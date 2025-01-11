"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";
import { ChevronsUpDown } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import variants from "@/data/products/variants.json";
import products from "@/data/products/products.json";
import { cn } from "@/lib/utils";
import { getCountries, getShippingCost } from "./actions";
import { useShipping } from "@/context/ShippingContext";
import { useRouter } from "next/navigation";
import { saveOrder } from "./actions";
import { useMemo } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const shippingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(8, "Phone number must be at least 8 digits").optional(),
  address: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Region is required"),
  zip: z.string().min(5, "ZIP/Postal code must be at least 5 characters"),
  country: z
    .string()
    .min(2, "Country is required")
    .max(2, "Country code must be 2 characters"),
});

type ShippingForm = z.infer<typeof shippingSchema>;

const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [shippingOptions, setShippingOptions] = useState<
    {
      id: string;
      name: string;
      rate: string;
      currency: string;
      minDeliveryDate: string;
      maxDeliveryDate: string;
    }[]
  >([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState<
    string | null
  >(null);
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [subtotal, setSubtotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [countries, setCountries] = useState<
    { value: string; label: string }[]
  >([]);

  const [selectedShipping, setSelectedShipping] = useState<{
    id: string;
    name: string;
    rate: string;
    currency: string;
    minDeliveryDate: string;
    maxDeliveryDate: string;
  } | null>(null);

  const router = useRouter();
  const { shippingInfo, saveShippingInfo, clearShippingInfo } = useShipping();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countryList = await getCountries();
        setCountries(countryList);
      } catch (error) {
        console.error("Error loading countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (shippingInfo?.country) {
      setFormValue("country", shippingInfo.country);
      setValue(shippingInfo.country);
    }
  }, [shippingInfo]);

  const {
    register,
    handleSubmit,
    reset,
    setValue: setFormValue,
    formState: { errors },
    getValues,
  } = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
    defaultValues: shippingInfo || {},
  });

  const onSubmit = async (data: ShippingForm, mode: "calculate" | "pay") => {
    console.log("mode", mode);

    const cartWithVariants = cart
      .map((item) => {
        const variant = variants.find((v) => v.sku === item.sku);
        if (!variant) {
          console.error(`Variant not found for SKU: ${item.sku}`);
          return null;
        }
        return {
          variant_id: variant.variant_id,
          quantity: item.quantity,
        };
      })
      .filter(
        (item): item is { variant_id: number; quantity: number } =>
          item !== null
      );

    if (cartWithVariants.length === 0) {
      throw new Error("Cart is empty or contains invalid items.");
    }

    if (mode === "calculate") {
      const shippingCostResponse = await getShippingCost(
        data.country,
        data.state,
        cartWithVariants
      );

      // setSelectedShipping(shippingCostResponse[0]);
      setShippingOptions(shippingCostResponse);
      setSelectedShippingRate(selectedShipping?.rate || null);
      setShippingCost(Number.parseFloat(selectedShipping?.rate || "0"));
    }

    if (mode === "pay") {
      try {
        // Save the order
        const orderId = await saveOrder({
          cart_items: cartWithVariants.map((item) => ({
            variant_id: item.variant_id,
            quantity: item.quantity,
            name:
              variants.find((v) => v.variant_id === item.variant_id)?.sku || "",
            price:
              variants.find((v) => v.variant_id === item.variant_id)
                ?.variant_price || 0,
          })),
          shipping_info: {
            name: data.name,
            address1: data.address,
            address2: data.address2,
            city: data.city,
            state_code: data.state,
            country_code: data.country,
            zip: data.zip,
            email: data.email || "",
            phone: data.phone,
          },
          selected_shipping: {
            id: selectedShipping?.id || "",
            name: selectedShipping?.name || "",
            rate: Number.parseFloat(selectedShipping?.rate || "0"),
            currency: selectedShipping?.currency || "USD",
            minDeliveryDays: Number.parseInt(
              selectedShipping?.minDeliveryDate || "0"
            ),
            maxDeliveryDays: Number.parseInt(
              selectedShipping?.maxDeliveryDate || "0"
            ),
          },
          shipping_cost: Number.parseFloat(selectedShipping?.rate || "0"),
          grand_total:
            subtotal + Number.parseFloat(selectedShipping?.rate || "0"),
          currency: "USD",
        });

        clearCart();

        router.push(`/shop/thank-you?id=${orderId}`);

        // console.log("data", data);

        console.log("Order saved successfully");
      } catch (error) {
        console.error("Error calculating or saving order:", error);
      }
    }
  };

  useEffect(() => {
    const total = cart.reduce(
      (sum, item) =>
        sum +
        (variants.find((v) => v.sku === item.sku)?.variant_price || 0) *
          item.quantity,
      0
    );
    setSubtotal(total);
    setGrandTotal(total + (shippingCost || 0)); // Update grand total
  }, [shippingCost, cart]);

  const handleClearShipping = () => {
    clearShippingInfo();
    reset();
    setValue("");
  };

  const handleSaveShipping = () => {
    const formValues = getValues();
    const result = shippingSchema.safeParse(formValues);
    if (result.success) {
      saveShippingInfo(result.data);
    } else {
      console.error("Invalid shipping information:", result.error.format());
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  // Wrapper functions for buttons
  const handleCalculateShipping = (data: ShippingForm) =>
    onSubmit(data, "calculate");
  const handlePayNow = (data: ShippingForm) => onSubmit(data, "pay");

  // const onPayPalApprove = async (data: any, actions: any) => {
  //   console.log("data", data);
  //   console.log("actions", actions);
  //   // return "ok";
  // };

  return (
    <div className="flex flex-col max-w-3xl w-full gap-8 pt-6 sm:pt-10 ">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="border-b pb-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        {cart.map((item) => {
          const variant = variants.find((v) => v.sku === item.sku);
          const product = products.find(
            (p) => p.product_id === variant?.product_id
          );
          const name = product?.name || "Unknown Product";
          const price = variant?.variant_price || 0;

          return (
            <div key={item.sku} className="flex justify-between py-2">
              <p>
                {name} x {item.quantity}
              </p>
              <p>{formatCurrency(price * item.quantity)}</p>
            </div>
          );
        })}
        <div className="mt-4 border-t pt-4">
          <p className="flex justify-between">
            <span className="font-bold">Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-bold">Shipping:</span>
            <span>
              {shippingCost === null
                ? "Calculate Shipping"
                : selectedShipping !== null
                  ? formatCurrency(shippingCost)
                  : "Select Shipping Option"}
            </span>
          </p>
          <p className="flex justify-between text-lg font-bold mt-2">
            <span>Grand Total:</span>
            {shippingCost === null ? (
              <p className="">
                Please calculate shipping cost to get the total.
              </p>
            ) : (
              <p className="text-2xl font-bold">{formatCurrency(grandTotal)}</p>
            )}
          </p>
        </div>
      </div>
      <form className="mb-6 min-w-full">
        <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>

        <div className="flex flex-col gap-4">
          <Input
            {...register("name")}
            placeholder="Full Name"
            className="w-full"
          />
          <p className="text-sm">{errors.name?.message}</p>
          <Input
            {...register("email")}
            placeholder="Email Address"
            className="w-full"
          />
          <p className="text-sm">{errors.email?.message}</p>
          <Input
            {...register("phone")}
            placeholder="Phone Number"
            className="w-full"
          />
          <p className="text-sm">{errors.phone?.message}</p>
          <Input
            {...register("address")}
            placeholder="Street Address"
            className="w-full"
          />
          <p className="text-sm">{errors.address?.message}</p>
          <Input {...register("address2")} placeholder="Apartment/Suite" />
          <p className="text-sm">{errors.address2?.message}</p>
          <Input {...register("city")} placeholder="City" className="w-full" />
          <p className="text-sm">{errors.city?.message}</p>
          <Input
            {...register("state")}
            placeholder="State/Province"
            className="w-full"
          />
          <p className="text-sm">{errors.state?.message}</p>
          <Input
            {...register("zip")}
            placeholder="ZIP/Postal Code"
            className="w-full"
          />
          <p className="text-sm">{errors.zip?.message}</p>
          <div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {value
                    ? countries.find((c) => c.value === value)?.label ||
                      "Select Country..."
                    : "Select Country..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search countries..." />
                  <CommandList>
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                      {countries.map((country) => (
                        <CommandItem
                          key={country.value}
                          value={country.label}
                          onSelect={() => {
                            setValue(country.value);
                            setFormValue("country", country.value);
                            setOpen(false);
                          }}
                        >
                          {country.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              value === country.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <p className="text-sm text-red-500">{errors.country?.message}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <Button
            onClick={handleSubmit(handleCalculateShipping)}
            size="lg"
            className="mt-4 w-full text-lg"
          >
            Calculate Shipping
          </Button>
          <div className="flex sm:flex-row flex-col gap-4 justify-between">
            <Button
              variant="ghost"
              type="button"
              className="mt-2 py-3"
              onClick={handleClearShipping}
            >
              Clear Shipping Information
            </Button>
            <Button
              variant="ghost"
              type="button"
              className="mt-2 py-3"
              onClick={handleSaveShipping}
            >
              Save Shipping Information
            </Button>
          </div>
        </div>
      </form>
      {shippingOptions.length > 0 && (
        <div className="border-t pt-6">
          <h2 className="text-xl font-bold mb-4">Shipping Options</h2>

          <div className="pb-4">
            {shippingCost === null
              ? "Calculate Shipping"
              : selectedShipping !== null
                ? formatCurrency(shippingCost)
                : "Select Shipping Option"}
          </div>
          {shippingOptions.map((option) => (
            <div key={option.id} className="mb-4">
              <label>
                <input
                  type="radio"
                  className="mr-2"
                  name="shippingOption"
                  value={option.rate}
                  onChange={() => {
                    setShippingCost(Number.parseFloat(option.rate || "0"));
                    setSelectedShipping(option);
                  }}
                />
                {`${option.name} - ${formatCurrency(
                  Number.parseFloat(option.rate)
                )}`}
              </label>
            </div>
          ))}
        </div>
      )}
      <div className="border-t pt-6">
        {shippingCost !== null && selectedShipping !== null && (
          <h2 className="text-xl font-bold mb-4">Grand Total</h2>
        )}

        {shippingCost === null ? (
          <p>Please calculate shipping cost to get the total.</p>
        ) : selectedShipping === null ? (
          <p>Select Shipping Option.</p>
        ) : (
          <p className="text-2xl font-bold">{formatCurrency(grandTotal)}</p>
        )}
      </div>
      <Button
        onClick={handleSubmit(handlePayNow)}
        className="w-full bg-blue-600 text-white py-3"
        disabled={!selectedShipping}
      >
        Pay Now
      </Button>
      {/* PayPal Buttons */}
      <div>{shippingCost}</div>
      {/* <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
          currency: "USD",
        }}
      >
        <PayPalButtons
          createOrder={(data, actions) => {
            // const totalAmount = (subtotal + (shippingCost || 0)).toFixed(2);
            const totalAmount = grandTotal.toFixed(2);

            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: "USD",
                    value: totalAmount, // Use recalculated total
                  },
                },
              ],
              intent: "CAPTURE",
            });
          }}
          onApprove={onPayPalApprove}
          onError={(error) => console.error("PayPal Error:", error)}
        />
      </PayPalScriptProvider> */}
      {/* <div>
        <button type="button" onClick={(e) => onPayPalApprove(grandTotal, {})}>
          Pay Now Test
        </button>
      </div> */}
    </div>
  );
};

export default CheckoutPage;
