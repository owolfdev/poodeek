const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const util = require("util");
const path = require("path");
// const { createClient } = require("@supabase/supabase-js");
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// );

export async function speakText(text) {
  console.log("speakText", text);
  return;

  // Parse the environment variable to an object
  const google_credentials_content = process.env.GOOGLE_CREDENTIALS_CONTENT;

  const credentials = JSON.parse(google_credentials_content);

  // Provide the parsed credentials when creating the TextToSpeechClient instance
  const client = new textToSpeech.TextToSpeechClient({ credentials });

  const request = {
    input: { text: text },
    voice: { languageCode: "fr-FR", ssmlGender: "FEMALE" },
    audioConfig: { audioEncoding: "MP3" },
  };

  const [response] = await client.synthesizeSpeech(request);
  // const writeFile = util.promisify(fs.writeFile);

  // Upload audio content to Supabase
  const { data, error } = await supabase.storage
    .from("audio-bucket")
    .upload("output.mp3", response.audioContent);

  // if (error) {
  //   console.log("error", error);
  //   return;
  // }

  console.log("data", data);

  console.log("Audio content written to file: output.mp3");
}

speakText("Bonjour");
