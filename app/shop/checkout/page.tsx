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
  const [grandTotal, setGrandTotal] = useState(0);
  const [countries, setCountries] = useState<
    { value: string; label: string }[]
  >([]);

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

  const {
    register,
    handleSubmit,
    setValue: setFormValue,
    formState: { errors },
  } = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
  });

  const onSubmit = async (data: ShippingForm) => {
    try {
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

      const shippingCostResponse = await getShippingCost(
        data.country,
        data.state,
        cartWithVariants
      );

      setShippingOptions(shippingCostResponse);
      setSelectedShippingRate(shippingCostResponse[0]?.rate || null);
      setShippingCost(Number.parseFloat(shippingCostResponse[0]?.rate || "0"));
    } catch (error) {
      console.error("Error calculating shipping:", error);
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
    setGrandTotal(total + (shippingCost || 0));
  }, [shippingCost, cart]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  return (
    <div className="flex flex-col max-w-3xl w-full gap-8 pt-6 sm:pt-10">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="border-b pb-4 mb-6">
        <h2 className="text-xl font-bold">Order Summary</h2>
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
        <p className="text-right font-bold mt-4">
          Total: {formatCurrency(grandTotal)}{" "}
          {shippingCost === null
            ? "(excluding shipping)"
            : "(including shipping)"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 min-w-full">
        <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
        <div className="flex flex-col gap-4">
          <Input
            {...register("name")}
            placeholder="Full Name"
            className="w-full"
          />
          <p className="text-sm ">{errors.name?.message}</p>
          <Input
            {...register("email")}
            placeholder="Email Address"
            className="w-full"
          />
          <p className="text-sm ">{errors.email?.message}</p>
          <Input
            {...register("phone")}
            placeholder="Phone Number"
            className="w-full"
          />
          <p className="text-sm ">{errors.phone?.message}</p>
          <Input
            {...register("address")}
            placeholder="Street Address"
            className="w-full"
          />
          <p className="text-sm ">{errors.address?.message}</p>
          <Input {...register("address2")} placeholder="Apartment/Suite" />
          <Input {...register("city")} placeholder="City" className="w-full" />
          <p className="text-sm ">{errors.city?.message}</p>
          <Input
            {...register("state")}
            placeholder="State/Province"
            className="w-full"
          />
          <p className="text-sm ">{errors.state?.message}</p>
          <Input
            {...register("zip")}
            placeholder="ZIP/Postal Code"
            className="w-full"
          />
          <p className="text-sm ">{errors.zip?.message}</p>
          <div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {value
                    ? countries.find((c) => c.value === value)?.label
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
                          onSelect={(label) => {
                            const selected = countries.find(
                              (c) => c.label === label
                            );
                            if (selected) {
                              setValue(selected.value);
                              setFormValue("country", selected.value);
                            }
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
        <Button type="submit" className="mt-4 w-full">
          Calculate Shipping
        </Button>
      </form>

      {shippingOptions.length > 0 && (
        <div className="border-t pt-6">
          <h2 className="text-xl font-bold mb-4">Shipping Options</h2>
          {shippingOptions.map((option) => (
            <div key={option.id} className="mb-4">
              <label>
                <input
                  type="radio"
                  name="shippingOption"
                  value={option.rate}
                  onChange={() =>
                    setShippingCost(Number.parseFloat(option.rate || "0"))
                  }
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
        <h2 className="text-xl font-bold mb-4">Grand Total</h2>
        {shippingCost === null ? (
          <p className="">Please calculate shipping cost to get the total.</p>
        ) : (
          <p className="text-2xl font-bold">{formatCurrency(grandTotal)}</p>
        )}
      </div>
      {/* Payment Mock */}
      <div className="border-t pt-6">
        <Button
          onClick={() => {
            // Log all order information
            console.log("Order Details:");
            console.log("Cart Items:", cart);
            console.log(
              "Selected Shipping Option:",
              shippingOptions.find(
                (option) => option.rate === selectedShippingRate
              )
            );
            console.log("Shipping Cost:", shippingCost);
            console.log("Grand Total:", grandTotal);

            // Mock payment success
            alert(`Payment successful! Order Details:
        - Cart Items: ${JSON.stringify(cart, null, 2)}
        - Selected Shipping Option: ${JSON.stringify(
          shippingOptions.find(
            (option) => option.rate === selectedShippingRate
          ),
          null,
          2
        )}
        - Shipping Cost: ${shippingCost ? `$${shippingCost.toFixed(2)}` : "Not calculated"}
        - Grand Total: $${grandTotal.toFixed(2)}
      `);

            // Clear the cart
            clearCart();
          }}
          className="w-full bg-blue-600 text-white py-3"
          disabled={shippingCost === null}
        >
          Pay Now (Mock)
        </Button>
      </div>
    </div>
  );
};

export default CheckoutPage;
