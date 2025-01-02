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

const countries = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "GB", label: "United Kingdom" },
  { value: "AU", label: "Australia" },
];

const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  const {
    register,
    handleSubmit,
    setValue: setFormValue,
    formState: { errors },
  } = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
  });

  const onSubmit = (data: ShippingForm) => {
    console.log("Shipping Info:", data);
    setShippingCost(10);
  };

  useEffect(() => {
    setGrandTotal(total + shippingCost);
  }, [shippingCost]);

  const handlePaymentMock = () => {
    alert("Payment successful! (Mock)");
    clearCart();
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  // Map order summary
  const orderSummary = cart.map((item) => {
    const variant = variants.find((v) => v.sku === item.sku);
    const product = products.find((p) => p.product_id === variant?.product_id);
    const name = product?.name || "Unknown Product";
    const price = variant?.variant_price || 0;

    return {
      ...item,
      name,
      price,
      subtotal: price * item.quantity,
    };
  });

  // Calculate total
  const total = orderSummary.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="flex flex-col max-w-3xl w-full gap-8 pt-6 sm:pt-10">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Order Summary */}
      <div className="border-b pb-4 mb-6">
        <h2 className="text-xl font-bold">Order Summary</h2>
        {orderSummary.map((item) => (
          <div key={item.sku} className="flex justify-between py-2">
            <p>
              {item.name} x {item.quantity}
            </p>
            <p>{formatCurrency(item.subtotal)}</p>
          </div>
        ))}
        <p className="text-right font-bold mt-4">
          Total: {formatCurrency(total)}
        </p>
      </div>

      {/* Shipping Info */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 min-w-full">
        <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
        <div className="flex flex-col gap-4">
          <Input
            {...register("name")}
            placeholder="Full Name"
            className="w-full"
          />
          <p className="text-sm text-red-500">{errors.name?.message}</p>
          <Input
            {...register("email")}
            placeholder="Email Address"
            className="w-full"
          />
          <p className="text-sm text-red-500">{errors.email?.message}</p>
          <Input
            {...register("phone")}
            placeholder="Phone Number"
            className="w-full"
          />
          <p className="text-sm text-red-500">{errors.phone?.message}</p>
          <Input
            {...register("address")}
            placeholder="Street Address"
            className="w-full"
          />
          <p className="text-sm text-red-500">{errors.address?.message}</p>
          <Input
            {...register("address2")}
            placeholder="Apartment/Suite (Optional)"
            className="w-full"
          />
          <Input {...register("city")} placeholder="City" className="w-full" />
          <p className="text-sm text-red-500">{errors.city?.message}</p>
          <Input
            {...register("state")}
            placeholder="State/Province/Region"
            className="w-full"
          />
          <p className="text-sm text-red-500">{errors.state?.message}</p>
          <Input
            {...register("zip")}
            placeholder="ZIP/Postal Code"
            className="w-full"
          />
          <p className="text-sm text-red-500">{errors.zip?.message}</p>
          <div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
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

      {/* Shipping Cost */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-bold mb-4">Shipping Cost</h2>
        <p>{formatCurrency(shippingCost)}</p>
      </div>

      {/* Grand Total */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-bold mb-4">Grand Total</h2>
        <p>{formatCurrency(grandTotal)}</p>
      </div>

      {/* Payment Mock */}

      <div className="border-t pt-6">
        <h2 className="text-xl font-bold mb-4">Payment</h2>
        <Button
          onClick={handlePaymentMock}
          className="w-full bg-blue-600 text-white py-3"
          disabled={!shippingCost}
        >
          Pay Now (Mock)
        </Button>
      </div>
    </div>
  );
};

export default CheckoutPage;
