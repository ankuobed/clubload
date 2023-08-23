const { spawn } = require("child_process");
const getStreamInfo = require("./getStreamInfo");

const downloadAudio = async (link) => {
  const streamInfo = await getStreamInfo(link);

  if (streamInfo?.url) {
    const ffmpegProcess = spawn("ffmpeg", [
      "-i",
      streamInfo.url,
      `/Users/elikem/Downloads/${streamInfo.pageTitle}.mp3`,
    ]);

    ffmpegProcess.on("close", (code) => {
      if (code === 0) {
        console.log("Download successful ✅");
      } else {
        console.error(`Download failed with code ${code}`);
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
