"use client";

import type React from "react";

const tShirtSizes = ["S", "M", "L", "XL", "2XL", "3XL"];

type TShirtOptionsProps = {
  size: string;
  quantity: number;
  onSizeChange: (size: string) => void;
  onQuantityChange: (quantity: number) => void;
};

const TShirtOptions: React.FC<TShirtOptionsProps> = ({
  size,
  quantity,
  onSizeChange,
  onQuantityChange,
}) => (
  <div className="flex flex-col gap-4">
    <div className="flex gap-2 items-center">
      <span className="font-bold">Size:</span>
      <select
        value={size}
        onChange={(e) => onSizeChange(e.target.value)}
        className="border p-2 rounded bg-white"
      >
        <option value="">Select Size</option>
        {tShirtSizes.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
    <div className="flex gap-2 items-center">
      <span className="font-bold">Quantity:</span>
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => onQuantityChange(Number.parseInt(e.target.value, 10))}
        className="border p-2 rounded bg-white"
      />
    </div>
  </div>
);

export default TShirtOptions;
