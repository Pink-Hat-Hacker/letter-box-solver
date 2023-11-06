import axios from "axios"; // Use axios for web scraping
import { wordlist } from "./wordlist";
// import { Solver } from "./TrieNode";
// import { useState, useEffect } from "react";


export async function SolvePuzzle(letters: string[], autofill: boolean) {
  // if user autofilled, look for the nyt solution
  const sides = splitIntoGroups(letters, 3);
  if (autofill) {
    const nytSolution = await fetchNYTSolution();
    const solutionList = solveWithWordlist(sides);
    
    console.log(
      "Letters: %s \n NYT Solution: %s \n Solution List: %s",
      sides,
      nytSolution,
      solutionList
    );

    return {
      Letters: sides,
      "NYT Solution": nytSolution,
      "Solution List": solveWithWordlist(sides),
    };
  } else {
    // NOT autofill nyt solution
    const solutionList: string[][] = solveWithWordlist(sides);
    
    return {
      Letters: sides,
      "NYT Solution": [],
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
    const allLetters = new Set([...letterGroups[0], ...letterGroups[1], ...letterGroups[2], ...letterGroups[3]]);
    const acceptableWords: string[] = wordlist.filter((w: string): boolean => isValidWord(w, letterGroups));

    let longestWord = '';
    let mostDistinctWord = '';
    let maxDistinctLetters = 0;
    let bestPair: [string, string] = ['', ''];
    let maxDistinctLettersInPair = 0;
    let bestTriple: [string, string, string] = ['', '', ''];
    let maxDistinctLettersInTriple = 0;

    for (const word of acceptableWords) {
        if (word.length > longestWord.length) {
            longestWord = word;
        }
    
        const distinctLetters = countDistinctLetters(word);
        if (distinctLetters > maxDistinctLetters) {
            maxDistinctLetters = distinctLetters;
            mostDistinctWord = word;
        }
    
        // Find pairs of words
        const lastLetter = word[word.length - 1];
        const matchingWords = acceptableWords.filter((w) => w[0] === lastLetter);
        for (const match of matchingWords) {
            const distinctLettersInPair = countDistinctLettersInPairs(word, match);
            if (distinctLettersInPair > maxDistinctLettersInPair) {
                maxDistinctLettersInPair = distinctLettersInPair;
                bestPair = [word, match];
            }
        }
    }
    
    if (maxDistinctLettersInPair < allLetters.size) {
        for (const [word1, word2] of [bestPair]) {
            const lastLetter = word2[word2.length - 1];
            const matchingWords = acceptableWords.filter((w) => w[0] === lastLetter);
            for (const match of matchingWords) {
                const distinctLettersInTriple = countDistinctLettersInPairs(word1, word2, match);
                if (distinctLettersInTriple > maxDistinctLettersInTriple) {
                    maxDistinctLettersInTriple = distinctLettersInTriple;
                    bestTriple = [word1, word2, match];
                }
            }
        }
    }
    
    console.log(`Number of acceptable words: ${acceptableWords.length}`);
    console.log(`Longest acceptable word: ${longestWord}`);
    console.log(`Word with most distinct letters: ${mostDistinctWord}`);
    
    if (maxDistinctLettersInPair === allLetters.size) {
        console.log(`Word pair covers all distinct letters: (${bestPair[0]}, ${bestPair[1]})`);
    } else {
        console.log(`Word triple with most distinct letters: (${bestTriple[0]}, ${bestTriple[1]}, ${bestTriple[2]})`);
    }

    return[[],[]];
}