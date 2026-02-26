// modules/commands/animegirl.js
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "myaifu",  // command
    version: "1.0.0",
    hasPermssion: 0,  // anyone
    credits: "Hridoy",
    description: "Random NSFW waifu or hentai pic from API",
    commandCategory: "NSFW",
    usages: "aniwaifu",
    cooldowns: 5
};

module.exports.onStart = async function({ api, event, args }) {
    const type = args[0] || "waifu"; // default type

    try {
        // Fetch random image from API
        const res = await axios.get(`https://api.waifu.pics/sfw/${type}`);
        const imgUrl = res.data.url;

        // Download to temp file
        const cacheDir = path.join(__dirname, "cache");
        await fs.ensureDir(cacheDir); // make sure cache exists
        const imgPath = path.join(cacheDir, `${type}.jpg`);
        const writer = fs.createWriteStream(imgPath);
        const imgRes = await axios.get(imgUrl, { responseType: 'stream' });
        imgRes.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Send image
        api.sendMessage(
            { body: `Random ${type} pic! 😏`, attachment: fs.createReadStream(imgPath) },
            event.threadID,
            () => fs.unlinkSync(imgPath) // remove after sending
        );

    } catch (err) {
        api.sendMessage(`Error: ${err.message}. Try again!`, event.threadID);
    }
};
