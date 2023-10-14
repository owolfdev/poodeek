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
  const [currentAudioFile, setCurrentAudioFile] = useState({ file: "" });

  const initialRender = useRef(true); // Add this ref

  const getLastVisitDate = () => localStorage.getItem("lastVisitDate") || "";
  const getLastPhraseIndex = () =>
    Number(localStorage.getItem("phraseIndex")) || 0;

  useEffect(() => {
    const fetchAudioFiles = async () => {
      const response = await fetch("/api/get-audio-files");
      const data = await response.json();
      setAudioFiles(data);
    };

    fetchAudioFiles();

    // Handle localStorage logic for phrases
    const today = getCurrentDate();
    const lastVisitDate = getLastVisitDate();
    let phraseIndex = getLastPhraseIndex();

    // if (initialRender.current) {
    //   initialRender.current = false;
    //   return;
    // }

    if (!lastVisitDate) {
      // Check if it's the user's first visit
      localStorage.setItem("lastVisitDate", today);
      localStorage.setItem("phraseIndex", "0");
    } else if (lastVisitDate !== today) {
      phraseIndex += 1;
      if (phraseIndex >= phrases.length) {
        phraseIndex = 0;
      }
      console.log("phraseIndex", phraseIndex);
      localStorage.setItem("lastVisitDate", today);
      localStorage.setItem("phraseIndex", String(phraseIndex));
    }

    setPhrase(phrases[phraseIndex]);
  }, []);

  useEffect(() => {
    console.log("time to get the current audio file");
    const matchedAudioFile = audioFiles.data.find(
      (audioFile: any) => audioFile.file.split(".")[0] === phrase.id
    );

    console.log("matchedAudioFile:", matchedAudioFile);
    if (matchedAudioFile) {
      setCurrentAudioFile(matchedAudioFile);
    }
  }, [audioFiles, phrase]);

  useEffect(() => {
    console.log("currentAudioFile:", currentAudioFile);
  }, [currentAudioFile]);

  const handlePreviousPhrase = () => {
    const today = getCurrentDate();
    const lastVisitDate = getLastVisitDate();
    let phraseIndex = getLastPhraseIndex();

    phraseIndex -= 1;
    if (phraseIndex < 0) {
      phraseIndex = phrases.length - 1;
    }
    console.log("phraseIndex", phraseIndex);
    localStorage.setItem("lastVisitDate", today);
    localStorage.setItem("phraseIndex", String(phraseIndex));

    setPhrase(phrases[phraseIndex]);
  };

  const handleNextPhrase = () => {
    const today = getCurrentDate();
    const lastVisitDate = getLastVisitDate();
    let phraseIndex = getLastPhraseIndex();

    phraseIndex += 1;
    if (phraseIndex >= phrases.length) {
      phraseIndex = 0;
    }
    console.log("phraseIndex", phraseIndex);
    localStorage.setItem("lastVisitDate", today);
    localStorage.setItem("phraseIndex", String(phraseIndex));

    setPhrase(phrases[phraseIndex]);
  };

  const handleGetInfo = () => {
    console.log("get info:");
  };

  return (
    <div className="flex flex-col gap-4 p-2 pt-6">
      {/* <div className="flex flex-col gap-0 p-2">
        <div>{getFormattedDateWithDay()}</div>
        <div className="text-xl">Repeat this 50 times.</div>
       
      </div> */}

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
        </CardContent>
        <CardFooter className="flex md:flex-row flex-col gap-6 md:justify-between md:items-center items-start">
          {currentAudioFile.file && (
            <div>
              <AudioPlayer currentAudioFile={currentAudioFile} />
              {/* <audio controls key={currentAudioFile.file}>
                <source
                  src={`/audio/${currentAudioFile.file}`}
                  type="audio/mpeg"
                />
                Your browser does not support the audio element.
              </audio> */}
            </div>
          )}
          {/* <div>{currentAudioFile.file}</div> */}
          <div className="flex gap-4 justify-between w-full md:w-auto">
            {/* <Button onClick={handleGetInfo} variant="outline">
              Info
            </Button> */}
            <InfoDialog phrase={phrase} />
            <div className="flex gap-2">
              <Button onClick={handlePreviousPhrase} variant="outline">
                Previous
              </Button>
              <Button onClick={handleNextPhrase} variant="outline">
                Next
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
      <Counter phraseId={phrase.id} />
    </div>
  );
};

export default PhraseDisplay;
