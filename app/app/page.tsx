import type React from "react";
import type { Metadata } from "next";
import EditPageButton from "@/components/page/edit-page-button";
import OpenInCursor from "@/components/page/open-page-in-cursor-button";
import PhraseDisplay from "@/components/app/phrase-display";
import { isDevMode } from "@/lib/utils/is-dev-mode";

interface MdxModule {
  default: React.ComponentType;
  metadata: {
    title: string;
    description: string;
    slug?: string;
  };
}

// // Dynamically import the MDX file to access metadata and content
// async function loadMdxFile(): Promise<MdxModule | null> {
//   try {
//     const mdxModule: MdxModule = await import("@/content/pages/about.mdx");
//     return mdxModule;
//   } catch (error) {
//     console.error("Failed to load MDX file:", error);
//     return null;
//   }
// }

// Generate metadata using the imported metadata from the MDX file
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Poodeek!",
    description: "Poodeek is a tool for learning Thai",
  };
}

// Render the About page using the dynamically imported content
export default async function AboutPage() {
  return (
    <div className="flex flex-col max-w-3xl w-full gap-8 pt-6 sm:pt-10">
      <PhraseDisplay />
    </div>
  );
}
