import type React from "react";
import { useRef } from "react";

type AudioFile = {
  file: string;
};

type AudioPlayerProps = {
  currentAudioFile: AudioFile;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ currentAudioFile }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlaybackRateChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = Number.parseFloat(e.target.value);
    }
  };

  return (
    <div>
      <audio controls key={currentAudioFile.file} ref={audioRef}>
        <source src={`/audio/app/${currentAudioFile.file}`} type="audio/mpeg" />
        <track kind="captions" />
        Your browser does not support the audio element.
      </audio>

      <div className="flex gap-4 items-center pt-4">
        <div>Playback Speed: </div>
        <select
          className="border py-2 px-4 rounded-md bg-white"
          onChange={handlePlaybackRateChange}
          defaultValue="1"
        >
          <option value="0.5">0.5x</option>
          <option value="0.75">0.75x</option>
          <option value="1">1x</option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
        </select>
      </div>
    </div>
  );
};

export default AudioPlayer;
