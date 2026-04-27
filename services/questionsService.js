const fs = require("fs");
const path = require("path");

function getQuestions() {
  const data = fs.readFileSync(
    path.join(__dirname, "../data/questions.json"),
    "utf8"
  );
  return JSON.parse(data).questions;
}

module.exports = { getQuestions };
