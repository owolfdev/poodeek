import React from "react";
import Image from "next/image";
import ProductOptions from "./options/product-options";
import { Button } from "@/components/ui/button";
import AddToCartButton from "./add-to-cart-button";
import Link from "next/link";
import products from "@/data/products/products.json";
import variants from "@/data/products/variants.json";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ add?: string; size?: string; quantity?: string }>;
};

async function ProductPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { add = "false", size = "", quantity = "1" } = await searchParams;

  // Find the product based on the slug
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    console.error("Product not found for slug:", slug);
    return <p>Product not found</p>;
  }

  const { name, base_price, description } = product;

  // Find the selected variant
  const selectedVariant = variants.find(
    (variant) =>
      variant.product_id === product.product_id &&
      (!size || variant.size === size)
  );

  if (!selectedVariant) {
    console.error("No variant found for product and size:", {
      product_id: product.product_id,
      size,
      availableVariants: variants.filter(
        (variant) => variant.product_id === product.product_id
      ),
    });
  }

  const sku = selectedVariant?.sku || ""; // Fallback to empty string if no valid variant is found
  const variant_id = selectedVariant?.variant_id || null;

  return (
    <div className="flex flex-col max-w-3xl w-full gap-8 pt-4 sm:pt-6">
      <h1 className="text-6xl font-black">{name}</h1>
      <p className="text-sm opacity-50">
        This is in development, so it&apos;s not functional yet.
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
          sku={sku}
          variant_id={variant_id}
          quantity={Number.parseInt(quantity, 10)}
          add={add === "true"}
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
