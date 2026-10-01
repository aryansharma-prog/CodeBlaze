// Comprehensive Assessment Question Bank containing 160+ DSA questions across 20 topics
// Difficulty distribution: ~40% Easy, ~45% Medium, ~15% Hard

const ASSESSMENT_QUESTIONS = [
  // ────────────────── ARRAYS (12 questions) ──────────────────
  {
    title: "Array Traversal & Time Complexity",
    difficulty: "easy",
    topic: "arrays",
    subtopic: "traversal",
    concepts: ["Contiguous Memory", "Random Access", "Time Complexity"],
    type: "complexity",
    question: "What is the time complexity of accessing an element at index `k` in an array of size `n` vs searching for a value in an unsorted array?",
    options: [
      { id: "A", text: "Access O(1), Search O(n)" },
      { id: "B", text: "Access O(n), Search O(1)" },
      { id: "C", text: "Access O(log n), Search O(n)" },
      { id: "D", text: "Access O(1), Search O(log n)" }
    ],
    correctOption: "A",
    explanation: "Arrays allow O(1) direct memory offset indexing via base_address + index * element_size. Searching an unsorted array requires scanning up to all n elements, taking O(n) time.",
    expectedTimeSeconds: 45
  },
  {
    title: "Prefix Sum Array Range Query",
    difficulty: "easy",
    topic: "arrays",
    subtopic: "prefix sum",
    concepts: ["Prefix Sum", "Range Sum Query", "Preprocessing"],
    type: "conceptual",
    question: "Given a prefix sum array `P` where `P[i] = nums[0] + ... + nums[i]`, how do you compute the sum of elements from index `L` to `R` in O(1) time?",
    options: [
      { id: "A", text: "P[R] - (L > 0 ? P[L - 1] : 0)" },
      { id: "B", text: "P[R] - P[L]" },
      { id: "C", text: "P[R + 1] - P[L]" },
      { id: "D", text: "P[R] + P[L - 1]" }
    ],
    correctOption: "A",
    explanation: "Sum(L..R) = Sum(0..R) - Sum(0..L-1). Hence P[R] - P[L-1], with the boundary case when L=0 being simply P[R].",
    expectedTimeSeconds: 60
  },
  {
    title: "Kadane's Algorithm State Transition",
    difficulty: "medium",
    topic: "arrays",
    subtopic: "Kadane",
    concepts: ["Dynamic Programming", "Maximum Subarray", "Greedy"],
    type: "code-output",
    question: "In Kadane's algorithm for finding the maximum subarray sum, what is the correct local transition at element `nums[i]`?",
    codeSnippet: "currentSum = max(nums[i], currentSum + nums[i]);\nmaxSum = max(maxSum, currentSum);",
    options: [
      { id: "A", text: "Start a new subarray at nums[i] if extending previous sum is worse than nums[i] alone" },
      { id: "B", text: "Always add nums[i] to currentSum regardless of sign" },
      { id: "C", text: "Reset currentSum to 0 only when nums[i] < 0" },
      { id: "D", text: "Skip negative numbers completely" }
    ],
    correctOption: "A",
    explanation: "Kadane's decides whether to start a fresh subarray at nums[i] or append nums[i] to the running subarray based on max(nums[i], currentSum + nums[i]).",
    expectedTimeSeconds: 75
  },
  {
    title: "Subarray with Given Sum",
    difficulty: "medium",
    topic: "arrays",
    subtopic: "subarrays",
    concepts: ["Prefix Sum", "Hash Table", "Negative Numbers"],
    type: "conceptual",
    question: "Which approach finds the total number of subarrays summing to `k` when the array contains BOTH positive and negative integers in O(n) time?",
    options: [
      { id: "A", text: "Prefix Sum combined with a Frequency HashMap of seen prefix sums" },
      { id: "B", text: "Classic two-pointer sliding window" },
      { id: "C", text: "Sorting followed by binary search" },
      { id: "D", text: "Divide and Conquer with Kadane" }
    ],
    correctOption: "A",
    explanation: "Two pointers fails with negative numbers because prefix sum is not monotonic. A Hash Map storing frequencies of (current_prefix_sum - k) solves it in O(n) time and O(n) space.",
    expectedTimeSeconds: 90
  },
  {
    title: "Matrix In-Place 90-Degree Rotation",
    difficulty: "medium",
    topic: "arrays",
    subtopic: "matrix",
    concepts: ["2D Array", "Matrix Transpose", "In-Place Manipulation"],
    type: "conceptual",
    question: "To rotate an N x N matrix 90 degrees clockwise in-place with O(1) extra space, what two operations should be performed sequentially?",
    options: [
      { id: "A", text: "Transpose the matrix (swap matrix[i][j] with matrix[j][i]), then reverse each row" },
      { id: "B", text: "Reverse each row, then transpose the matrix" },
      { id: "C", text: "Reverse each column, then reverse each row" },
      { id: "D", text: "Transpose across the anti-diagonal only" }
    ],
    correctOption: "A",
    explanation: "Clockwise rotation: Transpose followed by horizontal row reflection. Counter-clockwise rotation: Transpose followed by vertical column reflection.",
    expectedTimeSeconds: 90
  },
  {
    title: "Difference Array Range Update",
    difficulty: "hard",
    topic: "arrays",
    subtopic: "difference arrays",
    concepts: ["Difference Array", "Range Addition", "O(1) Updates"],
    type: "conceptual",
    question: "Given a difference array `D` of size `N`, how do you apply an update 'add value `val` to range [L, R]' in O(1) time?",
    options: [
      { id: "A", text: "D[L] += val, and if R+1 < N then D[R+1] -= val" },
      { id: "B", text: "D[L] += val and D[R] -= val" },
      { id: "C", text: "D[L-1] += val and D[R+1] -= val" },
      { id: "D", text: "Loop from L to R adding val" }
    ],
    correctOption: "A",
    explanation: "Adding val to D[L] propagates +val to all indices >= L upon prefix sum prefix-scanning. Subtracting val from D[R+1] cancels the increment for all indices > R.",
    expectedTimeSeconds: 100
  },
  {
    title: "Majority Element - Boyer-Moore Voting",
    difficulty: "easy",
    topic: "arrays",
    subtopic: "frequency",
    concepts: ["Boyer-Moore", "Counting", "O(1) Space"],
    type: "conceptual",
    question: "What is the space complexity of Boyer-Moore Voting Algorithm to find an element appearing more than ⌊n/2⌋ times?",
    options: [
      { id: "A", text: "O(1)" },
      { id: "B", text: "O(n)" },
      { id: "C", text: "O(log n)" },
      { id: "D", text: "O(k) where k is distinct elements" }
    ],
    correctOption: "A",
    explanation: "Boyer-Moore voting maintains only two scalar variables: `candidate` and `count`, running in O(n) time and O(1) space.",
    expectedTimeSeconds: 45
  },
  {
    title: "Array In-Place Element Removal",
    difficulty: "easy",
    topic: "arrays",
    subtopic: "sorting",
    concepts: ["Two Pointers", "In-Place Array", "Overwrite"],
    type: "code-output",
    question: "What does the two-pointer technique achieve when removing duplicates from a sorted array in-place?",
    options: [
      { id: "A", text: "Modifies array in-place with O(1) space and returns the new length" },
      { id: "B", text: "Creates a new HashSet requiring O(n) memory" },
      { id: "C", text: "Requires O(n log n) time" },
      { id: "D", text: "Can only work on descending arrays" }
    ],
    correctOption: "A",
    explanation: "Slow pointer writes unique elements while fast pointer scans, requiring O(n) time and O(1) auxiliary space.",
    expectedTimeSeconds: 60
  },
  {
    title: "Spiral Matrix Traversal Boundary Updates",
    difficulty: "medium",
    topic: "arrays",
    subtopic: "matrix",
    concepts: ["2D Array", "Simulation", "Boundary Tracking"],
    type: "conceptual",
    question: "When traversing an M x N matrix in spiral order, which 4 pointers/boundaries are adjusted after completing each directional sweep?",
    options: [
      { id: "A", text: "top++, right--, bottom--, left++" },
      { id: "B", text: "top--, right++, bottom++, left--" },
      { id: "C", text: "row++, col++, row--, col--" },
      { id: "D", text: "diagonal pointers only" }
    ],
    correctOption: "A",
    explanation: "After traversing top row: top++. After right col: right--. After bottom row: bottom--. After left col: left++.",
    expectedTimeSeconds: 75
  },
  {
    title: "Dutch National Flag Algorithm (3-way Partition)",
    difficulty: "medium",
    topic: "arrays",
    subtopic: "sorting",
    concepts: ["3-way Partitioning", "In-place Sort", "Two Pointers"],
    type: "code-output",
    question: "In the Dutch National Flag algorithm sorting 0s, 1s, and 2s, what action is taken when `nums[mid] == 2`?",
    options: [
      { id: "A", text: "swap(nums[mid], nums[high]); high--; (do not increment mid)" },
      { id: "B", text: "swap(nums[mid], nums[high]); mid++; high--;" },
      { id: "C", text: "swap(nums[mid], nums[low]); low++; mid++;" },
      { id: "D", text: "mid++ only" }
    ],
    correctOption: "A",
    explanation: "Because the swapped element from `high` has not been processed yet, `mid` must not be incremented until the next loop iteration examines it.",
    expectedTimeSeconds: 90
  },
  {
    title: "Product of Array Except Self without Division",
    difficulty: "medium",
    topic: "arrays",
    subtopic: "prefix sum",
    concepts: ["Prefix Product", "Suffix Product", "O(1) Space"],
    type: "conceptual",
    question: "To compute product of array except self in O(n) without division, we combine which two passes?",
    options: [
      { id: "A", text: "A prefix products pass from left, followed by running suffix product multiplication from right" },
      { id: "B", text: "Two nested loops" },
      { id: "C", text: "Sorting the array and taking binary search products" },
      { id: "D", text: "Bitwise XOR cumulative pass" }
    ],
    correctOption: "A",
    explanation: "Result[i] = (Product of all elements < i) * (Product of all elements > i). This is achieved with one left-to-right pass and one right-to-left running product pass in O(n) time and O(1) auxiliary space (excluding result array).",
    expectedTimeSeconds: 80
  },
  {
    title: "Trapping Rain Water - Array Preprocessing",
    difficulty: "hard",
    topic: "arrays",
    subtopic: "subarrays",
    concepts: ["Two Pointers", "Elevation Map", "Prefix Max"],
    type: "conceptual",
    question: "At any index `i`, how much water can be trapped directly above bar `height[i]`?",
    options: [
      { id: "A", text: "max(0, min(leftMax[i], rightMax[i]) - height[i])" },
      { id: "B", text: "max(leftMax[i], rightMax[i]) - height[i]" },
      { id: "C", text: "min(leftMax[i], rightMax[i])" },
      { id: "D", text: "(leftMax[i] + rightMax[i]) / 2 - height[i]" }
    ],
    correctOption: "A",
    explanation: "Water level is bounded by the shorter of the tallest boundaries on the left and right: min(leftMax, rightMax). The trapped water volume is this level minus the floor height.",
    expectedTimeSeconds: 90
  },

  // ────────────────── STRINGS (10 questions) ──────────────────
  {
    title: "Valid Palindrome with Alphanumeric Filtering",
    difficulty: "easy",
    topic: "strings",
    subtopic: "palindrome",
    concepts: ["Two Pointers", "String Sanitization"],
    type: "conceptual",
    question: "What is the optimal time and space complexity for checking if a string is a palindrome considering only alphanumeric characters and ignoring cases?",
    options: [
      { id: "A", text: "Time O(n), Space O(1) using two pointers moving inwards" },
      { id: "B", text: "Time O(n^2), Space O(n)" },
      { id: "C", text: "Time O(n log n), Space O(1)" },
      { id: "D", text: "Time O(n), Space O(n) by creating a reversed copy" }
    ],
    correctOption: "A",
    explanation: "Two pointers starting at 0 and n-1 skipping non-alphanumeric chars and comparing lowercase values check palindrome in O(n) time and O(1) auxiliary memory.",
    expectedTimeSeconds: 60
  },
  {
    title: "Valid Anagram Character Frequency",
    difficulty: "easy",
    topic: "strings",
    subtopic: "frequency",
    concepts: ["Frequency Array", "Hash Map", "ASCII Indexing"],
    type: "conceptual",
    question: "For lowercase English letters strings s and t, what is the most memory-efficient way to verify if they are anagrams?",
    options: [
      { id: "A", text: "A fixed-size integer array of length 26 counting frequencies (+1 for s, -1 for t)" },
      { id: "B", text: "Sorting both strings with O(n log n) time" },
      { id: "C", text: "Two generic HashMaps with O(n) dynamic allocations" },
      { id: "D", text: "Nested character comparison loops" }
    ],
    correctOption: "A",
    explanation: "An array of 26 ints uses fixed O(1) stack memory and completes in single-pass O(n) time.",
    expectedTimeSeconds: 50
  },
  {
    title: "Longest Common Prefix Horizontal Scanning",
    difficulty: "easy",
    topic: "strings",
    subtopic: "manipulation",
    concepts: ["String Matching", "Prefix Reduction"],
    type: "conceptual",
    question: "Given an array of strings, what is the best case time complexity of horizontal scanning for the longest common prefix if the first two strings share no common prefix?",
    options: [
      { id: "A", text: "O(1) / O(min_len) — immediately terminates on empty prefix" },
      { id: "B", text: "Always O(S) where S is sum of all characters" },
      { id: "C", text: "O(N log N)" },
      { id: "D", text: "O(N^2)" }
    ],
    correctOption: "A",
    explanation: "Horizontal scanning compares string 1 and 2; if prefix becomes empty string \"\", it early-exits without scanning remaining N-2 strings.",
    expectedTimeSeconds: 60
  },
  {
    title: "Rolling Hash (Rabin-Karp) Collision Handling",
    difficulty: "medium",
    topic: "strings",
    subtopic: "hashing",
    concepts: ["Rabin-Karp", "Polynomial Rolling Hash", "Mod Arithmetic"],
    type: "conceptual",
    question: "In Rabin-Karp string search, how is a rolling hash updated in O(1) when the window slides from string index `i` to `i+1`?",
    options: [
      { id: "A", text: "hash = ( (hash - old_char * base^(m-1)) * base + new_char ) % mod" },
      { id: "B", text: "hash = (hash + new_char - old_char) % mod" },
      { id: "C", text: "hash = (hash * base + new_char) % mod" },
      { id: "D", text: "hash = (hash ^ old_char) ^ new_char" }
    ],
    correctOption: "A",
    explanation: "Remove high-order term (old_char * base^(m-1)), shift existing polynomial left by multiplying by base, and add incoming low-order new_char.",
    expectedTimeSeconds: 90
  },
  {
    title: "KMP Algorithm - Longest Proper Prefix which is also Suffix (LPS)",
    difficulty: "hard",
    topic: "strings",
    subtopic: "pattern matching",
    concepts: ["KMP Algorithm", "LPS Table", "Finite Automaton"],
    type: "conceptual",
    question: "What does the `lps[i]` value represent in Knuth-Morris-Pratt (KMP) string matching for pattern `P`?",
    options: [
      { id: "A", text: "The length of the longest proper prefix of P[0..i] that is also a suffix of P[0..i]" },
      { id: "B", text: "The total number of occurrences of P[0..i]" },
      { id: "C", text: "The shortest substring that cannot be repeated" },
      { id: "D", text: "The index of the first mismatch" }
    ],
    correctOption: "A",
    explanation: "LPS table prevents backtracking in text pointer by recording the longest prefix that matches a proper suffix in the pattern prefix.",
    expectedTimeSeconds: 95
  },
  {
    title: "String Compression In-Place",
    difficulty: "medium",
    topic: "strings",
    subtopic: "manipulation",
    concepts: ["Run-length Encoding", "Two Pointers", "In-place Array"],
    type: "conceptual",
    question: "When compressing a character array `['a','a','b','b','c','c','c']` in place, which pointer mechanism is used?",
    options: [
      { id: "A", text: "Read pointer counts consecutive streak; write pointer updates char and multi-digit count" },
      { id: "B", text: "Extra dynamic StringBuilder" },
      { id: "C", text: "Recursive character reduction" },
      { id: "D", text: "Hash table of frequencies" }
    ],
    correctOption: "A",
    explanation: "A read pointer finds run lengths of identical consecutive chars, and write pointer writes the character and digits of length into the input array in O(1) extra space.",
    expectedTimeSeconds: 75
  },
  {
    title: "Group Anagrams Representation Key",
    difficulty: "medium",
    topic: "strings",
    subtopic: "hashing",
    concepts: ["Hash Map", "Canonical Form", "Character Count Tuple"],
    type: "conceptual",
    question: "What is the optimal hash key for grouping anagrams of strings with average length `L` containing lowercase ASCII characters?",
    options: [
      { id: "A", text: "A count tuple/delimited frequency string `#1#0#2...` taking O(L) time per word" },
      { id: "B", text: "Sum of ASCII values only (without collision resolution)" },
      { id: "C", text: "String length" },
      { id: "D", text: "Bitwise XOR of characters" }
    ],
    correctOption: "A",
    explanation: "Sorting each word takes O(L log L), while character count encoding `#a1#b0#c2...` takes O(L) time, making it faster for long strings.",
    expectedTimeSeconds: 80
  },
  {
    title: "Longest Palindromic Substring Expand Around Center",
    difficulty: "medium",
    topic: "strings",
    subtopic: "substring",
    concepts: ["Palindrome", "Center Expansion", "Time Complexity"],
    type: "complexity",
    question: "How many potential palindrome centers exist in a string of length `n`?",
    options: [
      { id: "A", text: "2n - 1 (n single-character centers and n-1 between-character centers)" },
      { id: "B", text: "n centers only" },
      { id: "C", text: "n / 2 centers" },
      { id: "D", text: "n^2 centers" }
    ],
    correctOption: "A",
    explanation: "Odd-length palindromes expand from single character `(i, i)` (n total). Even-length palindromes expand between `(i, i+1)` (n-1 total). Total centers = 2n - 1.",
    expectedTimeSeconds: 65
  },
  {
    title: "Minimum Window Substring - Frequency Matching",
    difficulty: "hard",
    topic: "strings",
    subtopic: "substring",
    concepts: ["Sliding Window", "Frequency Map", "Two Pointers"],
    type: "conceptual",
    question: "In Minimum Window Substring, how do we track if all required character frequencies from pattern `T` are satisfied in current window `S[L..R]` in O(1) per step?",
    options: [
      { id: "A", text: "Maintain a `matchedUniqueChars` counter that increments only when a char's window count reaches target count" },
      { id: "B", text: "Compare both 256-element frequency maps completely at every step" },
      { id: "C", text: "Convert window to array and search each character of T" },
      { id: "D", text: "Recalculate set intersection" }
    ],
    correctOption: "A",
    explanation: "Tracking `count == requiredCount` variable updates in O(1) during pointer moves avoids O(Alphabet) comparisons per character.",
    expectedTimeSeconds: 100
  },
  {
    title: "Z-Algorithm vs KMP for Pattern Matching",
    difficulty: "hard",
    topic: "strings",
    subtopic: "pattern matching",
    concepts: ["Z-Algorithm", "Z-Box", "Exact String Matching"],
    type: "conceptual",
    question: "What does the Z-array `Z[i]` store for a string `S`?",
    options: [
      { id: "A", text: "Length of the longest substring starting at index `i` that is also a prefix of `S`" },
      { id: "B", text: "Number of vowels up to index i" },
      { id: "C", text: "Suffix array rank at index i" },
      { id: "D", text: "Distance to the nearest matching character" }
    ],
    correctOption: "A",
    explanation: "Z-algorithm computes Z[i] in O(n) total time using maintaining the rightmost matching segment [L, R].",
    expectedTimeSeconds: 90
  },

  // ────────────────── HASHING (10 questions) ──────────────────
  {
    title: "Two Sum Complement Lookup",
    difficulty: "easy",
    topic: "hashing",
    subtopic: "complement lookup",
    concepts: ["HashMap", "O(n) Single Pass", "Complement Math"],
    type: "conceptual",
    question: "Why is a HashMap preferred over sorting + two pointers for the classic Two Sum problem when original 0-indexed indices must be returned?",
    options: [
      { id: "A", text: "HashMap achieves O(n) time while preserving original array indices without extra pair-index tracking" },
      { id: "B", text: "Sorting takes O(1) space but HashMap takes O(n^2) time" },
      { id: "C", text: "Two pointers cannot find pairs with negative numbers" },
      { id: "D", text: "HashMap guarantees no collisions" }
    ],
    correctOption: "A",
    explanation: "HashMap maps `nums[i] -> i`. Looking up `target - nums[i]` takes O(1) average time, giving O(n) overall time.",
    expectedTimeSeconds: 50
  },
  {
    title: "Hash Collision Resolution - Separate Chaining vs Open Addressing",
    difficulty: "medium",
    topic: "hashing",
    subtopic: "HashMap",
    concepts: ["Collision Resolution", "Probing", "Linked List Buckets"],
    type: "conceptual",
    question: "What is the primary difference between Separate Chaining and Linear Probing for hash collision resolution?",
    options: [
      { id: "A", text: "Separate Chaining stores colliding entries in linked lists/trees per bucket; Linear Probing searches subsequent slots in the same array" },
      { id: "B", text: "Separate Chaining never uses extra memory" },
      { id: "C", text: "Linear Probing avoids primary clustering completely" },
      { id: "D", text: "Separate Chaining cannot resize" }
    ],
    correctOption: "A",
    explanation: "Chaining uses secondary structures per bucket slot. Open addressing (like linear probing) resolves collisions by finding the next empty slot in the continuous table.",
    expectedTimeSeconds: 70
  },
  {
    title: "HashSet for Finding Duplicates in O(n)",
    difficulty: "easy",
    topic: "hashing",
    subtopic: "HashSet",
    concepts: ["HashSet", "Contains Duplicate", "O(1) amortized lookup"],
    type: "complexity",
    question: "What is the worst-case time complexity of inserting `n` elements into a standard Hash Table when poor hash distribution causes all keys to collide into a single bucket?",
    options: [
      { id: "A", text: "O(n^2)" },
      { id: "B", text: "O(n log n)" },
      { id: "C", text: "O(n)" },
      { id: "D", text: "O(1)" }
    ],
    correctOption: "A",
    explanation: "If every key hashes to the same bucket without treeification (e.g. standard linked list chaining), each insertion takes O(k) where k is current list length, summing to O(n^2) total worst-case time.",
    expectedTimeSeconds: 60
  },
  {
    title: "Continuous Subarray Sum Modulo K",
    difficulty: "medium",
    topic: "hashing",
    subtopic: "prefix sum + hashmap",
    concepts: ["Modulo Arithmetic", "Prefix Sum", "Hash Map"],
    type: "conceptual",
    question: "If two prefix sums `P[i]` and `P[j]` have the same remainder when divided by `k` (`P[i] % k == P[j] % k`), what does this imply about the subarray `nums[i+1..j]`?",
    options: [
      { id: "A", text: "The sum of elements in nums[i+1..j] is a multiple of k" },
      { id: "B", text: "The sum of elements in nums[i+1..j] equals k" },
      { id: "C", text: "nums[i+1..j] has length k" },
      { id: "D", text: "All elements in nums[i+1..j] are divisible by k" }
    ],
    correctOption: "A",
    explanation: "(P[j] - P[i]) % k == 0 implies that the subarray sum from i+1 to j is an exact multiple of k.",
    expectedTimeSeconds: 75
  },
  {
    title: "Longest Consecutive Sequence in O(n)",
    difficulty: "medium",
    topic: "hashing",
    subtopic: "HashSet",
    concepts: ["HashSet", "Sequence Starting Point", "O(n) Traversal"],
    type: "conceptual",
    question: "How do we ensure the Longest Consecutive Sequence algorithm runs in O(n) total time without redundant checks?",
    options: [
      { id: "A", text: "Only start counting sequence length if `num - 1` is NOT in the HashSet (ensures we only iterate from streak starts)" },
      { id: "B", text: "Sort the array in O(n log n)" },
      { id: "C", text: "Use nested while loops for every element" },
      { id: "D", text: "Maintain a binary search tree" }
    ],
    correctOption: "A",
    explanation: "Checking `!set.contains(num - 1)` ensures each contiguous streak is traversed only once across the entire array, giving O(n) amortized runtime.",
    expectedTimeSeconds: 80
  },
  {
    title: "LRU Cache Data Structure Combination",
    difficulty: "hard",
    topic: "hashing",
    subtopic: "HashMap",
    concepts: ["LRU Cache", "Doubly Linked List", "HashMap", "O(1) Operations"],
    type: "conceptual",
    question: "Which data structures are combined to implement an LRU (Least Recently Used) cache supporting `get` and `put` in O(1) time?",
    options: [
      { id: "A", text: "A Hash Map mapping key -> Doubly Linked List Node, paired with a Doubly Linked List" },
      { id: "B", text: "A Binary Heap and a Queue" },
      { id: "C", text: "A Single Linked List and an Array" },
      { id: "D", text: "A Stack and a Binary Search Tree" }
    ],
    correctOption: "A",
    explanation: "HashMap provides O(1) lookup to the node. Doubly Linked List enables O(1) removal and re-insertion at the head without traversing.",
    expectedTimeSeconds: 85
  },
  {
    title: "4Sum II - Count Tuples",
    difficulty: "medium",
    topic: "hashing",
    subtopic: "frequency map",
    concepts: ["Hash Map", "Meet in the Middle", "Complexity Reduction"],
    type: "complexity",
    question: "Given four integer arrays of size `n`, what is the time complexity to count tuples (i, j, k, l) such that A[i] + B[j] + C[k] + D[l] == 0 using a Hash Map?",
    options: [
      { id: "A", text: "O(n^2) by hashing pairwise sums of A and B, then querying -(C[k] + D[l])" },
      { id: "B", text: "O(n^4) brute force" },
      { id: "C", text: "O(n^3)" },
      { id: "D", text: "O(n log n)" }
    ],
    correctOption: "A",
    explanation: "Computing all n^2 pairs of (A[i] + B[j]) into a frequency map and querying -(C[k] + D[l]) for all n^2 pairs takes O(n^2) time and O(n^2) space.",
    expectedTimeSeconds: 80
  },
  {
    title: "Subarray Sums Divisible by K - Negative Remainder Handling",
    difficulty: "medium",
    topic: "hashing",
    subtopic: "prefix sum + hashmap",
    concepts: ["Modulo Arithmetic", "Negative Numbers in C++/Java"],
    type: "code-output",
    question: "In C++ / Java, why is remainder normalized with `((sum % k) + k) % k` when using a modulo frequency map?",
    options: [
      { id: "A", text: "The `%` operator can return negative values for negative integers; adding k maps it to [0, k-1]" },
      { id: "B", text: "To double the table capacity" },
      { id: "C", text: "To prevent integer overflow" },
      { id: "D", text: "To avoid 0-division" }
    ],
    correctOption: "A",
    explanation: "In C++ and Java, `-7 % 5 = -2`. In modulo arithmetic `-2 ≡ 3 (mod 5)`. Normalizing with `((val % k) + k) % k` ensures non-negative bucket indexing.",
    expectedTimeSeconds: 70
  },
  {
    title: "Isomorphic Strings Mapping",
    difficulty: "easy",
    topic: "hashing",
    subtopic: "HashMap",
    concepts: ["Bijection", "Two-way Mapping", "Character Hash"],
    type: "conceptual",
    question: "Why does verifying whether string s and string t are isomorphic require either two HashMaps or checking last-seen index array?",
    options: [
      { id: "A", text: "The mapping must be a bijection (one-to-one and onto); a single map only checks uniqueness in one direction" },
      { id: "B", text: "Strings could have different lengths" },
      { id: "C", text: "Because characters are 16-bit Unicode" },
      { id: "D", text: "To sort characters alphabetically" }
    ],
    correctOption: "A",
    explanation: "If 'ab' maps to 'aa', a single map allows 'a'->'a' and 'b'->'a', violating the one-to-one injective requirement. Two maps ensure distinct keys map to distinct targets.",
    expectedTimeSeconds: 65
  },
  {
    title: "Ransom Note Character Frequency",
    difficulty: "easy",
    topic: "hashing",
    subtopic: "frequency map",
    concepts: ["Frequency Count", "Array as Map"],
    type: "conceptual",
    question: "Can `ransomNote` be constructed from `magazine` if every character in `ransomNote` appears in `magazine` with equal or greater count?",
    options: [
      { id: "A", text: "Yes, by decrementing magazine character counts and verifying no count drops below 0" },
      { id: "B", text: "No, order must be strictly preserved" },
      { id: "C", text: "Only if lengths are identical" },
      { id: "D", text: "Only if characters are in sorted order" }
    ],
    correctOption: "A",
    explanation: "Count frequencies in magazine, then for each char in ransomNote decrement count. If any count becomes negative, ransom note cannot be constructed.",
    expectedTimeSeconds: 45
  },

  // ────────────────── TWO POINTERS (8 questions) ──────────────────
  {
    title: "Two Sum II - Input Array is Sorted",
    difficulty: "easy",
    topic: "two-pointers",
    subtopic: "sorted arrays",
    concepts: ["Two Pointers", "Opposite Direction", "O(1) Space"],
    type: "conceptual",
    question: "When `nums[left] + nums[right] < target` on a sorted array, what is the next step in the two-pointer approach?",
    options: [
      { id: "A", text: "left++ (increase sum since array is sorted ascending)" },
      { id: "B", text: "right-- (decrease sum)" },
      { id: "C", text: "Reset left = 0" },
      { id: "D", text: "Swap left and right" }
    ],
    correctOption: "A",
    explanation: "Since the array is sorted, increasing `left` moves to a larger value, raising the total sum towards `target`.",
    expectedTimeSeconds: 45
  },
  {
    title: "Container With Most Water Greedy Choice",
    difficulty: "medium",
    topic: "two-pointers",
    subtopic: "opposite direction",
    concepts: ["Two Pointers", "Greedy Proof", "Area Maximization"],
    type: "conceptual",
    question: "In Container With Most Water, why do we always move the pointer pointing to the SHORTER line inwards?",
    options: [
      { id: "A", text: "Because moving the taller line reduces width without any chance of increasing the limiting height (min(h[L], h[R]))" },
      { id: "B", text: "To keep width constant" },
      { id: "C", text: "Because the taller line is always the answer" },
      { id: "D", text: "It is an arbitrary choice" }
    ],
    correctOption: "A",
    explanation: "Area = (right - left) * min(h[left], h[right]). Moving the taller pointer decreases width while height can never exceed h[shorter]. Moving shorter is the only move that can possibly discover a taller bounding line.",
    expectedTimeSeconds: 75
  },
  {
    title: "3Sum Triplet Deduplication",
    difficulty: "medium",
    topic: "two-pointers",
    subtopic: "pairs",
    concepts: ["Sorting", "Two Pointers", "Deduplication"],
    type: "code-output",
    question: "How do we skip duplicate triplets in 3Sum after finding a valid sum `nums[i] + nums[left] + nums[right] == 0`?",
    options: [
      { id: "A", text: "while (left < right && nums[left] == nums[left+1]) left++; while (left < right && nums[right] == nums[right-1]) right--; left++; right--;" },
      { id: "B", text: "left = right;" },
      { id: "C", text: "i++ immediately" },
      { id: "D", text: "Convert array to HashSet and restart" }
    ],
    correctOption: "A",
    explanation: "After recording the triplet, advance both `left` and `right` while skipping contiguous identical values to avoid duplicate answers.",
    expectedTimeSeconds: 80
  },
  {
    title: "Trapping Rain Water - Two Pointer O(1) Space",
    difficulty: "hard",
    topic: "two-pointers",
    subtopic: "opposite direction",
    concepts: ["Two Pointers", "Running Max", "O(1) Auxiliary Space"],
    type: "conceptual",
    question: "In the O(1) space two-pointer solution for Trapping Rain Water, how do we know `leftMax` is the true bottleneck when `height[left] <= height[right]`?",
    options: [
      { id: "A", text: "Because height[right] >= height[left] guarantees there exists a right boundary at least as tall as leftMax" },
      { id: "B", text: "Because rightMax is always zero" },
      { id: "C", text: "We do not know, we approximate" },
      { id: "D", text: "Because the array is sorted" }
    ],
    correctOption: "A",
    explanation: "When `height[left] <= height[right]`, we are guaranteed that a right boundary exists that is >= leftMax, so trapped water is determined strictly by `leftMax - height[left]`.",
    expectedTimeSeconds: 90
  },
  {
    title: "Move Zeroes In-Place Two Pointers",
    difficulty: "easy",
    topic: "two-pointers",
    subtopic: "same direction",
    concepts: ["Fast-Slow Pointers", "In-Place Swap"],
    type: "conceptual",
    question: "How does the slow-pointer / fast-pointer technique move zeroes to the end of an array while maintaining relative order of non-zero elements?",
    options: [
      { id: "A", text: "Fast pointer scans every element; whenever nums[fast] != 0, swap with nums[slow] and increment slow" },
      { id: "B", text: "Sort all elements with custom comparator" },
      { id: "C", text: "Shift all elements right by one upon encountering 0" },
      { id: "D", text: "Delete zeroes and re-allocate array" }
    ],
    correctOption: "A",
    explanation: "The slow pointer tracks the position for the next non-zero number. Swapping keeps non-zero elements in order in a single O(n) pass.",
    expectedTimeSeconds: 50
  },
  {
    title: "Valid Word Abbreviation Pointer Navigation",
    difficulty: "easy",
    topic: "two-pointers",
    subtopic: "same direction",
    concepts: ["String Pointers", "Parsing Digits", "Edge Cases"],
    type: "conceptual",
    question: "When parsing a numeric skip count `k` in an abbreviation string, which edge case must immediately invalidate the match?",
    options: [
      { id: "A", text: "Leading zero in a number (e.g. '01' or '0')" },
      { id: "B", text: "Even numbers" },
      { id: "C", text: "Numbers greater than 10" },
      { id: "D", text: "Letters occurring after numbers" }
    ],
    correctOption: "A",
    explanation: "In valid word abbreviations, leading zeros (e.g. '0') are disallowed because they create ambiguous representations.",
    expectedTimeSeconds: 60
  },
  {
    title: "Sort Colors Partitioning",
    difficulty: "medium",
    topic: "two-pointers",
    subtopic: "partitioning",
    concepts: ["3-way Partitioning", "In-place Array"],
    type: "conceptual",
    question: "In 3-way partitioning of array [0, 1, 2], what do the pointers `low`, `mid`, and `high` represent invariant-wise?",
    options: [
      { id: "A", text: "[0..low-1] are 0s, [low..mid-1] are 1s, [mid..high] are unexamined, [high+1..n-1] are 2s" },
      { id: "B", text: "All sections are sorted descending" },
      { id: "C", text: "low points to 2, high points to 0" },
      { id: "D", text: "No invariants are maintained" }
    ],
    correctOption: "A",
    explanation: "This is Dijkstra's Dutch National Flag partition: elements before low are 0s, between low and mid-1 are 1s, and after high are 2s.",
    expectedTimeSeconds: 85
  },
  {
    title: "Backspace String Compare with O(1) Space",
    difficulty: "medium",
    topic: "two-pointers",
    subtopic: "opposite direction",
    concepts: ["Reverse Traversal", "Skip Counter", "O(1) Space"],
    type: "conceptual",
    question: "To compare two strings containing backspaces '#' in O(1) space, in which direction should pointers traverse?",
    options: [
      { id: "A", text: "From right to left (end to beginning), maintaining a count of pending backspaces" },
      { id: "B", text: "From left to right using a Stack" },
      { id: "C", text: "From middle outwards" },
      { id: "D", text: "Forward two passes" }
    ],
    correctOption: "A",
    explanation: "Traversing right-to-left allows each '#' to eagerly swallow preceding characters via a counter without needing a stack or string rebuilding.",
    expectedTimeSeconds: 75
  },

  // ────────────────── SLIDING WINDOW (10 questions) ──────────────────
  {
    title: "Maximum Average Subarray of Fixed Size K",
    difficulty: "easy",
    topic: "sliding-window",
    subtopic: "fixed window",
    concepts: ["Fixed Window", "Running Sum", "O(n) Time"],
    type: "code-output",
    question: "In a fixed window of size `k`, how is the window sum updated when sliding from index `i` to `i+1`?",
    codeSnippet: "windowSum += nums[i] - nums[i - k];",
    options: [
      { id: "A", text: "Add incoming nums[i] and subtract outgoing nums[i - k]" },
      { id: "B", text: "Recompute sum of all k elements from scratch" },
      { id: "C", text: "Multiply by k" },
      { id: "D", text: "Subtract nums[i] and add nums[i - k]" }
    ],
    correctOption: "A",
    explanation: "Fixed sliding window maintains sum in O(1) per step by adding incoming element and subtracting outgoing element.",
    expectedTimeSeconds: 45
  },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    topic: "sliding-window",
    subtopic: "variable window",
    concepts: ["Variable Window", "Last Seen Index Map", "Fast Jump"],
    type: "conceptual",
    question: "When a duplicate character `c` is encountered at index `r`, how should the left window boundary `l` be updated using a last-seen index map `lastSeen`?",
    options: [
      { id: "A", text: "l = max(l, lastSeen[c] + 1)" },
      { id: "B", text: "l = lastSeen[c]" },
      { id: "C", text: "l = 0" },
      { id: "D", text: "l = r" }
    ],
    correctOption: "A",
    explanation: "`max(l, lastSeen[c] + 1)` ensures the left pointer never moves backward if the duplicate occurred before the current window start.",
    expectedTimeSeconds: 70
  },
  {
    title: "Longest Repeating Character Replacement",
    difficulty: "medium",
    topic: "sliding-window",
    subtopic: "frequency window",
    concepts: ["Sliding Window", "Max Frequency Invariant", "Shrinking Condition"],
    type: "conceptual",
    question: "In Longest Repeating Character Replacement with at most `k` edits, what is the condition for a window `[l, r]` to be INVALID?",
    options: [
      { id: "A", text: "(r - l + 1) - maxFrequency > k" },
      { id: "B", text: "(r - l + 1) <= k" },
      { id: "C", text: "maxFrequency > k" },
      { id: "D", text: "k == 0" }
    ],
    correctOption: "A",
    explanation: "Window length minus the count of the most frequent character gives the number of characters needing replacement. If this exceeds k, window is invalid.",
    expectedTimeSeconds: 80
  },
  {
    title: "Minimum Size Subarray Sum",
    difficulty: "medium",
    topic: "sliding-window",
    subtopic: "minimum window",
    concepts: ["Two Pointers", "Positive Integers", "Shrinking Window"],
    type: "code-output",
    question: "When finding the minimal length subarray with sum >= target of positive integers, when is the left pointer incremented?",
    options: [
      { id: "A", text: "While current window sum >= target, record min length and shrink: `sum -= nums[l++];`" },
      { id: "B", text: "Only when right reaches end of array" },
      { id: "C", text: "When sum < target" },
      { id: "D", text: "Every iteration unconditionally" }
    ],
    correctOption: "A",
    explanation: "Expand with right pointer until sum >= target, then shrink with left pointer to find minimum valid window length while keeping sum >= target.",
    expectedTimeSeconds: 75
  },
  {
    title: "Sliding Window Maximum using Monotonic Deque",
    difficulty: "hard",
    topic: "sliding-window",
    subtopic: "fixed window",
    concepts: ["Monotonic Deque", "Decreasing Order", "O(n) Amortized"],
    type: "conceptual",
    question: "Why does a Monotonic Deque maintain elements in STRICTLY DECREASING order when finding sliding window maximums?",
    options: [
      { id: "A", text: "The front of the deque always holds the index of the maximum element for current window in O(1)" },
      { id: "B", text: "To sort the array in O(n)" },
      { id: "C", text: "To calculate average in O(1)" },
      { id: "D", text: "To store duplicates only" }
    ],
    correctOption: "A",
    explanation: "Smaller elements behind a newly added larger element can never be the maximum in any future window containing both, so they are popped from back. Front is always maximum.",
    expectedTimeSeconds: 90
  },
  {
    title: "Subarrays with K Different Integers (Exact K via At-Most K)",
    difficulty: "hard",
    topic: "sliding-window",
    subtopic: "longest window",
    concepts: ["Exact to At-Most Transformation", "Prefix Window"],
    type: "conceptual",
    question: "How is the number of subarrays with EXACTLY `k` distinct integers calculated using standard sliding window?",
    options: [
      { id: "A", text: "atMost(k) - atMost(k - 1)" },
      { id: "B", text: "atMost(k) + atMost(k - 1)" },
      { id: "C", text: "atMost(k) / 2" },
      { id: "D", text: "atMost(k * 2)" }
    ],
    correctOption: "A",
    explanation: "Counting atMost(k) distinct integers is monotonically solvable with a standard variable window. The count of exact k is `atMost(k) - atMost(k - 1)`.",
    expectedTimeSeconds: 95
  },
  {
    title: "Permutation in String (Anagram Substring)",
    difficulty: "medium",
    topic: "sliding-window",
    subtopic: "fixed window",
    concepts: ["Fixed Window", "Frequency Match Count", "O(26) or O(1) Check"],
    type: "complexity",
    question: "What is the time complexity of checking if string `s2` contains a permutation of `s1` where lengths are `n` and `m` respectively?",
    options: [
      { id: "A", text: "O(n) where n is length of s2, using a fixed window of size m" },
      { id: "B", text: "O(n * m!)" },
      { id: "C", text: "O(n * m log m)" },
      { id: "D", text: "O(2^m)" }
    ],
    correctOption: "A",
    explanation: "A sliding window of fixed size `m` over `s2` updating character matches achieves O(n) total time and O(1) extra space.",
    expectedTimeSeconds: 65
  },
  {
    title: "Max Consecutive Ones III (At Most K Zero Flips)",
    difficulty: "medium",
    topic: "sliding-window",
    subtopic: "variable window",
    concepts: ["Sliding Window", "Zero Counter", "Max Length"],
    type: "conceptual",
    question: "In Max Consecutive Ones III, when flipping at most `k` zeros, what does the window `[l, r]` maintain?",
    options: [
      { id: "A", text: "A contiguous subarray containing at most k zeros" },
      { id: "B", text: "An array of only ones" },
      { id: "C", text: "A sorted array" },
      { id: "D", text: "Exactly k ones" }
    ],
    correctOption: "A",
    explanation: "As long as the count of zeros inside [l, r] <= k, the window is valid and represents an all-1s streak after flipping at most k zeros.",
    expectedTimeSeconds: 70
  },
  {
    title: "Fruit Into Baskets (At Most 2 Distinct Elements)",
    difficulty: "medium",
    topic: "sliding-window",
    subtopic: "longest window",
    concepts: ["Variable Window", "Map Size Invariant", "Subarray"],
    type: "conceptual",
    question: "The Fruit Into Baskets problem is equivalent to which generic DSA problem formulation?",
    options: [
      { id: "A", text: "Longest contiguous subarray with at most 2 distinct elements" },
      { id: "B", text: "Knapsack 0/1" },
      { id: "C", text: "Two Sum" },
      { id: "D", text: "Longest Common Subsequence" }
    ],
    correctOption: "A",
    explanation: "Collecting from two baskets is isomorphic to finding the longest subarray containing at most 2 distinct integer types.",
    expectedTimeSeconds: 60
  },
  {
    title: "Minimum Window Subsequence vs Minimum Window Substring",
    difficulty: "hard",
    topic: "sliding-window",
    subtopic: "minimum window",
    concepts: ["Subsequence vs Substring", "Two Pointers Forward/Backward"],
    type: "conceptual",
    question: "What is the key difference between Minimum Window Substring and Minimum Window Subsequence?",
    options: [
      { id: "A", text: "Subsequence requires characters to appear in the exact relative order; Substring only requires character frequency presence" },
      { id: "B", text: "Subsequence does not care about order" },
      { id: "C", text: "Substring must be shorter than 5 characters" },
      { id: "D", text: "They are completely identical" }
    ],
    correctOption: "A",
    explanation: "Substring checks anagram-like multi-set containment; Subsequence mandates that characters match strictly in left-to-right sequence order.",
    expectedTimeSeconds: 85
  },

  // ────────────────── STACK (10 questions) ──────────────────
  {
    title: "Valid Parentheses Matching",
    difficulty: "easy",
    topic: "stack",
    subtopic: "parentheses",
    concepts: ["LIFO", "Bracket Matching", "Stack"],
    type: "code-output",
    question: "When processing a closing bracket `')'`, what two conditions must hold for the string to remain valid?",
    options: [
      { id: "A", text: "Stack must NOT be empty and top element must be the matching '('" },
      { id: "B", text: "Stack must be empty" },
      { id: "C", text: "Top element must be ')'" },
      { id: "D", text: "String length must be odd" }
    ],
    correctOption: "A",
    explanation: "A closing bracket must match the most recently opened bracket at top of stack. If stack is empty or top doesn't match, string is invalid.",
    expectedTimeSeconds: 45
  },
  {
    title: "Next Greater Element using Monotonic Stack",
    difficulty: "medium",
    topic: "stack",
    subtopic: "next greater",
    concepts: ["Monotonic Stack", "Decreasing Stack", "O(n) Traversal"],
    type: "conceptual",
    question: "When finding the Next Greater Element for every element in an array, what kind of monotonic stack is maintained?",
    options: [
      { id: "A", text: "A monotonically decreasing stack of elements/indices" },
      { id: "B", text: "A monotonically increasing stack" },
      { id: "C", text: "A random queue" },
      { id: "D", text: "A max-heap" }
    ],
    correctOption: "A",
    explanation: "Elements are pushed onto a decreasing stack. When a larger element arrives, it resolves the next greater element for all smaller top elements and pops them.",
    expectedTimeSeconds: 70
  },
  {
    title: "Largest Rectangle in Histogram",
    difficulty: "hard",
    topic: "stack",
    subtopic: "histogram",
    concepts: ["Monotonic Stack", "Left/Right Smaller Boundaries", "O(n) Time"],
    type: "conceptual",
    question: "In the histogram problem, when bar `h` is popped from an increasing monotonic stack because a shorter bar arrived, how is its width calculated?",
    options: [
      { id: "A", text: "width = currentIndex - stack.peek() - 1 (or currentIndex if stack is empty)" },
      { id: "B", text: "width = currentIndex" },
      { id: "C", text: "width = 1" },
      { id: "D", text: "width = stack.size()" }
    ],
    correctOption: "A",
    explanation: "The current index is the right first smaller bar, and the new stack top is the left first smaller bar. The rectangle width is `current - new_top - 1`.",
    expectedTimeSeconds: 95
  },
  {
    title: "Min Stack in O(1) Time and Space",
    difficulty: "medium",
    topic: "stack",
    subtopic: "basic stack",
    concepts: ["Min Stack", "Auxiliary Stack", "Value Encoding"],
    type: "conceptual",
    question: "How can `getMin()` be supported in O(1) time without extra memory per node using mathematical value encoding on a standard stack?",
    options: [
      { id: "A", text: "Push `2*val - minVal` whenever a new minimum `val` is inserted, allowing previous minimum recovery on pop" },
      { id: "B", text: "Sort the stack on every push" },
      { id: "C", text: "Store min at the bottom of the stack" },
      { id: "D", text: "Scan all elements on getMin()" }
    ],
    correctOption: "A",
    explanation: "If `val < minVal`, pushing `2*val - minVal` creates a value strictly less than `val`. Upon popping a value `< minVal`, previous minimum is restored via `2*minVal - popped`.",
    expectedTimeSeconds: 85
  },
  {
    title: "Daily Temperatures (Days to Warmer Temperature)",
    difficulty: "medium",
    topic: "stack",
    subtopic: "monotonic stack",
    concepts: ["Monotonic Stack", "Index Tracking", "Warmer Weather"],
    type: "code-output",
    question: "In Daily Temperatures, what values should be stored on the monotonic stack?",
    options: [
      { id: "A", text: "Indices of temperatures in strictly decreasing temperature order" },
      { id: "B", text: "Only temperature values without indices" },
      { id: "C", text: "Sorted array of all temperatures" },
      { id: "D", text: "Differences between adjacent days" }
    ],
    correctOption: "A",
    explanation: "Storing indices allows calculating the number of days waited via `currentDay - stack.pop()` when a warmer temperature is found.",
    expectedTimeSeconds: 65
  },
  {
    title: "Evaluate Reverse Polish Notation (Postfix)",
    difficulty: "medium",
    topic: "stack",
    subtopic: "expression evaluation",
    concepts: ["RPN", "Postfix Evaluation", "Operator Precedence"],
    type: "conceptual",
    question: "In Reverse Polish Notation `[\"4\", \"13\", \"5\", \"/\", \"+\"]`, when division `/` is encountered, which operand is the divisor?",
    options: [
      { id: "A", text: "The first popped element (second operand)" },
      { id: "B", text: "The second popped element" },
      { id: "C", text: "Always the number 1" },
      { id: "D", text: "The bottom of the stack" }
    ],
    correctOption: "A",
    explanation: "For `a b /`, stack has `a` below `b`. First pop is `b` (divisor), second pop is `a` (dividend). Result is `a / b` (13 / 5 = 2).",
    expectedTimeSeconds: 60
  },
  {
    title: "Asteroid Collision Simulation",
    difficulty: "medium",
    topic: "stack",
    subtopic: "basic stack",
    concepts: ["Stack Simulation", "Collision Resolution"],
    type: "conceptual",
    question: "In Asteroid Collision, when does a collision occur between top asteroid `top` and incoming asteroid `curr`?",
    options: [
      { id: "A", text: "Only when top > 0 (moving right) and curr < 0 (moving left)" },
      { id: "B", text: "Whenever both asteroids have opposite signs regardless of position" },
      { id: "C", text: "When top < 0 and curr > 0" },
      { id: "D", text: "When both are moving left" }
    ],
    correctOption: "A",
    explanation: "Asteroids only collide when the left one moves right (`top > 0`) and the right one moves left (`curr < 0`). If top moves left (`<0`) and curr moves right (`>0`), they move away from each other.",
    expectedTimeSeconds: 70
  },
  {
    title: "Next Smaller Element Calculation",
    difficulty: "medium",
    topic: "stack",
    subtopic: "next smaller",
    concepts: ["Monotonic Stack", "Increasing Stack"],
    type: "conceptual",
    question: "To find the next smaller element to the right for every index, we maintain:",
    options: [
      { id: "A", text: "A monotonically increasing stack from bottom to top" },
      { id: "B", text: "A monotonically decreasing stack" },
      { id: "C", text: "A priority queue" },
      { id: "D", text: "A doubly linked list" }
    ],
    correctOption: "A",
    explanation: "An increasing stack pops elements when an incoming smaller element arrives, establishing that incoming element as their next smaller value.",
    expectedTimeSeconds: 65
  },
  {
    title: "Remove All Adjacent Duplicates in String II (K Duplicates)",
    difficulty: "medium",
    topic: "stack",
    subtopic: "basic stack",
    concepts: ["Stack with Counts", "Pair Storage"],
    type: "conceptual",
    question: "What is the cleanest stack structure to remove k adjacent duplicates in single pass?",
    options: [
      { id: "A", text: "Stack storing pairs: `{char, currentCount}`" },
      { id: "B", text: "Repeatedly scanning string with regex" },
      { id: "C", text: "Recursive substring slicing" },
      { id: "D", text: "Two HashSets" }
    ],
    correctOption: "A",
    explanation: "Pushing `{char, count}` allows popping the streak in O(1) as soon as `count == k` without rescanning from the beginning.",
    expectedTimeSeconds: 65
  },
  {
    title: "Trapping Rain Water using Monotonic Decreasing Stack",
    difficulty: "hard",
    topic: "stack",
    subtopic: "monotonic stack",
    concepts: ["Bounded Area by Height", "Horizontal Bounded Water Layers"],
    type: "conceptual",
    question: "When Trapping Rain Water is solved using a stack, in which geometric orientation is water volume accumulated?",
    options: [
      { id: "A", text: "Horizontally, layer by layer between bounded valleys" },
      { id: "B", text: "Vertically column by column" },
      { id: "C", text: "Diagonally" },
      { id: "D", text: "Randomly" }
    ],
    correctOption: "A",
    explanation: "When a taller bar arrives, previous valley bottoms are popped and water is computed horizontally: `(min(h[left], h[right]) - h[bottom]) * (right - left - 1)`.",
    expectedTimeSeconds: 90
  },

  // ────────────────── QUEUE & BFS (8 questions) ──────────────────
  {
    title: "Queue Implementation using Two Stacks",
    difficulty: "easy",
    topic: "queue",
    subtopic: "queue",
    concepts: ["Two Stacks", "Amortized O(1)", "FIFO Order"],
    type: "complexity",
    question: "What is the amortized time complexity of `pop()` and `peek()` in a Queue implemented using two Stacks (inStack and outStack)?",
    options: [
      { id: "A", text: "Amortized O(1)" },
      { id: "B", text: "Strictly O(n)" },
      { id: "C", text: "O(log n)" },
      { id: "D", text: "O(n^2)" }
    ],
    correctOption: "A",
    explanation: "Each element is pushed to inStack once, transferred to outStack once, and popped from outStack once. Over n operations, total work is O(n), giving O(1) amortized per operation.",
    expectedTimeSeconds: 50
  },
  {
    title: "Circular Queue Index Calculation",
    difficulty: "medium",
    topic: "queue",
    subtopic: "circular queue",
    concepts: ["Circular Buffer", "Modulo Arithmetic", "Capacity"],
    type: "code-output",
    question: "In a fixed-size circular queue of capacity `K`, what formula calculates the next insertion index for `rear`?",
    options: [
      { id: "A", text: "(rear + 1) % K" },
      { id: "B", text: "rear + 1" },
      { id: "C", text: "(rear + K) % (K + 1)" },
      { id: "D", text: "rear % K + 1" }
    ],
    correctOption: "A",
    explanation: "Modulo `(rear + 1) % K` wraps the rear pointer around to index 0 when it exceeds index K - 1.",
    expectedTimeSeconds: 55
  },
  {
    title: "Deque - Double Ended Queue Operations",
    difficulty: "easy",
    topic: "queue",
    subtopic: "deque",
    concepts: ["Deque", "O(1) Ends", "Doubly Linked List"],
    type: "conceptual",
    question: "Which operations are guaranteed to run in O(1) time in a standard Deque?",
    options: [
      { id: "A", text: "pushFront, pushBack, popFront, popBack, peekFront, peekBack" },
      { id: "B", text: "Random access by index in O(1) in linked-list deque" },
      { id: "C", text: "Sorting in O(1)" },
      { id: "D", text: "Binary search in O(1)" }
    ],
    correctOption: "A",
    explanation: "A Deque supports constant-time insertion, deletion, and inspection at both the front and back ends.",
    expectedTimeSeconds: 45
  },
  {
    title: "Monotonic Queue Invariant for Moving Maximum",
    difficulty: "hard",
    topic: "queue",
    subtopic: "monotonic queue",
    concepts: ["Monotonic Queue", "Amortized Analysis"],
    type: "conceptual",
    question: "When pushing a new value `x` into a monotonic decreasing queue, what elements are evicted from the back of the queue?",
    options: [
      { id: "A", text: "All elements strictly smaller than x" },
      { id: "B", text: "All elements strictly greater than x" },
      { id: "C", text: "Only the front element" },
      { id: "D", text: "No elements are evicted" }
    ],
    correctOption: "A",
    explanation: "Any element smaller than x is older and smaller, so it can never be the maximum of any current or future window. Evicting them maintains monotonic decreasing order.",
    expectedTimeSeconds: 85
  },
  {
    title: "Rotting Oranges Multi-Source BFS",
    difficulty: "medium",
    topic: "queue",
    subtopic: "BFS",
    concepts: ["Multi-Source BFS", "Queue", "Grid Traversal"],
    type: "conceptual",
    question: "Why is multi-source BFS starting with ALL initially rotten oranges pushed into the queue at minute 0 required instead of multiple separate BFS runs?",
    options: [
      { id: "A", text: "All rotten oranges contaminate adjacent fresh oranges simultaneously in parallel waves" },
      { id: "B", text: "To avoid using a 2D array" },
      { id: "C", text: "Because DFS is faster" },
      { id: "D", text: "To sort oranges by size" }
    ],
    correctOption: "A",
    explanation: "Multi-source BFS simulates parallel wavefront propagation level-by-level, finding the true shortest time for each orange to rot.",
    expectedTimeSeconds: 75
  },
  {
    title: "Shortest Path in Binary Matrix (0/1 Grid BFS)",
    difficulty: "medium",
    topic: "queue",
    subtopic: "BFS",
    concepts: ["BFS Shortest Path", "Unweighted Graph", "Level Order"],
    type: "conceptual",
    question: "Why does standard BFS guarantee the shortest path in an unweighted grid with 8-directional movement?",
    options: [
      { id: "A", text: "BFS explores all vertices at distance d before moving to distance d+1" },
      { id: "B", text: "BFS uses Dijkstra's greedy edge weights" },
      { id: "C", text: "BFS visits diagonally first" },
      { id: "D", text: "BFS sorts coordinates" }
    ],
    correctOption: "A",
    explanation: "In graphs with uniform edge weights (1 step per move), the first time BFS visits the target node is mathematically guaranteed to be the shortest path.",
    expectedTimeSeconds: 65
  },
  {
    title: "Open the Lock - Minimum Combinations BFS",
    difficulty: "medium",
    topic: "queue",
    subtopic: "BFS",
    concepts: ["State Space Search", "Queue", "Visited Set"],
    type: "conceptual",
    question: "When finding minimum turns to reach target lock combination, what represents a vertex and an edge?",
    options: [
      { id: "A", text: "Vertex: 4-digit combination string; Edge: 1 turn of a single wheel (+1 or -1 mod 10)" },
      { id: "B", text: "Vertex: number of deadends; Edge: target code" },
      { id: "C", text: "Vertex: wheel index; Edge: digit value" },
      { id: "D", text: "Linear array indices" }
    ],
    correctOption: "A",
    explanation: "There are 10,000 state vertices. Each state connects to 8 neighbors (turning any of the 4 wheels up or down). BFS finds the shortest path avoiding deadends.",
    expectedTimeSeconds: 70
  },
  {
    title: "Word Ladder Bidirectional BFS Optimization",
    difficulty: "hard",
    topic: "queue",
    subtopic: "BFS",
    concepts: ["Bidirectional BFS", "Branching Factor", "Exponential Search Space"],
    type: "complexity",
    question: "How does Bidirectional BFS improve time complexity over standard single-source BFS with branching factor `b` and distance `d`?",
    options: [
      { id: "A", text: "Reduces search space from O(b^d) to O(b^(d/2)) by searching from beginWord and endWord simultaneously" },
      { id: "B", text: "Reduces space to O(1)" },
      { id: "C", text: "Eliminates need for visited set" },
      { id: "D", text: "Guarantees O(d) without branching" }
    ],
    correctOption: "A",
    explanation: "Meeting in the middle searches two smaller trees of depth d/2 rather than one massive tree of depth d, saving exponential work.",
    expectedTimeSeconds: 90
  },

  // ────────────────── LINKED LIST (10 questions) ──────────────────
  {
    title: "Reverse a Singly Linked List In-Place",
    difficulty: "easy",
    topic: "linked-list",
    subtopic: "reversal",
    concepts: ["Pointer Manipulation", "3 Pointers (prev, curr, next)", "O(1) Space"],
    type: "code-output",
    question: "What is the correct 4-step pointer rotation inside the traversal loop to reverse a linked list in-place?",
    codeSnippet: "next = curr.next;\ncurr.next = prev;\nprev = curr;\ncurr = next;",
    options: [
      { id: "A", text: "Save next -> Point curr.next to prev -> Advance prev to curr -> Advance curr to next" },
      { id: "B", text: "curr.next = prev -> prev = curr -> curr = curr.next" },
      { id: "C", text: "prev.next = curr -> curr = next" },
      { id: "D", text: "Swap head and tail values" }
    ],
    correctOption: "A",
    explanation: "Saving `next` before overwriting `curr.next = prev` prevents losing the rest of the list. Then `prev` and `curr` step forward.",
    expectedTimeSeconds: 50
  },
  {
    title: "Floyd's Cycle-Finding Algorithm (Tortoise and Hare)",
    difficulty: "medium",
    topic: "linked-list",
    subtopic: "fast/slow",
    concepts: ["Fast and Slow Pointers", "Cycle Detection", "Floyd's Proof"],
    type: "conceptual",
    question: "If a cycle exists in a linked list and `fast` moves 2 steps while `slow` moves 1 step, why are they guaranteed to meet?",
    options: [
      { id: "A", text: "The relative distance between fast and slow decreases by exactly 1 in each step inside the cycle" },
      { id: "B", text: "Because fast always laps slow twice" },
      { id: "C", text: "Because linked list cycles are always even in length" },
      { id: "D", text: "Only if the cycle begins at head" }
    ],
    correctOption: "A",
    explanation: "Inside the loop, `fast` closes the gap by `2 - 1 = 1` node per step. A gap of `k` nodes decreases by 1 each iteration until it reaches 0 (they meet).",
    expectedTimeSeconds: 65
  },
  {
    title: "Finding the Cycle Start Node (Floyd's Phase 2)",
    difficulty: "medium",
    topic: "linked-list",
    subtopic: "cycle",
    concepts: ["Floyd's Algorithm", "Mathematical Proof", "Meeting Point"],
    type: "conceptual",
    question: "After `fast` and `slow` meet inside the cycle, how do you locate the exact entry node of the cycle?",
    options: [
      { id: "A", text: "Reset one pointer to head, keep other at meeting point, and advance both 1 step at a time until they meet" },
      { id: "B", text: "Advance fast by 2 steps from meeting point" },
      { id: "C", text: "Count total nodes in cycle and divide by 2" },
      { id: "D", text: "The meeting point is always the cycle start" }
    ],
    correctOption: "A",
    explanation: "Distance from head to cycle entrance equals distance from meeting point to cycle entrance modulo cycle length (L = n*C - k). Moving both 1 step per turn finds the entrance.",
    expectedTimeSeconds: 80
  },
  {
    title: "Merge Two Sorted Linked Lists with Dummy Head",
    difficulty: "easy",
    topic: "linked-list",
    subtopic: "merge",
    concepts: ["Dummy Node", "Pointer Splice", "O(1) Space"],
    type: "conceptual",
    question: "What is the primary benefit of using a `dummy` (sentinel) node when merging two sorted linked lists?",
    options: [
      { id: "A", text: "Eliminates special boundary handling for creating the new list's head" },
      { id: "B", text: "Reduces time complexity from O(n) to O(1)" },
      { id: "C", text: "Avoids allocating memory on heap" },
      { id: "D", text: "Automatically sorts the elements" }
    ],
    correctOption: "A",
    explanation: "A dummy node provides a fixed non-null anchor point. `dummy.next` points to the true merged head, avoiding `if (head == null)` branch checks in the loop.",
    expectedTimeSeconds: 45
  },
  {
    title: "Remove N-th Node From End of List in One Pass",
    difficulty: "medium",
    topic: "linked-list",
    subtopic: "fast/slow",
    concepts: ["Two Pointers", "Offset Gap", "Single Pass"],
    type: "conceptual",
    question: "How do you delete the N-th node from the end of a linked list in a single pass?",
    options: [
      { id: "A", text: "Advance fast pointer N+1 steps ahead of slow pointer, then advance both together until fast reaches null" },
      { id: "B", text: "Count total length in pass 1, then traverse to L-N in pass 2" },
      { id: "C", text: "Reverse the list twice" },
      { id: "D", text: "Store all nodes in an array" }
    ],
    correctOption: "A",
    explanation: "Maintaining a gap of `N+1` nodes between `slow` and `fast` ensures `slow` stops directly at the node preceding the target deletion node when `fast` hits null.",
    expectedTimeSeconds: 65
  },
  {
    title: "Intersection of Two Linked Lists in O(1) Space",
    difficulty: "easy",
    topic: "linked-list",
    subtopic: "intersection",
    concepts: ["Two Pointers", "Path Alignment", "O(1) Space"],
    type: "conceptual",
    question: "When pointer `pA` reaches the end of list A, it switches to head of list B; pointer `pB` does the same for list A. Why will they meet at the intersection node?",
    options: [
      { id: "A", text: "Both pointers traverse exactly length(A) + length(B) steps, equalizing any initial length discrepancy" },
      { id: "B", text: "Because list A and list B must have identical lengths" },
      { id: "C", text: "Because of hash collisions" },
      { id: "D", text: "They meet only at null" }
    ],
    correctOption: "A",
    explanation: "Path traversed by pA is `a + c + b`; path traversed by pB is `b + c + a`. Both distances are identical, so they reach the intersection node simultaneously in pass 2.",
    expectedTimeSeconds: 60
  },
  {
    title: "Palindrome Linked List in O(1) Space",
    difficulty: "medium",
    topic: "linked-list",
    subtopic: "palindrome",
    concepts: ["Fast-Slow", "Half List Reversal", "Comparison"],
    type: "conceptual",
    question: "How can you verify if a singly linked list is a palindrome in O(n) time and O(1) auxiliary space?",
    options: [
      { id: "A", text: "Find middle using fast/slow pointers -> reverse second half -> compare halves -> restore list" },
      { id: "B", text: "Copy node values to an ArrayList" },
      { id: "C", text: "Use recursive call stack with O(n) memory" },
      { id: "D", text: "Compare head and tail node values repeatedly with nested loops in O(n^2)" }
    ],
    correctOption: "A",
    explanation: "Reversing only the second half of the list allows in-place two-pointer comparison against the first half in O(1) extra space.",
    expectedTimeSeconds: 75
  },
  {
    title: "Merge K Sorted Linked Lists using Min-Heap",
    difficulty: "hard",
    topic: "linked-list",
    subtopic: "merge",
    concepts: ["Priority Queue", "Min-Heap", "K-way Merge"],
    type: "complexity",
    question: "What is the time complexity of merging `k` sorted linked lists with a total of `N` nodes using a min-heap?",
    options: [
      { id: "A", text: "O(N log k)" },
      { id: "B", text: "O(N * k)" },
      { id: "C", text: "O(N log N)" },
      { id: "D", text: "O(k log N)" }
    ],
    correctOption: "A",
    explanation: "The min-heap stores at most `k` node pointers. For each of the `N` nodes, heap extraction and insertion takes O(log k), yielding O(N log k) total time.",
    expectedTimeSeconds: 70
  },
  {
    title: "Copy List with Random Pointer in O(1) Space",
    difficulty: "medium",
    topic: "linked-list",
    subtopic: "traversal",
    concepts: ["Interweaving Nodes", "Cloning", "O(1) Auxiliary Space"],
    type: "conceptual",
    question: "How do we clone a linked list with random pointers in O(1) extra space (without a Hash Map)?",
    options: [
      { id: "A", text: "Interweave cloned nodes directly next to originals (`curr.next = copy`), copy random pointers, then separate the two lists" },
      { id: "B", text: "Hash Map mapping original -> clone" },
      { id: "C", text: "Sort by random pointers" },
      { id: "D", text: "Random pointers cannot be cloned without HashMap" }
    ],
    correctOption: "A",
    explanation: "Interweaving creates `A -> A' -> B -> B'`. Then `curr.next.random = curr.random.next`. Finally, unweave to restore original list and return copy.",
    expectedTimeSeconds: 85
  },
  {
    title: "Reverse Nodes in k-Group",
    difficulty: "hard",
    topic: "linked-list",
    subtopic: "reversal",
    concepts: ["K-Group Reversal", "Pointer Splicing", "Recursive/Iterative"],
    type: "conceptual",
    question: "In Reverse Nodes in k-Group, what should happen to the remaining nodes if fewer than `k` nodes remain at the end of the list?",
    options: [
      { id: "A", text: "Leave them in their original order without reversing" },
      { id: "B", text: "Reverse them anyway" },
      { id: "C", text: "Delete them" },
      { id: "D", text: "Pad with dummy zero nodes" }
    ],
    correctOption: "A",
    explanation: "Per specification, if the number of remaining nodes is not a multiple of k, they must remain in their original relative positions.",
    expectedTimeSeconds: 80
  },

  // ────────────────── BINARY SEARCH (10 questions) ──────────────────
  {
    title: "Binary Search Midpoint Calculation to Avoid Overflow",
    difficulty: "easy",
    topic: "binary-search",
    subtopic: "basic search",
    concepts: ["Integer Overflow", "Midpoint Formula", "Low-Level Systems"],
    type: "code-output",
    question: "Why is `mid = low + (high - low) / 2` preferred over `mid = (low + high) / 2` in C++ / Java?",
    options: [
      { id: "A", text: "Prevents 32-bit signed integer overflow when `low + high > 2^31 - 1`" },
      { id: "B", text: "It executes faster at hardware CPU level" },
      { id: "C", text: "It rounds upwards" },
      { id: "D", text: "It works on linked lists" }
    ],
    correctOption: "A",
    explanation: "If low and high are large positive integers (e.g. 1.5 billion each), `low + high` overflows 32-bit signed max (2,147,483,647) becoming negative.",
    expectedTimeSeconds: 45
  },
  {
    title: "Lower Bound vs Upper Bound in Sorted Array",
    difficulty: "medium",
    topic: "binary-search",
    subtopic: "lower bound",
    concepts: ["Lower Bound", "Upper Bound", "Binary Search Boundaries"],
    type: "conceptual",
    question: "What is the precise definition of `lower_bound` for value `x` in a sorted array?",
    options: [
      { id: "A", text: "The first index where element is GREATER THAN OR EQUAL to x (`>= x`)" },
      { id: "B", text: "The first index where element is strictly greater than x (`> x`)" },
      { id: "C", text: "The last index where element equals x" },
      { id: "D", text: "The middle index of x" }
    ],
    correctOption: "A",
    explanation: "`lower_bound` returns the iterator/index to the first element that is `>= x`. `upper_bound` returns the first element that is `> x`.",
    expectedTimeSeconds: 60
  },
  {
    title: "Search in Rotated Sorted Array Invariant",
    difficulty: "medium",
    topic: "binary-search",
    subtopic: "rotated array",
    concepts: ["Rotated Array", "Sorted Half Property", "Binary Search"],
    type: "conceptual",
    question: "In a rotated sorted array without duplicates, what property is GUARANTEED for every midpoint `mid`?",
    options: [
      { id: "A", text: "At least one half (either [low..mid] or [mid..high]) is strictly sorted" },
      { id: "B", text: "Both halves are always sorted" },
      { id: "C", text: "The minimum is always at mid" },
      { id: "D", text: "Target must be in the left half" }
    ],
    correctOption: "A",
    explanation: "Dividing a rotated sorted array at any point always leaves at least one of the two halves cleanly sorted. We can test if target falls in that sorted range.",
    expectedTimeSeconds: 75
  },
  {
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "medium",
    topic: "binary-search",
    subtopic: "rotated array",
    concepts: ["Inflection Point", "Comparison with High Boundary"],
    type: "code-output",
    question: "To find the minimum element in a rotated array `nums`, why do we compare `nums[mid]` with `nums[high]`?",
    options: [
      { id: "A", text: "If `nums[mid] > nums[high]`, the inflection/minimum MUST be in the right half `[mid+1..high]`" },
      { id: "B", text: "If nums[mid] > nums[high], minimum is in left half" },
      { id: "C", text: "Because nums[high] is always the maximum" },
      { id: "D", text: "To sort the array" }
    ],
    correctOption: "A",
    explanation: "When `nums[mid] > nums[high]`, the rotation pivot (and smallest element) must lie to the right of `mid`. Hence `low = mid + 1`.",
    expectedTimeSeconds: 70
  },
  {
    title: "Search a 2D Matrix in O(log(m*n))",
    difficulty: "medium",
    topic: "binary-search",
    subtopic: "matrix search",
    concepts: ["Virtual 1D Array", "Coordinate Mapping", "2D Binary Search"],
    type: "code-output",
    question: "If an m x n matrix is sorted such that each row's last element is smaller than the next row's first element, how is virtual index `mid` mapped to 2D coordinates?",
    options: [
      { id: "A", text: "row = mid / n, col = mid % n" },
      { id: "B", text: "row = mid % m, col = mid / m" },
      { id: "C", text: "row = mid / m, col = mid % n" },
      { id: "D", text: "row = mid * n, col = mid + n" }
    ],
    correctOption: "A",
    explanation: "The matrix behaves as a contiguous 1D array of length `m * n`. Dividing by number of columns `n` gives the row index; modulo `n` gives the column index.",
    expectedTimeSeconds: 60
  },
  {
    title: "Binary Search on Answer - Koko Eating Bananas",
    difficulty: "medium",
    topic: "binary-search",
    subtopic: "search on answer",
    concepts: ["Monotonic Feasibility", "Search Space Range", "Ceil Division"],
    type: "conceptual",
    question: "Why is 'Binary Search on Answer' applicable to Koko Eating Bananas (and Capacity to Ship Packages)?",
    options: [
      { id: "A", text: "Feasibility is monotonic: if speed k is sufficient to finish in H hours, any speed > k is also sufficient" },
      { id: "B", text: "Because the piles array is already sorted" },
      { id: "C", text: "Because hours H is always equal to piles.length" },
      { id: "D", text: "Because we use a Hash Table" }
    ],
    correctOption: "A",
    explanation: "When the predicate `canFinish(speed)` is monotonic (False, False, ..., True, True), binary search finds the minimum feasible value in O(N log(max_val)) time.",
    expectedTimeSeconds: 80
  },
  {
    title: "Median of Two Sorted Arrays in O(log(min(M, N)))",
    difficulty: "hard",
    topic: "binary-search",
    subtopic: "search on answer",
    concepts: ["Binary Search Partition", "Median Invariant", "Logarithmic Time"],
    type: "conceptual",
    question: "In the optimal O(log(min(M, N))) solution for Median of Two Sorted Arrays, what condition confirms a valid partition between arrays A and B?",
    options: [
      { id: "A", text: "maxLeftA <= minRightB AND maxLeftB <= minRightA" },
      { id: "B", text: "maxLeftA == maxLeftB" },
      { id: "C", text: "minRightA == minRightB" },
      { id: "D", text: "sum(leftPart) == sum(rightPart)" }
    ],
    correctOption: "A",
    explanation: "A valid median partition requires that all elements in the left combined half are less than or equal to all elements in the right combined half.",
    expectedTimeSeconds: 100
  },
  {
    title: "Peak Index in a Mountain Array",
    difficulty: "easy",
    topic: "binary-search",
    subtopic: "basic search",
    concepts: ["Mountain Array", "Slope Detection", "O(log n)"],
    type: "code-output",
    question: "In a mountain array, if `arr[mid] < arr[mid + 1]`, in which direction is the peak?",
    options: [
      { id: "A", text: "Right: `low = mid + 1` (we are on the ascending slope)" },
      { id: "B", text: "Left: `high = mid - 1`" },
      { id: "C", text: "Peak is at mid" },
      { id: "D", text: "Peak cannot be found with binary search" }
    ],
    correctOption: "A",
    explanation: "If `arr[mid] < arr[mid + 1]`, we are on the upward slope before the peak, so the peak must exist at an index >= `mid + 1`.",
    expectedTimeSeconds: 50
  },
  {
    title: "Split Array Largest Sum - Binary Search Predicate",
    difficulty: "hard",
    topic: "binary-search",
    subtopic: "search on answer",
    concepts: ["Minimax Partition", "Greedy Subarray Packing", "Binary Search on Answer"],
    type: "conceptual",
    question: "What are the search bounds `[low, high]` when binary searching for the minimized largest sum among `k` subarrays?",
    options: [
      { id: "A", text: "low = max(nums) (largest single element), high = sum(nums) (all elements in 1 subarray)" },
      { id: "B", text: "low = 0, high = nums.length" },
      { id: "C", text: "low = min(nums), high = max(nums)" },
      { id: "D", text: "low = 1, high = k" }
    ],
    correctOption: "A",
    explanation: "No subarray can have a sum smaller than the largest individual element (`max(nums)`), and at most one subarray contains all elements (`sum(nums)`).",
    expectedTimeSeconds: 85
  },
  {
    title: "Single Element in a Sorted Array (Pairs Pattern)",
    difficulty: "medium",
    topic: "binary-search",
    subtopic: "basic search",
    concepts: ["Parity of Indices", "Duplicate Pairs", "O(log n)"],
    type: "conceptual",
    question: "In a sorted array where every element appears twice except one single element, what parity property holds for pairs BEFORE the single element?",
    options: [
      { id: "A", text: "First instance is at an EVEN index, second instance is at an ODD index (`even-odd` pattern)" },
      { id: "B", text: "First instance is at an ODD index, second at EVEN index" },
      { id: "C", text: "Both instances are at even indices" },
      { id: "D", text: "Indices have no pattern" }
    ],
    correctOption: "A",
    explanation: "Before the unique element, pairs start at even indices (0, 2, 4...). After the unique element, this pattern shifts to (odd, even). Testing `mid ^ 1` finds the disruption in O(log n).",
    expectedTimeSeconds: 75
  }
];

// Export question bank
module.exports = ASSESSMENT_QUESTIONS;
