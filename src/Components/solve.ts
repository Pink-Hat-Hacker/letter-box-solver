import axios from 'axios'; // Use axios for web scraping
import { wordlist } from './wordlist';

export function solvePuzzle(letters: string[], autofill: boolean) {
    if (autofill) {
        const sides = splitIntoGroups(letters, 3);
        const nytSolution = axios.get('/puzzles/letter-boxed').then((response: any) => {
            const htmlContent = response.data;
            const regex = /window\.gameData\s*=\s*({[^}]*})/;
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
        // NOT autofill nyt solution
        const letterGroups = splitIntoGroups(letters, 3);
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
    console.log(wordlist);
    return [];
}