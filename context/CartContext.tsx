"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

type CartItem = {
  sku: string; // SKU as the unique identifier
  quantity: number; // Quantity of the item
  size?: string; // Optional: For T-shirts or other variants
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartItem: (sku: string, quantity: number) => void;
  removeCartItem: (sku: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.sku === item.sku
      );

      if (existingItem) {
        // Increment quantity if item exists
        return prevCart.map((cartItem) =>
          cartItem.sku === item.sku
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }

      // Add new item if it doesn't exist
      return [...prevCart, item];
    });
  };

  const updateCartItem = (sku: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.sku === sku ? { ...cartItem, quantity } : cartItem
      )
    );
  };

  const removeCartItem = (sku: string) => {
    setCart((prevCart) => prevCart.filter((cartItem) => cartItem.sku !== sku));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateCartItem, removeCartItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
