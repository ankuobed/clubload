#!/usr/bin/env node

const downloadAudio = require("./utils/downloadAudio");

const link = process.argv[2];

if (link) {
  downloadAudio(link);
} else {
  console.log("Missing link");
}
