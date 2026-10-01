// Assessment Question Bank Part 3: Deep DSA Questions across subtopics to reach 160+ total questions

const ASSESSMENT_QUESTIONS_PART3 = [
  // ─── Additional Arrays & Subtopics ───
  {
    title: "Maximum Product Subarray (Tracking Min and Max)",
    difficulty: "medium",
    topic: "arrays",
    subtopic: "Kadane",
    concepts: ["Dynamic Programming", "Negative Multiplications", "Max/Min Swap"],
    type: "conceptual",
    question: "When computing the maximum product subarray, why do we maintain BOTH `maxProd` and `minProd` at each step?",
    options: [
      { id: "A", text: "Multiplying a negative number by a large negative minimum product turns it into a large positive product" },
      { id: "B", text: "Because products are always positive" },
      { id: "C", text: "To avoid floating point errors" },
      { id: "D", text: "To sort the array" }
    ],
    correctOption: "A",
    explanation: "If `nums[i] < 0`, the previous `minProd * nums[i]` could become the new `maxProd`. Swapping `maxProd` and `minProd` when `nums[i] < 0` handles this sign inversion.",
    expectedTimeSeconds: 65
  },
  {
    title: "Find All Numbers Disappeared in an Array In-Place",
    difficulty: "easy",
    topic: "arrays",
    subtopic: "traversal",
    concepts: ["Array as Hash Map", "Sign Inversion", "O(1) Auxiliary Space"],
    type: "code-output",
    question: "How do we mark number `val` as present in an array of size `n` with values in `[1, n]` without extra memory?",
    codeSnippet: "int index = abs(nums[i]) - 1;\nnums[index] = -abs(nums[index]);",
    options: [
      { id: "A", text: "Negate the value at `nums[abs(nums[i]) - 1]` to mark its presence as a visited indicator" },
      { id: "B", text: "Set value to 0" },
      { id: "C", text: "Add 1000 to value" },
      { id: "D", text: "Sort the array" }
    ],
    correctOption: "A",
    explanation: "Using the index `val - 1` and negating `nums[index]` encodes presence in-place. In pass 2, any positive index `i` implies `i + 1` was never visited.",
    expectedTimeSeconds: 60
  },
  {
    title: "Set Matrix Zeroes with O(1) Space",
    difficulty: "medium",
    topic: "arrays",
    subtopic: "matrix",
    concepts: ["In-Place Flagging", "First Row and Col as Memory"],
    type: "conceptual",
    question: "In Set Matrix Zeroes, how can we record which rows and columns should be zeroed in O(1) extra space?",
    options: [
      { id: "A", text: "Use the first row (`matrix[0][j]`) and first column (`matrix[i][0]`) as the flag arrays, plus two booleans for row0 and col0" },
      { id: "B", text: "Allocate two boolean arrays of size M and N" },
      { id: "C", text: "Store coordinates in a HashSet" },
      { id: "D", text: "Set entire matrix to zero" }
    ],
    correctOption: "A",
    explanation: "Using row 0 and column 0 of the matrix itself as storage saves O(M + N) space, achieving strict O(1) auxiliary memory.",
    expectedTimeSeconds: 75
  },

  // ─── Additional Strings & Subtopics ───
  {
    title: "Encode and Decode Strings (Length Delimited)",
    difficulty: "medium",
    topic: "strings",
    subtopic: "manipulation",
    concepts: ["Stateless Protocol", "Chunked Transfer Encoding", "Delimiter Escaping"],
    type: "conceptual",
    question: "How can a list of arbitrary strings (which may contain any ASCII character, commas, newlines, or delimiters) be safely encoded and decoded?",
    options: [
      { id: "A", text: "Prefix each string with its length followed by a fixed separator (e.g. `\"4#word\"` or `\"5#hello\"`)" },
      { id: "B", text: "Join with commas" },
      { id: "C", text: "Join with spaces" },
      { id: "D", text: "Convert to uppercase" }
    ],
    correctOption: "A",
    explanation: "Prefixing `length + '#'` is unambiguous: the decoder parses the integer length until '#' and then reads exactly that many characters, impervious to any inner characters.",
    expectedTimeSeconds: 70
  },
  {
    title: "Longest Repeating Substring (Suffix Automaton / Binary Search + Rolling Hash)",
    difficulty: "hard",
    topic: "strings",
    subtopic: "hashing",
    concepts: ["Rolling Hash", "Binary Search on Length", "Rabin-Karp"],
    type: "conceptual",
    question: "How is the Longest Repeating Substring found in O(N log N) average time?",
    options: [
      { id: "A", text: "Binary search on length L (if duplicate substring of length L exists, test L > current); check duplicates in O(N) using Rabin-Karp rolling hash" },
      { id: "B", text: "Compare all substring pairs in O(N^3)" },
      { id: "C", text: "Sort all characters" },
      { id: "D", text: "Count vowels" }
    ],
    correctOption: "A",
    explanation: "Length feasibility is monotonic (a duplicate of length L implies duplicates of length < L exist). Combining binary search with O(N) rolling hash solves it in O(N log N).",
    expectedTimeSeconds: 85
  },

  // ─── Additional Hashing & Subtopics ───
  {
    title: "Insert Delete GetRandom O(1)",
    difficulty: "medium",
    topic: "hashing",
    subtopic: "HashMap",
    concepts: ["HashMap + Dynamic Array", "Swap with Last Element", "O(1) Random Choice"],
    type: "code-output",
    question: "In `RandomizedSet`, how is `remove(val)` executed in O(1) time without leaving empty holes in the dynamic array?",
    options: [
      { id: "A", text: "Swap the target element with the LAST element in the array, update the last element's index in the HashMap, and pop the array back in O(1)" },
      { id: "B", text: "Shift all subsequent elements left in O(N)" },
      { id: "C", text: "Leave a null placeholder in the array" },
      { id: "D", text: "Re-initialize the array" }
    ],
    correctOption: "A",
    explanation: "Arrays allow O(1) deletion only at the back. Swapping the target element to the back and updating the hash map achieves O(1) removal while preserving contiguous random access.",
    expectedTimeSeconds: 75
  },

  // ─── Additional Sliding Window ───
  {
    title: "Find All Anagrams in a String",
    difficulty: "medium",
    topic: "sliding-window",
    subtopic: "fixed window",
    concepts: ["Fixed Window", "Frequency Array Equality", "O(26) Comparison"],
    type: "conceptual",
    question: "When scanning string `s` for anagrams of pattern `p`, why is the window size fixed to `p.length()`?",
    options: [
      { id: "A", text: "An anagram must contain the exact same number of total characters as the pattern" },
      { id: "B", text: "To avoid memory allocation" },
      { id: "C", text: "Because s must be sorted" },
      { id: "D", text: "It is not fixed, it varies" }
    ],
    correctOption: "A",
    explanation: "Any anagram of `p` has length equal to `p.length`. We slide a window of size `p.length()` and compare character count frequencies in O(1) per move.",
    expectedTimeSeconds: 55
  },

  // ─── Additional Stack ───
  {
    title: "Basic Calculator with Parentheses and +, -",
    difficulty: "hard",
    topic: "stack",
    subtopic: "expression evaluation",
    concepts: ["Sign Stack", "Running Result", "Parentheses Scope"],
    type: "code-output",
    question: "In Basic Calculator with parentheses, what is pushed onto the stack when `'('` is encountered?",
    options: [
      { id: "A", text: "The current accumulated `result` and the current outer `sign`" },
      { id: "B", text: "Only the character '('" },
      { id: "C", text: "The length of the string" },
      { id: "D", text: "Nothing is pushed" }
    ],
    correctOption: "A",
    explanation: "Encountering '(' starts a new nested sub-expression. Saving `{result, sign}` on the stack allows resetting `result = 0, sign = 1` for the inner scope.",
    expectedTimeSeconds: 85
  },

  // ─── Additional Dynamic Programming ───
  {
    title: "Longest Palindromic Subsequence vs Substring DP",
    difficulty: "medium",
    topic: "dp",
    subtopic: "subsequence",
    concepts: ["LPS Recurrence", "2D Interval DP", "Subsequence vs Substring"],
    type: "code-output",
    question: "What is the DP transition for the Longest Palindromic Subsequence of substring `s[i..j]` when `s[i] == s[j]`?",
    options: [
      { id: "A", text: "`dp[i][j] = 2 + dp[i + 1][j - 1]`" },
      { id: "B", text: "`dp[i][j] = 1 + dp[i + 1][j - 1]`" },
      { id: "C", text: "`dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])`" },
      { id: "D", text: "`dp[i][j] = dp[i + 1][j - 1]`" }
    ],
    correctOption: "A",
    explanation: "If outer characters match (`s[i] == s[j]`), both contribute to the palindrome, adding 2 to the optimal inner subproblem `dp[i+1][j-1]`.",
    expectedTimeSeconds: 65
  },
  {
    title: "Target Sum (Subset Sum Equivalence)",
    difficulty: "medium",
    topic: "dp",
    subtopic: "knapsack",
    concepts: ["0/1 Knapsack", "Math Transformation: P - N = Target -> 2P = Target + Sum"],
    type: "conceptual",
    question: "Assigning +/- signs to reach `target` is mathematically equivalent to finding a positive subset `P` with sum equal to:",
    options: [
      { id: "A", text: "`(target + sum(nums)) / 2`" },
      { id: "B", text: "`target / 2`" },
      { id: "C", text: "`sum(nums) - target`" },
      { id: "D", text: "`target * 2`" }
    ],
    correctOption: "A",
    explanation: "Let P be positive set and N negative set. `sum(P) - sum(N) = target` and `sum(P) + sum(N) = sum(nums)`. Adding yields `2 * sum(P) = target + sum(nums)`.",
    expectedTimeSeconds: 70
  },
  {
    title: "Maximal Square (2D DP Matrix)",
    difficulty: "medium",
    topic: "dp",
    subtopic: "grid DP",
    concepts: ["2D DP", "Min of 3 Neighbors", "Square Side Length"],
    type: "code-output",
    question: "In Maximal Square, what is the DP recurrence for `dp[i][j]` (side length of maximum square with bottom-right corner at `(i, j)`) when `matrix[i][j] == '1'`?",
    options: [
      { id: "A", text: "`dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])`" },
      { id: "B", text: "`dp[i][j] = 1 + max(dp[i-1][j], dp[i][j-1])`" },
      { id: "C", text: "`dp[i][j] = dp[i-1][j-1] + 1`" },
      { id: "D", text: "`dp[i][j] = 4`" }
    ],
    correctOption: "A",
    explanation: "A square of side `k` can only be formed if top, left, and top-left diagonal squares all have side at least `k - 1`. Taking the minimum of the three neighbors determines the maximum possible square.",
    expectedTimeSeconds: 65
  },

  // ─── Additional Graphs ───
  {
    title: "Reconstruct Itinerary (Eulerian Path Hierholzer's Algorithm)",
    difficulty: "hard",
    topic: "graphs",
    subtopic: "DFS",
    concepts: ["Eulerian Circuit", "Hierholzer Algorithm", "Lexicographical Greedy Postorder"],
    type: "conceptual",
    question: "How does Hierholzer's Algorithm find an Eulerian Path (visiting every ticket edge exactly once) using DFS with Priority Queues?",
    options: [
      { id: "A", text: "Greedily traverse smallest alphabetical edge, and append airport to itinerary in POSTORDER (reversed at end)" },
      { id: "B", text: "Append airports in preorder traversal" },
      { id: "C", text: "Topological sort" },
      { id: "D", text: "Dijkstra algorithm" }
    ],
    correctOption: "A",
    explanation: "Appending in postorder ensures that dead-end sub-cycles are pushed onto the route after the main loop has completed, constructing the exact Eulerian trail when reversed.",
    expectedTimeSeconds: 85
  },
  {
    title: "Cheapest Flights Within K Stops (Bellman-Ford / BFS Modified)",
    difficulty: "medium",
    topic: "graphs",
    subtopic: "shortest path",
    concepts: ["Bounded Steps Shortest Path", "Snapshot Distance Array", "Bellman-Ford Relaxations"],
    type: "conceptual",
    question: "When finding the cheapest flight from src to dst with at most `K` stops using Bellman-Ford, why must we use a CLONED copy of previous distances `prevDist` during edge relaxations?",
    options: [
      { id: "A", text: "To prevent an edge from using a distance computed in the CURRENT pass, which would violate the at-most-K-stops constraint (chaining multiple flights in 1 iteration)" },
      { id: "B", text: "To speed up memory allocation" },
      { id: "C", text: "Because graphs are undirected" },
      { id: "D", text: "To avoid cycles" }
    ],
    correctOption: "A",
    explanation: "If in pass `k`, an updated distance at node u is immediately used to relax edge `u -> v`, it uses 2 flights in a single pass. Cloning distances guarantees exactly 1 flight is added per iteration.",
    expectedTimeSeconds: 80
  },

  // ─── Additional Backtracking & Subtopics ───
  {
    title: "Letter Combinations of a Phone Number (Cartesian Product)",
    difficulty: "easy",
    topic: "backtracking",
    subtopic: "combinations",
    concepts: ["Digit to Letters Map", "Recursion Tree", "Time Complexity"],
    type: "complexity",
    question: "What is the worst-case time complexity for generating letter combinations of an `n`-digit phone number?",
    options: [
      { id: "A", text: "O(4^n * n) — digits 7 and 9 have 4 letters each" },
      { id: "B", text: "O(n!)" },
      { id: "C", text: "O(n^4)" },
      { id: "D", text: "O(2^n)" }
    ],
    correctOption: "A",
    explanation: "Each digit maps to 3 or 4 letters. In the worst case (e.g. all 7s or 9s), there are 4^n leaf combinations, each taking O(n) to construct.",
    expectedTimeSeconds: 50
  }
];

module.exports = ASSESSMENT_QUESTIONS_PART3;
