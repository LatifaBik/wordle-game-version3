import express from "express";
import Highscore from "../models/Highscore.js";

const router = express.Router();

router.post("/highscores", async (req, res) => {
  try {
    const { name, time, guesses, wordLength, allowDuplicates } = req.body;

    if (!name || !time || !guesses || !wordLength) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await Highscore.create({
      name,
      time_ms: time,
      guesses,
      word_length: wordLength,
      allow_duplicates: allowDuplicates,
    });

    res.json({ message: "Highscore saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save highscore" });
  }
});

router.get("/highscores", async (req, res) => {
  try {
    const scores = await Highscore.find().sort({ time_ms: 1 });
    res.json(scores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch highscores" });
  }
});

export default router;
