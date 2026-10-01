import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import Navbar from '../components/Navbar';

const TOPIC_CATEGORIES = [
  { id: 'ALL', label: 'All Topics' },
  { id: 'FUNDAMENTALS', label: 'Fundamentals' },
  { id: 'LINEAR', label: 'Linear Data Structures' },
  { id: 'TREES_GRAPHS', label: 'Trees & Graphs' },
  { id: 'ALGORITHMS', label: 'Advanced Algorithms' }
];

const DSA_CURRICULUM = [
  {
    slug: 'arrays',
    title: 'Arrays',
    category: 'FUNDAMENTALS',
    icon: '📊',
    color: '#6c8ef7',
    description: 'The foundation of data structures. Focus on memory indexing, two-pointer traversals, prefix sums, and Kadane’s algorithm.',
    subtopics: ['Traversal', 'Prefix Sum', 'Kadane Algorithm', 'Two Pointers', 'Subarrays', 'Matrix Manipulation'],
    problemCount: 15,
    difficulty: { easy: 6, medium: 7, hard: 2 }
  },
  {
    slug: 'strings',
    title: 'Strings',
    category: 'FUNDAMENTALS',
    icon: '🔤',
    color: '#f59e0b',
    description: 'Character manipulation, palindrome verification, anagrams, substring hashing, and pattern matching.',
    subtopics: ['Palindromes', 'Anagrams', 'Substrings', 'Pattern Matching', 'Rabin-Karp', 'Character Frequency'],
    problemCount: 12,
    difficulty: { easy: 5, medium: 5, hard: 2 }
  },
  {
    slug: 'hashing',
    title: 'Hashing',
    category: 'FUNDAMENTALS',
    icon: '🗝️',
    color: '#10b981',
    description: 'O(1) lookups using HashMaps and HashSets. Complement searching, frequency counts, and prefix sum combinations.',
    subtopics: ['HashMap & HashSet', 'Complement Lookup', 'Frequency Map', 'Prefix Sum + Hash', 'Duplicate Detection'],
    problemCount: 12,
    difficulty: { easy: 5, medium: 5, hard: 2 }
  },
  {
    slug: 'two-pointers',
    title: 'Two Pointers',
    category: 'LINEAR',
    icon: '👉👈',
    color: '#8b5cf6',
    description: 'Iterating arrays from opposite ends or same direction. Essential for sorted arrays, triplets, and partitioning.',
    subtopics: ['Opposite Direction', 'Same Direction', 'Pair Sums', 'Triplets', 'Dutch National Flag'],
    problemCount: 10,
    difficulty: { easy: 4, medium: 5, hard: 1 }
  },
  {
    slug: 'sliding-window',
    title: 'Sliding Window',
    category: 'LINEAR',
    icon: '🪟',
    color: '#ec4899',
    description: 'Subarray and substring problems with fixed and variable size windows. Key for minimum/maximum window constraints.',
    subtopics: ['Fixed Window', 'Variable Window', 'Longest Substring', 'Minimum Window', 'Frequency Window'],
    problemCount: 12,
    difficulty: { easy: 3, medium: 7, hard: 2 }
  },
  {
    slug: 'stack',
    title: 'Stack',
    category: 'LINEAR',
    icon: '🥞',
    color: '#f43f5e',
    description: 'LIFO structures, parentheses validation, monotonic stacks for Next Greater Element, and largest rectangle problems.',
    subtopics: ['Valid Parentheses', 'Next Greater Element', 'Monotonic Stack', 'Largest Rectangle', 'Expression Eval'],
    problemCount: 12,
    difficulty: { easy: 4, medium: 6, hard: 2 }
  },
  {
    slug: 'queue',
    title: 'Queue & Deque',
    category: 'LINEAR',
    icon: '🚶‍♂️🚶‍♀️',
    color: '#06b6d4',
    description: 'FIFO structures, sliding window maximum with Monotonic Deques, and Breadth-First Search buffers.',
    subtopics: ['Circular Queue', 'Deque Operations', 'Monotonic Deque', 'Sliding Window Max', 'Queue via Stacks'],
    problemCount: 8,
    difficulty: { easy: 3, medium: 4, hard: 1 }
  },
  {
    slug: 'linked-list',
    title: 'Linked List',
    category: 'LINEAR',
    icon: '🔗',
    color: '#3b82f6',
    description: 'Pointers and node manipulation. Reversal, cycle detection (Floyd’s algorithm), merging, and palindrome checking.',
    subtopics: ['Reversal', 'Fast & Slow Pointers', 'Cycle Detection', 'Merge Sorted Lists', 'LRU Cache'],
    problemCount: 12,
    difficulty: { easy: 4, medium: 6, hard: 2 }
  },
  {
    slug: 'binary-search',
    title: 'Binary Search',
    category: 'ALGORITHMS',
    icon: '🔍',
    color: '#14b8a6',
    description: 'Logarithmic search on sorted arrays, rotated arrays, lower/upper bounds, and binary search on answer spaces.',
    subtopics: ['Lower / Upper Bound', 'Rotated Sorted Array', 'Binary Search on Answer', 'Matrix Search', 'Peak Element'],
    problemCount: 12,
    difficulty: { easy: 4, medium: 6, hard: 2 }
  },
  {
    slug: 'recursion',
    title: 'Recursion',
    category: 'FUNDAMENTALS',
    icon: '🌀',
    color: '#a855f7',
    description: 'Subproblems, base cases, recursion trees, divide-and-conquer, and recursion with memoization foundations.',
    subtopics: ['Base Cases', 'Divide & Conquer', 'Recursive Strings', 'Merge Sort', 'Quick Sort'],
    problemCount: 8,
    difficulty: { easy: 3, medium: 4, hard: 1 }
  },
  {
    slug: 'backtracking',
    title: 'Backtracking',
    category: 'ALGORITHMS',
    icon: '🌲',
    color: '#eab308',
    description: 'Exhaustive state-space search with pruning. Subsets, permutations, combinations, N-Queens, and Sudoku.',
    subtopics: ['Subsets & Power Set', 'Permutations', 'Combinations', 'N-Queens', 'Word Search', 'Sudoku Solver'],
    problemCount: 10,
    difficulty: { easy: 2, medium: 6, hard: 2 }
  },
  {
    slug: 'trees',
    title: 'Binary Trees',
    category: 'TREES_GRAPHS',
    icon: '🌳',
    color: '#22c55e',
    description: 'Hierarchical node traversal: Preorder, Inorder, Postorder, and Level-order BFS. Height, diameter, and path sums.',
    subtopics: ['DFS Traversals', 'Level Order BFS', 'Max Depth & Diameter', 'LCA', 'Path Sum', 'Tree Serialization'],
    problemCount: 15,
    difficulty: { easy: 5, medium: 8, hard: 2 }
  },
  {
    slug: 'bst',
    title: 'Binary Search Trees',
    category: 'TREES_GRAPHS',
    icon: '⚖️',
    color: '#84cc16',
    description: 'Sorted tree properties, validation, k-th smallest element, LCA in BST, and range queries.',
    subtopics: ['BST Validation', 'K-th Smallest', 'Inorder Successor', 'LCA in BST', 'Sorted Array to BST'],
    problemCount: 10,
    difficulty: { easy: 4, medium: 5, hard: 1 }
  },
  {
    slug: 'heap',
    title: 'Heap & Priority Queue',
    category: 'LINEAR',
    icon: '🏔️',
    color: '#f97316',
    description: 'Min-heaps, max-heaps, top-K frequent elements, median of a data stream, and k-way merging.',
    subtopics: ['Min / Max Heap', 'Top K Elements', 'Kth Largest Element', 'Merge K Sorted Lists', 'Median from Stream'],
    problemCount: 10,
    difficulty: { easy: 3, medium: 5, hard: 2 }
  },
  {
    slug: 'greedy',
    title: 'Greedy Algorithms',
    category: 'ALGORITHMS',
    icon: '🎯',
    color: '#0ea5e9',
    description: 'Making the locally optimal choice. Interval scheduling, jump games, activity selection, and gas station problems.',
    subtopics: ['Interval Scheduling', 'Activity Selection', 'Jump Game', 'Gas Station', 'Task Scheduler'],
    problemCount: 10,
    difficulty: { easy: 3, medium: 5, hard: 2 }
  },
  {
    slug: 'graphs',
    title: 'Graphs',
    category: 'TREES_GRAPHS',
    icon: '🕸️',
    color: '#6366f1',
    description: 'Adjacency lists, BFS/DFS traversals, cycle detection, topological sort (Kahn’s), and Dijkstra shortest paths.',
    subtopics: ['BFS & DFS', 'Cycle Detection', 'Topological Sort', 'Dijkstra Algorithm', 'Connected Components', 'Bipartite Graph'],
    problemCount: 15,
    difficulty: { easy: 3, medium: 9, hard: 3 }
  },
  {
    slug: 'dynamic-programming',
    title: 'Dynamic Programming',
    category: 'ALGORITHMS',
    icon: '⚡',
    color: '#d946ef',
    description: 'Overlapping subproblems and optimal substructure. 1D DP, 2D Grid DP, 0/1 Knapsack, and Longest Common Subsequence.',
    subtopics: ['1D DP (Climbing Stairs)', '0/1 Knapsack & Unbounded', 'Longest Common Subsequence', 'Longest Increasing Subsequence', 'Grid DP', 'Edit Distance'],
    problemCount: 18,
    difficulty: { easy: 3, medium: 10, hard: 5 }
  },
  {
    slug: 'bit-manipulation',
    title: 'Bit Manipulation',
    category: 'FUNDAMENTALS',
    icon: '0️⃣1️⃣',
    color: '#06b6d4',
    description: 'Bitwise AND, OR, XOR, shifts, counting set bits, finding single numbers, and bitmasking techniques.',
    subtopics: ['XOR Operations', 'Single Number', 'Counting Bits', 'Power of Two', 'Bitmasking Subsets'],
    problemCount: 8,
    difficulty: { easy: 4, medium: 3, hard: 1 }
  },
  {
    slug: 'trie',
    title: 'Trie (Prefix Tree)',
    category: 'TREES_GRAPHS',
    icon: '🔤🌲',
    color: '#e11d48',
    description: 'Tree structure for string prefixes. Fast autocomplete, spell checking, and maximum XOR pairs.',
    subtopics: ['Insert & Search', 'StartsWith Prefix', 'Word Dictionary (Regex)', 'Maximum XOR with Trie'],
    problemCount: 6,
    difficulty: { easy: 1, medium: 4, hard: 1 }
  },
  {
    slug: 'union-find',
    title: 'Union Find (DSU)',
    category: 'TREES_GRAPHS',
    icon: '🧩',
    color: '#8b5cf6',
    description: 'Disjoint Set Union with path compression and union by rank. Kruskal’s MST and redundant connection detection.',
    subtopics: ['Disjoint Set Union (DSU)', 'Connected Components', 'Cycle Detection', 'Redundant Connection', 'Kruskal MST'],
    problemCount: 6,
    difficulty: { easy: 1, medium: 4, hard: 1 }
  }
];

