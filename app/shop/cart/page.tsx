"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import products from "@/data/products/products.json"; // Import product metadata
import variants from "@/data/products/variants.json"; // Import variant metadata
import Link from "next/link";
const CartPage: React.FC = () => {
  const { cart, clearCart, updateCartItem, removeCartItem } = useCart();

  // Format price as currency
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  // Calculate total
  const total = cart.reduce((total, item) => {
    const variant = variants.find((v) => v.sku === item.sku);
    return total + (variant?.variant_price || 0) * item.quantity;
  }, 0);

  return (
    <div className="flex flex-col max-w-4xl mx-auto w-full gap-8 pt-6 sm:pt-10 px-4 sm:px-0">
      <h1 className="text-3xl sm:text-5xl font-bold text-center sm:text-left">
        Shopping Cart
      </h1>
      <p className="text-sm opacity-50 text-center sm:text-left">
        This is in development, so it&apos;s not functional yet.
      </p>

      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-lg mb-4">Your cart is empty.</p>
          <Link href="/shop">
            <Button variant="default" className="px-6 py-3 text-xl" size="lg">
              Browse Products
            </Button>
          </Link>
        </div>
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
                  className="flex flex-wrap items-center gap-4 border-b pb-4"
                >
                  {/* Product Image */}
                  <img
                    src={`/images/shop/${slug}.jpg`}
                    onError={(e) => {
                      e.currentTarget.src = "/images/placeholder.jpg";
                    }}
                    alt={name}
                    className="w-24 h-24 object-cover rounded"
                  />

                  {/* Product Details */}
                  <div className="flex-1">
                    <h2 className="text-lg font-bold">{name}</h2>
                    <p className="text-sm">{formatCurrency(variant_price)}</p>
                    {size && <p className="text-sm">Size: {size}</p>}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      aria-label={`Decrease quantity of ${name}`}
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
                      aria-label={`Increase quantity of ${name}`}
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
                    {formatCurrency(subtotal)}
                  </p>

                  {/* Delete Button */}
                  <Button
                    aria-label={`Remove ${name} from cart`}
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

          {/* Total and Checkout */}
          <div className="flex flex-col items-end gap-4 mt-6">
            <div className="text-xl font-bold">
              Total: {formatCurrency(total)}
              <div className="text-sm font-normal opacity-60">
                Before taxes and shipping
              </div>
            </div>

            <Link href="/shop/checkout">
              <Button
                variant="default"
                className="px-6 py-3 bg-primary text-primary-foreground font-bold"
                aria-label="Proceed to checkout"
              >
                Proceed to Checkout
              </Button>
            </Link>
            <Button
              onClick={clearCart}
              className="text-sm"
              variant="outline"
              aria-label="Clear cart"
            >
              Clear Cart
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
