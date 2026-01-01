import type { AlgorithmConfig } from '../types/algorithm';
import { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort, heapSort, countingSort } from './sorting';
import { binarySearch } from './divide-conquer';
import { bfs, dfs, topologicalSort } from './graphs';
import { knapsack01, lcs, matrixChain } from './dynamic-programming';
import { nQueen } from './backtracking';
import { fractionalKnapsack, jobScheduling } from './greedy';
import { naiveStringMatching, kmp, rabinKarp } from './string-matching';

// Registry of all implemented algorithms
export const algorithmRegistry: Record<string, AlgorithmConfig> = {
    // Sorting algorithms (7)
    'bubble-sort': bubbleSort,
    'selection-sort': selectionSort,
    'insertion-sort': insertionSort,
    'merge-sort': mergeSort,
    'quick-sort': quickSort,
    'heap-sort': heapSort,
    'counting-sort': countingSort,

    // Divide and Conquer (1)
    'binary-search': binarySearch,

    // Graph algorithms (3)
    'bfs': bfs,
    'dfs': dfs,
    'topological-sort': topologicalSort,

    // Dynamic Programming (3)
    'knapsack-01': knapsack01,
    'lcs': lcs,
    'matrix-chain': matrixChain,

    // Greedy (2)
    'fractional-knapsack': fractionalKnapsack,
    'job-scheduling': jobScheduling,

    // Backtracking (1)
    'n-queen': nQueen,

    // String Matching (3)
    'naive-string-matching': naiveStringMatching,
    'kmp': kmp,
    'rabin-karp': rabinKarp,
};

// Get all algorithms for a category
export function getAlgorithmsByCategory(category: string): AlgorithmConfig[] {
    return Object.values(algorithmRegistry).filter(algo => algo.category === category);
}

// Check if an algorithm is implemented
export function isAlgorithmImplemented(id: string): boolean {
    return id in algorithmRegistry;
}
