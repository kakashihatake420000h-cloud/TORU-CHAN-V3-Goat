const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "dogpic",
    version: "1.1.0",
    author: "Hridoy",
    role: 0,
    shortDescription: "Random dog image 🐶",
    category: "Image",
    guide: "{pn}",
    cooldown: 5
  },

  onStart: async function ({ api, event }) {
    try {
      const res = await axios.get("https://dog.ceo/api/breeds/image/random");
      if (!res.data || res.data.status !== "success" || !res.data.message) 
        return api.sendMessage("🐕 Dog pic load hoilo na... abar try koro!", event.threadID, event.messageID);

      const imgUrl = res.data.message;
      const cachePath = path.join(__dirname, "cache", `dog_${Date.now()}.jpg`);
      await fs.ensureDir(path.dirname(cachePath));

      // Download dog image
      const response = await axios({ url: imgUrl, method: "GET", responseType: "stream" });
      const writer = fs.createWriteStream(cachePath);
      response.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage({
          body: "🐶 Random Dog Pic!",
          attachment: fs.createReadStream(cachePath)
        }, event.threadID, () => fs.unlinkSync(cachePath), event.messageID);
      });

      writer.on("error", () => api.sendMessage("❌ Dog pic download failed", event.threadID, event.messageID));

    } catch (err) {
      console.error(err);
      api.sendMessage("⚠️ Dog pic fetch korte pari nai... abar try koro 😅", event.threadID, event.messageID);
    }
  }
};
