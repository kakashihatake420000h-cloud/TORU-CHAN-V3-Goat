const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "meme2",
    version: "1.1.0",
    author: "Hridoy",
    role: 0,
    shortDescription: "Random meme 😆",
    category: "Image",
    guide: "{pn}",
    cooldown: 5
  },

  onStart: async function ({ api, event }) {
    try {
      // Meme API
      const res = await axios.get("https://meme-api.com/gimme");
      if (!res.data || !res.data.url) 
        return api.sendMessage("😅 Meme load hoilo na... abar try koro!", event.threadID, event.messageID);

      const memeUrl = res.data.url;
      const title = res.data.title || "Meme";
      const subreddit = res.data.subreddit || "unknown";

      // Cache path
      const cachePath = path.join(__dirname, "cache", `meme_${Date.now()}.jpg`);
      await fs.ensureDir(path.dirname(cachePath));

      // Download meme
      const response = await axios({ url: memeUrl, method: "GET", responseType: "stream" });
      const writer = fs.createWriteStream(cachePath);
      response.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage({
          body: `😂 ${title}\n📌 Subreddit: ${subreddit}`,
          attachment: fs.createReadStream(cachePath)
        }, event.threadID, () => fs.unlinkSync(cachePath), event.messageID);
      });

      writer.on("error", () => api.sendMessage("❌ Meme download failed", event.threadID, event.messageID));

    } catch (err) {
      console.error(err);
      api.sendMessage("⚠️ Meme fetch korte pari nai... abar try koro 😅", event.threadID, event.messageID);
    }
  }
};
