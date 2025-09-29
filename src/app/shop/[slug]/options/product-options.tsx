"use client";

import type React from "react";
import { useState, useEffect } from "react";
import TShirtOptions from "./t-shirt-options";
import MugOptions from "./mug-options";
import { useRouter } from "next/navigation";

type ProductOptionsProps = {
  slug: string;
  initialSize: string;
  initialQuantity: number;
  variants: Array<{
    size: string;
    variant_price: number;
    stock_quantity: number;
  }>;
};

const ProductOptions: React.FC<ProductOptionsProps> = ({
  slug,
  initialSize,
  initialQuantity,
  variants,
}) => {
  const [size, setSize] = useState(initialSize);
  const [quantity, setQuantity] = useState(initialQuantity);
  const router = useRouter();

  useEffect(() => {
    const query = new URLSearchParams();
    if (size) query.set("size", size);
    query.set("quantity", quantity.toString());
    router.replace(`/shop/${slug}?${query.toString()}`, { scroll: false });
  }, [size, quantity, slug, router]);

  return slug === "t-shirt" ? (
    <TShirtOptions
      size={size}
      quantity={quantity}
      onSizeChange={setSize}
      onQuantityChange={setQuantity}
    />
  ) : (
    <MugOptions quantity={quantity} onQuantityChange={setQuantity} />
  );
};

export default ProductOptions;
