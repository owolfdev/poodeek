import type React from "react";
import type { Metadata } from "next";
import EditPageButton from "@/components/page/edit-page-button";
import OpenInCursor from "@/components/page/open-page-in-cursor-button";
import { isDevMode } from "@/lib/utils/is-dev-mode";
import Image from "next/image";
import Link from "next/link";
import products from "@/data/products/products.json"; // Import products data
import variants from "@/data/products/variants.json"; // Import variants data

interface MdxModule {
  default: React.ComponentType;
  metadata: {
    title: string;
    description: string;
    slug?: string;
  };
}

// Dynamically import the MDX file to access metadata and content
async function loadMdxFile(): Promise<MdxModule | null> {
  try {
    const mdxModule: MdxModule = await import("@/content/pages/shop.mdx");
    return mdxModule;
  } catch (error) {
    console.error("Failed to load MDX file:", error);
    return null;
  }
}

// Generate metadata using the imported metadata from the MDX file
export async function generateMetadata(): Promise<Metadata> {
  const mdxModule = await loadMdxFile();
  if (!mdxModule) {
    return {
      title: "About Poodeek!",
      description: "Learn more about Poodeek!",
    };
  }
  const { metadata } = mdxModule;

  return {
    title: metadata.title,
    description: metadata.description,
  };
}

// Render the Shop page using the dynamically imported content
export default async function ShopPage() {
  const mdxModule = await loadMdxFile();

  if (!mdxModule) {
    return <p>Page not found</p>; // Handle the case where the MDX file is not found
  }

  const { default: Content, metadata } = mdxModule;

  return (
    <div className="flex flex-col max-w-3xl w-full gap-8 pt-6 sm:pt-10">
      <h1 className="text-6xl font-black">Our Products</h1>
      <p className="text-sm opacity-50">
        This is in development, so it&apos;s not functional yet.
      </p>
      {isDevMode() && (
        <div className="flex gap-3">
          <EditPageButton slug="shop" />
          <OpenInCursor path="shop" />
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-8">
        {products && products.length > 0 ? (
          products.map((product) => {
            // Filter variants related to the current product
            const productVariants = variants.filter(
              (variant) => variant.product_id === product.product_id
            );

            // Calculate min and max prices for the product
            const prices = productVariants.map(
              (variant) => variant.variant_price
            );
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);

            return (
              <Link key={product.slug} href={`/shop/${product.slug}`}>
                <div className="flex flex-col gap-4">
                  <h2 className="text-4xl font-bold">{product.name}</h2>
                  <Image
                    alt={product.name}
                    src={`/images/shop/${product.slug}.jpg`}
                    width={300}
                    height={300}
                  />
                  <p className="text-xl font-bold">
                    {minPrice === maxPrice
                      ? `Price: $${minPrice}` // Display single price for single variant
                      : `Price: $${minPrice} - $${maxPrice}`}{" "}
                  </p>
                  <p className="text-sm max-w-[300px]">{product.description}</p>
                </div>
              </Link>
            );
          })
        ) : (
          <p>No products available at the moment.</p>
        )}
      </div>
    </div>
  );
}
