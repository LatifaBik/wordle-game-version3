import express from "express";
import cors from "cors";
import pickSecretWord from "./backend/pickSecretWord.js";
import guessedWord from "./backend/guessedWord.js";

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

app.listen(5080, () => {
  console.log("Server running on port 5080");
});