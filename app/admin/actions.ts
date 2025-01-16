"use server";

import { createClient } from "@/utils/supabase/server";

type Order = {
  id: string;
  created_at: string;
  grand_total: number;
  currency: string;
  status: string;
  customer_name: string;
};

export async function getOrders(): Promise<Order[]> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.from("orders_for_language_app_merch")
      .select(`
        id,
        created_at,
        grand_total,
        currency,
        status,
        shipping_info
      `);

    console.log("orders data: ", data);

    if (error) {
      console.error("Error fetching orders:", error);
      throw new Error("Failed to fetch orders");
    }

    if (!data) {
      throw new Error("No data returned from Supabase");
    }

    // Validate and transform data
    const orders: Order[] = data.map((order) => {
      if (
        !order.id ||
        !order.created_at ||
        !order.grand_total ||
        !order.currency ||
        !order.status ||
        !order.shipping_info.name
      ) {
        console.error("Invalid order data:", order);
        throw new Error("Missing required fields in order data");
      }

      return {
        id: order.id,
        created_at: order.created_at,
        grand_total: Number.parseFloat(order.grand_total),
        currency: order.currency,
        status: order.status,
        customer_name: order.shipping_info.name,
      };
    });

    return orders;
  } catch (error) {
    console.error(
      "Unexpected error:",
      error instanceof Error ? error.message : String(error)
    );
    throw new Error("An error occurred while fetching orders");
  }
}
