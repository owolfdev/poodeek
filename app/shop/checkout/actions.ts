"use server";

import axios from "axios";
import { createClient } from "@/utils/supabase/server";
import { Resend } from "resend";

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
}): Promise<{ id: string; created_at: string }[]> {
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
      .select(); // Ensure we return the inserted rows

    if (error) {
      console.error("Supabase Error:", error);
      throw new Error("Failed to save order");
    }

    return data; // Return the array of inserted rows
  } catch (error) {
    console.error(
      "Error:",
      error instanceof Error ? error.message : String(error)
    );
    throw new Error("An error occurred while saving the order");
  }
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  message,
}: {
  to: string;
  subject: string;
  message: string;
}) {
  try {
    const emailResponse = await resend.emails.send({
      from: "Your Store <wolf@owolf.com>",
      to: [to],
      subject,
      html: `<p>${message}</p>`,
    });

    return { success: true, data: emailResponse };
  } catch (error) {
    console.error("Error sending email via Resend:", error);
    throw new Error("Failed to send email.");
  }
}

// checkout/actions.ts

export async function generateEmailTemplate(order: {
  id: string;
  created_at: string;
  grand_total: number;
  currency: string;
  cart_items: Array<{
    name: string;
    quantity: number;
    price: number;
    variant_id: number;
  }>;
  shipping_info: {
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
  selected_shipping: {
    name: string;
    rate: string;
    currency: string;
    minDeliveryDate: string;
    maxDeliveryDate: string;
  };
  status: string;
  notes?: string;
}): Promise<string> {
  const {
    id,
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

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h1 style="font-size: 24px; font-weight: bold;">Thank You for Your Order!</h1>
      <p>Your order has been successfully placed.</p>
      
      <h2>Order Info:</h2>
      <p><strong>Order ID:</strong> ${id.slice(-12)}</p>
      <p><strong>Order Date:</strong> ${new Date(`${created_at}Z`).toLocaleString()}</p>
      
      <h2>Shipping To:</h2>
      <p><strong>Name:</strong> ${shipping.name}</p>
      <p><strong>Address:</strong> ${shipping.address1}, ${shipping.city}, ${shipping.state_code}, ${shipping.country_code} ${shipping.zip}</p>
      <p><strong>Email:</strong> ${shipping.email}</p>
      <p><strong>Phone:</strong> ${shipping.phone}</p>
      
      <h2>Items Ordered:</h2>
      <ul>
        ${items
          .map(
            (item) =>
              `<li>${item.name} x ${item.quantity} - ${currency} ${item.price.toFixed(
                2
              )}</li>`
          )
          .join("")}
      </ul>
      
      <h2>Shipping:</h2>
      <p><strong>Method:</strong> ${shippingDetails.name}</p>
      <p><strong>Rate:</strong> ${shippingDetails.currency} ${shippingDetails.rate}</p>
      
      <p><strong>Grand Total:</strong> ${currency} ${currencySymbol}${grand_total.toFixed(2)}</p>
      
      <h2>Order Status:</h2>
      <p><strong>Status:</strong> ${
        status.charAt(0).toUpperCase() + status.slice(1)
      }</p>
      
      ${notes ? `<h2>Notes:</h2><p>${notes}</p>` : ""}
    </div>
  `;
}
