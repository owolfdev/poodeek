import React from "react";
import Image from "next/image";
import ProductOptions from "./options/product-options";
import { Button } from "@/components/ui/button";
import AddToCartButton from "./add-to-cart-button";
import Link from "next/link";
import products from "@/data/products/products.json"; // Import product metadata
import variants from "@/data/products/variants.json"; // Import product variants

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ add?: string; size?: string; quantity?: string }>;
};

async function ProductPage({ params, searchParams }: Props) {
  // Await both params and searchParams
  const { slug } = await params;
  const { add = "false", size = "", quantity = "1" } = await searchParams;

  // Find the product based on the slug
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return <p>Product not found</p>; // Handle case where the product doesn't exist
  }

  const { name, base_price, description } = product;

  // Determine the SKU for the selected variant or default product
  const sku = variants.find((variant) => {
    if (variant.product_id === product.product_id) {
      // For products with variants (e.g., T-shirts)
      if (variant.size) {
        return variant.size === size;
      }
      // For products without variants (e.g., mugs)
      return true;
    }
    return false;
  })?.sku;

  return (
    <div className="flex flex-col max-w-3xl w-full gap-8 pt-4 sm:pt-6">
      <h1 className="text-6xl font-black">{name}</h1>
      <p className="text-sm text-gray-700">
        This is in development, so it's not functional yet.
      </p>
      <Image
        alt={name}
        src={`/images/shop/${slug}.jpg` || "/images/shop/placeholder.jpg"}
        width={400}
        height={400}
      />
      <p className="text-xl">{description}</p>
      <p className="text-2xl font-bold">${base_price.toFixed(2)}</p>
      <ProductOptions slug={slug} />
      <div className="flex gap-2">
        <AddToCartButton
          sku={sku || ""}
          quantity={Number.parseInt(quantity, 10)}
        />

        <Link href="/shop/cart">
          <Button variant="outline" className="active:scale-95">
            View cart
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default ProductPage;
