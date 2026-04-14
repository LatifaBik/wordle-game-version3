import express from "express";
import Highscore from "../models/Highscore.js";

const router = express.Router();

router.get("/highscores", async (req, res) => {
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

router.get("/about", (req, res) => {
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

export default router;
