import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic"; // Ensure dynamic rendering

type Props = {
  params: Promise<{ id: string }>; // params is now a Promise
};

async function fetchOrder(id: string) {
  const supabase = createClient();
  const { data: order, error } = await (
    await supabase
  )
    .from("orders_for_language_app_merch")
    .select(
      `
      id,
      created_at,
      grand_total,
      currency,
      cart_items,
      shipping_info,
      selected_shipping,
      status,
      notes
    `
    )
    .eq("id", id)
    .single();

  if (error || !order) {
    console.error("Error fetching order:", error);
    return null;
  }
  return order;
}

async function updateOrderInSupabase(
  id: string,
  updatedFields: { status?: string; notes?: string }
) {
  const supabase = createClient();
  const { error } = await (await supabase)
    .from("orders_for_language_app_merch")
    .update(updatedFields)
    .eq("id", id);

  if (error) {
    console.error("Error updating order:", error);
    throw new Error("Failed to update order in Supabase.");
  }
}

export default async function OrderAdminPage({ params }: Props) {
  const { id } = await params; // Resolve params promise to get the `id`

  if (!id) {
    return notFound(); // Redirect to 404 if no ID is provided
  }

  const order = await fetchOrder(id);

  if (!order) {
    return notFound(); // Redirect to 404 if order not found
  }

  async function handleUpdateOrder(data: FormData) {
    "use server"; // Server action
    const updatedStatus = data.get("status") as string;
    const updatedNotes = data.get("notes") as string;

    await updateOrderInSupabase(id, {
      status: updatedStatus,
      notes: updatedNotes,
    });

    revalidatePath(`/shop/orders-admin/${id}`); // Revalidate the page
  }

  const {
    created_at,
    grand_total,
    currency,
    cart_items,
    shipping_info,
    selected_shipping,
    status,
    notes,
  } = order;

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
      <h1 className="text-4xl font-bold">Order Admin</h1>
      <p>Update the status and notes for this order.</p>

      {/* Order Summary */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Order Info:</h2>
        <p>
          <strong>Order ID:</strong> {id}
        </p>
        <p>
          <strong>Order Date:</strong>{" "}
          {new Date(`${created_at}Z`).toLocaleString()}
        </p>
        <p>
          <strong>Grand Total:</strong>{" "}
          {`${currencySymbol}${grand_total.toFixed(2)}`}
        </p>
      </div>

      {/* Items Ordered */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Items Ordered:</h2>
        <ul className="list-disc pl-6">
          {items.map((item) => (
            <li key={item.variant_id}>
              {item.name} x {item.quantity} -{" "}
              {`${currencySymbol}${item.price.toFixed(2)}`}
            </li>
          ))}
        </ul>
      </div>

      {/* Shipping Info */}
      <div>
        <h2 className="text-lg font-bold mb-2">Shipping To:</h2>
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

      {/* Editable Fields */}
      <form
        action={handleUpdateOrder}
        method="post"
        className="flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold mb-2">Update Order:</h2>

        {/* Status */}
        <label className="block mb-2">
          <span className="text-lg font-bold">Status:</span>
          <select
            name="status"
            defaultValue={status}
            className="w-full mt-1 border p-2 bg-white"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
        </label>

        {/* Notes */}
        <label className="block mb-2">
          <span className="text-lg font-bold">Notes:</span>
          <textarea
            name="notes"
            defaultValue={notes || ""}
            className="w-full mt-1 border p-2 bg-white"
            rows={4}
          />
        </label>

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded "
        >
          Update Order
        </button>
      </form>
    </div>
  );
}
