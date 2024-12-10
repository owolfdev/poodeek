"use client";
import type React from "react";
import { useState, useEffect } from "react";
import phrases from "@/data/phrases.json";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AudioPlayer from "./audio-player";

const getCurrentDate = () => new Date().toISOString().split("T")[0];

const PhraseDisplay: React.FC = () => {
  const [audioFiles, setAudioFiles] = useState<
    Array<{ name: string; url: string }>
  >([]);
  const [phrase, setPhrase] = useState({
    id: "",
    phrase: "",
    translation: "",
    transliteration: "",
  });
  const [phraseIndex, setPhraseIndex] = useState<number>(0);
  const [currentAudioFile, setCurrentAudioFile] = useState<{ file: string }>({
    file: "",
  });

  // Fetch audio files once on component mount
  useEffect(() => {
    const fetchAudioFiles = async () => {
      const response = await fetch("/api/get-audio-files");
      const data = await response.json();
      const formattedFiles = data.data.map((file: { file: string }) => ({
        name: file.file,
        url: `/audio/app/${file.file}`,
      }));
      setAudioFiles(formattedFiles);
    };

    fetchAudioFiles();
  }, []);

  // Initialize the phrase on component mount
  useEffect(() => {
    const storedIndex = Number(localStorage.getItem("phraseIndex")) || 0;
    setPhraseIndex(storedIndex);

    const today = getCurrentDate();
    const lastVisitDate = localStorage.getItem("lastVisitDate") || "";

    let nextIndex = storedIndex;
    if (lastVisitDate !== today) {
      nextIndex = (storedIndex + 1) % phrases.length;
      localStorage.setItem("phraseIndex", String(nextIndex));
      localStorage.setItem("lastVisitDate", today);
    }

    const initialPhrase = phrases[nextIndex];
    setPhrase(initialPhrase);

    // Immediately set the audio for the initial phrase
    const matchingAudio = audioFiles.find((file) =>
      file.name.startsWith(initialPhrase.id)
    );
    setCurrentAudioFile({
      file: matchingAudio ? matchingAudio.name : "",
    });
  }, [audioFiles]);

  // Centralized logic to update phrase and audio
  const updatePhrase = (newIndex: number) => {
    const newPhrase = phrases[newIndex];
    setPhraseIndex(newIndex);
    localStorage.setItem("phraseIndex", String(newIndex));
    setPhrase(newPhrase);

    // Immediately update the audio file
    const matchingAudio = audioFiles.find((file) =>
      file.name.startsWith(newPhrase.id)
    );
    setCurrentAudioFile({
      file: matchingAudio ? matchingAudio.name : "",
    });
  };

  const handlePreviousPhrase = () => {
    let newIndex = phraseIndex - 1;
    if (newIndex < 0) {
      newIndex = phrases.length - 1;
    }
    updatePhrase(newIndex);
  };

  const handleNextPhrase = () => {
    const newIndex = (phraseIndex + 1) % phrases.length;
    updatePhrase(newIndex);
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
          {currentAudioFile.file && (
            <AudioPlayer currentAudioFile={currentAudioFile} />
          )}

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
      {/* <div className="flex flex-col gap-2">{phrase.id}</div> */}
    </div>
  );
};

export default PhraseDisplay;
