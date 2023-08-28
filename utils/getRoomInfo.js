const puppeteer = require("puppeteer");

const getRoomInfo = async (link) => {
  return new Promise(async (resolve) => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    const client = await page.target().createCDPSession();
    await client.send("Debugger.enable");
    await client.send("Debugger.setAsyncCallStackDepth", { maxDepth: 32 });

    await client.send("Network.enable");
    client.on("Network.responseReceived", async (params) => {
      const { response } = params;
      if (
        response?.url &&
        response?.url?.includes("get_replay_channel_playlist")
      ) {
        const pageTitle = (await page.title())
          .replace(":", "")
          .replace("/", " ");
        resolve({ url: response.url, pageTitle });
      }
    });

    await page.goto(link, {
      waitUntil: "networkidle2",
      timeout: 0,
    });

    await browser.close();
  });
};

module.exports = getRoomInfo;
