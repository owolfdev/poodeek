import { rawData } from "../data/raw_data.mjs";

function transformData(data) {
  const pattern = /\*\*(.*?)\*\* - (.*?)(\n|$)/g;
  const transformedData = [];

  let match;
  while ((match = pattern.exec(data)) !== null) {
    transformedData.push({
      phrase: match[1].trim(),
      translation: match[2].trim(),
    });
  }

  return transformedData;
}

const PHRASES = transformData(rawData);
console.log(JSON.stringify(PHRASES, null, 2));
