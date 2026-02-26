// modules/commands/animegirl2.js
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "mywaifu2",
    version: "1.2.0",
    hasPermssion: 0,
    credits: "Hridoy",
    description: "Random anime pic from waifu.pics (waifu/neko/etc) - random if no type given",
    commandCategory: "NSFW",
    usages: "animegirl2 [category] (no arg = random category)",
    cooldowns: 5
};

module.exports.onStart = async function({ api, event, args }) {
    const categories = [
        "waifu","neko","shinobu","megumin","bully","cuddle","cry","hug","awoo","kiss",
        "lick","pat","smug","bonk","yeet","blush","smile","wave","highfive","handhold",
        "nom","bite","glomp","slap","kill","kick","happy","wink","poke","dance","cringe"
    ];

    let category = args[0] ? args[0].toLowerCase() : null;
    if (!category || !categories.includes(category)) {
        category = categories[Math.floor(Math.random() * categories.length)];
    }

    const messageBody = `Random ${category} pic! 😈🔥`;

    try {
        // Fetch SFW image (change "sfw" to "nsfw" if needed)
        const res = await axios.get(`https://api.waifu.pics/sfw/${category}`);
        const imgUrl = res.data.url;

        if (!imgUrl) throw new Error("No image URL received");

        // Save image in cache
        const cacheDir = path.join(__dirname, "cache");
        await fs.ensureDir(cacheDir);
        const imgPath = path.join(cacheDir, `anime_${category}_${Date.now()}.jpg`);
        const writer = fs.createWriteStream(imgPath);
        const imgRes = await axios.get(imgUrl, { responseType: "stream" });
        imgRes.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });

        // Send image
        api.sendMessage({
            body: messageBody,
            attachment: fs.createReadStream(imgPath)
        }, event.threadID, () => fs.unlinkSync(imgPath));

    } catch (err) {
        console.error(err);
        api.sendMessage(`Error: ${err.message || "API থেকে সমস্যা"}। আবার চেষ্টা করো! 😅`, event.threadID);
    }
};
