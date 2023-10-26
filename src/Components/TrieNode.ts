class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;

  constructor() {
    this.children = new Map<string, TrieNode>();
    this.isEndOfWord = false;
  }
}

// Function to insert a word into the Trie
function insertWord(root: TrieNode, word: string) {
  let node = root;
  for (const char of word) {
    if (!node.children.has(char)) {
      node.children.set(char, new TrieNode());
    }
    node = node.children.get(char)!;
  }
  node.isEndOfWord = true;
}

// Function to find 2-word solutions for Letter Boxed
export function findLetterBoxedSolutions(
  letterGroups: string[],
  wordlist: Set<string>
): string[][] {
  // Build a Trie from the wordlist
  const root = new TrieNode();
  for (const word of wordlist) {
    insertWord(root, word);
  }

  const solutions: string[][] = [];

  // Recursive function to find solutions
  function findSolutions(
    visited: Set<string>,
    currentWord: string,
    lastChar: string
  ) {
    if (currentWord.length >= 3) {
      visited.add(currentWord);
      lastChar = currentWord.charAt(currentWord.length - 1);
    }

    if (visited.size === letterGroups.join("").length) {
      if (visited.size % 3 === 0) {
        solutions.push([...visited]);
      }
      visited.delete(currentWord);
      return;
    }

    const currentSide = letterGroups[Math.floor(visited.size / 3)];
    for (const char of currentSide) {
      if (visited.has(char)) continue;
      const nextWord = currentWord + char;

      if (startsWithValidWord(root, nextWord) && lastChar !== char) {
        findSolutions(visited, nextWord, lastChar);
      }
    }

    visited.delete(currentWord);
  }

  for (const side of letterGroups) {
    for (const char of side) {
      findSolutions(new Set<string>(), char, char);
    }
  }
  return solutions;
}

// Function to check if a valid word starts with the given prefix
function startsWithValidWord(root: TrieNode, prefix: string): boolean {
  let node = root;
  for (const char of prefix) {
    if (!node.children.has(char)) {
      return false;
    }
    node = node.children.get(char)!;
  }
  return node.isEndOfWord;
}
