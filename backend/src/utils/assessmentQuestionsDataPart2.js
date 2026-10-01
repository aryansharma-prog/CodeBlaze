// Assessment Question Bank Part 2: Recursion, Backtracking, Trees, BST, Heap, Greedy, Graphs, DP, Bit Manipulation, Trie, Union Find

const ASSESSMENT_QUESTIONS_PART2 = [
  // ────────────────── RECURSION (6 questions) ──────────────────
  {
    title: "Recursion Call Stack & Space Complexity",
    difficulty: "easy",
    topic: "recursion",
    subtopic: "basic recursion",
    concepts: ["Call Stack", "Stack Overflow", "Base Case"],
    type: "complexity",
    question: "What determines the auxiliary space complexity of a non-tail-recursive function?",
    options: [
      { id: "A", text: "The maximum depth of the recursion call stack (number of active stack frames)" },
      { id: "B", text: "The total number of recursive calls made across all branches" },
      { id: "C", text: "Always O(1)" },
      { id: "D", text: "The size of the return value only" }
    ],
    correctOption: "A",
    explanation: "Auxiliary space in recursion is determined by the maximum call stack depth at any given moment, which equals the length of the longest root-to-leaf path in the recursion tree.",
    expectedTimeSeconds: 45
  },
  {
    title: "Divide and Conquer Recurrence (Master Theorem)",
    difficulty: "medium",
    topic: "recursion",
    subtopic: "divide and conquer",
    concepts: ["Master Theorem", "Merge Sort", "Time Complexity"],
    type: "complexity",
    question: "What is the asymptotic time complexity of the recurrence relation T(n) = 2*T(n/2) + O(n)?",
    options: [
      { id: "A", text: "O(n log n) — Case 2 of Master Theorem" },
      { id: "B", text: "O(n^2)" },
      { id: "C", text: "O(n)" },
      { id: "D", text: "O(log n)" }
    ],
    correctOption: "A",
    explanation: "Here a = 2, b = 2, f(n) = n. Since n^(log_b a) = n^(log_2 2) = n^1 = f(n), Case 2 applies: T(n) = Θ(n log n). This is standard Merge Sort.",
    expectedTimeSeconds: 65
  },
  {
    title: "Fast Exponentiation (Pow(x, n))",
    difficulty: "medium",
    topic: "recursion",
    subtopic: "divide and conquer",
    concepts: ["Binary Exponentiation", "Logarithmic Time", "Odd/Even Power"],
    type: "code-output",
    question: "When calculating x^n recursively with fast exponentiation, how is odd power `n` reduced in O(log n) steps?",
    options: [
      { id: "A", text: "x^n = x * (x^(n/2))^2 (or x * Pow(x, n - 1))" },
      { id: "B", text: "Multiply x by itself n times in a loop" },
      { id: "C", text: "x^n = Pow(x/2, n)" },
      { id: "D", text: "x^n = n * x" }
    ],
    correctOption: "A",
    explanation: "If n is even, x^n = (x^(n/2))^2. If n is odd, x^n = x * (x^((n-1)/2))^2. This halves n at each step, running in O(log n) time.",
    expectedTimeSeconds: 60
  },
  {
    title: "Reverse String Recursively in O(n) Stack Space",
    difficulty: "easy",
    topic: "recursion",
    subtopic: "recursive strings",
    concepts: ["Base Case", "Head/Tail Swap"],
    type: "conceptual",
    question: "What is the base case for reversing a substring between indices `left` and `right` recursively?",
    options: [
      { id: "A", text: "if (left >= right) return;" },
      { id: "B", text: "if (left == 0) return;" },
      { id: "C", text: "if (right == str.length) return;" },
      { id: "D", text: "if (left == null) return;" }
    ],
    correctOption: "A",
    explanation: "When left >= right, the pointers have met or crossed in the middle, meaning all mirrored pairs have been swapped.",
    expectedTimeSeconds: 40
  },
  {
    title: "Tower of Hanoi Move Count",
    difficulty: "medium",
    topic: "recursion",
    subtopic: "basic recursion",
    concepts: ["Tower of Hanoi", "Recurrence", "Exponential Moves"],
    type: "complexity",
    question: "What is the minimum number of moves required to solve the Tower of Hanoi puzzle with `n` disks?",
    options: [
      { id: "A", text: "2^n - 1" },
      { id: "B", text: "n^2" },
      { id: "C", text: "2*n" },
      { id: "D", text: "n!" }
    ],
    correctOption: "A",
    explanation: "Recurrence: T(n) = 2*T(n-1) + 1 with T(1) = 1. Solving gives T(n) = 2^n - 1.",
    expectedTimeSeconds: 50
  },
  {
    title: "Recursion vs Iteration Tail Call Optimization",
    difficulty: "medium",
    topic: "recursion",
    subtopic: "basic recursion",
    concepts: ["Tail Recursion", "TCO", "Stack Frame Reuse"],
    type: "conceptual",
    question: "What allows a compiler to perform Tail Call Optimization (TCO) and convert recursion to O(1) space?",
    options: [
      { id: "A", text: "The recursive call is the absolute final statement executed, with no pending operations (like addition) waiting on return" },
      { id: "B", text: "The function returns void" },
      { id: "C", text: "The function has at least 3 parameters" },
      { id: "D", text: "The recursion tree has branching factor 2" }
    ],
    correctOption: "A",
    explanation: "If no computation is pending after the recursive call, the current stack frame can be overwritten for the child call, running in O(1) stack space.",
    expectedTimeSeconds: 70
  },

  // ────────────────── BACKTRACKING (8 questions) ──────────────────
  {
    title: "Backtracking Core Mechanism (Choose, Explore, Unchoose)",
    difficulty: "easy",
    topic: "backtracking",
    subtopic: "subsets",
    concepts: ["State Reversion", "Recursion Tree", "Depth First Search"],
    type: "conceptual",
    question: "Why is the 'Unchoose' (backtracking) step `path.pop_back()` or `used[i] = false` essential?",
    options: [
      { id: "A", text: "It restores the shared mutable state before returning to the parent caller so sibling branches start with a clean state" },
      { id: "B", text: "To free garbage-collected heap memory" },
      { id: "C", text: "To terminate the program early" },
      { id: "D", text: "To reverse the final answer list" }
    ],
    correctOption: "A",
    explanation: "Backtracking modifies a single shared buffer during recursive exploration. Popping the chosen element restores the state for other recursion branches.",
    expectedTimeSeconds: 50
  },
  {
    title: "Subsets (Power Set) Size and Complexity",
    difficulty: "medium",
    topic: "backtracking",
    subtopic: "subsets",
    concepts: ["Power Set", "2^n Complexity", "Include/Exclude Decision"],
    type: "complexity",
    question: "For an array with `n` distinct elements, how many total subsets exist, and what is the time complexity to generate all subsets?",
    options: [
      { id: "A", text: "2^n subsets, O(n * 2^n) time" },
      { id: "B", text: "n! subsets, O(n!) time" },
      { id: "C", text: "n^2 subsets, O(n^2) time" },
      { id: "D", text: "2^n subsets, O(n) time" }
    ],
    correctOption: "A",
    explanation: "Each element has 2 choices (include or exclude), yielding 2^n subsets. Copying each subset of average length n/2 takes O(n), giving O(n * 2^n) total time.",
    expectedTimeSeconds: 60
  },
  {
    title: "Permutations of Array without Duplicates",
    difficulty: "medium",
    topic: "backtracking",
    subtopic: "permutations",
    concepts: ["Permutations", "n! Complexity", "Used Array / In-place Swap"],
    type: "complexity",
    question: "What is the time complexity to generate all permutations of an array with `n` distinct elements?",
    options: [
      { id: "A", text: "O(n * n!)" },
      { id: "B", text: "O(2^n)" },
      { id: "C", text: "O(n^n)" },
      { id: "D", text: "O(n^3)" }
    ],
    correctOption: "A",
    explanation: "There are n! permutations. Creating a copy of length n for each permutation takes O(n), totaling O(n * n!) time.",
    expectedTimeSeconds: 65
  },
  {
    title: "Combinations Sum with Reusable Elements",
    difficulty: "medium",
    topic: "backtracking",
    subtopic: "combinations",
    concepts: ["Combination Sum", "Index Advancement", "Pruning"],
    type: "code-output",
    question: "In Combination Sum where candidates can be chosen UNLIMITED times, how is the recursive call invoked after picking `candidates[i]`?",
    options: [
      { id: "A", text: "`backtrack(remain - candidates[i], i, currentPath)` (pass index `i` again, not `i + 1`)" },
      { id: "B", text: "`backtrack(remain - candidates[i], i + 1, currentPath)`" },
      { id: "C", text: "`backtrack(remain, 0, currentPath)`" },
      { id: "D", text: "`backtrack(remain - candidates[0], i, currentPath)`" }
    ],
    correctOption: "A",
    explanation: "Passing the same index `i` allows the same candidate number to be picked repeatedly until the remaining target sum is exhausted or exceeded.",
    expectedTimeSeconds: 70
  },
  {
    title: "N-Queens Diagonal Conflict Check in O(1)",
    difficulty: "hard",
    topic: "backtracking",
    subtopic: "N-Queens",
    concepts: ["N-Queens", "Diagonal Formula (r-c and r+c)", "Hash Sets"],
    type: "conceptual",
    question: "How can diagonal conflicts for a queen placed at `(row, col)` be checked in O(1) time?",
    options: [
      { id: "A", text: "Store active `cols` set, main diagonals `(row - col)` set, and anti-diagonals `(row + col)` set" },
      { id: "B", text: "Iterate across all 8 directions with nested while loops" },
      { id: "C", text: "Multiply row and col" },
      { id: "D", text: "Using a single 1D array of size N" }
    ],
    correctOption: "A",
    explanation: "Main diagonals have constant `row - col` (or `row - col + N`), and anti-diagonals have constant `row + col`. Lookup in 3 Boolean arrays/sets takes O(1) time.",
    expectedTimeSeconds: 85
  },
  {
    title: "Sudoku Solver Backtracking Pruning",
    difficulty: "hard",
    topic: "backtracking",
    subtopic: "constraint search",
    concepts: ["Sudoku Solver", "3x3 Box Indexing", "Bitmask Optimization"],
    type: "code-output",
    question: "What is the formula to compute the 3x3 subgrid index `boxIndex` (0 to 8) for cell `(row, col)` on a 9x9 Sudoku board?",
    options: [
      { id: "A", text: "(row / 3) * 3 + (col / 3)" },
      { id: "B", text: "row % 3 + col % 3" },
      { id: "C", text: "(row * 3) + col" },
      { id: "D", text: "row + col / 3" }
    ],
    correctOption: "A",
    explanation: "Each 3x3 box block is indexed: row block is `row / 3` (0, 1, 2) and col block is `col / 3` (0, 1, 2). The box index is `(row/3)*3 + (col/3)`.",
    expectedTimeSeconds: 75
  },
  {
    title: "Word Search on 2D Grid with In-Place Visited Tracking",
    difficulty: "medium",
    topic: "backtracking",
    subtopic: "maze",
    concepts: ["Grid DFS", "Backtracking", "O(1) Visited Marker"],
    type: "conceptual",
    question: "How can we mark cell `board[r][c]` as visited in Word Search without allocating an extra boolean 2D array?",
    options: [
      { id: "A", text: "Temporarily replace char `board[r][c] = '#'`, and restore original char `board[r][c] = orig` when backtracking" },
      { id: "B", text: "Delete the entire row" },
      { id: "C", text: "Set char to uppercase" },
      { id: "D", text: "Cannot be done without extra memory" }
    ],
    correctOption: "A",
    explanation: "Mutating the board cell in-place to a sentinel like '#' and restoring it on recursion unwind achieves O(1) auxiliary space (excluding stack).",
    expectedTimeSeconds: 65
  },
  {
    title: "Palindromic Partitioning (Backtracking + DP)",
    difficulty: "medium",
    topic: "backtracking",
    subtopic: "combinations",
    concepts: ["Palindrome Substrings", "Backtracking Slicing"],
    type: "conceptual",
    question: "In Palindrome Partitioning of string `s`, when is a recursive branch pruned?",
    options: [
      { id: "A", text: "Whenever prefix `s[start..end]` is NOT a palindrome" },
      { id: "B", text: "Only when end reaches the end of the string" },
      { id: "C", text: "When string length is odd" },
      { id: "D", text: "When characters are lowercase" }
    ],
    correctOption: "A",
    explanation: "If the candidate substring `s[start..end]` is not a palindrome, that branch is immediately pruned because any full partition including it is invalid.",
    expectedTimeSeconds: 70
  },

  // ────────────────── TREES (12 questions) ──────────────────
  {
    title: "Binary Tree Inorder, Preorder, and Postorder Traversals",
    difficulty: "easy",
    topic: "trees",
    subtopic: "traversals",
    concepts: ["Tree Traversal", "DFS", "Node Processing Order"],
    type: "conceptual",
    question: "In which binary tree traversal is the root node processed BETWEEN its left subtree and right subtree?",
    options: [
      { id: "A", text: "Inorder traversal (Left -> Root -> Right)" },
      { id: "B", text: "Preorder traversal (Root -> Left -> Right)" },
      { id: "C", text: "Postorder traversal (Left -> Right -> Root)" },
      { id: "D", text: "Level order traversal" }
    ],
    correctOption: "A",
    explanation: "Inorder visits: Left subtree, then current node, then Right subtree. In a BST, this yields sorted ascending order.",
    expectedTimeSeconds: 40
  },
  {
    title: "Maximum Depth of Binary Tree",
    difficulty: "easy",
    topic: "trees",
    subtopic: "height",
    concepts: ["Recursion", "Tree Height", "Postorder DFS"],
    type: "code-output",
    question: "What is the recursive recurrence for finding the maximum depth of a binary tree?",
    codeSnippet: "if (!root) return 0;\nreturn 1 + max(maxDepth(root.left), maxDepth(root.right));",
    options: [
      { id: "A", text: "1 + max(depth(left), depth(right))" },
      { id: "B", text: "depth(left) + depth(right)" },
      { id: "C", text: "1 + min(depth(left), depth(right))" },
      { id: "D", text: "depth(left) * depth(right)" }
    ],
    correctOption: "A",
    explanation: "The height of any node is 1 (accounting for current node) plus the maximum of the heights of its left and right subtrees.",
    expectedTimeSeconds: 45
  },
  {
    title: "Binary Tree Level Order Traversal (BFS)",
    difficulty: "medium",
    topic: "trees",
    subtopic: "level order",
    concepts: ["Queue", "BFS", "Level by Level Separation"],
    type: "code-output",
    question: "In Level Order Traversal using a Queue, how do we group nodes level by level into separate sub-lists?",
    options: [
      { id: "A", text: "Take snapshot of `int levelSize = queue.size()` at start of each while iteration, then loop exactly `levelSize` times" },
      { id: "B", text: "Use two separate queues for every tree node" },
      { id: "C", text: "Insert a null delimiter after every node" },
      { id: "D", text: "By tracking tree height recursively" }
    ],
    correctOption: "A",
    explanation: "Capturing `queue.size()` before processing ensures we pop and collect only the nodes belonging to the current level before newly pushed children are processed.",
    expectedTimeSeconds: 65
  },
  {
    title: "Diameter of Binary Tree Definition",
    difficulty: "medium",
    topic: "trees",
    subtopic: "diameter",
    concepts: ["Tree Diameter", "Longest Path Between Nodes", "Global Variable Max"],
    type: "conceptual",
    question: "What is the diameter of a binary tree?",
    options: [
      { id: "A", text: "The length of the longest path between any two nodes in a tree, which may or may not pass through the root" },
      { id: "B", text: "The depth of the root node" },
      { id: "C", text: "The number of leaf nodes" },
      { id: "D", text: "The height of left subtree minus height of right subtree" }
    ],
    correctOption: "A",
    explanation: "Diameter is the maximum number of edges on a path between any two leaf/internal nodes in the tree. At node `u`, local diameter is `height(left) + height(right)`.",
    expectedTimeSeconds: 60
  },
  {
    title: "Balanced Binary Tree Condition (AVL Property)",
    difficulty: "easy",
    topic: "trees",
    subtopic: "height",
    concepts: ["Tree Balance", "Height Difference <= 1", "Bottom-Up DFS"],
    type: "conceptual",
    question: "What is the condition for a binary tree to be height-balanced?",
    options: [
      { id: "A", text: "For EVERY node in the tree, |height(left) - height(right)| <= 1, and both left and right subtrees are balanced" },
      { id: "B", text: "Only the root node must have equal subtree heights" },
      { id: "C", text: "All leaves must be at the exact same depth" },
      { id: "D", text: "Number of nodes in left subtree equals right subtree" }
    ],
    correctOption: "A",
    explanation: "A binary tree is height-balanced if for every individual node in the entire tree, the height difference between left and right children is at most 1.",
    expectedTimeSeconds: 50
  },
  {
    title: "Lowest Common Ancestor (LCA) in Binary Tree",
    difficulty: "medium",
    topic: "trees",
    subtopic: "DFS",
    concepts: ["LCA", "Postorder Traversal", "Recursive Bubble Up"],
    type: "code-output",
    question: "In the recursive LCA algorithm for a binary tree, what does returning `root` when `left != null && right != null` signify?",
    options: [
      { id: "A", text: "Target nodes p and q were found in distinct subtrees (one in left, one in right), making `root` their lowest common ancestor" },
      { id: "B", text: "Both targets are in the left subtree" },
      { id: "C", text: "Neither target node was found" },
      { id: "D", text: "Tree has a cycle" }
    ],
    correctOption: "A",
    explanation: "When left recursive call finds p (or q) and right call finds q (or p), the current root node is the unique lowest junction point connecting them.",
    expectedTimeSeconds: 75
  },
  {
    title: "Binary Tree Maximum Path Sum",
    difficulty: "hard",
    topic: "trees",
    subtopic: "paths",
    concepts: ["Max Path Sum", "Negative Contribution Pruning", "Postorder"],
    type: "conceptual",
    question: "In Binary Tree Maximum Path Sum, why do we take `max(0, dfs(child))` for child return values?",
    options: [
      { id: "A", text: "To ignore subtrees with negative net sums that would only decrease the total path sum" },
      { id: "B", text: "To avoid integer overflow" },
      { id: "C", text: "Because tree node values are strictly positive" },
      { id: "D", text: "To terminate recursion at leaves" }
    ],
    correctOption: "A",
    explanation: "If a child branch has a negative total contribution (`< 0`), including it hurts the path sum, so we clamp its contribution to 0 (effectively omitting that branch).",
    expectedTimeSeconds: 85
  },
  {
    title: "Serialize and Deserialize Binary Tree (Preorder with Null Sentinels)",
    difficulty: "hard",
    topic: "trees",
    subtopic: "traversals",
    concepts: ["Serialization", "Preorder Traversal", "Reconstruction"],
    type: "conceptual",
    question: "Why can a binary tree be uniquely reconstructed from a SINGLE preorder string if null nodes are explicitly stored (e.g. '1,2,#,#,3,#,#')?",
    options: [
      { id: "A", text: "Null markers '#' unambiguously determine when subtrees terminate, removing structural ambiguity without needing an inorder traversal" },
      { id: "B", text: "Because preorder always sorts values" },
      { id: "C", text: "Only full binary trees can be reconstructed" },
      { id: "D", text: "It cannot, inorder is always required" }
    ],
    correctOption: "A",
    explanation: "Standard preorder without nulls is ambiguous. Storing explicit null sentinels fixes the exact tree shape during recursive consumer reading.",
    expectedTimeSeconds: 90
  },
  {
    title: "Binary Tree Right Side View (BFS / DFS)",
    difficulty: "medium",
    topic: "trees",
    subtopic: "level order",
    concepts: ["Rightmost Node", "Level Order Snapshot", "Preorder with Right-First"],
    type: "conceptual",
    question: "What is the simplest way to obtain the Right Side View of a binary tree in DFS?",
    options: [
      { id: "A", text: "Traverse Root -> Right -> Left, adding node value when `currentDepth == result.size()`" },
      { id: "B", text: "Only traverse the right pointer of root until null" },
      { id: "C", text: "Inorder traversal" },
      { id: "D", text: "Take sum of all levels" }
    ],
    correctOption: "A",
    explanation: "Visiting right child before left child guarantees the first node encountered at each depth level is the rightmost visible node from the right perspective.",
    expectedTimeSeconds: 65
  },
  {
    title: "Path Sum III (Prefix Sum on Trees)",
    difficulty: "medium",
    topic: "trees",
    subtopic: "paths",
    concepts: ["Prefix Sum on Trees", "Backtracking HashMap", "O(n) Time"],
    type: "complexity",
    question: "How does using a Prefix Sum HashMap achieve O(n) time for counting all downward paths that sum to target in a binary tree?",
    options: [
      { id: "A", text: "Maintains running prefix sums on the current root-to-node path in a HashMap, decrementing count when backtracking" },
      { id: "B", text: "By checking every pair of nodes in O(n^2)" },
      { id: "C", text: "Using dynamic programming on arrays" },
      { id: "D", text: "Sorting node values" }
    ],
    correctOption: "A",
    explanation: "Just like 1D array subarray sums, running prefix sum lookup finds matching ancestor prefixes in O(1). Backtracking the hash map on return maintains path correctness.",
    expectedTimeSeconds: 80
  },
  {
    title: "Flatten Binary Tree to Linked List In-Place (Morris Traversal Idea)",
    difficulty: "medium",
    topic: "trees",
    subtopic: "DFS",
    concepts: ["Preorder In-place Modification", "Rightmost Node of Left Subtree"],
    type: "conceptual",
    question: "To flatten a binary tree to a right-skewed linked list in preorder in O(1) space, where is the original right subtree attached?",
    options: [
      { id: "A", text: "To the rightmost leaf of the left subtree" },
      { id: "B", text: "Directly to the root's left pointer" },
      { id: "C", text: "To the leftmost leaf of the right subtree" },
      { id: "D", text: "To a newly allocated dummy node" }
    ],
    correctOption: "A",
    explanation: "Because preorder visits the entire left subtree before the right subtree, the original right subtree must be spliced as the right child of the left subtree's rightmost leaf.",
    expectedTimeSeconds: 75
  },
  {
    title: "Symmetric Tree (Mirror Reflection)",
    difficulty: "easy",
    topic: "trees",
    subtopic: "DFS",
    concepts: ["Mirror Property", "Simultaneous DFS"],
    type: "code-output",
    question: "What condition tests whether two subtrees `t1` and `t2` are mirror reflections of each other?",
    options: [
      { id: "A", text: "`t1.val == t2.val` AND `isMirror(t1.left, t2.right)` AND `isMirror(t1.right, t2.left)`" },
      { id: "B", text: "`isMirror(t1.left, t2.left)` AND `isMirror(t1.right, t2.right)`" },
      { id: "C", text: "`t1.val == t2.val` only" },
      { id: "D", text: "`t1.left == t2.left`" }
    ],
    correctOption: "A",
    explanation: "Mirror symmetry requires outer children (`t1.left` vs `t2.right`) and inner children (`t1.right` vs `t2.left`) to match reciprocally.",
    expectedTimeSeconds: 50
  },

  // ────────────────── BST (8 questions) ──────────────────
  {
    title: "Binary Search Tree Property & Inorder Sort",
    difficulty: "easy",
    topic: "bst",
    subtopic: "validation",
    concepts: ["BST Invariant", "Inorder Traversal", "Strictly Ascending"],
    type: "conceptual",
    question: "What invariant must hold for a valid Binary Search Tree (BST) without duplicate values?",
    options: [
      { id: "A", text: "For every node, all values in its left subtree are strictly smaller, all in its right subtree are strictly larger" },
      { id: "B", text: "Every node's left child is smaller than right child (no requirement on subtrees)" },
      { id: "C", text: "The tree must be complete" },
      { id: "D", text: "Height of left equals height of right" }
    ],
    correctOption: "A",
    explanation: "The BST property applies to the ENTIRE left and right subtrees of every node, not just immediate children. Inorder traversal of a valid BST produces strictly increasing values.",
    expectedTimeSeconds: 45
  },
  {
    title: "Validate Binary Search Tree Range Invariant",
    difficulty: "medium",
    topic: "bst",
    subtopic: "validation",
    concepts: ["Validation with Min/Max Bounds", "Long Integer Bounds"],
    type: "code-output",
    question: "When validating a BST recursively, what arguments are passed down to child calls?",
    options: [
      { id: "A", text: "`isValid(node.left, minVal, node.val)` and `isValid(node.right, node.val, maxVal)`" },
      { id: "B", text: "`isValid(node.left)` and `isValid(node.right)` without bounds" },
      { id: "C", text: "`isValid(node.left, node.val, maxVal)`" },
      { id: "D", text: "`isValid(node, 0, 100)`" }
    ],
    correctOption: "A",
    explanation: "Left child is bounded above by `node.val` (inheriting parent's `minVal`). Right child is bounded below by `node.val` (inheriting parent's `maxVal`).",
    expectedTimeSeconds: 65
  },
  {
    title: "Lowest Common Ancestor in a BST",
    difficulty: "easy",
    topic: "bst",
    subtopic: "search",
    concepts: ["BST Property LCA", "O(h) Time", "No Backtracking"],
    type: "code-output",
    question: "How do you find the LCA of nodes `p` and `q` in a BST in O(h) time?",
    options: [
      { id: "A", text: "If both p and q are smaller than root, move left; if both are larger, move right; otherwise, current root is the split point / LCA" },
      { id: "B", text: "Always return root" },
      { id: "C", text: "Store all ancestors in an array and find set intersection" },
      { id: "D", text: "Traverse postorder" }
    ],
    correctOption: "A",
    explanation: "Using BST ordering: if both values are on one side, LCA must be in that subtree. The first node where p and q split to opposite sides is their LCA.",
    expectedTimeSeconds: 50
  },
  {
    title: "K-th Smallest Element in a BST",
    difficulty: "medium",
    topic: "bst",
    subtopic: "kth smallest",
    concepts: ["Inorder Traversal", "Early Stopping", "O(h + k) Time"],
    type: "conceptual",
    question: "How can the k-th smallest element in a BST be retrieved with early termination?",
    options: [
      { id: "A", text: "Perform iterative inorder traversal using a stack, decrementing k on each popped node until k == 0" },
      { id: "B", text: "Collect all elements into a list and sort" },
      { id: "C", text: "Level order traversal" },
      { id: "D", text: "Preorder traversal" }
    ],
    correctOption: "A",
    explanation: "Inorder visits elements in ascending order. Popping nodes with an iterative stack stops immediately after visiting the k-th node in O(h + k) time.",
    expectedTimeSeconds: 60
  },
  {
    title: "Delete Node in a BST (3 Cases)",
    difficulty: "medium",
    topic: "bst",
    subtopic: "insertion",
    concepts: ["BST Node Deletion", "Inorder Successor", "Pointer Re-linking"],
    type: "conceptual",
    question: "When deleting a node that has TWO children in a BST, how is its value replaced?",
    options: [
      { id: "A", text: "Replace value with its inorder successor (smallest node in right subtree), then delete that successor from right subtree" },
      { id: "B", text: "Delete both subtrees" },
      { id: "C", text: "Replace with root of tree" },
      { id: "D", text: "Replace with left child and discard right child" }
    ],
    correctOption: "A",
    explanation: "The inorder successor is guaranteed to have at most one child (a right child), making its recursive deletion trivial while maintaining BST properties.",
    expectedTimeSeconds: 75
  },
  {
    title: "Convert Sorted Array to Balanced BST",
    difficulty: "easy",
    topic: "bst",
    subtopic: "insertion",
    concepts: ["Divide and Conquer", "Midpoint Root", "Height Balance"],
    type: "code-output",
    question: "To convert a sorted array into a height-balanced BST, what node should be chosen as the subtree root?",
    options: [
      { id: "A", text: "The middle element: `nums[mid]` where `mid = (left + right) / 2`" },
      { id: "B", text: "The first element: nums[0]" },
      { id: "C", text: "The last element: nums[n-1]" },
      { id: "D", text: "A random element" }
    ],
    correctOption: "A",
    explanation: "Picking the middle element as root ensures left and right halves have equal number of elements (±1), recursively constructing a balanced AVL-like BST.",
    expectedTimeSeconds: 50
  },
  {
    title: "Inorder Successor in BST with Parent Pointer O(1) Space",
    difficulty: "medium",
    topic: "bst",
    subtopic: "successor",
    concepts: ["Inorder Successor", "Leftmost in Right Subtree vs Lowest Ancestor"],
    type: "conceptual",
    question: "If node `x` has NO right child in a BST, where is its inorder successor located?",
    options: [
      { id: "A", text: "The lowest ancestor of `x` whose left child is also an ancestor of `x` (or `x` itself)" },
      { id: "B", text: "The root node always" },
      { id: "C", text: "Node x has no successor" },
      { id: "D", text: "Its left child" }
    ],
    correctOption: "A",
    explanation: "Without a right subtree, the successor is the first ancestor reached when traveling upwards via right-child edges where we finally make a turn from a left child.",
    expectedTimeSeconds: 70
  },
  {
    title: "Range Sum of BST Pruning",
    difficulty: "easy",
    topic: "bst",
    subtopic: "range queries",
    concepts: ["BST Pruning", "Range Query", "DFS Optimization"],
    type: "code-output",
    question: "When computing sum of all node values in range `[low, high]`, when can the left subtree be completely skipped?",
    options: [
      { id: "A", text: "When `root.val < low` (all nodes in left subtree are strictly < root.val < low)" },
      { id: "B", text: "When root.val > high" },
      { id: "C", text: "When root.val == low" },
      { id: "D", text: "Never skip subtrees" }
    ],
    correctOption: "A",
    explanation: "If `root.val < low`, every node in the left subtree is `< root.val < low` due to BST invariants, so the left subtree cannot contain any values within `[low, high]`.",
    expectedTimeSeconds: 50
  },

  // ────────────────── HEAP / PRIORITY QUEUE (8 questions) ──────────────────
  {
    title: "Binary Heap Array Representation & Index Arithmetic",
    difficulty: "easy",
    topic: "heap",
    subtopic: "min heap",
    concepts: ["Complete Binary Tree", "Array Indexing", "Parent/Child Formulas"],
    type: "code-output",
    question: "For a 0-indexed binary heap array, what are the index formulas for the parent and left child of node at index `i`?",
    options: [
      { id: "A", text: "Parent: (i - 1) / 2, Left Child: 2*i + 1, Right Child: 2*i + 2" },
      { id: "B", text: "Parent: i / 2, Left Child: 2*i, Right Child: 2*i + 1" },
      { id: "C", text: "Parent: i - 2, Left Child: 2*i" },
      { id: "D", text: "Parent: 2*i, Left Child: i / 2" }
    ],
    correctOption: "A",
    explanation: "In 0-indexed binary heaps: parent is `(i - 1) / 2`, left child is `2*i + 1`, and right child is `2*i + 2`.",
    expectedTimeSeconds: 45
  },
  {
    title: "Heapify (Build Heap) Time Complexity",
    difficulty: "medium",
    topic: "heap",
    subtopic: "max heap",
    concepts: ["Build Heap", "Sift-Down", "Mathematical Series O(n)"],
    type: "complexity",
    question: "What is the time complexity of building a heap from an unsorted array of `n` elements using bottom-up `siftDown` (Floyd's algorithm)?",
    options: [
      { id: "A", text: "O(n) — linear time" },
      { id: "B", text: "O(n log n)" },
      { id: "C", text: "O(n^2)" },
      { id: "D", text: "O(log n)" }
    ],
    correctOption: "A",
    explanation: "Most nodes are near the bottom of the tree with height 0 or 1. The sum of (nodes * height) forms a convergent geometric series summing to O(n) total operations.",
    expectedTimeSeconds: 65
  },
  {
    title: "Kth Largest Element in an Array (Min-Heap of Size K)",
    difficulty: "medium",
    topic: "heap",
    subtopic: "kth largest",
    concepts: ["Min-Heap", "Fixed Capacity K", "O(N log K) Time"],
    type: "conceptual",
    question: "Why do we use a MIN-HEAP of capacity `k` (instead of a max-heap) to find the k-th LARGEST element in an array of size `N`?",
    options: [
      { id: "A", text: "The root of the min-heap always holds the minimum among the top-k largest elements, taking O(N log k) time and O(k) memory" },
      { id: "B", text: "Min-heaps are faster to allocate than max-heaps" },
      { id: "C", text: "Because a max-heap would require O(N^2) space" },
      { id: "D", text: "To sort the array in reverse" }
    ],
    correctOption: "A",
    explanation: "Maintaining a min-heap of size k evicts numbers smaller than the current k-th largest. After scanning all N elements, the root is the k-th largest element.",
    expectedTimeSeconds: 60
  },
  {
    title: "Top K Frequent Elements (Bucket Sort vs Min-Heap)",
    difficulty: "medium",
    topic: "heap",
    subtopic: "top K",
    concepts: ["Frequency Map", "Bucket Sort O(n)", "Min-Heap O(n log k)"],
    type: "complexity",
    question: "What is the optimal time complexity to find top k frequent elements using Bucket Sort (array of frequency buckets)?",
    options: [
      { id: "A", text: "O(n) time and O(n) space" },
      { id: "B", text: "O(n log n)" },
      { id: "C", text: "O(n^2)" },
      { id: "D", text: "O(k log n)" }
    ],
    correctOption: "A",
    explanation: "Since maximum frequency is bounded by array length n, indexing frequencies into `buckets[count]` allows gathering top k elements in linear O(n) time.",
    expectedTimeSeconds: 70
  },
  {
    title: "Find Median from Data Stream (Two Heaps Pattern)",
    difficulty: "hard",
    topic: "heap",
    subtopic: "min heap",
    concepts: ["Max-Heap and Min-Heap", "Dynamic Median", "O(log n) Insert / O(1) Median"],
    type: "conceptual",
    question: "In the Two Heaps pattern for finding the median of a stream, how are elements partitioned?",
    options: [
      { id: "A", text: "Max-heap stores smaller half of numbers; Min-heap stores larger half; sizes differ by at most 1" },
      { id: "B", text: "Both heaps store all numbers" },
      { id: "C", text: "One heap stores even numbers, one stores odd" },
      { id: "D", text: "Min-heap stores indices only" }
    ],
    correctOption: "A",
    explanation: "Max-heap gives the largest of the lower half in O(1); Min-heap gives the smallest of the upper half in O(1). Median is either maxHeap.top or average of both tops.",
    expectedTimeSeconds: 85
  },
  {
    title: "Merge K Sorted Lists via Priority Queue",
    difficulty: "hard",
    topic: "heap",
    subtopic: "merge K",
    concepts: ["Priority Queue", "K-way Merge", "Space Complexity"],
    type: "complexity",
    question: "What is the maximum space complexity of the Min-Heap when merging `K` sorted lists?",
    options: [
      { id: "A", text: "O(K) — stores at most 1 node per list at any time" },
      { id: "B", text: "O(N) where N is total nodes" },
      { id: "C", text: "O(K^2)" },
      { id: "D", text: "O(1)" }
    ],
    correctOption: "A",
    explanation: "The heap only contains the current head pointer of each of the K lists. Hence, its size never exceeds K.",
    expectedTimeSeconds: 55
  },
  {
    title: "Task Scheduler with Cooling Interval (Greedy + Heap)",
    difficulty: "medium",
    topic: "heap",
    subtopic: "max heap",
    concepts: ["Frequency Heap", "Cooling Queue", "Idle Slots"],
    type: "conceptual",
    question: "In Task Scheduler with cooldown `n`, which tasks should be scheduled first greedily?",
    options: [
      { id: "A", text: "Tasks with the highest remaining frequency (popped from max-heap)" },
      { id: "B", text: "Tasks with lowest frequency" },
      { id: "C", text: "Tasks in alphabetical order" },
      { id: "D", text: "Random tasks" }
    ],
    correctOption: "A",
    explanation: "Scheduling the most frequent tasks first prevents remaining high-frequency tasks from bottlenecking the CPU into excessive idle cooling cycles.",
    expectedTimeSeconds: 70
  },
  {
    title: "Reorganize String (No Adjacent Identical Characters)",
    difficulty: "medium",
    topic: "heap",
    subtopic: "max heap",
    concepts: ["Max Heap", "Pebble Principle", "Cooldown Variable"],
    type: "conceptual",
    question: "When is it impossible to reorganize a string of length `L` so no two adjacent characters are the same?",
    options: [
      { id: "A", text: "When any single character has frequency > (L + 1) / 2" },
      { id: "B", text: "When string length is odd" },
      { id: "C", text: "When string contains more than 10 distinct characters" },
      { id: "D", text: "When all characters are distinct" }
    ],
    correctOption: "A",
    explanation: "By the Pigeonhole Principle, if the most frequent character appears more than `(L + 1) / 2` times, at least two occurrences must sit adjacent to each other.",
    expectedTimeSeconds: 65
  },

  // ────────────────── GREEDY (8 questions) ──────────────────
  {
    title: "Greedy Choice Property vs Optimal Substructure",
    difficulty: "easy",
    topic: "greedy",
    subtopic: "local optimization",
    concepts: ["Greedy Algorithm", "Local vs Global Optimum", "Matroid Theory"],
    type: "conceptual",
    question: "What is the core characteristic of a Greedy algorithm?",
    options: [
      { id: "A", text: "Makes locally optimal choices at each step with no backtracking, hoping to yield a globally optimal solution" },
      { id: "B", text: "Explores all possible combinations with recursion" },
      { id: "C", text: "Guarantees optimal solution on every computational problem" },
      { id: "D", text: "Requires exponential memory" }
    ],
    correctOption: "A",
    explanation: "Greedy algorithms make irrevocable local optimal decisions at each stage without re-evaluating past choices.",
    expectedTimeSeconds: 45
  },
  {
    title: "Non-Overlapping Intervals (Interval Scheduling)",
    difficulty: "medium",
    topic: "greedy",
    subtopic: "interval scheduling",
    concepts: ["Interval Scheduling", "Sort by End Time", "Greedy Proof"],
    type: "conceptual",
    question: "To maximize the number of compatible non-overlapping intervals, how should the intervals be sorted?",
    options: [
      { id: "A", text: "Sorted ascending by their END time (`interval[1]`)" },
      { id: "B", text: "Sorted ascending by their START time" },
      { id: "C", text: "Sorted by interval duration" },
      { id: "D", text: "Sorted descending by start time" }
    ],
    correctOption: "A",
    explanation: "Selecting the interval that finishes earliest leaves the maximum remaining time available for subsequent compatible intervals.",
    expectedTimeSeconds: 65
  },
  {
    title: "Merge Intervals Overlap Condition",
    difficulty: "medium",
    topic: "greedy",
    subtopic: "interval scheduling",
    concepts: ["Merge Intervals", "Sort by Start Time", "Linear Merge"],
    type: "code-output",
    question: "After sorting intervals by `start` time, what condition indicates that `currentInterval` overlaps with `prevMergedInterval`?",
    options: [
      { id: "A", text: "`current.start <= prevMerged.end`" },
      { id: "B", text: "`current.start > prevMerged.end`" },
      { id: "C", text: "`current.end == prevMerged.start`" },
      { id: "D", text: "`current.start == 0`" }
    ],
    correctOption: "A",
    explanation: "Because intervals are sorted by start time, an overlap occurs if and only if the current interval begins at or before the previous interval finishes.",
    expectedTimeSeconds: 60
  },
  {
    title: "Jump Game (Reachable Furthest Index)",
    difficulty: "medium",
    topic: "greedy",
    subtopic: "local optimization",
    concepts: ["Greedy Furthest Reach", "O(n) Single Pass", "O(1) Space"],
    type: "code-output",
    question: "In Jump Game I, what condition means we CANNOT reach the final index?",
    codeSnippet: "for (int i = 0; i < nums.length; i++) {\n  if (i > maxReach) return false;\n  maxReach = max(maxReach, i + nums[i]);\n}",
    options: [
      { id: "A", text: "When current index `i > maxReach` (we reached an unreachable point)" },
      { id: "B", text: "When nums[i] == 0" },
      { id: "C", text: "When maxReach < nums.length" },
      { id: "D", text: "When array length is even" }
    ],
    correctOption: "A",
    explanation: "If loop index `i` exceeds `maxReach`, it means index `i` is impossible to reach from any previous jump, so we return false.",
    expectedTimeSeconds: 55
  },
  {
    title: "Gas Station Circular Tour (Greedy Reset)",
    difficulty: "medium",
    topic: "greedy",
    subtopic: "sorting-based greedy",
    concepts: ["Circular Array", "Net Surplus", "O(n) Greedy Single Pass"],
    type: "conceptual",
    question: "In Gas Station, if running fuel `currentTank < 0` at station `i`, why can the starting station NOT be any station between `start` and `i`?",
    options: [
      { id: "A", text: "Any intermediate station had a non-negative fuel contribution; starting from it would only provide LESS initial fuel than starting from `start`" },
      { id: "B", text: "Because stations are sorted by price" },
      { id: "C", text: "Because gas prices decrease clockwise" },
      { id: "D", text: "It is an arbitrary assumption" }
    ],
    correctOption: "A",
    explanation: "Since starting at `start` entered every intermediate station `k` with >= 0 gas and still failed at `i`, starting at `k` with 0 initial gas is guaranteed to fail by station `i`.",
    expectedTimeSeconds: 80
  },
  {
    title: "Fractional Knapsack vs 0/1 Knapsack",
    difficulty: "easy",
    topic: "greedy",
    subtopic: "sorting-based greedy",
    concepts: ["Value to Weight Ratio", "Fractional Knapsack", "Greedy Optimality"],
    type: "conceptual",
    question: "Why does sorting by value/weight ratio work for Fractional Knapsack but FAILS for 0/1 Knapsack?",
    options: [
      { id: "A", text: "Fractional knapsack can take fractional pieces to fill remaining capacity completely; 0/1 knapsack leaves empty unusable gaps" },
      { id: "B", text: "0/1 knapsack items have no weight" },
      { id: "C", text: "Fractional knapsack requires DP" },
      { id: "D", text: "Because 0/1 knapsack has negative weights" }
    ],
    correctOption: "A",
    explanation: "0/1 Knapsack is NP-complete and requires DP because taking a high-ratio item may preclude a combination of slightly lower-ratio items that fill capacity better.",
    expectedTimeSeconds: 65
  },
  {
    title: "Candy Distribution (Two Passes)",
    difficulty: "hard",
    topic: "greedy",
    subtopic: "local optimization",
    concepts: ["Two-Pass Greedy", "Left-to-Right and Right-to-Left", "O(n) Time"],
    type: "conceptual",
    question: "In the Candy distribution problem, why are two passes (left-to-right, then right-to-left) necessary?",
    options: [
      { id: "A", text: "Pass 1 satisfies condition against left neighbors; Pass 2 satisfies condition against right neighbors using `max(candies[i], candies[i+1] + 1)`" },
      { id: "B", text: "To sort the children by rating" },
      { id: "C", text: "To find the average rating" },
      { id: "D", text: "To avoid negative candies" }
    ],
    correctOption: "A",
    explanation: "A child's rating constraint depends on BOTH left and right neighbors. Two directional passes resolve both local slope constraints in O(n) total time.",
    expectedTimeSeconds: 80
  },
  {
    title: "Assign Cookies Greedy Match",
    difficulty: "easy",
    topic: "greedy",
    subtopic: "sorting-based greedy",
    concepts: ["Greedy Pairing", "Two Pointers", "Sorting"],
    type: "conceptual",
    question: "To maximize content children, how should greed factor `g` and cookie sizes `s` be processed?",
    options: [
      { id: "A", text: "Sort both arrays; give the smallest cookie that satisfies each child with the smallest greed factor" },
      { id: "B", text: "Give the largest cookie to the child with smallest greed" },
      { id: "C", text: "Pick cookies at random" },
      { id: "D", text: "Divide total cookies by total children" }
    ],
    correctOption: "A",
    explanation: "Matching the smallest viable cookie to the least greedy child preserves larger cookies for children with higher greed demands.",
    expectedTimeSeconds: 45
  },

  // ────────────────── GRAPHS (12 questions) ──────────────────
  {
    title: "Graph Representation (Adjacency Matrix vs Adjacency List)",
    difficulty: "easy",
    topic: "graphs",
    subtopic: "connected components",
    concepts: ["Adjacency List", "Adjacency Matrix", "Sparse Graphs"],
    type: "complexity",
    question: "For a sparse graph with V vertices and E edges where E << V^2, what is the space complexity of an Adjacency List vs Adjacency Matrix?",
    options: [
      { id: "A", text: "List: O(V + E), Matrix: O(V^2)" },
      { id: "B", text: "List: O(V^2), Matrix: O(V + E)" },
      { id: "C", text: "Both O(V * E)" },
      { id: "D", text: "Both O(V^2)" }
    ],
    correctOption: "A",
    explanation: "Adjacency list allocates memory proportional to actual existing edges O(V + E), saving massive memory over a full V x V matrix when E is small.",
    expectedTimeSeconds: 50
  },
  {
    title: "Breadth-First Search (BFS) vs DFS Time Complexity",
    difficulty: "easy",
    topic: "graphs",
    subtopic: "BFS",
    concepts: ["Graph Traversal", "O(V + E) Complexity", "Visited Set"],
    type: "complexity",
    question: "What is the time complexity of standard BFS / DFS on a directed graph represented with an adjacency list?",
    options: [
      { id: "A", text: "O(V + E)" },
      { id: "B", text: "O(V * E)" },
      { id: "C", text: "O(V^2)" },
      { id: "D", text: "O(E log V)" }
    ],
    correctOption: "A",
    explanation: "Each vertex is enqueued/visited once (O(V)), and each edge in its adjacency list is traversed once (O(E)), summing to O(V + E).",
    expectedTimeSeconds: 45
  },
  {
    title: "Number of Connected Components in Undirected Graph",
    difficulty: "medium",
    topic: "graphs",
    subtopic: "connected components",
    concepts: ["DFS / BFS", "Disjoint Components", "Visited Array"],
    type: "code-output",
    question: "How do you count the number of connected components in an undirected graph?",
    options: [
      { id: "A", text: "Iterate from vertex 0 to V-1; whenever `!visited[i]`, increment count and run DFS/BFS to mark all reachable nodes" },
      { id: "B", text: "Divide total edges by 2" },
      { id: "C", text: "Count leaf nodes" },
      { id: "D", text: "Count vertices with odd degree" }
    ],
    correctOption: "A",
    explanation: "Each unvisited vertex found in the outer loop represents the start of a distinct connected component. DFS explores all its members.",
    expectedTimeSeconds: 55
  },
  {
    title: "Cycle Detection in Directed Graph using 3 Colors / Recursion Stack",
    difficulty: "medium",
    topic: "graphs",
    subtopic: "cycle detection",
    concepts: ["Directed Cycle", "Back Edge", "3-Color DFS (White, Gray, Black)"],
    type: "conceptual",
    question: "In DFS on a DIRECTED graph, when is a cycle detected?",
    options: [
      { id: "A", text: "When exploring an edge to a vertex currently in the active recursion call stack (GRAY / visited in current path)" },
      { id: "B", text: "When exploring an edge to any previously visited node" },
      { id: "C", text: "When a vertex has in-degree > 2" },
      { id: "D", text: "When graph is disconnected" }
    ],
    correctOption: "A",
    explanation: "Encountering a back-edge pointing to an ancestor currently on the recursion stack (Gray) forms a directed cycle.",
    expectedTimeSeconds: 70
  },
  {
    title: "Topological Sort via Kahn's Algorithm (BFS In-Degree)",
    difficulty: "medium",
    topic: "graphs",
    subtopic: "topological sort",
    concepts: ["DAG", "In-Degree Array", "Kahn's BFS"],
    type: "code-output",
    question: "In Kahn's Algorithm for Topological Sort, which vertices are initially pushed to the BFS queue?",
    options: [
      { id: "A", text: "All vertices with `inDegree == 0` (no prerequisite dependencies)" },
      { id: "B", text: "All vertices with outDegree == 0" },
      { id: "C", text: "The vertex with the highest degree" },
      { id: "D", text: "Vertex 0 always" }
    ],
    correctOption: "A",
    explanation: "Vertices with inDegree 0 have no incoming prerequisites and can be processed immediately. As each vertex is popped, we decrement its neighbors' inDegrees.",
    expectedTimeSeconds: 65
  },
  {
    title: "Dijkstra's Shortest Path Algorithm & Priority Queue",
    difficulty: "medium",
    topic: "graphs",
    subtopic: "shortest path",
    concepts: ["Dijkstra", "Min-Heap", "Non-Negative Edge Weights", "O(E log V)"],
    type: "complexity",
    question: "What is the time complexity of Dijkstra's Algorithm implemented with a binary min-heap for a graph with V vertices and E edges?",
    options: [
      { id: "A", text: "O((V + E) log V) or O(E log V)" },
      { id: "B", text: "O(V^2)" },
      { id: "C", text: "O(V * E)" },
      { id: "D", text: "O(V + E)" }
    ],
    correctOption: "A",
    explanation: "Each vertex is extracted from the min-heap in O(log V) time (V total), and each edge relaxation pushes a distance update in O(log V) time (E total), giving O(E log V).",
    expectedTimeSeconds: 65
  },
  {
    title: "Dijkstra Failure on Negative Edge Weights",
    difficulty: "medium",
    topic: "graphs",
    subtopic: "shortest path",
    concepts: ["Negative Edge Weights", "Bellman-Ford", "Greedy Invariant"],
    type: "conceptual",
    question: "Why does Dijkstra's Algorithm FAIL on graphs with negative edge weights?",
    options: [
      { id: "A", text: "Dijkstra greedily assumes once a vertex is finalized (popped from min-heap), its shortest path cannot be reduced; negative edges violate this assumption" },
      { id: "B", text: "Priority queues cannot store negative numbers" },
      { id: "C", text: "Negative edges create infinite loops in all graphs" },
      { id: "D", text: "It causes stack overflow" }
    ],
    correctOption: "A",
    explanation: "Dijkstra marks a node's distance as permanent once popped. A negative edge encountered later could produce a shorter path to a previously finalized node.",
    expectedTimeSeconds: 70
  },
  {
    title: "Bellman-Ford Algorithm Edge Relaxation Passes",
    difficulty: "hard",
    topic: "graphs",
    subtopic: "shortest path",
    concepts: ["Bellman-Ford", "Negative Cycle Detection", "V-1 Relaxations"],
    type: "conceptual",
    question: "Why does Bellman-Ford relax all edges exactly `V - 1` times, and what does a further distance decrease on the V-th pass indicate?",
    options: [
      { id: "A", text: "A simple shortest path contains at most V-1 edges; a decrease on pass V proves the existence of a negative weight cycle" },
      { id: "B", text: "To guarantee average O(1) time" },
      { id: "C", text: "V-1 is the number of vertices" },
      { id: "D", text: "Pass V re-initializes visited array" }
    ],
    correctOption: "A",
    explanation: "Any simple path between vertices has at most V-1 edges. If any edge can still be relaxed on iteration V, distance can decrease indefinitely, indicating a negative cycle.",
    expectedTimeSeconds: 85
  },
  {
    title: "Course Schedule II (Order of Completion)",
    difficulty: "medium",
    topic: "graphs",
    subtopic: "topological sort",
    concepts: ["Kahn's Algorithm", "Topological Ordering", "Cycle Detection"],
    type: "conceptual",
    question: "In Course Schedule, how do we confirm all courses can be finished?",
    options: [
      { id: "A", text: "The number of courses processed in the topological order equals total courses `numCourses` (no cycle present)" },
      { id: "B", text: "Total prerequisites is less than numCourses" },
      { id: "C", text: "Course 0 has in-degree 0" },
      { id: "D", text: "The graph is a tree" }
    ],
    correctOption: "A",
    explanation: "If a cycle exists in the dependency DAG, nodes in the cycle will never reach inDegree 0 and won't be queued, resulting in `processedCount < numCourses`.",
    expectedTimeSeconds: 65
  },
  {
    title: "Flood Fill / Island Count Grid Graph Modeling",
    difficulty: "easy",
    topic: "graphs",
    subtopic: "DFS",
    concepts: ["Grid as Graph", "4-Directional Neighbors", "In-Place Modification"],
    type: "conceptual",
    question: "When modeling an M x N grid of 1s (land) and 0s (water) as a graph, how many maximum neighbors does each cell have?",
    options: [
      { id: "A", text: "4 neighbors (Up, Down, Left, Right) in standard adjacent connectivity" },
      { id: "B", text: "8 neighbors always" },
      { id: "C", text: "M * N neighbors" },
      { id: "D", text: "2 neighbors" }
    ],
    correctOption: "A",
    explanation: "Grid cells connect to top, bottom, left, right orthogonal neighbors. Boundary checks prevent out-of-bounds array access.",
    expectedTimeSeconds: 40
  },
  {
    title: "Alien Dictionary Character Order Deduction",
    difficulty: "hard",
    topic: "graphs",
    subtopic: "topological sort",
    concepts: ["First Mismatch Character", "Dependency Graph", "Topological Sort"],
    type: "conceptual",
    question: "In Alien Dictionary, how is a directed edge `u -> v` constructed from adjacent sorted words `w1` and `w2`?",
    options: [
      { id: "A", text: "Find the FIRST mismatched character index `k` where `w1[k] != w2[k]`, and add directed edge `w1[k] -> w2[k]`" },
      { id: "B", text: "Add edges between all character pairs in both words" },
      { id: "C", text: "Compare lengths of words" },
      { id: "D", text: "Add edge from first letter of w1 to last letter of w2" }
    ],
    correctOption: "A",
    explanation: "Lexicographical order is decided exclusively by the first differing character between adjacent dictionary words.",
    expectedTimeSeconds: 90
  },
  {
    title: "Bipartite Graph Verification (2-Coloring)",
    difficulty: "medium",
    topic: "graphs",
    subtopic: "BFS",
    concepts: ["2-Coloring", "Odd Cycle", "Bipartite Graph"],
    type: "conceptual",
    question: "A graph is bipartite IF AND ONLY IF it contains:",
    options: [
      { id: "A", text: "NO cycles of odd length (can be 2-colored such that no adjacent vertices share the same color)" },
      { id: "B", text: "No cycles of any length" },
      { id: "C", text: "An even number of vertices" },
      { id: "D", text: "No directed edges" }
    ],
    correctOption: "A",
    explanation: "A graph can be partitioned into two independent sets (2-colored) if and only if it has no odd-length cycles.",
    expectedTimeSeconds: 70
  },

  // ────────────────── DYNAMIC PROGRAMMING (14 questions) ──────────────────
  {
    title: "Climbing Stairs Fibonacci Recurrence",
    difficulty: "easy",
    topic: "dp",
    subtopic: "1D DP",
    concepts: ["Fibonacci Sequence", "Space Optimization O(1)", "Overlapping Subproblems"],
    type: "code-output",
    question: "If you can climb 1 or 2 steps at a time, what is the state transition for `dp[i]` (ways to reach step i)?",
    codeSnippet: "dp[i] = dp[i - 1] + dp[i - 2];",
    options: [
      { id: "A", text: "dp[i] = dp[i-1] + dp[i-2] with base cases dp[1] = 1, dp[2] = 2" },
      { id: "B", text: "dp[i] = dp[i-1] * dp[i-2]" },
      { id: "C", text: "dp[i] = 2 * dp[i-1]" },
      { id: "D", text: "dp[i] = min(dp[i-1], dp[i-2]) + 1" }
    ],
    correctOption: "A",
    explanation: "To arrive at step i, the last move was either a 1-step from (i-1) or a 2-step from (i-2). Total ways is `dp[i-1] + dp[i-2]`.",
    expectedTimeSeconds: 45
  },
  {
    title: "House Robber State Transition & Space Optimization",
    difficulty: "medium",
    topic: "dp",
    subtopic: "1D DP",
    concepts: ["Non-adjacent Constraint", "Space Optimization", "1D DP"],
    type: "code-output",
    question: "In House Robber, how is the optimal decision represented at house `i`?",
    codeSnippet: "dp[i] = max(dp[i - 1], nums[i] + dp[i - 2]);",
    options: [
      { id: "A", text: "max(skip current house `dp[i-1]`, rob current house `nums[i] + dp[i-2]`)" },
      { id: "B", text: "nums[i] + dp[i-1]" },
      { id: "C", text: "max(nums[i], dp[i-1])" },
      { id: "D", text: "dp[i-1] + dp[i-2]" }
    ],
    correctOption: "A",
    explanation: "You can either skip house i (retaining maximum loot up to i-1) or rob house i (gaining nums[i] plus maximum loot up to i-2).",
    expectedTimeSeconds: 60
  },
  {
    title: "Coin Change (Minimum Coins) State Transition",
    difficulty: "medium",
    topic: "dp",
    subtopic: "knapsack",
    concepts: ["Unbounded Knapsack", "Min Optimization", "Bottom-Up DP"],
    type: "code-output",
    question: "What is the DP transition for `dp[a]` representing minimum coins needed to make amount `a`?",
    codeSnippet: "for (int coin : coins) {\n  if (a >= coin) {\n    dp[a] = min(dp[a], 1 + dp[a - coin]);\n  }\n}",
    options: [
      { id: "A", text: "dp[a] = min(dp[a], 1 + dp[a - coin]) for all valid coins" },
      { id: "B", text: "dp[a] = sum(dp[a - coin])" },
      { id: "C", text: "dp[a] = dp[a - coin]" },
      { id: "D", text: "dp[a] = a / coin" }
    ],
    correctOption: "A",
    explanation: "If you take coin `c`, you use 1 coin plus the optimal solution to the subproblem `dp[a - c]`. Minimizing over all available coins finds the optimal solution.",
    expectedTimeSeconds: 70
  },
  {
    title: "Longest Increasing Subsequence (LIS) DP vs Binary Search",
    difficulty: "medium",
    topic: "dp",
    subtopic: "LIS",
    concepts: ["LIS", "O(n^2) DP", "O(n log n) Patience Sorting"],
    type: "complexity",
    question: "What are the time complexities of standard nested DP vs Patience Sorting with Binary Search (Piles) for LIS?",
    options: [
      { id: "A", text: "DP: O(n^2), Patience Sorting: O(n log n)" },
      { id: "B", text: "DP: O(n log n), Patience Sorting: O(n^2)" },
      { id: "C", text: "Both O(n)" },
      { id: "D", text: "Both O(2^n)" }
    ],
    correctOption: "A",
    explanation: "DP compares every pair of indices (i, j) in O(n^2). Patience sorting maintains smallest tail values of increasing subsequences with binary search in O(n log n).",
    expectedTimeSeconds: 65
  },
  {
    title: "0/1 Knapsack 1D Array Space Optimization Direction",
    difficulty: "medium",
    topic: "dp",
    subtopic: "knapsack",
    concepts: ["0/1 Knapsack", "1D Space Optimization", "Reverse Iteration"],
    type: "conceptual",
    question: "When optimizing 0/1 Knapsack space from 2D `dp[n][W]` to 1D `dp[W]`, in which direction must the weight loop iterate and why?",
    options: [
      { id: "A", text: "From capacity W DOWN to item weight (reverse), to prevent using the same item multiple times in the same row" },
      { id: "B", text: "From 0 up to W (forward)" },
      { id: "C", text: "In random order" },
      { id: "D", text: "Direction does not matter" }
    ],
    correctOption: "A",
    explanation: "Iterating backwards ensures `dp[w - weight]` represents values from the PREVIOUS item iteration, ensuring each item is taken at most once (0/1 constraint). Forward loop solves Unbounded Knapsack.",
    expectedTimeSeconds: 80
  },
  {
    title: "Longest Common Subsequence (LCS) State Transition",
    difficulty: "medium",
    topic: "dp",
    subtopic: "subsequence",
    concepts: ["2D DP", "LCS Table", "Character Match Case"],
    type: "code-output",
    question: "In the LCS algorithm for strings text1 and text2, what is the recurrence when `text1[i-1] == text2[j-1]` vs when they differ?",
    options: [
      { id: "A", text: "Match: `1 + dp[i-1][j-1]`, Mismatch: `max(dp[i-1][j], dp[i][j-1])`" },
      { id: "B", text: "Match: `dp[i-1][j-1]`, Mismatch: 0" },
      { id: "C", text: "Match: `1 + dp[i][j]`, Mismatch: -1" },
      { id: "D", text: "Match: `2 + dp[i-1][j-1]`" }
    ],
    correctOption: "A",
    explanation: "If characters match, extend the diagonal subproblem by 1. If they differ, take the best subsequence obtainable by dropping one char from either text1 or text2.",
    expectedTimeSeconds: 70
  },
  {
    title: "Edit Distance (Levenshtein Distance) Operations",
    difficulty: "hard",
    topic: "dp",
    subtopic: "2D DP",
    concepts: ["Edit Distance", "Insert, Delete, Replace", "2D Table"],
    type: "code-output",
    question: "When `word1[i-1] != word2[j-1]`, what formula computes `dp[i][j]` from Insert, Delete, and Replace subproblems?",
    options: [
      { id: "A", text: "`1 + min(dp[i][j-1] (Insert), dp[i-1][j] (Delete), dp[i-1][j-1] (Replace))`" },
      { id: "B", text: "`dp[i-1][j-1] + 1` only" },
      { id: "C", text: "`dp[i][j-1] + dp[i-1][j]`" },
      { id: "D", text: "`max(dp[i-1][j], dp[i][j-1])`" }
    ],
    correctOption: "A",
    explanation: "The minimum edit cost is 1 operation plus the minimum cost of insert (`dp[i][j-1]`), delete (`dp[i-1][j]`), or replace (`dp[i-1][j-1]`).",
    expectedTimeSeconds: 85
  },
  {
    title: "Unique Paths in a Grid State Transition",
    difficulty: "easy",
    topic: "dp",
    subtopic: "grid DP",
    concepts: ["Grid Paths", "Combinatorics", "2D DP"],
    type: "code-output",
    question: "For a robot moving only Right or Down, what is the number of ways to reach cell `(i, j)`?",
    options: [
      { id: "A", text: "`dp[i][j] = dp[i-1][j] + dp[i][j-1]`" },
      { id: "B", text: "`dp[i][j] = dp[i-1][j] * dp[i][j-1]`" },
      { id: "C", text: "`dp[i][j] = max(dp[i-1][j], dp[i][j-1])`" },
      { id: "D", text: "`dp[i][j] = i + j`" }
    ],
    correctOption: "A",
    explanation: "Cell (i, j) can only be entered from the cell directly above `(i-1, j)` or the cell directly to the left `(i, j-1)`. Total paths is the sum of both.",
    expectedTimeSeconds: 45
  },
  {
    title: "Maximum Subarray Sum with Circular Array",
    difficulty: "medium",
    topic: "dp",
    subtopic: "1D DP",
    concepts: ["Kadane Extension", "Total Sum - Min Subarray", "All-Negative Edge Case"],
    type: "conceptual",
    question: "In Maximum Circular Subarray Sum, how is the circular wraparound maximum subarray sum computed?",
    options: [
      { id: "A", text: "`totalSum - minSubarraySum` (unless all numbers are negative, then return standard maxSubarray)" },
      { id: "B", text: "Sum of all positive numbers" },
      { id: "C", text: "Standard Kadane on array concatenated with itself in O(n^2)" },
      { id: "D", text: "totalSum * 2" }
    ],
    correctOption: "A",
    explanation: "A circular max subarray wraps around ends, leaving an inverted contiguous MINIMUM subarray in the center. Subtracting `minSubarraySum` from `totalSum` calculates it in O(n).",
    expectedTimeSeconds: 75
  },
  {
    title: "Word Break (DP with Dictionary Lookup)",
    difficulty: "medium",
    topic: "dp",
    subtopic: "state transitions",
    concepts: ["Word Segmentation", "Boolean DP Array", "HashSet"],
    type: "conceptual",
    question: "In Word Break, what does `dp[i] = true` represent?",
    options: [
      { id: "A", text: "The prefix `s[0..i-1]` can be segmented into a space-separated sequence of dictionary words" },
      { id: "B", text: "Word at index i exists in dictionary" },
      { id: "C", text: "The entire string is valid" },
      { id: "D", text: "String has length i" }
    ],
    correctOption: "A",
    explanation: "`dp[i]` is true if there exists some split point `j < i` such that `dp[j]` is true AND substring `s[j..i-1]` is in the dictionary.",
    expectedTimeSeconds: 65
  },
  {
    title: "Best Time to Buy and Sell Stock with Cooldown",
    difficulty: "hard",
    topic: "dp",
    subtopic: "state transitions",
    concepts: ["State Machine DP", "Hold, Sold, Rest States"],
    type: "conceptual",
    question: "In Stock Trading with a 1-day cooldown after selling, which 3 states are tracked at day `i`?",
    options: [
      { id: "A", text: "`hold` (own stock), `sold` (just sold today), `rest` (idle / cooldown over)" },
      { id: "B", text: "Buy, Sell, Wait" },
      { id: "C", text: "Positive, Negative, Zero" },
      { id: "D", text: "Single balance variable" }
    ],
    correctOption: "A",
    explanation: "State machine transitions: `hold = max(prev_hold, prev_rest - price)`, `sold = prev_hold + price`, `rest = max(prev_rest, prev_sold)`.",
    expectedTimeSeconds: 85
  },
  {
    title: "Partition Equal Subset Sum (Subset Sum DP)",
    difficulty: "medium",
    topic: "dp",
    subtopic: "knapsack",
    concepts: ["Subset Sum", "Target = Sum / 2", "Parity Check"],
    type: "conceptual",
    question: "Partition Equal Subset Sum is equivalent to finding a subset summing to what target value?",
    options: [
      { id: "A", text: "`sum(nums) / 2` (and immediately returning false if sum is odd)" },
      { id: "B", text: "`max(nums)`" },
      { id: "C", text: "`sum(nums)`" },
      { id: "D", text: "`nums.length / 2`" }
    ],
    correctOption: "A",
    explanation: "If total sum is odd, it cannot be divided into two equal integers. If even, we run 0/1 Knapsack to test if a subset summing to `sum / 2` exists.",
    expectedTimeSeconds: 60
  },
  {
    title: "Matrix Chain Multiplication (Interval DP)",
    difficulty: "hard",
    topic: "dp",
    subtopic: "2D DP",
    concepts: ["Interval DP", "Split Point K", "O(n^3) MCM"],
    type: "complexity",
    question: "What is the time complexity of solving Matrix Chain Multiplication with `n` matrices using dynamic programming?",
    options: [
      { id: "A", text: "O(n^3) time and O(n^2) space" },
      { id: "B", text: "O(n^2)" },
      { id: "C", text: "O(2^n)" },
      { id: "D", text: "O(n log n)" }
    ],
    correctOption: "A",
    explanation: "There are O(n^2) interval states `(i, j)`. For each interval of length `L`, we iterate through all `k` split points from `i` to `j-1` (O(n)), giving O(n^3) total operations.",
    expectedTimeSeconds: 85
  },
  {
    title: "Burst Balloons (Interval DP Reversed Thinking)",
    difficulty: "hard",
    topic: "dp",
    subtopic: "2D DP",
    concepts: ["Interval DP", "Last Balloon Burst", "Subproblem Independence"],
    type: "conceptual",
    question: "Why do we think of balloon `k` as the LAST balloon to burst in range `(i, j)` rather than the first?",
    options: [
      { id: "A", text: "Bursting balloon k last guarantees boundaries `nums[i]` and `nums[j]` remain fixed, creating two independent subproblems `(i, k)` and `(k, j)`" },
      { id: "B", text: "Because bursting first is faster to compute" },
      { id: "C", text: "Because balloon values decrease" },
      { id: "D", text: "To sort the balloons" }
    ],
    correctOption: "A",
    explanation: "Bursting first makes subproblems interdependent because balloons on either side become new adjacent neighbors. Bursting last cleanly decouples left and right intervals.",
    expectedTimeSeconds: 95
  },

  // ────────────────── BIT MANIPULATION (6 questions) ──────────────────
  {
    title: "Single Number (All Elements Twice Except One)",
    difficulty: "easy",
    topic: "bit-manipulation",
    subtopic: "XOR",
    concepts: ["XOR Properties", "Self-Inverse (x ^ x = 0)", "Identity (x ^ 0 = x)"],
    type: "code-output",
    question: "Why does cumulative XOR `result ^= num` over the whole array find the unique element in O(n) time and O(1) space?",
    options: [
      { id: "A", text: "XOR is commutative and associative; duplicate pairs cancel each other (`x ^ x = 0`), leaving only `0 ^ unique = unique`" },
      { id: "B", text: "XOR adds all numbers together" },
      { id: "C", text: "XOR sorts the bits in ascending order" },
      { id: "D", text: "XOR converts numbers to binary strings" }
    ],
    correctOption: "A",
    explanation: "`a ^ b ^ a = (a ^ a) ^ b = 0 ^ b = b`. Every duplicate number XORs with itself to 0, isolating the single unique value.",
    expectedTimeSeconds: 40
  },
  {
    title: "Brian Kernighan's Algorithm (Counting Set Bits)",
    difficulty: "easy",
    topic: "bit-manipulation",
    subtopic: "set bits",
    concepts: ["Brian Kernighan", "n & (n - 1)", "Clearing Lowest Set Bit"],
    type: "code-output",
    question: "What does the operation `n & (n - 1)` do to binary integer `n`?",
    options: [
      { id: "A", text: "Clears (turns to 0) the lowest / rightmost set bit (1) of `n`" },
      { id: "B", text: "Doubles the number" },
      { id: "C", text: "Inverts all bits" },
      { id: "D", text: "Extracts the sign bit" }
    ],
    correctOption: "A",
    explanation: "Subtracting 1 flips all bits up to and including the lowest set bit. Bitwise ANDing with original `n` zeros out that lowest 1-bit.",
    expectedTimeSeconds: 45
  },
  {
    title: "Power of Two Verification in O(1)",
    difficulty: "easy",
    topic: "bit-manipulation",
    subtopic: "powers of two",
    concepts: ["Single Set Bit", "Bitwise Trick"],
    type: "code-output",
    question: "Which one-line bitwise expression checks if positive integer `n > 0` is a power of two?",
    options: [
      { id: "A", text: "`n > 0 && (n & (n - 1)) == 0`" },
      { id: "B", text: "`n % 2 == 0`" },
      { id: "C", text: "`n & 1 == 0`" },
      { id: "D", text: "`n ^ (n - 1) == 0`" }
    ],
    correctOption: "A",
    explanation: "A power of two in binary has exactly one '1' bit (e.g. 8 is 1000). Subtracting 1 yields 0111. Their AND is 0000.",
    expectedTimeSeconds: 40
  },
  {
    title: "Counting Bits from 0 to N in O(n) DP",
    difficulty: "medium",
    topic: "bit-manipulation",
    subtopic: "set bits",
    concepts: ["Bitwise DP", "Right Shift", "Parity Bit"],
    type: "code-output",
    question: "What is the DP transition to calculate number of set bits `ans[i]` for number `i` in O(1) from smaller subproblems?",
    options: [
      { id: "A", text: "`ans[i] = ans[i >> 1] + (i & 1)`" },
      { id: "B", text: "`ans[i] = ans[i - 1] + 1`" },
      { id: "C", text: "`ans[i] = ans[i / 2] * 2`" },
      { id: "D", text: "`ans[i] = ans[i & (i - 1)] + 2`" }
    ],
    correctOption: "A",
    explanation: "Shifting right `i >> 1` removes the least significant bit. The number of set bits in `i` is set bits in `i >> 1` plus the lowest bit `(i & 1)`.",
    expectedTimeSeconds: 60
  },
  {
    title: "Single Number III (Two Unique Numbers via Lowest Differing Bit)",
    difficulty: "medium",
    topic: "bit-manipulation",
    subtopic: "bit masking",
    concepts: ["XOR Partitioning", "Lowest Set Bit Isolation `xor & -xor`"],
    type: "conceptual",
    question: "In an array where exactly two numbers appear once and all others twice, how do we partition the numbers into two separate groups?",
    options: [
      { id: "A", text: "Compute total XOR `diff = a ^ b`, isolate any set bit `mask = diff & -diff`, then partition array into elements having that bit set vs unset" },
      { id: "B", text: "Sort the array in O(n log n)" },
      { id: "C", text: "Partition by even and odd indices" },
      { id: "D", text: "Partition by greater than average" }
    ],
    correctOption: "A",
    explanation: "Because a != b, `diff = a ^ b != 0`. Isolate any bit where a and b differ (`diff & -diff`). Numbers with this bit set XOR together to produce `a`, and numbers with it unset XOR to produce `b`.",
    expectedTimeSeconds: 75
  },
  {
    title: "Bitwise AND of Numbers Range [m, n]",
    difficulty: "medium",
    topic: "bit-manipulation",
    subtopic: "shifts",
    concepts: ["Common Prefix", "Right Shift Alignment"],
    type: "conceptual",
    question: "What is the bitwise AND of all integers in the contiguous range `[m, n]`?",
    options: [
      { id: "A", text: "The common binary prefix of m and n, padded with trailing zeros" },
      { id: "B", text: "Always 0" },
      { id: "C", text: "m & n" },
      { id: "D", text: "m ^ n" }
    ],
    correctOption: "A",
    explanation: "As numbers increment between m and n, all lower bits alternate between 0 and 1, turning all non-common suffix bits to 0. Only the common binary prefix survives.",
    expectedTimeSeconds: 65
  },

  // ────────────────── TRIE (5 questions) ──────────────────
  {
    title: "Trie (Prefix Tree) Node Structure & Lookups",
    difficulty: "medium",
    topic: "trie",
    subtopic: "prefix",
    concepts: ["Prefix Tree", "O(L) Word Lookup", "Alphabet Pointers"],
    type: "conceptual",
    question: "What are the two essential fields stored inside each TrieNode for 26 lowercase English letters?",
    options: [
      { id: "A", text: "An array/map of child pointers `children[26]` and a boolean flag `isEndOfWord`" },
      { id: "B", text: "The complete string and an integer frequency" },
      { id: "C", text: "A binary search tree" },
      { id: "D", text: "Parent pointer only" }
    ],
    correctOption: "A",
    explanation: "Each Trie node branches out to child nodes for subsequent letters and marks whether a complete inserted word ends at this node with `isEndOfWord = true`.",
    expectedTimeSeconds: 50
  },
  {
    title: "Prefix Search vs Exact Word Search in Trie",
    difficulty: "easy",
    topic: "trie",
    subtopic: "search",
    concepts: ["Prefix Matching", "startsWith Method"],
    type: "code-output",
    question: "What is the difference between `search(word)` and `startsWith(prefix)` in a Trie implementation?",
    options: [
      { id: "A", text: "`search` requires `node != null && node.isEndOfWord == true`; `startsWith` only requires `node != null`" },
      { id: "B", text: "`startsWith` checks string length" },
      { id: "C", text: "`search` searches in reverse" },
      { id: "D", text: "There is no difference" }
    ],
    correctOption: "A",
    explanation: "A prefix match succeeds if the path of characters exists in the Trie. An exact word search additionally mandates that a word was explicitly terminated at that final node.",
    expectedTimeSeconds: 45
  },
  {
    title: "Design Add and Search Words Data Structure (Wildcard '.')",
    difficulty: "medium",
    topic: "trie",
    subtopic: "word dictionary",
    concepts: ["Trie with DFS", "Wildcard Branching"],
    type: "conceptual",
    question: "When encountering wildcard character `'.'` during word search in a Trie, how must the search proceed?",
    options: [
      { id: "A", text: "Recursively branch into ALL 26 non-null child nodes and return true if any path matches" },
      { id: "B", text: "Skip the character and stay at the current node" },
      { id: "C", text: "Return false immediately" },
      { id: "D", text: "Match only vowels" }
    ],
    correctOption: "A",
    explanation: "The wildcard '.' can represent any letter. Exploring all non-null children via backtracking checks if any valid character continuation matches the remainder of the query.",
    expectedTimeSeconds: 65
  },
  {
    title: "Maximum XOR of Two Numbers in an Array (Binary Bit Trie)",
    difficulty: "hard",
    topic: "trie",
    subtopic: "XOR trie",
    concepts: ["Binary 0/1 Trie", "Greedy Opposite Bit Choice", "O(32 * n) Time"],
    type: "conceptual",
    question: "How is a Trie used to find the maximum XOR of two numbers from an array in O(n * 32) time?",
    options: [
      { id: "A", text: "Insert binary representations into a 0/1 Trie; for each number, greedily navigate towards the OPPOSITE bit (1-bit) at each bit position from MSB to LSB" },
      { id: "B", text: "Sort bits using binary search" },
      { id: "C", text: "Build suffix tree on decimal strings" },
      { id: "D", text: "XOR all adjacent elements" }
    ],
    correctOption: "A",
    explanation: "To maximize XOR, we want the most significant bit to be 1. For each bit of `num`, choosing the opposite child branch `1 ^ current_bit` in the binary Trie maximizes the resulting XOR.",
    expectedTimeSeconds: 85
  },
  {
    title: "Word Search II (Boggle with Multiple Words Optimization)",
    difficulty: "hard",
    topic: "trie",
    subtopic: "insertion",
    concepts: ["Trie + Backtracking", "Pruning Leaf Nodes on Match"],
    type: "conceptual",
    question: "Why is inserting all dictionary words into a Trie vastly superior to searching each word independently on the grid in Word Search II?",
    options: [
      { id: "A", text: "A single DFS traversal on the grid checks prefixes for ALL words simultaneously; branches with no valid Trie prefix are pruned immediately" },
      { id: "B", text: "Trie removes duplicates automatically" },
      { id: "C", text: "Grid search requires sorting words" },
      { id: "D", text: "Trie converts grid into 1D array" }
    ],
    correctOption: "A",
    explanation: "Traversing the grid alongside the Trie nodes prunes futile board exploration as soon as a prefix is not present in the dictionary, solving 10,000 words in a single grid sweep.",
    expectedTimeSeconds: 85
  },

  // ────────────────── UNION FIND / DISJOINT SET (5 questions) ──────────────────
  {
    title: "Union-Find Path Compression & Union by Rank/Size",
    difficulty: "medium",
    topic: "union-find",
    subtopic: "DSU",
    concepts: ["Disjoint Set Union", "Path Compression", "Inverse Ackermann α(N)"],
    type: "complexity",
    question: "What is the amortized time complexity per `find` / `union` operation when BOTH Path Compression and Union by Rank are used?",
    options: [
      { id: "A", text: "O(α(N)) — effectively O(1) nearly constant time (Inverse Ackermann function)" },
      { id: "B", text: "Strictly O(log N)" },
      { id: "C", text: "O(N)" },
      { id: "D", text: "O(N log N)" }
    ],
    correctOption: "A",
    explanation: "Combining Path Compression (`parent[x] = find(parent[x])`) with Union by Rank flattens the tree so thoroughly that operations run in O(α(N)) <= 4 operations for all realistic universe inputs.",
    expectedTimeSeconds: 55
  },
  {
    title: "Cycle Detection in Undirected Graph via Union-Find",
    difficulty: "medium",
    topic: "union-find",
    subtopic: "cycle detection",
    concepts: ["Disjoint Set", "Same Root Check", "Undirected Cycle"],
    type: "code-output",
    question: "When processing an undirected edge `(u, v)`, what condition indicates that this edge creates a cycle in the graph?",
    options: [
      { id: "A", text: "`find(u) == find(v)` (both endpoints already belong to the same connected component)" },
      { id: "B", text: "`find(u) != find(v)`" },
      { id: "C", text: "`rank[u] == rank[v]`" },
      { id: "D", text: "`u == 0 || v == 0`" }
    ],
    correctOption: "A",
    explanation: "If `find(u) == find(v)`, there already exists a path connecting u and v. Adding edge (u, v) creates a redundant second path, forming a cycle.",
    expectedTimeSeconds: 50
  },
  {
    title: "Kruskal's Minimum Spanning Tree (MST) Algorithm",
    difficulty: "medium",
    topic: "union-find",
    subtopic: "Kruskal",
    concepts: ["Greedy MST", "Sort Edges by Weight", "Union-Find Cycle Avoidance"],
    type: "conceptual",
    question: "How does Kruskal's Algorithm build a Minimum Spanning Tree for a connected weighted graph?",
    options: [
      { id: "A", text: "Sort all edges by weight ascending; greedily add each edge if it does not form a cycle (`find(u) != find(v)`)" },
      { id: "B", text: "Grow MST node-by-node from a starting vertex using a priority queue" },
      { id: "C", text: "Run BFS from vertex 0" },
      { id: "D", text: "Select the highest degree edges" }
    ],
    correctOption: "A",
    explanation: "Kruskal sorts edges by weight in O(E log E) and uses DSU to include edges that connect disjoint components until V-1 edges are added.",
    expectedTimeSeconds: 65
  },
  {
    title: "Number of Islands II (Dynamic Land Additions)",
    difficulty: "hard",
    topic: "union-find",
    subtopic: "connected components",
    concepts: ["Dynamic Graph", "Online DSU", "4-Directional Union"],
    type: "conceptual",
    question: "In Number of Islands II where land cells are dynamically added one by one, how is island count updated in O(1) amortized per query?",
    options: [
      { id: "A", text: "Increment island count by 1 for new land; for each adjacent land neighbor, if `union(cell, neighbor)` succeeds, decrement count by 1" },
      { id: "B", text: "Run full grid BFS from scratch for every added cell" },
      { id: "C", text: "Multiply number of rows and columns" },
      { id: "D", text: "Sort land coordinates" }
    ],
    correctOption: "A",
    explanation: "Adding a new land tile initially forms a new isolated component (+1). Merging with any of its up to 4 neighbors reduces the total number of components by 1 per successful union.",
    expectedTimeSeconds: 80
  },
  {
    title: "Redundant Connection in a Tree + Edge Graph",
    difficulty: "medium",
    topic: "union-find",
    subtopic: "cycle detection",
    concepts: ["Tree + 1 Edge", "Cycle Edge Extraction", "DSU"],
    type: "conceptual",
    question: "Given a tree with N vertices that was augmented with 1 additional redundant edge, how does DSU identify the exact redundant edge that appeared last in the input?",
    options: [
      { id: "A", text: "Iterate edges in given order; the first edge `(u, v)` encountered where `find(u) == find(v)` is the redundant cycle-completing edge" },
      { id: "B", text: "The edge with the largest numerical indices" },
      { id: "C", text: "Run topological sort" },
      { id: "D", text: "Delete vertex 0" }
    ],
    correctOption: "A",
    explanation: "Processing edges sequentially with DSU connects trees. The first edge whose vertices are already connected is the edge that closes the single cycle in the graph.",
    expectedTimeSeconds: 60
  }
];

module.exports = ASSESSMENT_QUESTIONS_PART2;
