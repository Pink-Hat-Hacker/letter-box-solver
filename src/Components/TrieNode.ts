class TrieNode {
    children: Map<string, TrieNode>;
    isEndOfWord: boolean;

    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
    }
}

class Trie {
    root: TrieNode;

    constructor() {
        this.root = new TrieNode();
    }

    insert(word: string) {
        let node = this.root;
        for (const char of word) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char)!;
        }
        node.isEndOfWord = true;
    }

    search(word: string): boolean {
        let node = this.root;
        for (const char of word) {
            if (!node.children.has(char)) {
                return false;
            }
            node = node.children.get(char)!;
        }
        return node.isEndOfWord;
    }
}

export function findTwoWordSolutions(letterGroups: string[], wordlist: string[]): string[][] {
    const solutions: string[][] = [];
    const trie = new Trie();

    for (const word of wordlist) {
        trie.insert(word);
    }

    function backtrack(path: string[], currentSide: string[], unusedSides: string[][]): void {
        if (currentSide.length === 0) {
            const word = path.join('');
            console.log("Word: " + word);
            if (trie.search(word)) {
                solutions.push([path.join("")]);
                console.log("(line 55) Solutions: " + solutions);
            }
            return;
        }

        for (let i = 0; i < currentSide.length; i++) {
            if (path.length > 0 && path[path.length - 1].endsWith(currentSide[i])) {
                console.log("Path: " + path);
                continue; // Avoid consecutive letters
            }

            const newSide = currentSide.slice();
            const newPath = path.slice();
            newPath.push(currentSide[i]);
            newSide.splice(i, 1);

            backtrack(newPath, newSide, unusedSides);
        }

        if (unusedSides.length > 0) {
            const newSide = unusedSides[0];
            const newUnusedSides = unusedSides.slice(1);
            backtrack([...path], newSide, newUnusedSides);
        }
    }

    const [top, right, bottom, left] = letterGroups.map((group) => Array.from(group));
    console.log("Sides: " + top, right, bottom, left);
    backtrack([], top, [right, bottom, left]);

    return solutions;
}

