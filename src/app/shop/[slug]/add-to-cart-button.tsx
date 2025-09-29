"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

type CartItem = {
  sku: string;
  variant_id: number | null;
  quantity: number;
};

function AddToCartButton({
  sku,
  variant_id,
  quantity = 1,
  add = false,
}: {
  sku: string;
  variant_id: number | null;
  quantity?: number;
  add?: boolean;
}) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    if (!add) {
      toast({
        title: "Invalid product selection",
        description:
          "Please select a valid size or variant to add to your cart.",
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);

    try {
      const newItem: CartItem = {
        sku,
        variant_id,
        quantity,
      };

      addToCart(newItem);

      setIsAdded(true);
      toast({
        title: "Item added to cart",
        description: `${quantity}x ${sku} added to your cart.`,
        variant: "default",
        duration: 1500,
      });

      setTimeout(() => setIsAdded(false), 1500);
    } catch (error) {
      console.error("Failed to add to cart", error);
      toast({
        title: "Error",
        description: "An error occurred while adding the item to the cart.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      disabled={!add || isAdding}
      onClick={handleAddToCart}
      className="active:scale-95 min-w-40"
      aria-live="polite"
      aria-disabled={!add || isAdding}
    >
      {isAdding ? "Adding..." : isAdded ? "✓ Added" : "Add to Cart"}
    </Button>
  );
}

export default AddToCartButton;
