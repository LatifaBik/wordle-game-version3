/*import { useState } from "react";*/
import { useEffect, useState } from "react";


export default function App() {
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
  const response = await fetch("http://localhost:5080/api/highscores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      time: 10000,
      guesses: history,
      wordLength,
      allowDuplicates,
    }),
  });

  const data = await response.json();

  alert(data.message || "Score sparad!");

  await loadHighscores();
}


  function getColor(result) {
    if (result === "correct") return "green";
    if (result === "misplaced") return "gold";
    return "tomato";
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Wordle</h1>


    <a href="http://localhost:5080/highscores">
      Gå till highscores
    </a>
    
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Ordlängd:{" "}
          <input
            type="number"
            min="1"
            value={wordLength}
            onChange={(e) => setWordLength(Number(e.target.value))}
          />
        </label>

        <label style={{ marginLeft: "1rem" }}>
          <input
            type="checkbox"
            checked={allowDuplicates}
            onChange={(e) => setAllowDuplicates(e.target.checked)}
          />
          Tillåt dubbla bokstäver
        </label>

        <button onClick={startGame} style={{ marginLeft: "1rem" }}>
          Starta spel
        </button>
      </div>

      <p>{message}</p>

      {gameStarted && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Skriv din gissning"
          />
          <button type="submit">Gissa</button>
        </form>
      )}

      {message === "Du gissade rätt!" && (
        <div style={{ marginTop: "1rem" }}>
          <input
            type="text"
            placeholder="Ditt namn"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={saveScore} style={{ marginLeft: "0.5rem" }}>
            Spara score
          </button>
        </div>
      )}

      <h2>Senaste gissning</h2>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
        {feedback.map((item, index) => (
          <div
            key={index}
            style={{
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: getColor(item.result),
              color: "white",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            {item.letter}
          </div>
        ))}
      </div>

      <h2>Tidigare gissningar</h2>
      {history.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}
        >
          {row.map((item, colIndex) => (
            <div
              key={colIndex}
              style={{
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: getColor(item.result),
                color: "white",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              {item.letter}
            </div>
          ))}
        </div>

      ))}

      <h2>Highscores</h2>
<ul>
  {highscores.map((score) => (
    <li key={score.id}>
      {score.name} - {score.time_ms} ms - {score.word_length} bokstäver
    </li>
  ))}
</ul>

    </div>

  );
}