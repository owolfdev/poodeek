"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import phrases from "@/data/indexed-phrases.json";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AudioPlayer from "./audio-player";
import { InfoDialog } from "./info-dialog";
import Link from "next/link";

const PhraseDisplay: React.FC<{ id: string }> = ({ id }) => {
  const router = useRouter();

  const [phrase, setPhrase] = useState({
    id: "",
    phrase: "",
    transliteration: "",
    translation: "",
    index: 0,
  });
  const [currentAudioFile, setCurrentAudioFile] = useState<{ file: string }>({
    file: "",
  });
  const [audioFiles, setAudioFiles] = useState<
    Array<{ name: string; url: string }>
  >([]);

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

  const updateStoredPhraseIndexNext = () => {
    const newIndex = phrase.index + 1;
    localStorage.setItem("phraseIndex", newIndex.toString());
  };
  const updateStoredPhraseIndexPrev = () => {
    const newIndex = phrase.index - 1;
    localStorage.setItem("phraseIndex", newIndex.toString());
  };

  // Load the phrase based on the id in the URL
  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const foundPhrase = phrases.find((p) => p.id === id);
    if (foundPhrase) {
      setPhrase(foundPhrase);
      localStorage.setItem("lastViewedPhraseId", id);

      // Find matching audio file for the phrase
      const matchingAudio = audioFiles.find((file) =>
        file.name.startsWith(foundPhrase.id)
      );
      setCurrentAudioFile({
        file: matchingAudio ? matchingAudio.name : "",
      });
    }
  }, [id, audioFiles]);

  const nextPhrase = phrases[phrase.index % phrases.length];
  const prevPhrase =
    phrases[(phrase.index - 2 + phrases.length) % phrases.length];

  return (
    <Card className="w-full">
      {/* <Link href={"/app/5e6f7g8h"}>5e6f7g8h</Link>
      <Link href={"/app/9i0j1k2l"}>1a2b3c4d</Link> */}

      <CardContent>
        <div className="sm:pl-4 pt-6 flex  gap-4 items-center">
          <div className="flex gap-4 items-center">
            <Link href={`/phrase/${prevPhrase.id}`} passHref>
              <Button variant="outline" onClick={updateStoredPhraseIndexPrev}>
                Previous
              </Button>
            </Link>
            <Link href={`/phrase/${nextPhrase.id}`} passHref>
              <Button variant="outline" onClick={updateStoredPhraseIndexNext}>
                Next
              </Button>
            </Link>
          </div>
          <div className="text-sm">
            {phrase.index} of {phrases.length}
          </div>
        </div>
        <div className="sm:py-6 sm:px-4 py-4">
          <p className="sm:text-3xl text-2xl font-semibold">
            {phrase.transliteration}
          </p>
        </div>
        <div className="sm:px-4 px-0 py-4">
          <p className="text-xl text-muted-foreground">{phrase.translation}</p>
        </div>
        <div className="pt-4 pb-8 sm:px-4 px-0">
          <p className="sm:text-3xl text-3xl font-semibold">{phrase.phrase}</p>
        </div>
        {currentAudioFile.file && (
          <AudioPlayer currentAudioFile={currentAudioFile} />
        )}
      </CardContent>
      <CardFooter className="flex gap-4">
        <InfoDialog phrase={phrase} />
      </CardFooter>
    </Card>
  );
};

export default PhraseDisplay;