export default function ExplorePage() {
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = DSA_CURRICULUM.filter((t) => {
    if (selectedCat !== 'ALL' && t.category !== selectedCat) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchSub = t.subtopics.some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchSub) return false;
    }
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0a0b0e', color: '#e8eaf0', fontFamily: "'Syne', -apple-system, sans-serif" }}>
      <Navbar />

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '36px 24px 64px' }}>
        {/* Header Hero */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '16px', background: 'rgba(108, 142, 247, 0.1)', border: '1px solid rgba(108, 142, 247, 0.25)', color: '#6c8ef7', fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>
            <span>🗺️ Complete DSA Roadmap</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.8px', marginBottom: '8px' }}>
            Explore Data Structures & Algorithms
          </h1>
          <p style={{ fontSize: '14px', color: '#888d9f', maxWidth: '640px', lineHeight: 1.6 }}>
            Master all 20 essential DSA domains. Each topic includes comprehensive subtopics, curated coding problems, and targeted AI-driven assessments.
          </p>
        </div>

        {/* Filters and Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '28px',
          flexWrap: 'wrap'
        }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {TOPIC_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: selectedCat === cat.id ? '1px solid #6c8ef7' : '1px solid #1e2230',
                  background: selectedCat === cat.id ? 'rgba(108, 142, 247, 0.15)' : '#131620',
                  color: selectedCat === cat.id ? '#6c8ef7' : '#888d9f',
                  transition: 'all 0.15s'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '280px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555870', fontSize: '14px' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Search topics or subtopics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                background: '#131620',
                border: '1px solid #1e2230',
                borderRadius: '8px',
                color: '#e8eaf0',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Topics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '20px'
        }}>
          {filteredTopics.map((t) => (
            <div
              key={t.slug}
              style={{
                background: '#131620',
                border: '1px solid #1e2230',
                borderRadius: '14px',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.2s, transform 0.2s',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = t.color;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#1e2230';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Header */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: `${t.color}15`,
                      border: `1px solid ${t.color}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px'
                    }}>
                      {t.icon}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#e8eaf0' }}>{t.title}</h3>
                      <span style={{ fontSize: '11px', color: '#7a8099', fontFamily: "'JetBrains Mono', monospace" }}>
                        {t.problemCount} Core Problems
                      </span>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: `${t.color}15`,
                    color: t.color,
                    border: `1px solid ${t.color}30`,
                    fontFamily: "'JetBrains Mono', monospace"
                  }}>
                    {t.category}
                  </span>
                </div>

                <p style={{ fontSize: '13px', color: '#888d9f', lineHeight: 1.5, marginBottom: '16px' }}>
                  {t.description}
                </p>

                {/* Subtopics Pills */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#555870', letterSpacing: '0.6px', marginBottom: '6px', fontFamily: "'JetBrains Mono', monospace" }}>
                    Key Subtopics
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {t.subtopics.map((sub) => (
                      <span
                        key={sub}
                        style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: '#0d0e14',
                          border: '1px solid #202434',
                          color: '#a0a5ba'
                        }}
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div style={{ borderTop: '1px solid #181b26', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '8px', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace" }}>
                  <span style={{ color: '#22c55e' }}>{t.difficulty.easy} Easy</span>
                  <span style={{ color: '#f59e0b' }}>{t.difficulty.medium} Med</span>
                  <span style={{ color: '#ef4444' }}>{t.difficulty.hard} Hard</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <NavLink
                    to={`/recommendations?topic=${encodeURIComponent(t.title)}`}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: 'rgba(108, 142, 247, 0.1)',
                      border: '1px solid rgba(108, 142, 247, 0.25)',
                      color: '#6c8ef7',
                      fontSize: '12px',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    🎯 Test
                  </NavLink>
                  <NavLink
                    to={`/problems?topic=${encodeURIComponent(t.title)}`}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: '#1a1d2b',
                      border: '1px solid #2a2e42',
                      color: '#e8eaf0',
                      fontSize: '12px',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    Practice →
                  </NavLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
