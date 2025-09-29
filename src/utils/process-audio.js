import textToSpeech from "@google-cloud/text-to-speech";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const phrases = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/phrases.json"), "utf8"));

const google_credentials_content = process.env.GOOGLE_CREDENTIALS_CONTENT;
const credentials = JSON.parse(google_credentials_content);
const client = new textToSpeech.TextToSpeechClient({ credentials });

async function convertTextToAudioFile(obj) {
  // console.log("convertTextToAudioFile:", obj.phrase);

  const request = {
    input: { text: obj.phrase },
    voice: { languageCode: "th-TH", ssmlGender: "FEMALE" }, // Changed language to Thai here
    audioConfig: { audioEncoding: "MP3" },
  };

  const [response] = await client.synthesizeSpeech(request);

  // Specify the path where the audio should be saved
  const outputPath = path.join(
    __dirname,
    "../public/audio/",
    `${obj.id}.audio.mp3`
  );

  // Write the audio content to the file
  await fs.promises.writeFile(outputPath, response.audioContent, "binary");

  // if (error) {
  //   console.log("error", error);
  //   return;
  // }
}

async function convertAll() {
  for (const phraseObj of phrases) {
    await convertTextToAudioFile(phraseObj);
  }
}

convertAll();
