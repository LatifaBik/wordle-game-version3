import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const uri = process.env.MONGODB_URI;

console.log("MONGODB_URI from env:", process.env.MONGODB_URI);

if (!uri) {
  throw new Error("MONGODB_URI is missing in .env");
}

const client = new MongoClient(uri);

let db;

export async function connectDB() {
  await client.connect();
  db = client.db("wordle_highscores");
  console.log("Connected to MongoDB");
}

export function getDB() {
  if (!db) {
    throw new Error("Database not connected");
  }
  return db;
}

