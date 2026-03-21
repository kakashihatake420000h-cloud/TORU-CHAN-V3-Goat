const axios = require("axios");

module.exports = {
  config: {
    name: "hnekos",
    version: "1.0.0",
    author: "Hridoy",
    role: 0,
    shortDescription: "Random anime image",
    category: "NSFW",
    guide: "{pn}",
    cooldown: 5
  },

  onStart: async function ({ api, event }) {
    try {
      const res = await axios.get("https://api.waifu.pics/nsfw/neko");

      const stream = await global.utils.getStreamFromURL(res.data.url);

      return api.sendMessage({
        body: "Random Nekos Pic✨",
        attachment: stream
      }, event.threadID, event.messageID);

    } catch (e) {
      return api.sendMessage("⚠️ Failed!", event.threadID, event.messageID);
    }
  }
};
