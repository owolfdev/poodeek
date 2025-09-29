"use client";

import type React from "react";

type MugOptionsProps = {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
};

const MugOptions: React.FC<MugOptionsProps> = ({
  quantity,
  onQuantityChange,
}) => (
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
);

export default MugOptions;
