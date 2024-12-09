"use client";
import React, { useState, useRef, useEffect, use } from "react";
import phrases from "@/data/phrases.json";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Counter from "@/components/counter";
import { InfoDialog } from "./info-dialog";
import AudioPlayer from "./audio-player";
import Image from "next/image";

let phraseIndex = 0;

const getFormattedDateWithDay = (): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  return new Date().toLocaleDateString("en-US", options);
};

const getCurrentDate = () => new Date().toISOString().split("T")[0];

const PhraseDisplay: React.FC<{}> = () => {
  const [audioFiles, setAudioFiles] = useState({ message: "", data: [] });
  const [phrase, setPhrase] = useState({
    id: "",
    phrase: "",
    translation: "",
    transliteration: "",
  });
  const [phraseIndex, setPhraseIndex] = useState<number>(() => {
    // Initialize `phraseIndex` from localStorage
    return Number(localStorage.getItem("phraseIndex")) || 0;
  });

  useEffect(() => {
    const fetchAudioFiles = async () => {
      const response = await fetch("/api/get-audio-files");
      const data = await response.json();
      setAudioFiles(data);
    };

    fetchAudioFiles();

    // Handle logic for setting initial phrase
    const today = getCurrentDate();
    const lastVisitDate = localStorage.getItem("lastVisitDate") || "";

    if (lastVisitDate !== today) {
      // If it's a new day, increment the index
      const nextIndex = (phraseIndex + 1) % phrases.length;
      setPhraseIndex(nextIndex);
      localStorage.setItem("phraseIndex", String(nextIndex));
      localStorage.setItem("lastVisitDate", today);
      setPhrase(phrases[nextIndex]);
    } else {
      // Use the existing index for today
      setPhrase(phrases[phraseIndex]);
    }
  }, []);

  const handlePreviousPhrase = () => {
    let newIndex = phraseIndex - 1;
    if (newIndex < 0) {
      newIndex = phrases.length - 1;
    }
    setPhraseIndex(newIndex);
    localStorage.setItem("phraseIndex", String(newIndex));
    setPhrase(phrases[newIndex]);
  };

  const handleNextPhrase = () => {
    const newIndex = (phraseIndex + 1) % phrases.length;
    setPhraseIndex(newIndex);
    localStorage.setItem("phraseIndex", String(newIndex));
    setPhrase(phrases[newIndex]);
  };

  return (
    <div className="flex flex-col gap-4 p-2 pt-6">
      <Card className="w-full">
        <CardContent>
          <div className="pt-12 pb-6 px-4">
            <p className="sm:text-3xl text-2xl font-semibold">
              {phrase.transliteration}
            </p>
          </div>
          <div className="sm:p-6 p-4">
            <p className="text-xl text-muted-foreground">
              {phrase.translation}
            </p>
          </div>
          <div className="pt-6 pb-6 px-4">
            <p className="sm:text-3xl text-2xl font-semibold">
              {phrase.phrase}
            </p>
          </div>
          <div className="px-4 text-sm text-muted-foreground">
            Phrase {phraseIndex + 1} of {phrases.length}
          </div>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button onClick={handlePreviousPhrase} variant="outline">
            Previous
          </Button>
          <Button onClick={handleNextPhrase} variant="outline">
            Next
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PhraseDisplay;
