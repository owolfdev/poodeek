import type React from "react";
import type { Metadata } from "next";
import EditPageButton from "@/components/page/edit-page-button";
import OpenInCursor from "@/components/page/open-page-in-cursor-button";
import PhraseDisplay from "@/components/app/phrase-display-for-indexed-data";
import { isDevMode } from "@/lib/utils/is-dev-mode";
import { InfoDialog } from "@/components/app/info-dialog";

type Props = {
  params: Promise<{ id: string }>;
};

interface MdxModule {
  default: React.ComponentType;
  metadata: {
    title: string;
    description: string;
    slug?: string;
  };
}

// Generate metadata using the imported metadata from the MDX file
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Poodeek!",
    description: "Poodeek is a tool for learning Thai",
  };
}

// Render the About page using the dynamically imported content
export default async function Page({ params }: Props) {
  const { id } = await params;
  return (
    <div className="flex flex-col max-w-3xl w-full gap-8 pt-6 sm:pt-10">
      <PhraseDisplay id={id} />
    </div>
  );
}
