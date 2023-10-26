import axios from 'axios'; // Use axios for web scraping
import { wordlist } from './wordlist';

export async function SolvePuzzle(letters: string[], autofill: boolean) {
    // if user autofilled, look for the nyt solution
    if (autofill) {
        const sides = splitIntoGroups(letters, 3);
        const nytSolution = await fetchNYTSolution();
        // return a json with the sides, nytSolution found and the list of solves
        const solutionList = solveWithWordlist(sides)
        console.log("Letters: %s \n NYT Solution: %s \n Solution List: %s", sides, nytSolution, solutionList);
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
    const result: string[] = [];

    function isValidWord(word: string) {
      return wordlist.includes(word);
    }
  
    function findSolutions(remainingGroups: string[], currentSolution: string) {
      if (remainingGroups.length === 0) {
        result.push(currentSolution.slice()); // Clone the current solution
        return;
      }
  
      const lastLetter = currentSolution[currentSolution.length - 1];
      for (let i = 0; i < remainingGroups.length; i++) {
        const group = remainingGroups[i];
        const groupLetters = group.split('');
  
        if (lastLetter !== groupLetters[0]) {
          const newSolution = currentSolution.concat(group);
          const newRemainingGroups = remainingGroups.slice(0, i).concat(remainingGroups.slice(i + 1));
  
          findSolutions(newRemainingGroups, newSolution);
        }
      }
    }
  
    findSolutions(letterGroups, "");
  
    const validSolutions = result.filter((solution) => {
      // Combine the solution into one string
        const combined = solution;
  
      // Check if it contains only valid words and is at least 3 letters long
      return combined.length >= 3 && isValidWord(combined);
    });

    console.log(validSolutions);
    return validSolutions;
}
  