import axios from 'axios'; // Use axios for web scraping
import { wordlist } from './wordlist';

export async function SolvePuzzle(letters: string[], autofill: boolean) {
    // if user autofilled, look for the nyt solution
    if (autofill) {
        const sides = splitIntoGroups(letters, 3);
        const nytSolution = await fetchNYTSolution();
        // return a json with the sides, nytSolution found and the list of solves
        return {
            'Letters': sides,
            'NYT Solution': nytSolution,
            'Solution List': solveWithWordlist(sides),
        };
    } else {
        // NOT autofill nyt solution
        const letterGroups = splitIntoGroups(letters, 3);
        const solutionList: string[] = solveWithWordlist(letterGroups);
        return {
            'Letters': letterGroups,
            'NYT Solution': [],
            'Solution List': solutionList,
        };
    }
}

async function fetchNYTSolution() {
    try {
      const response = await axios.get('/puzzles/letter-boxed');
      const htmlContent = response.data;
      const regex = /window\.gameData\s*=\s*({[^}]*})/;
      const match = htmlContent.match(regex);
  
      if (match && match[1]) {
        const jsonData = JSON.parse(match[1]);
        return jsonData.ourSolution;
      } else {
        console.log('No match found for gameData in the HTML content.');
        return null; // Handle the case where the data is not found
      }
    } catch (error) {
      console.error('Error fetching nyt solution:', error);
      return null; // Handle the error
    }
}

function splitIntoGroups(letters: string[], groupSize: number): string[] {
    const letterGroups = [];
    for (let i = 0; i < letters.length; i += groupSize) {
        letterGroups.push(letters.slice(i, i + groupSize).join(''));
    }
    return letterGroups;
}

function solveWithWordlist(letterGroups: string[]): string[] {
    const results: string[] = [];
  
    // Recursive function to explore all combinations
    function findCombinations(currentWord: string, usedLetters: string[]) {
      if (currentWord.length >= 3) {
        // Check if it's a valid word
        if (wordlist.includes(currentWord)) {
          usedLetters = usedLetters.concat(currentWord.split(''));
          currentWord = '';
        }
      }
  
      // Check if all letters are used
      if (usedLetters.length === letterGroups.join('').length) {
        results.push(currentWord);
        return;
      }
  
      // Iterate through sides
      for (let i = 0; i < letterGroups.length; i++) {
        const side = letterGroups[i];
  
        // Check if the next letter is from a different side
        if (!usedLetters.includes(side[0])) {
          const nextWord = currentWord + side;
          const nextUsedLetters = usedLetters.concat(side.split(''));
  
          findCombinations(nextWord, nextUsedLetters);
        }
      }
    }
    // Start with an empty word and no used letters
    findCombinations('', []);
    console.log(results);
    return results;
}
  