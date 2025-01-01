"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import products from "@/data/products/products.json"; // Import product metadata
import variants from "@/data/products/variants.json"; // Import variant metadata

const CartPage: React.FC = () => {
  const { cart, clearCart, updateCartItem, removeCartItem } = useCart();

  // Calculate grand total
  const grandTotal = cart.reduce((total, item) => {
    const variant = variants.find((v) => v.sku === item.sku);
    return total + (variant?.variant_price || 0) * item.quantity;
  }, 0);

  return (
    <div className="flex flex-col max-w-4xl mx-auto w-full gap-8 pt-6 sm:pt-10">
      <h1 className="text-5xl font-bold">Shopping Cart</h1>
      <p className="text-sm text-gray-700">
        This is in development, so it's not functional yet.
      </p>

      {cart.length === 0 ? (
        <p className="text-lg">Your cart is empty.</p>
      ) : (
        <>
          <ul className="flex flex-col gap-6">
            {cart.map((item) => {
              const variant = variants.find((v) => v.sku === item.sku);
              const product = products.find(
                (p) => p.product_id === variant?.product_id
              );

              if (!product || !variant) return null;

              const { name, slug } = product;
              const { size, variant_price } = variant;
              const subtotal = variant_price * item.quantity;

              return (
                <li
                  key={item.sku}
                  className="flex items-center gap-4 border-b pb-4"
                >
                  {/* Product Image */}
                  <img
                    src={`/images/shop/${slug}.jpg`}
                    alt={name}
                    className="w-24 h-24 object-cover rounded"
                  />

                  {/* Product Details */}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold">{name}</h2>
                    <p className="text-sm">${variant_price.toFixed(2)}</p>
                    {size && <p className="text-sm">Size: {size}</p>}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() =>
                        updateCartItem(item.sku, Math.max(1, item.quantity - 1))
                      }
                      size="icon"
                      variant="secondary"
                    >
                      -
                    </Button>
                    <div className="text-center bg-white px-4 py-2 rounded-md">
                      {item.quantity}
                    </div>
                    <Button
                      onClick={() =>
                        updateCartItem(item.sku, item.quantity + 1)
                      }
                      size="icon"
                      variant="secondary"
                    >
                      +
                    </Button>
                  </div>

                  {/* Subtotal */}
                  <p className="w-24 text-right font-medium">
                    ${subtotal.toFixed(2)}
                  </p>

                  {/* Delete Button */}
                  <Button
                    onClick={() => removeCartItem(item.sku)}
                    size="icon"
                    className="active:scale-95"
                    variant="outline"
                  >
                    🗑️
                  </Button>
                </li>
              );
            })}
          </ul>

          {/* Grand Total and Checkout */}
          <div className="flex flex-col items-end gap-4 mt-6">
            <div className="text-xl font-bold">
              Grand Total: ${grandTotal.toFixed(2)}
            </div>
            <Button
              variant="default"
              className="px-6 py-3 bg-primary text-primary-foreground font-bold"
            >
              Proceed to Checkout
            </Button>
            <Button onClick={clearCart} className="text-sm" variant="outline">
              Clear Cart
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
