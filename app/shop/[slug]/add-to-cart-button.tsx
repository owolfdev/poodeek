"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

type CartItem = {
  sku: string;
  quantity: number;
  size?: string;
};

function AddToCartButton({
  sku,
  quantity = 1,
}: {
  sku: string;
  quantity?: number;
}) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);

    try {
      const newItem: CartItem = {
        sku,
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

      // Reset "Added!" state after 1.5 seconds
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
      disabled={sku === ""}
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
