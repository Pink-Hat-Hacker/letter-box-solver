// export function solvePuzzle(letters: string[], getNYTSol: boolean) {
//     let solution = [];
//     if (getNYTSol) {
//         solution = () => {
//             axios.get('/puzzles/letter-boxed').then((response: any) => {
//                 const htmlContent = response.data;
//                 // Define a regular expression to match the JSON containing "sides"
//                 const regex = /window\.gameData\s*=\s*({[^}]*})/;
//                 // Find and extract the JSON object containing "sides"
//                 const match = htmlContent.match(regex);
//                 if (match && match[1]) {
//                   const jsonData = JSON.parse(match[1]);
//                   const sol = jsonData.ourSolution;
//                   return sol;
//                 } else {
//                   console.log('No match found for gameData in the HTML content.');
//                 }
//             })
//               .catch((error: any) => {
//                 console.error('Error fetching letters:', error);
//             });
//         }
//     } else {

//     }
// }

import fs from 'fs'; // Import the file system module for reading wordlist.txt
import axios from 'axios'; // Use axios for web scraping

// Function to scrape the NYT website and access wordlist.txt for solutions
const solvePuzzle = async (letters: string[], autofill: boolean): Promise<JSON> => {
  let sides: string[] = [];
  let nytSolution: string[] = [];
  if (autofill) {
    nytSolution = axios.get('/puzzles/letter-boxed').then((response: any) => {
        const htmlContent = response.data;
        // Define a regular expression to match the JSON containing "sides"
        const regex = /window\.gameData\s*=\s*({[^}]*})/;
        // Find and extract the JSON object containing "sides"
        const match = htmlContent.match(regex);
        if (match && match[1]) {
            const jsonData = JSON.parse(match[1]);
            const sol = jsonData.ourSolution;
            return sol;
        } else {
            console.log('No match found for gameData in the HTML content.');
        }
    })
    .catch((error: any) => {
        console.error('Error fetching nyt solution:', error);
    });
  } else if (letters) {
    // Convert the letters into groups of 3
    sides = convertLettersToGroups(letters);
  }

  // Access wordlist.txt to find solutions
  const wordlist = loadWordlist();
  const listOfSolutions = findSolutions(wordlist, sides);
  console.log('Solutions:', listOfSolutions);

  return {"Letters": sides, "NYT Solution": nytSolution, "Solutions List": listOfSolutions};
};

// Function to convert letters to groups of 3
const convertLettersToGroups = (letters: string[]): string[] => {
  const groups = [];
  for (let i = 0; i < letters.length; i += 3) {
    groups.push(letters.slice(i, i + 3).join(''));
  }
  return groups;
};

// Function to load wordlist from wordlist.txt
const loadWordlist = (): string[] => {
  // Read the wordlist.txt file and split it into an array of words
  const wordlist = fs.readFileSync('wordlist.txt', 'utf-8').split('\n');
  return wordlist;
};

// Function to find solutions in the wordlist
const findSolutions = (wordlist: string[], sides: string[]): string[] => {
  // Implement your logic to find solutions using the wordlist and sides
  // Return an array of found solutions
  return [];
};

export { solvePuzzle };
