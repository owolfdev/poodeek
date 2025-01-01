"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const MugOptions = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const router = useRouter();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Math.max(1, Number.parseInt(e.target.value, 10) || 1));
  };

  useEffect(() => {
    const query = new URLSearchParams();
    query.set("quantity", quantity.toString());
    query.set("add", "true");
    router.push(`/shop/mug?${query.toString()}`, { scroll: false });
  }, [quantity, router]);

  return (
    <div className="flex gap-2">
      <span className="font-bold">Quantity:</span>
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={handleQuantityChange}
        className="bg-white text-black w-10"
      />
    </div>
  );
};

export default MugOptions;
