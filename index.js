#!/usr/bin/env node

const downloadAudio = require("./utils/downloadAudio");
const downloadLatest = require("./utils/downloadLatest");

const argument = process.argv[2];

if (argument === "latest") {
  downloadLatest();
} else if (argument) {
  try {
    downloadAudio(argument);
  } catch (err) {
    console.log("\x1b[31m%s\x1b[0m", err?.toString());
  }
} else {
  console.log("\x1b[31m%s\x1b[0m", "Missing link");
}
