const { spawn } = require("child_process");
const getM3u8Url = require("./getM3u8Url");

const downloadAudio = async (link) => {
  const x = await getM3u8Url(link);

  if (x?.url) {
    const ffmpegProcess = spawn("ffmpeg", [
      "-i",
      x.url,
      `/Users/elikem/Downloads/${x.pageTitle}.mp3`,
    ]);

    ffmpegProcess.on("close", (code) => {
      if (code === 0) {
        console.log("Conversion successful.");
      } else {
        console.error(`Conversion failed with code ${code}`);
      }
    });

    ffmpegProcess.stdout.on("data", (data) => {
      console.log(`FFmpeg stdout: ${data}`);
    });

    ffmpegProcess.stderr.on("data", (data) => {
      console.error(`FFmpeg stderr: ${data}`);
    });

    ffmpegProcess.on("error", (err) => {
      console.error("Error executing FFmpeg:", err);
    });
  } else {
    console.log("Found no m3u8 url");
  }
};

module.exports = downloadAudio;
