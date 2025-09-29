import fs from "node:fs";

// Read data from JSON file
const data = JSON.parse(fs.readFileSync("./src/data/phrases.json", "utf8"));

// Add index to each object in the array
const dataWithIndex = data.map((item, index) => ({
  ...item,
  index: index + 1,
}));

console.log(dataWithIndex);

// Write the new data to a JSON file
fs.writeFileSync(
  "./src/data/indexed-phrases.json",
  JSON.stringify(dataWithIndex, null, 2)
);

console.log("Indexed data has been saved to ./indexed-phrases.json");
