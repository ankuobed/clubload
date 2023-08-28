const { spawn } = require("child_process");
const getRoomInfo = require("./getRoomInfo");
const os = require("os");
const path = require("path");
const chalk = require("chalk");
const readline = require("readline");
const fs = require("fs");
const formatFileSize = require("./formatFileSize");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const downloadsDirectory = path.join(os.homedir(), "Downloads");

const downloadAudio = async (link) => {
  console.log(chalk.grey("Getting room info..."));
  const streamInfo = await getRoomInfo(link);
  if (streamInfo?.pageTitle) {
    console.log(chalk.grey("Downloading"), streamInfo.pageTitle);
  }

  if (streamInfo?.url) {
    const filePath = `${downloadsDirectory}/${streamInfo.pageTitle}.mp3`;

    const ffmpegProcess = spawn("ffmpeg", ["-i", streamInfo.url, filePath]);

    ffmpegProcess.on("close", (code) => {
      if (code === 0) {
        console.log(
          chalk.green("\nDownload successful, check your downloads folder")
        );
      } else {
        console.log(chalk.red(`Download failed with code ${code}`));
      }
      rl.close();
    });

    ffmpegProcess.stderr.on("data", (data) => {
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);

      const fileExists = fs.existsSync(filePath);
      if (fileExists) {
        const stats = fs.statSync(filePath);
        if (stats.size) {
          process.stdout.write(
            `${chalk.grey("Downloaded:")} ${chalk.yellow(
              formatFileSize(stats.size)
            )}`
          );
        }
      }
    });

    ffmpegProcess.on("error", (err) => {
      console.log("\x1b[31m%s\x1b[0m", "Error executing FFmpeg:", err);
    });
  } else {
    console.log("\x1b[31m%s\x1b[0m", "Found no m3u8 url");
  }
};

module.exports = downloadAudio;
