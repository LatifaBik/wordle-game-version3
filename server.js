import express from "express";
import pickSecretWord from "./pickSecretWord.js";
import guessedWord from "./guessedWord.js";

const app = express();

app.use(express.json());

let currentWord = "";

// test-route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// starta spel
app.get("/api/new-game", (req, res) => {
  currentWord = pickSecretWord(5, true);
  res.json({ message: "Game started" });
});

// gissa ord
app.post("/api/guess", (req, res) => {
  const { guess } = req.body;
  const result = guessedWord(guess, currentWord);
  res.json(result);
});

app.listen(5080, () => {
  console.log("Server running on port 5080");
});