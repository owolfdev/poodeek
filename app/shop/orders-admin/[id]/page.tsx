import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export const dynamic = "force-dynamic"; // Ensure dynamic rendering

type Props = {
  params: Promise<{ id: string }>;
};

async function fetchOrder(id: string) {
  const supabase = await createClient();
  const { data: order, error } = await supabase
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

async function deleteOrderFromSupabase(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("orders_for_language_app_merch")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting order:", error);
    throw new Error("Failed to delete order in Supabase.");
  }
}

async function updateOrderInSupabase(
  id: string,
  updatedFields: { status?: string; notes?: string }
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("orders_for_language_app_merch")
    .update(updatedFields)
    .eq("id", id);

  if (error) {
    console.error("Error updating order:", error);
    throw new Error("Failed to update order in Supabase.");
  }
}

export default async function OrderAdminPage({ params }: Props) {
  const { id } = await params;

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

    redirect("/admin"); // Redirect to the orders list page
  }

  async function handleDeleteOrder() {
    "use server"; // Server action
    await deleteOrderFromSupabase(id);
    revalidatePath("/admin"); // Refresh the orders list
    redirect("/admin"); // Redirect to the orders list page
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
      <h1 className="text-6xl font-bold">Order Admin</h1>
      <p>View the details and current status of your order.</p>

      {/* Order Summary */}
      <div className="">
        <h2 className="text-2xl font-bold mb-2">Order Info:</h2>
        <p>
          <strong>Order ID:</strong> {id}
        </p>
        <p>
          <strong>Order Date:</strong>{" "}
          {new Date(`${created_at}Z`).toLocaleString()}
        </p>
      </div>

      {/* Shipping Information */}
      <div className="">
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

      {/* Items Ordered */}
      <div className="">
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

      {/* Sub Total */}
      <p>
        <strong>Sub Total:</strong>{" "}
        {`${currencySymbol}${items
          .reduce((acc, item) => acc + item.price * item.quantity, 0)
          .toFixed(2)}`}
      </p>

      {/* Shipping Details */}
      <div className="">
        <h2 className="text-2xl font-bold mb-2">Shipping:</h2>
        <p>
          <strong>Method:</strong> {shippingDetails.name}
        </p>
        <p>
          <strong>Rate:</strong>{" "}
          {`${shippingDetails.currency} ${shippingDetails.rate}`}
        </p>
      </div>

      <p className="text-2xl">
        <strong>Grand Total:</strong>{" "}
        {`${currency} ${currencySymbol}${grand_total.toFixed(2)}`}
      </p>

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

      {/* Delete Order Button with Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-red-500 hover:bg-red-600 text-white hover:text-white"
          >
            Delete Order
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Deleting this order will remove it
              permanently.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <form action={handleDeleteOrder} method="post">
              <Button type="submit" variant="destructive">
                Confirm Delete
              </Button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
