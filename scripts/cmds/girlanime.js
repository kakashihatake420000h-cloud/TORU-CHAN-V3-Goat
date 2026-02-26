const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "girlanime",
    version: "1.0.0",
    author: "Hridoy",
    countDown: 5,
    role: 0,
    shortDescription: "Random Anime Pic",
    longDescription: "Send random anime picture from list",
    category: "Image",
    guide: "{pn}"
  },

  onStart: async function ({ message }) {
    try {

      const imageLinks = [
        "https://i.imgur.com/qHuv5H8.jpg",
        "https://i.imgur.com/atYmQt0.jpg",
        "https://i.imgur.com/Kuz4Owe.jpg",
        "https://i.imgur.com/L9u9Si8.jpg",
        "https://i.imgur.com/2oGBtMi.jpg",
        "https://i.imgur.com/MWihsUp.jpg",
        "https://i.imgur.com/dPDFYxJ.jpg",
        "https://i.imgur.com/AiuPHQK.jpg",
        "https://i.imgur.com/6jKbMGx.jpg",
        "https://i.imgur.com/H0oXAje.jpg",
        "https://i.imgur.com/kKKwXkX.jpg",
        "https://i.imgur.com/F5CLGkl.jpg",
        "https://i.imgur.com/HKm2LKH.jpg",
        "https://i.imgur.com/egaTOK5.jpg",
        "https://i.imgur.com/vLGyXHX.jpg",
        "https://i.imgur.com/HqJuhTj.jpg",
        "https://i.imgur.com/VE6KEwT.jpg",
        "https://i.imgur.com/JLC36Uu.jpg",
        "https://i.imgur.com/qqt3KI1.jpg",
        "https://i.imgur.com/yImrkax.jpg",
        "https://i.imgur.com/sLzPtky.jpg",
        "https://i.imgur.com/vfCigSS.jpg",
        "https://i.imgur.com/WYVQRp1.jpg",
        "https://i.imgur.com/Y1djOm5.jpg",
        "https://i.imgur.com/e0mPXD9.jpg"
      ];

      const randomLink = imageLinks[Math.floor(Math.random() * imageLinks.length)];

      const filePath = path.join(__dirname, "cache", "randomanime.jpg");
      const writer = fs.createWriteStream(filePath);

      const response = await axios({
        url: randomLink,
        method: "GET",
        responseType: "stream"
      });

      response.data.pipe(writer);

      writer.on("finish", async () => {
        await message.reply({
          body: "🌸 𝗚𝗶𝗿𝗹 𝗔𝗻𝗶𝗺𝗲 𝗣𝗶𝗰 🌸",
          attachment: fs.createReadStream(filePath)
        });
        fs.unlinkSync(filePath);
      });

      writer.on("error", () => {
        message.reply("❌ Image send failed!");
      });

    } catch (error) {
      message.reply("❌ Something went wrong!");
    }
  }
};