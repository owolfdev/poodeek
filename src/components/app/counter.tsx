"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

const Counter = ({ phraseId }: { phraseId: string }) => {
  const getCountFromLocalStorage = () => {
    if (typeof window !== "undefined") {
      const storedCounts = JSON.parse(
        localStorage.getItem("phraseCounts") || "[]"
      );
      const matchingCountObj = storedCounts.find(
        (item: { phraseId: string; count: number }) =>
          item.phraseId === phraseId
      );
      return matchingCountObj ? matchingCountObj.count : 0;
    }
    return 0; // Default value
  };

  const [count, setCount] = useState<number>(0); // Set initial state to 0

  useEffect(() => {
    setCount(getCountFromLocalStorage());
  }, [phraseId]);

  const saveCountToLocalStorage = (newCount: number) => {
    if (typeof window !== "undefined") {
      const storedCounts = JSON.parse(
        localStorage.getItem("phraseCounts") || "[]"
      );
      const updatedCounts = storedCounts.filter(
        (item: { phraseId: string; count: number }) =>
          item.phraseId !== phraseId
      );
      updatedCounts.push({ phraseId, count: newCount });
      localStorage.setItem("phraseCounts", JSON.stringify(updatedCounts));
    }
  };

  const incrementCounter = () => {
    console.log("incrementCounter:", phraseId);
    if (count < 50) {
      const newCount = count + 1;
      setCount(newCount);
      saveCountToLocalStorage(newCount);

      const clickSound = new Audio("/sounds/Pop.mp3");
      clickSound.play();
    }

    if (count === 49) {
      const applause = new Audio("/sounds/applause.mp3");
      const glass = new Audio("/sounds/Glass.mp3");
      glass.play();
      // applause.play();
      handleConfetti();
    }
  };

  const resetCounter = () => {
    setCount(0);
    saveCountToLocalStorage(0);
  };

  const handleConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.4 },
    });
  };

  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="text-lg">
        <span className="pl-2">
          {count > 49 ? <span>Hooray</span> : <span>Repeat the phrase</span>}:{" "}
          {count} / 50
        </span>
      </div>
      <div className="flex gap-4">
        <Button variant={`outline`} onClick={incrementCounter}>
          Count
        </Button>
        <Button variant={`outline`} onClick={resetCounter}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default Counter;
