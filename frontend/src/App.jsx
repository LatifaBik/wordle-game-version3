import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [startTime, setStartTime] = useState(null);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [wordLength, setWordLength] = useState(5);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [name, setName] = useState("");
  const [highscores, setHighscores] = useState([]);

  async function startGame() {
    const response = await fetch(
      `http://localhost:5080/api/new-game?length=${wordLength}&allowDuplicates=${allowDuplicates}`
    );
    const data = await response.json();

    setGameStarted(true);
    setFeedback([]);
    setHistory([]);
    setGuess("");
    setName("");
    setMessage(data.message);
    setStartTime(Date.now());
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await fetch("http://localhost:5080/api/guess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ guess }),
    });

    const data = await response.json();

    if (data.error) {
      setMessage(data.error);
      return;
    }

    setFeedback(data.result);
    setHistory((prev) => [...prev, data.result]);
    setGuess("");

    if (data.isCorrect) {
      setMessage("Du gissade rätt!");
    } else {
      setMessage("Försök igen");
    }
  }

  async function loadHighscores() {
    const response = await fetch("http://localhost:5080/api/highscores");
    const data = await response.json();
    setHighscores(data);
  }

  useEffect(() => {
    loadHighscores();
  }, []);

  async function saveScore() {
    const elapsedTime = startTime ? Date.now() - startTime : 0;

    const response = await fetch("http://localhost:5080/api/highscores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        time: elapsedTime,
        guesses: history,
        wordLength,
        allowDuplicates,
      }),
    });

    const data = await response.json();

    alert(data.message || "Score sparad!");

    await loadHighscores();
    setStartTime(null);
  }

  function getColor(result) {
    if (result === "correct") return "green";
    if (result === "misplaced") return "gold";
    return "tomato";
  }

  return (
    <div className="app-container">
      <h1>Wordle Game</h1>

      <div className="nav-links">
        <a href="http://localhost:5080/highscores">Highscores</a>
        <a href="http://localhost:5080/about">About projekt</a>
      </div>

      <div className="game-settings">
        <label>
          Ordlängd:{" "}
          <input
            className="word-length-input"
            type="number"
            min="1"
            value={wordLength}
            onChange={(e) => setWordLength(Number(e.target.value))}
          />
        </label>

        <label className="duplicate-label">
          <input
            type="checkbox"
            checked={allowDuplicates}
            onChange={(e) => setAllowDuplicates(e.target.checked)}
          />
          Tillåt dubbla bokstäver
        </label>

        <button onClick={startGame} className="start-spel-button">
          Starta spel
        </button>
      </div>

      <p>{message}</p>

      {gameStarted && (
        <form onSubmit={handleSubmit}>
          <input
            className="guess-input"
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Skriv din gissning"
          />
          <button className="guess-button" type="submit">
            Gissa
          </button>
        </form>
      )}

      {message === "Du gissade rätt!" && (
        <div className="save-score-container">
          <input
            className="name-input"
            type="text"
            placeholder="Ditt namn"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button onClick={saveScore} className="save-score-button">
            Spara score
          </button>
        </div>
      )}

      <h2>Senaste gissning</h2>

      <div className="feedback-container">
        {feedback.map((item, index) => (
          <div
            key={index}
            className="feedback-box"
            style={{ backgroundColor: getColor(item.result) }}
          >
            {item.letter}
          </div>
        ))}
      </div>

      <h2>Tidigare gissningar</h2>
      {history.map((row, rowIndex) => (
        <div key={rowIndex} className="history-row">
          {row.map((item, colIndex) => (
            <div
              key={colIndex}
              className="history-box"
              style={{ backgroundColor: getColor(item.result) }}
            >
              {item.letter}
            </div>
          ))}
        </div>
      ))}

      <h2>Highscores</h2>
      <ul className="highscore-list">
        {highscores.map((score) => (
          <li key={score.id}>
            {score.name} - {score.time_ms} ms - {score.word_length} bokstäver
          </li>
        ))}
      </ul>
    </div>
  );
}