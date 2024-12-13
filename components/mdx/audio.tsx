import React from "react";

function Audio({ src }: { src: string | undefined }) {
  return (
    src && (
      <audio controls className="pb-4">
        <source src={src || undefined} type="audio/mpeg" />
        <track kind="captions" src="" label="English captions" />
        Your browser does not support the audio element.
      </audio>
    )
  );
}

export default Audio;
