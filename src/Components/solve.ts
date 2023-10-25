import fs from 'fs'; // Import the file system module for reading wordlist.txt
import axios from 'axios'; // Use axios for web scraping



export function solvePuzzle(letters: string[], autofill: boolean) {
    if (autofill) {
        // For now, we'll just initialize empty results for demonstration
        const sides = splitIntoGroups(letters, 3);
        const nytSolution = axios.get('/puzzles/letter-boxed').then((response: any) => {
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

        return {
            'Letters': sides,
            'NYT Solution': nytSolution,
            'Solution List': solveWithWordlist(sides),
        };
    } else {
        // Split the given letters into groups of 3
        const letterGroups = splitIntoGroups(letters, 3);
        // Access the wordlist.txt to solve two-word solutions
        const solutionList = solveWithWordlist(letterGroups);

        return {
            'Letters': letterGroups,
            'NYT Solution': [],
            'Solution List': solutionList,
        };
    }
}

function splitIntoGroups(letters: string[], groupSize: number) {
    const letterGroups = [];
    for (let i = 0; i < letters.length; i += groupSize) {
        letterGroups.push(letters.slice(i, i + groupSize).join(''));
    }
    return letterGroups;
}

function solveWithWordlist(letterGroups: string[]) {
    // Access wordlist.txt to solve two-word solutions using letterGroups
    const wordlist = fs.readFileSync('wordlist.txt', 'utf-8').split('\n');
    // For now, we'll return an empty list for demonstration
    return [];
}