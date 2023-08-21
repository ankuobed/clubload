const puppeteer = require("puppeteer");

const getM3u8Url = async (link) => {
  let url = "";
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const client = await page.target().createCDPSession();
  await client.send("Debugger.enable");
  await client.send("Debugger.setAsyncCallStackDepth", { maxDepth: 32 });

  await client.send("Network.enable");
  client.on("Network.responseReceived", (params) => {
    const { response } = params;
    if (
      response?.url &&
      response?.url?.includes("get_replay_channel_playlist")
    ) {
      url = response.url;
    }
  });

  await page.goto(link, {
    waitUntil: "networkidle2",
  });
  pageTitle = await page.title();
  await browser.close();

  if (url) {
    return { url, pageTitle };
  }

  return null;
};

module.exports = getM3u8Url;
