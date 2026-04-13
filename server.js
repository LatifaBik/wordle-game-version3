import "dotenv/config";
import express from "express";
import cors from "cors";
import pickSecretWord from "./backend/pickSecretWord.js";
import guessedWord from "./backend/guessedWord.js";
import { connectDB, getDB } from "./backend/db.js";


const app = express();

app.use(cors());
app.use(express.json());


let currentWord = "";

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/api/new-game", (req, res) => {
  const length = Number(req.query.length) || 5;
  const allowDuplicates = req.query.allowDuplicates === "true";

  currentWord = pickSecretWord(length, allowDuplicates);

  res.json({
    message: "Game started",
    length,
    allowDuplicates,
  });
});

app.post("/api/guess", (req, res) => {
  const { guess } = req.body;

  if (!currentWord) {
    return res.status(400).json({ error: "No active game" });
  }

  if (guess.length !== currentWord.length) {
    return res.status(400).json({
      error: `Guess must be ${currentWord.length} letters long`,
    });
  }

  const result = guessedWord(guess, currentWord);
  const isCorrect = guess === currentWord;

  res.json({ result, isCorrect });
});



app.post("/api/highscores", async (req, res) => {
  try {
    const { name, time, guesses, wordLength, allowDuplicates } = req.body;

    if (!name || !time || !guesses || !wordLength) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const db = getDB();

    await db.collection("highscores").insertOne({
      name,
      time_ms: time,
      guesses,
      word_length: wordLength,
      allow_duplicates: allowDuplicates,
      created_at: new Date(),
    });

    res.json({ message: "Highscore saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save highscore" });
  }
});



app.get("/api/highscores", async (req, res) => {
  try {
    const db = getDB();

    const rows = await db
      .collection("highscores")
      .find({})
      .sort({ time_ms: 1 })
      .toArray();

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch highscores" });
  }
});

async function startServer() {
  try {
    await connectDB();
    app.listen(process.env.PORT || 5080, () => {
      console.log("Server running on port 5080");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

startServer();


