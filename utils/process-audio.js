const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const util = require("util");
const path = require("path");
require("dotenv").config();

const phrases = require("../data/phrases.json");

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
