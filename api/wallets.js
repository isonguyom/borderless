// api/wallets.js
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbFile = path.join(__dirname, "db.json");

function readDB() {
  return JSON.parse(readFileSync(dbFile, "utf-8"));
}

function writeDB(data) {
  writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
  const db = readDB();
  const { wallets } = db;

  if (req.method === "GET") {
    res.status(200).json(wallets);
  }

  if (req.method === "POST") {
    const newWallet = { id: Date.now().toString(), ...req.body };
    wallets.push(newWallet);
    writeDB(db);
    res.status(201).json(newWallet);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    db.wallets = wallets.filter(w => w.id !== id);
    writeDB(db);
    res.status(200).json({ success: true });
  }
}
