// File: /app/api/orders/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Client } from "@notionhq/client";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Define Notion database ID
const notionDatabaseId = "17ea80717b31818fba0bdb99f27f90de";

// Define a type for Notion orders
type NotionOrder = {
  id: string; // The Notion page ID
  properties: {
    id?: { title: { text: { content: string } }[] };
    origin?: { rich_text: { text: { content: string } }[] };
    cart_items?: { rich_text: { text: { content: string } }[] };
    created_at?: { date: { start: string } };
    currency?: { select: { name: string } };
    grand_total?: { number: number };
    notes?: { rich_text: { text: { content: string } }[] };
    selected_shipping?: { rich_text: { text: { content: string } }[] };
    shipping_cost?: { number: number };
    shipping_info?: { rich_text: { text: { content: string } }[] };
    status?: { select: { name: string } };
  };
};

export async function GET() {
  try {
    // Fetch orders from Supabase
    const { data: supabaseOrders, error: supabaseError } = await supabase
      .from("orders_for_language_app_merch")
      .select("*")
      .order("created_at", { ascending: false });

    if (supabaseError) {
      console.error("Supabase error:", supabaseError);
      return NextResponse.json(
        { error: "Failed to fetch orders from Supabase" },
        { status: 500 }
      );
    }

    // Fetch all existing Notion records
    let notionOrders: NotionOrder[] = [];
    let cursor: string | undefined = undefined;

    do {
      const response = await notion.databases.query({
        database_id: notionDatabaseId,
        start_cursor: cursor,
      });
      notionOrders = [...notionOrders, ...(response.results as NotionOrder[])];
      cursor = response.next_cursor ?? undefined;
    } while (cursor);

    // Create a map of Notion orders by their ID
    const notionOrderMap: Record<string, NotionOrder> = notionOrders.reduce(
      (map, notionOrder) => {
        const orderId = notionOrder.properties.id?.title?.[0]?.text?.content;
        if (orderId) {
          map[orderId] = notionOrder;
        }
        return map;
      },
      {} as Record<string, NotionOrder>
    );

    // Sync: Add or update orders in Notion
    for (const order of supabaseOrders) {
      if (!notionOrderMap[order.id.toString()]) {
        // Add new order to Notion
        await notion.pages.create({
          parent: { database_id: notionDatabaseId },
          properties: {
            id: {
              title: [{ text: { content: order.id.toString() } }],
            },
            origin: {
              rich_text: [{ text: { content: "Poodeek" } }],
            },
            cart_items: {
              rich_text: [
                { text: { content: JSON.stringify(order.cart_items) } },
              ],
            },
            created_at: {
              date: { start: order.created_at || new Date().toISOString() },
            },
            currency: {
              select: { name: order.currency || "USD" },
            },
            grand_total: {
              number: order.grand_total || 0,
            },
            notes: {
              rich_text: [{ text: { content: order.notes || "" } }],
            },
            selected_shipping: {
              rich_text: [
                { text: { content: JSON.stringify(order.selected_shipping) } },
              ],
            },
            shipping_cost: {
              number: order.shipping_cost || 0,
            },
            shipping_info: {
              rich_text: [
                { text: { content: JSON.stringify(order.shipping_info) } },
              ],
            },
            status: {
              select: { name: order.status || "pending" },
            },
          },
        });
      }
    }

    // Sync: Remove orders from Notion that are no longer in Supabase
    const supabaseOrderIds = new Set(
      supabaseOrders.map((order) => order.id.toString())
    );

    for (const [orderId, notionOrder] of Object.entries(notionOrderMap)) {
      if (!supabaseOrderIds.has(orderId)) {
        await notion.pages.update({
          page_id: notionOrder.id,
          archived: true,
        });
      }
    }

    return NextResponse.json({
      message: "Notion database successfully synced with Supabase orders",
    });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
