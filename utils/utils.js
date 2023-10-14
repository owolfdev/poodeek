const fs = require("fs");

// Read the JSON file
fs.readFile("data/phrases.json", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // Parse the JSON data
  const jsonData = JSON.parse(data);

  // Get the length of the main array
  const length = jsonData.length;

  console.log(`The length of the main array is ${length}`);

  // Check for duplicates
  const ids = new Set();
  const duplicates = new Set();
  for (let i = 0; i < length; i++) {
    const id = jsonData[i].id;
    if (ids.has(id)) {
      duplicates.add(id);
    }
    ids.add(id);
  }
  if (duplicates.size > 0) {
    console.error(`Duplicate ids found: ${[...duplicates].join(", ")}`);
  } else {
    console.log("No duplicates found.");
  }
});
