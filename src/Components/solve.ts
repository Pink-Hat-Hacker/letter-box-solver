import axios from "axios"; // Use axios for web scraping
import { wordlist } from "./wordlist";

export async function solvePuzzle(letters: string[], autofill: boolean) {
    // if user autofilled, look for the nyt solution
    const sides = splitIntoGroups(letters, 3);

    if (autofill) {
        const nytSolution = await fetchNYTSolution();
        const solutionList = solveWithWordlist(sides);

        return {
            "Letters": sides,
            "NYT Solution": nytSolution,
            "Solution List": solutionList,
        };
    } else {
        // NOT autofill nyt solution
        const solutionList: string[][] = solveWithWordlist(sides);
        return {
            "Letters": sides,
            "NYT Solution": Promise<{}>,
            "Solution List": solutionList,
        };
    }
}

async function fetchNYTSolution() {
    try {
        const response = await axios.get("/puzzles/letter-boxed");
        const htmlContent = response.data;
        const regex = /window\.gameData\s*=\s*({[^}]*})/;
        const match = htmlContent.match(regex);

        if (match && match[1]) {
            const jsonData = JSON.parse(match[1]);
            return jsonData.ourSolution;
        } else {
            console.log("No match found for gameData in the HTML content.");
            return null; // Handle the case where the data is not found
        }
    } catch (error) {
        console.error("Error fetching nyt solution:", error);
        return null; // Handle the error
    }
}

function splitIntoGroups(letters: string[], groupSize: number): string[][] {
    const result: string[][] = [];
    for (let i = 0; i < letters.length; i += groupSize) {
        result.push(letters.slice(i, i + groupSize));
    }
    return result;
}

function isValidWord(word: string, letterGroups: string[][]): boolean {
    const A: Set<string> = new Set(letterGroups[0]);
    const B: Set<string> = new Set(letterGroups[1]);
    const C: Set<string> = new Set(letterGroups[2]);
    const D: Set<string> = new Set(letterGroups[3]);
    const allLetters = new Set([...A, ...B, ...C, ...D]);

    if (!word) return false;

    let prevSet: Set<string> | null = null;
    for (const letter of word) {
        if (!allLetters.has(letter)) {
            return false;
        }

        let currentSet: Set<string> | null = null;
        if (A.has(letter)) currentSet = A;
        else if (B.has(letter)) currentSet = B;
        else if (C.has(letter)) currentSet = C;
        else if (D.has(letter)) currentSet = D;

        if (prevSet === currentSet) {
            return false;
        }

        prevSet = currentSet;
    }

    return true;
}

function countDistinctLetters(word: string): number {
    const usedLetters = new Set<string>();
    for (const letter of word) {
        usedLetters.add(letter);
    }
    return usedLetters.size;
}

function countDistinctLettersInPairs(...words: string[]): number {
    const combinedWord = words.join('');
    return countDistinctLetters(combinedWord);
}

function solveWithWordlist(letterGroups: string[][]) {
    const acceptableWords: string[] = wordlist.filter((w: string): boolean => isValidWord(w, letterGroups));

    let result: string[][] = [];

    for (const word of acceptableWords) {
        // Find pairs of words
        const lastLetter = word[word.length - 1];
        const matchingWords = acceptableWords.filter((w) => w[0] === lastLetter);
        for (const match of matchingWords) {
            const distinctLettersInPair = countDistinctLettersInPairs(word, match);
            if (distinctLettersInPair === 12) {
                result.push([word, match]);
            }
        }
    }

    console.log(`Number of acceptable words: ${acceptableWords.length}`);
    console.log(result);

    return result;
}