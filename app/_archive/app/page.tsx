"use client";
// Import required libraries and components
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import phrases from "@/data/indexed-phrases.json";

export default function AppHomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Check local storage for the current phrase index
    const storedIndex = localStorage.getItem("phraseIndex");
    let targetIndex = storedIndex ? Number.parseInt(storedIndex, 10) : 1; // Default to index 1 if none exists

    // Validate the index to ensure it corresponds to a valid phrase
    if (
      Number.isNaN(targetIndex) ||
      targetIndex < 1 ||
      targetIndex > phrases.length
    ) {
      targetIndex = 1; // Reset to the first index if invalid
    }

    // Get the corresponding phrase ID based on the index
    const targetPhrase = phrases.find((phrase) => phrase.index === targetIndex);

    // Redirect to the appropriate URL
    if (targetPhrase) {
      router.push(`/app/${targetPhrase.id}`);
    }
  }, [router]);

  return null; // This component only handles redirection
}
