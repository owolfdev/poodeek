"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const tShirtSizes = ["S", "M", "L", "XL", "2XL", "3XL"];

const TShirtOptions = () => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const router = useRouter();

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Math.max(1, Number.parseInt(e.target.value, 10) || 1));
  };

  useEffect(() => {
    const query = new URLSearchParams();
    if (selectedSize) query.set("size", selectedSize);
    query.set("quantity", quantity.toString());
    query.set("add", selectedSize ? "true" : "false");
    router.push(`/shop/t-shirt?${query.toString()}`, { scroll: false });
  }, [selectedSize, quantity, router]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <span className="font-bold">Size:</span>
        <Select onValueChange={handleSizeChange}>
          <SelectTrigger className="w-[180px]">
            <span className="font-bold">
              <SelectValue placeholder="Select Size" />
            </span>
          </SelectTrigger>
          <SelectContent className="bg-white text-black">
            {tShirtSizes.map((size) => (
              <SelectItem key={size} value={size}>
                <span className="font-bold">{size}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <span className="font-bold">Quantity:</span>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
          className="bg-white text-black w-14 pl-2 rounded-md"
        />
      </div>
    </div>
  );
};

export default TShirtOptions;
