import express from "express";
import pickSecretWord from "../pickSecretWord.js";
import guessedWord from "../guessedWord.js";


const router = express.Router();

let currentWord = "";

router.get("/new-game", (req, res) => {
  const length = Number(req.query.length) || 5;
  const allowDuplicates = req.query.allowDuplicates === "true";

  currentWord = pickSecretWord(length, allowDuplicates);

  


  res.json({
    message: "Game started",
    length,
    allowDuplicates,
  });
});

router.post("/guess", (req, res) => {
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

export default router;
