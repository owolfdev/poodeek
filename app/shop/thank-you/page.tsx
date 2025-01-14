import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  // Resolve searchParams to access the order ID
  const { id } = await searchParams;

  if (!id) {
    console.error("Order ID missing in searchParams");
    return notFound(); // Redirect to 404 if no ID is provided
  }

  // Create Supabase client
  const supabase = await createClient();

  // Fetch order details from Supabase
  const { data: order, error } = await supabase
    .from("orders_for_language_app_merch") // Table name
    .select(
      `
      id,
      created_at,
      grand_total,
      currency,
      cart_items,
      shipping_info,
      selected_shipping
    `
    )
    .eq("id", id)
    .single();

  if (error || !order) {
    console.error("Error fetching order:", error);
    return notFound(); // Redirect to 404 if order not found
  }

  // Extract details from the fetched order
  const {
    created_at,
    grand_total,
    currency,
    cart_items,
    shipping_info,
    selected_shipping,
  } = order;

  // Parse JSONB fields
  const items = cart_items as Array<{
    name: string;
    quantity: number;
    price: number;
    variant_id: number;
  }>;
  const shipping = shipping_info as {
    name: string;
    email: string;
    phone: string;
    address1: string;
    address2?: string;
    city: string;
    state_code: string;
    country_code: string;
    zip: string;
  };

  const shippingDetails = selected_shipping as {
    name: string;
    rate: string;
    currency: string;
    minDeliveryDate: string;
    maxDeliveryDate: string;
  };

  const currencySymbol = currency === "USD" ? "$" : "€";

  return (
    <div className="flex flex-col max-w-3xl w-full gap-6 pt-6 sm:pt-10 pb-10">
      <h1 className="text-6xl font-bold">Thank You for Your Order!</h1>
      <p>Your order has been successfully placed.</p>

      {/* Order Summary */}
      <div className="">
        <h2 className="text-2xl font-bold mb-2">Order Summary</h2>
        <p>
          <strong>Order ID:</strong> {id.slice(-12)}
        </p>
        <p>
          <strong>Order Date:</strong>{" "}
          {new Date(`${created_at}Z`).toLocaleString()}
        </p>
      </div>

      {/* Items Ordered */}
      <div className="">
        <h2 className="text-2xl font-bold mb-2">Items Ordered</h2>
        <ul className="list-disc pl-6">
          {items.map((item) => (
            <li key={item.variant_id}>
              {item.name} x {item.quantity} - {`${currency} ${item.price}`}
            </li>
          ))}
        </ul>
      </div>

      {/* Shipping Details */}
      <div className="">
        {/* {JSON.stringify(shippingDetails)} */}
        <h2 className="text-2xl font-bold mb-2">Shipping Details</h2>
        <p>
          <strong>Method:</strong> {shippingDetails.name}
        </p>
        <p>
          <strong>Rate:</strong>{" "}
          {`${shippingDetails.currency} ${shippingDetails.rate}`}
        </p>
      </div>

      {/* Shipping Information */}
      <div className="">
        <h2 className="text-2xl font-bold mb-2">Shipping Information</h2>
        <p>
          <strong>Name:</strong> {shipping.name}
        </p>
        <p>
          <strong>Address:</strong>{" "}
          {`${shipping.address1}, ${shipping.city}, ${shipping.state_code}, ${shipping.country_code} ${shipping.zip}`}
        </p>
        <p>
          <strong>Email:</strong> {shipping.email}
        </p>
        <p>
          <strong>Phone:</strong> {shipping.phone}
        </p>
      </div>

      <p className="text-2xl">
        <strong>Grand Total:</strong>{" "}
        {`${currency} ${currencySymbol}${grand_total}`}
      </p>
    </div>
  );
}
