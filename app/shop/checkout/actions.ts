"use server";

import axios from "axios";
import { createClient } from "@/utils/supabase/server";

export async function getCountries() {
  try {
    const response = await axios.get("https://api.printful.com/countries", {
      headers: {
        Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`, // Use environment variables for security
      },
    });

    // console.log(response.data.result);

    return response.data.result.map(
      (country: { code: string; name: string }) => ({
        value: country.code,
        label: country.name,
      })
    );
  } catch (error: unknown) {
    console.error(
      "Error fetching countries:",
      error instanceof Error ? error.message : String(error)
    );
    throw new Error("Failed to fetch countries");
  }
}

export async function getShippingCost(
  countryCode: string,
  stateCode: string | null,
  items: { variant_id: number; quantity: number }[]
) {
  const recipient: { country_code: string; state_code?: string } = {
    country_code: countryCode,
  };
  if (stateCode) {
    recipient.state_code = stateCode;
  }

  // console.log("Payload for Printful API:", {
  //   recipient,
  //   items,
  // });

  try {
    const response = await axios.post(
      "https://api.printful.com/shipping/rates",
      {
        recipient,
        items,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
        },
      }
    );

    // console.log("Shipping Rates Response:", response.data.result);
    return response.data.result;
  } catch (error: unknown) {
    if (error instanceof Error && "response" in error) {
      const axiosError = error as {
        response: { data: unknown; status: number; headers: unknown };
      };
      console.error("Error Response Data:", axiosError.response.data);
      console.error("Error Response Status:", axiosError.response.status);
      console.error("Error Response Headers:", axiosError.response.headers);
    } else {
      console.error(
        "Error:",
        error instanceof Error ? error.message : String(error)
      );
    }
    throw new Error("Failed to fetch shipping cost");
  }
}

export async function saveOrder(order: {
  cart_items: Array<{
    variant_id: number;
    quantity: number;
    name: string;
    price: number;
  }>;
  shipping_info: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    state_code?: string;
    country_code: string;
    zip: string;
    email: string;
    phone?: string;
  };
  selected_shipping: {
    id: string;
    name: string;
    rate: number;
    currency: string;
    minDeliveryDays: number;
    maxDeliveryDays: number;
  };
  shipping_cost: number;
  grand_total: number;
  currency: string;
}): Promise<{ id: string }[]> {
  const supabase = createClient();

  try {
    const { data, error } = await (
      await supabase
    )
      .from("orders_for_language_app_merch")
      .insert([
        {
          cart_items: order.cart_items,
          shipping_info: order.shipping_info,
          selected_shipping: order.selected_shipping,
          shipping_cost: order.shipping_cost,
          grand_total: order.grand_total,
          currency: order.currency,
          status: "pending",
        },
      ])
      .select(); // Explicitly request the inserted rows

    if (error) {
      console.error("Supabase Error:", error);
      throw new Error("Failed to save order");
    }

    // console.log("Order saved successfully:", data);
    console.log("Order saved successfully:", data[0]?.id);
    const orderId = data[0]?.id;

    return orderId;
  } catch (error) {
    console.error(
      "Error:",
      error instanceof Error ? error.message : String(error)
    );
    throw new Error("An error occurred while saving the order");
  }
}
