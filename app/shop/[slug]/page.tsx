import React from "react";
import Image from "next/image";
import ProductOptions from "./options/product-options";
import { Button } from "@/components/ui/button";
import AddToCartButton from "./add-to-cart-button";
import Link from "next/link";
import products from "@/data/products/products.json";
import variants from "@/data/products/variants.json";

// Utility function to extract the first value from a parameter
function getFirstValue(param: string | string[] | undefined): string {
  return Array.isArray(param) ? param[0] : param || "";
}

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function ProductPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const slug = resolvedParams.slug;
  const size = getFirstValue(resolvedSearchParams.size);
  const quantity = Number(getFirstValue(resolvedSearchParams.quantity)) || 1;

  const product = products.find((p) => p.slug === slug);
  if (!product) return <p>Product not found</p>;

  const { name, description, product_id } = product;
  const productVariants = variants.filter((v) => v.product_id === product_id);

  // Determine the selected variant
  const selectedVariant =
    productVariants.length === 1
      ? productVariants[0] // Single variant (e.g., mug)
      : productVariants.find((v) => v.size === size); // Multiple variants (e.g., t-shirt)

  const price = selectedVariant?.variant_price || product.base_price;

  const isAddToCartEnabled = !!selectedVariant;

  return (
    <div className="flex flex-col max-w-3xl w-full gap-8 pt-4 sm:pt-6">
      <h1 className="text-6xl font-black">{name}</h1>
      <Image
        alt={name}
        src={`/images/shop/${slug}.jpg`}
        width={400}
        height={400}
      />
      <p className="text-xl">{description}</p>
      <p className="text-2xl font-bold">Price: ${price.toFixed(2)} each</p>
      <ProductOptions
        slug={slug}
        initialSize={size}
        initialQuantity={quantity}
        variants={productVariants}
      />
      <div className="flex gap-2">
        <AddToCartButton
          sku={selectedVariant?.sku || ""}
          variant_id={selectedVariant?.variant_id || null}
          quantity={quantity}
          add={isAddToCartEnabled}
        />
        <Link href="/shop/cart">
          <Button variant="outline">View cart</Button>
        </Link>
      </div>
    </div>
  );
}

export default ProductPage;
