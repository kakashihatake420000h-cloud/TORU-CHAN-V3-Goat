const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../data/bot.json");

function loadDB() {
  try {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify({ users: {} }, null, 2));
    }

    const raw = fs.readFileSync(dbPath, "utf8");

    if (!raw || raw.trim() === "") {
      fs.writeFileSync(dbPath, JSON.stringify({ users: {} }, null, 2));
      return { users: {} };
    }

    return JSON.parse(raw);
  } catch (err) {
    console.log("⚠️ bot.json corrupted, resetting...");
    fs.writeFileSync(dbPath, JSON.stringify({ users: {} }, null, 2));
    return { users: {} };
  }
}

function saveDB(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

module.exports = {
  get(uid) {
    const db = loadDB();
    if (!db.users[uid]) {
      db.users[uid] = { money: 1000 };
      saveDB(db);
    }
    return db.users[uid].money;
  },

  add(uid, amount) {
    const db = loadDB();
    if (!db.users[uid]) db.users[uid] = { money: 1000 };
    db.users[uid].money += amount;
    saveDB(db);
    return db.users[uid].money;
  },

  subtract(uid, amount) {
    const db = loadDB();
    if (!db.users[uid]) db.users[uid] = { money: 1000 };
    db.users[uid].money -= amount;
    if (db.users[uid].money < 0) db.users[uid].money = 0;
    saveDB(db);
    return db.users[uid].money;
  },

  set(uid, amount) {
    const db = loadDB();
    db.users[uid] = { money: amount };
    saveDB(db);
    return amount;
  }
};
