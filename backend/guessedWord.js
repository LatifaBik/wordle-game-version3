export default function guessedWord(guessed, secret) {
  if (guessed === '') {
    return [];
  }

  if (guessed.length !== secret.length) {
    return [];
  }

  const output = new Array(guessed.length);
   //Spitrar hemliga ordet till bokstäver
  const secretLetters = secret.split('');
   //En array som håller koll på vilka bokstäver i det hemliga ordet som redan har blivit använda.
  const used = new Array(secret.length).fill(false);

  // Första varvet: markera correct
  for (let i = 0; i < guessed.length; i++) {
    if (guessed[i] === secret[i]) {
      output[i] = {
        letter: guessed[i],
        result: 'correct'
      };
      used[i] = true;
    }
  }

  // Andra varvet markera misplaced eller incorrect
  for (let i = 0; i < guessed.length; i++) {
    if (output[i]) continue;

    let found = false;

    //Inre loop leta efter bokstaven i hemliga ordet
    for (let j = 0; j < secretLetters.length; j++) {
      if (!used[j] && guessed[i] === secretLetters[j]) {
        found = true;
        used[j] = true;
    //Så fort den hittat en match, slutar den leta vidare (hanterar dubbletter)
        break;
      }
    }

    output[i] = {
      letter: guessed[i],
      result: found ? 'misplaced' : 'incorrect'
    };
  }

  return output;
}








