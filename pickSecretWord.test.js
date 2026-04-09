import { describe, expect, it } from '@jest/globals';
import pickSecretWord from './pickSecretWord.js';

// Algoritm B – val av ord
/*
1. Ta emot en lista med ord.
2. Ta emot önskad ordlängd.
3. Ta emot information om bokstäver får upprepas eller inte.
4. Filtrera ordlistan så att bara ord som uppfyller kraven återstår.
4.1. Ordet måste ha rätt längd.
4.2. Om unika bokstäver krävs får samma bokstav inte förekomma mer än en gång.
5. Om inga ord matchar kriterierna: returnera null.
6. Om ett eller flera ord matchar kriterierna:
6.1. Välj ett slumpmässigt ord bland de giltiga orden.
6.2. Returnera det ordet.
*/

// Teststrategi för algoritm B
/*
Dessa tester är valda för att täcka funktionens viktigaste regler:

1. Tom eller omöjlig träff
- Funktionen ska hantera fallet där inga ord matchar kriterierna.

2. Rätt längd
- Funktionen ska bara kunna välja ord med den längd som efterfrågas.

3. Tillåtna dubbla bokstäver
- När dubbla bokstäver är tillåtna ska ord med upprepade bokstäver kunna väljas.

4. Endast unika bokstäver
- När unika bokstäver krävs ska ord med dubbla bokstäver filtreras bort.

5. Slumpmässigt val inom giltiga alternativ
- Returnerat ord ska alltid vara ett av de ord som uppfyller reglerna.
*/

describe('pickSecretWord', () => {
  it('returns null if no word matches the required length', () => {
    const words = ['cat', 'dog', 'sun'];
    const output = pickSecretWord(words, 5, true);

    expect(output).toBeNull();
  });

  it('returns only a word with the requested length', () => {
    const words = ['cat', 'apple', 'plane'];
    const output = pickSecretWord(words, 5, true);

    expect(['apple', 'plane']).toContain(output);
  });

  it('allows words with repeated letters when duplicates are allowed', () => {
    const words = ['apple', 'grape'];
    const output = pickSecretWord(words, 5, true);

    expect(['apple', 'grape']).toContain(output);
  });

  it('filters out words with repeated letters when duplicates are not allowed', () => {
    const words = ['apple', 'grape', 'brick'];
    const output = pickSecretWord(words, 5, false);

    expect(['grape', 'brick']).toContain(output);
  });

  it('returns null when no word has unique letters and duplicates are not allowed', () => {
    const words = ['apple', 'level', 'alloy'];
    const output = pickSecretWord(words, 5, false);

    expect(output).toBeNull();
  });
});