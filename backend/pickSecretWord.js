

function wordHasDuplicates(word) {
  return new Set(word).size !== word.length;
}

export default function pickSecretWord(words, length = 5, allowDuplicates = false) {
  let filteredWords = words.filter((word) => word.length === length);

  if (!allowDuplicates) {
    filteredWords = filteredWords.filter((word) => !wordHasDuplicates(word));
  }

  if (filteredWords.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * filteredWords.length);
  return filteredWords[randomIndex];
}