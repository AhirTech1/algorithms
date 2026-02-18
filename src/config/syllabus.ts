import type { SyllabusItem } from '../types/algorithm';

export const syllabus: SyllabusItem[] = [
    {
        id: 'sorting',
        title: 'Sorting Algorithms',
        algorithms: [
            { id: 'bubble-sort', name: 'Bubble Sort', path: '/algorithm/bubble-sort' },
            { id: 'selection-sort', name: 'Selection Sort', path: '/algorithm/selection-sort' },
            { id: 'insertion-sort', name: 'Insertion Sort', path: '/algorithm/insertion-sort' },
            { id: 'merge-sort', name: 'Merge Sort', path: '/algorithm/merge-sort' },
            { id: 'quick-sort', name: 'Quick Sort', path: '/algorithm/quick-sort' },
            { id: 'heap-sort', name: 'Heap Sort', path: '/algorithm/heap-sort' },
            { id: 'counting-sort', name: 'Counting Sort', path: '/algorithm/counting-sort' },
            { id: 'radix-sort', name: 'Radix Sort', path: '/algorithm/radix-sort' },
            { id: 'bucket-sort', name: 'Bucket Sort', path: '/algorithm/bucket-sort' },
        ],
    },
    {
        id: 'divide-conquer',
        title: 'Divide & Conquer',
        algorithms: [
            { id: 'binary-search', name: 'Binary Search', path: '/algorithm/binary-search' },
            { id: 'strassen', name: "Strassen's Matrix Multiplication", path: '/algorithm/strassen' },
        ],
    },
    {
        id: 'greedy',
        title: 'Greedy Algorithms',
        algorithms: [
            { id: 'fractional-knapsack', name: 'Fractional Knapsack', path: '/algorithm/fractional-knapsack' },
            { id: 'huffman-coding', name: 'Huffman Coding', path: '/algorithm/huffman-coding' },
            { id: 'job-scheduling', name: 'Job Scheduling', path: '/algorithm/job-scheduling' },
            { id: 'prims', name: "Prim's MST", path: '/algorithm/prims' },
            { id: 'kruskals', name: "Kruskal's MST", path: '/algorithm/kruskals' },
        ],
    },
    {
        id: 'dynamic-programming',
        title: 'Dynamic Programming',
        algorithms: [
            { id: 'knapsack-01', name: '0/1 Knapsack', path: '/algorithm/knapsack-01' },
            { id: 'lcs', name: 'Longest Common Subsequence', path: '/algorithm/lcs' },
            { id: 'matrix-chain', name: 'Matrix Chain Multiplication', path: '/algorithm/matrix-chain' },
            { id: 'floyd-warshall', name: 'Floyd-Warshall (APSP)', path: '/algorithm/floyd-warshall' },
        ],
    },
    {
        id: 'graphs',
        title: 'Graph Algorithms',
        algorithms: [
            { id: 'bfs', name: 'Breadth-First Search', path: '/algorithm/bfs' },
            { id: 'dfs', name: 'Depth-First Search', path: '/algorithm/dfs' },
            { id: 'topological-sort', name: 'Topological Sort', path: '/algorithm/topological-sort' },
            { id: 'scc', name: 'Strongly Connected Components', path: '/algorithm/scc' },
            { id: 'articulation-points', name: 'Articulation Points', path: '/algorithm/articulation-points' },
        ],
    },
    {
        id: 'backtracking',
        title: 'Backtracking & Branch and Bound',
        algorithms: [
            { id: 'n-queen', name: 'N-Queen Problem', path: '/algorithm/n-queen' },
            { id: 'tsp', name: 'Travelling Salesman Problem', path: '/algorithm/tsp' },
        ],
    },
    {
        id: 'string-matching',
        title: 'String Matching',
        algorithms: [
            { id: 'naive-string', name: 'Naive String Matching', path: '/algorithm/naive-string' },
            { id: 'rabin-karp', name: 'Rabin-Karp', path: '/algorithm/rabin-karp' },
            { id: 'kmp', name: 'Knuth-Morris-Pratt', path: '/algorithm/kmp' },
        ],
    },
    {
        id: 'np-completeness',
        title: 'NP-Completeness',
        algorithms: [
            { id: 'p-vs-np', name: 'P vs NP', path: '/algorithm/p-vs-np' },
        ],
    },
];

export const categoryIcons: Record<string, string> = {
    'sorting': '📊',
    'divide-conquer': '✂️',
    'greedy': '🎯',
    'dynamic-programming': '📈',
    'graphs': '🕸️',
    'backtracking': '🔙',
    'string-matching': '🔤',
    'np-completeness': '🧩',
};

export const categoryColors: Record<string, string> = {
    'sorting': 'from-indigo-500 to-purple-500',
    'divide-conquer': 'from-blue-500 to-cyan-500',
    'greedy': 'from-green-500 to-emerald-500',
    'dynamic-programming': 'from-orange-500 to-amber-500',
    'graphs': 'from-pink-500 to-rose-500',
    'backtracking': 'from-violet-500 to-purple-500',
    'string-matching': 'from-teal-500 to-cyan-500',
    'np-completeness': 'from-red-500 to-orange-500',
};

export const categoryDescriptions: Record<string, string> = {
    'sorting': 'Learn how to efficiently arrange elements in order',
    'divide-conquer': 'Break problems into smaller subproblems',
    'greedy': 'Make locally optimal choices for global solutions',
    'dynamic-programming': 'Solve complex problems by breaking into overlapping subproblems',
    'graphs': 'Traverse and analyze graph structures',
    'backtracking': 'Explore all possibilities systematically',
    'string-matching': 'Find patterns within text efficiently',
    'np-completeness': 'Understand computational complexity classes',
};
