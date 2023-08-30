const puppeteer = require("puppeteer");
const downloadAudio = require("./downloadAudio");
const chalk = require("chalk");

const profileLinks = [
  "https://www.clubhouse.com/@hope_expression?utm_medium=ch_profile&utm_campaign=zwq8YMxjH8uZ-bK_OjW5Tg-869782",
  "https://www.clubhouse.com/@hope.expression?utm_medium=ch_profile&utm_campaign=zwq8YMxjH8uZ-bK_OjW5Tg-869796",
];

const getLatestRoomUrl = async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const rooms = [];

  for (const profileLink of profileLinks) {
    await page.goto(profileLink, { timeout: 0 });

    const latestRoomElement = await page.waitForSelector(
      "::-p-text(SPEAKER IN) + div > :first-child"
    );

    const linkElement = await latestRoomElement.waitForSelector("a");
    const link = await (await linkElement.getProperty("href")).jsonValue();

    const dateElement = await latestRoomElement.waitForSelector("time");
    const date = await (
      await dateElement.getProperty("textContent")
    ).jsonValue();

    rooms.push({ link, date });
  }

  await browser.close();

  const firstRoom = rooms[0];
  const secondRoom = rooms[1];

  if (firstRoom.date === secondRoom.date) {
    return firstRoom.link;
  }

  if (new Date(firstRoom.date) > new Date(secondRoom.date)) {
    return firstRoom.link;
  } else {
    return secondRoom.link;
  }
};

const downloadLatest = async () => {
  console.log(chalk.grey("Getting latest room link..."));
  const link = await getLatestRoomUrl();
  downloadAudio(link);
};

module.exports = downloadLatest;
