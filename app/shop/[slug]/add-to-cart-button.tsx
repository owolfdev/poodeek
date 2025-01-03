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
    if (!sku || !variant_id) {
      console.error("Invalid add-to-cart attempt:", {
        sku,
        variant_id,
        quantity,
      });
      toast({
        title: "Invalid product selection",
        description: "Please choose a valid size or variant.",
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
      disabled={!add}
      onClick={handleAddToCart}
      className="active:scale-95 min-w-40"
      aria-live="polite"
      aria-disabled={isAdding}
    >
      {isAdding ? "Adding..." : isAdded ? "✓ Added" : "Add to Cart"}
    </Button>
  );
}

export default AddToCartButton;
