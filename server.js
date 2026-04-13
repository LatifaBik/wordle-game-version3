import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import pickSecretWord from "./backend/pickSecretWord.js";
import guessedWord from "./backend/guessedWord.js";
import highscoreRoutes from "./backend/Routes/highscoreRoutes.js";
import Highscore from "./backend/models/Highscore.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", highscoreRoutes);

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

app.get("/highscores", async (req, res) => {
  const scores = await Highscore.find().sort({ time_ms: 1 });

  const html = `
    <html>
      <head>
        <title>Highscores</title>
      </head>
      <body>
        <h1>Highscores</h1>
        <ul>
          ${scores
            .map(
              (s) =>
                `<li>${s.name} - ${s.time_ms} ms - ${s.word_length} bokstäver - ${new Date(s.created_at).toLocaleString()}</li>`
            )
            .join("")}
        </ul>
        <a href="/">Tillbaka</a>
      </body>
    </html>
  `;

  res.send(html);
});

app.get("/about", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Om projektet</title>
      </head>
      <body>
        <h1>Om projektet</h1>
        <p>Detta är ett Wordle-spel byggt med React, Node.js och MongoDB.</p>
        <p>Du kan spela spelet, gissa ord och spara highscores.</p>
        <a href="http://localhost:5173">Till spelet</a><br/>
        <a href="http://localhost:5080/highscores">Se highscores</a>
      </body>
    </html>
  `);
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB with Mongoose");

    app.listen(process.env.PORT || 5080, () => {
      console.log("Server running on port 5080");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

startServer();