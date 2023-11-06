import { useState, useCallback, useRef } from "react";

type TrieNode = {
    children: { [key: string]: TrieNode };
    isEndOfWord: boolean;

};

class Trie {
    root: TrieNode;

    constructor() {
        this.root = this.createNode();
    }

    createNode(): TrieNode {
        return { isEndOfWord: false, children: {} };
    }

    insert(word: string): void {
        let node = this.root;
        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = this.createNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }

    search(word: string): boolean {
        let node = this.root;
        for (const char of word) {
            if (!node.children[char]) {
                return false;
            }
            node = node.children[char];
        }
        return node.isEndOfWord;
    }
}

const findOneWords = (trie: Trie, letters: string[][]): string[][] => {
    const results: string[][] = [];
    const path: string[] = [];

    const flatLetters = letters.flat();
    const groups = flatLetters.map((letter) => {
        return letters.findIndex((group) => group.includes(letter));
    });

    const dfs = (
        node: TrieNode,
        lastGroup: number,
        used: Map<string, number>
    ) => {
        if (node.isEndOfWord) {
            let count = 0;
            for (const pair of used) {
                if (pair[1] >= 1) {
                    count += 1;
                }
            }
            if (count === flatLetters.length) {
                results.push([path.join("")]);
            }
        }

        for (let i = 0; i < flatLetters.length; i++) {
            const letter = flatLetters[i];
            const group = groups[i];

            if (node.children[letter] && lastGroup !== group) {
                const currentCount = used.get(letter) || 0;
                used.set(letter, currentCount + 1);
                path.push(letter);
                dfs(node.children[letter], group, used);
                path.pop();
                used.set(letter, currentCount);
            }
        }
    };

    const used: Map<string, number> = new Map<string, number>();
    dfs(trie.root, -1, used);
    return results;
};

const findTwoWords = (trie: Trie, letters: string[][]): string[][] => {
    const results: string[][] = [];
    const path1: string[] = [];
    let path2: string[] = [];
    const flatLetters = letters.flat();
    const groups = flatLetters.map((letter) => {
        return letters.findIndex((group) => group.includes(letter));
    });

    const dfsTwoWords = (
        node: TrieNode,
        lastGroup: number,
        used2: Map<string, number>,
        firstWord: string
    ) => {
        if (node.isEndOfWord) {
            let count = 0;
            for (const pair of used2) {
                if (pair[1] >= 1) {
                    count += 1;
                }
            }
            if (count === flatLetters.length) {
                results.push([firstWord, path2.join("")]);
            }
        }

        for (let i = 0; i < flatLetters.length; i++) {
            const letter = flatLetters[i];
            const group = groups[i];

            if (node.children[letter] && lastGroup !== group) {
                const currentCount = used2.get(letter) || 0;
                used2.set(letter, currentCount + 1);
                path2.push(letter);
                dfsTwoWords(node.children[letter], group, used2, firstWord);
                path2.pop();
                used2.set(letter, currentCount);
            }
        }
    };

    const dfsOneWord = (
        node: TrieNode,
        lastGroup: number,
        used1: Map<string, number>
    ) => {
        if (node.isEndOfWord) {
            const firstWord = path1.join("");
            const firstLetter = firstWord[firstWord.length - 1];
            if (trie.root.children[firstLetter]) {
                path2 = [firstLetter];
                const used2 = new Map<string, number>([...used1]);
                const currentCount = used2.get(firstLetter) || 0;
                used2.set(firstLetter, currentCount + 1);
                dfsTwoWords(
                    trie.root.children[firstLetter],
                    -1,
                    used2,
                    firstWord
                );
            }
        }

        for (let i = 0; i < flatLetters.length; i++) {
            const letter = flatLetters[i];
            const group = groups[i];

            if (node.children[letter] && lastGroup !== group) {
                const currentCount = used1.get(letter) || 0;
                used1.set(letter, currentCount + 1);
                path1.push(letter);
                dfsOneWord(node.children[letter], group, used1);
                path1.pop();
                used1.set(letter, currentCount);
            }
        }
    };
    const used = new Map<string, number>();
    dfsOneWord(trie.root, -1, used);
    return results;
};


export function Solver(letters: string[][], wordlist: string[]): [string[][], () => void] {
    const [answers, setAnswers] = useState<string[][]>([]);
    const trieRef = useRef<Trie | null>(null);

    const newTrie = new Trie();
    for (const word of wordlist) {
        newTrie.insert(word);
    }
    trieRef.current = newTrie;

    const computeAnswers = useCallback(() => {
        if (trieRef.current) {
            const newAnswers = findOneWords(trieRef.current, letters).concat(
                findTwoWords(trieRef.current, letters)
            );
            setAnswers(newAnswers);
        }
    }, [letters]);
    
    const solve = () => {
        if (trieRef.current) {
            computeAnswers();
        }
    };

    return [answers, solve];
}



// export function findTwoWordSolutions(letterGroups: string[], wordlist: string[]): string[][] {
//     const solutions: string[][] = [];
//     const trie = new Trie();

//     for (const word of wordlist) {
//         trie.insert(word);
//     }

//     function backtrack(path: string[], currentSide: string[], unusedSides: string[][]): void {
//         if (currentSide.length === 0) {
//             const word = path.join('');
//             // console.log("Word: " + word);
//             if (trie.search(word)) {
//                 solutions.push([path.join("")]);
//                 // console.log("(line 55) Solutions: " + solutions);
//             }
//             return;
//         }

//         for (let i = 0; i < currentSide.length; i++) {
//             if (path.length > 0 && path[path.length - 1].endsWith(currentSide[i])) {
//                 // console.log("Path: " + path);
//                 continue; // Avoid consecutive letters
//             }

//             const newSide = currentSide.slice();
//             const newPath = path.slice();
//             newPath.push(currentSide[i]);
//             newSide.splice(i, 1);

//             backtrack(newPath, newSide, unusedSides);
//         }

//         if (unusedSides.length > 0) {
//             const newSide = unusedSides[0];
//             const newUnusedSides = unusedSides.slice(1);
//             backtrack([...path], newSide, newUnusedSides);
//         }
//     }

//     const [top, right, bottom, left] = letterGroups.map((group) => Array.from(group));
//     // console.log("Sides: " + top, right, bottom, left);
//     backtrack([], top, [right, bottom, left]);
//     console.log(solutions);
//     return solutions;
// }

