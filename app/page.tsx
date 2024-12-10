import type React from "react";
import type { Metadata } from "next";
import EditPageButton from "@/components/page/edit-page-button";
import OpenInCursor from "@/components/page/open-page-in-cursor-button";
import { isDevMode } from "@/lib/utils/is-dev-mode";
import Image from "next/image";
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
    const mdxModule: MdxModule = await import("@/content/pages/home.mdx");
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
      title: "About Thriving Expat",
      description: "Learn more about Thriving Expat",
    };
  }
  const { metadata } = mdxModule;

  return {
    title: metadata.title,
    description: metadata.description,
  };
}

// Render the About page using the dynamically imported content
export default async function HomePage() {
  const mdxModule = await loadMdxFile();

  if (!mdxModule) {
    return <p>Page not found</p>; // Handle the case where the MDX file is not found
  }

  const { default: Content, metadata } = mdxModule;

  return (
    <div className="flex flex-col max-w-3xl w-full gap-8 pt-10">
      <div>
        <h1 className="text-6xl sm:text-8xl font-black text-center">
          {metadata.title}
        </h1>
        <p className="text-center text-2xl pt-4">{metadata.description}</p>
      </div>
      {isDevMode() && (
        <div className="flex gap-3">
          <EditPageButton slug={metadata.slug ?? "default-slug"} />
          <OpenInCursor path={metadata.slug ?? "default-path"} />
        </div>
      )}
      <article className="prose prose-lg mx-auto w-full">
        <Content />
      </article>

      <div className="flex justify-center">
        <Image src="/logos/app-logo.png" alt="logo" width={200} height={200} />
      </div>
    </div>
  );
}
