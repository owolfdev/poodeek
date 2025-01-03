"use server";

import axios from "axios";

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

  console.log("Payload for Printful API:", {
    recipient,
    items,
  });

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

    console.log("Shipping Rates Response:", response.data.result);
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
