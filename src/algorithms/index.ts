import type { AlgorithmConfig } from '../types/algorithm';
import { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort, heapSort, countingSort, radixSort, bucketSort } from './sorting';
import { binarySearch, strassen } from './divide-conquer';
import { bfs, dfs, topologicalSort, scc, articulationPoints } from './graphs';
import { knapsack01, lcs, matrixChain, floydWarshall } from './dynamic-programming';
import { nQueen, tsp } from './backtracking';
import { fractionalKnapsack, jobScheduling, prims, kruskals, huffmanCoding } from './greedy';
import { naiveStringMatching, kmp, rabinKarp } from './string-matching';
import { pVsNp } from './np-completeness';

// Registry of all implemented algorithms
export const algorithmRegistry: Record<string, AlgorithmConfig> = {
    // Sorting algorithms (9)
    'bubble-sort': bubbleSort,
    'selection-sort': selectionSort,
    'insertion-sort': insertionSort,
    'merge-sort': mergeSort,
    'quick-sort': quickSort,
    'heap-sort': heapSort,
    'counting-sort': countingSort,
    'radix-sort': radixSort,
    'bucket-sort': bucketSort,

    // Divide and Conquer (2)
    'binary-search': binarySearch,
    'strassen': strassen,

    // Graph algorithms (5)
    'bfs': bfs,
    'dfs': dfs,
    'topological-sort': topologicalSort,
    'scc': scc,
    'articulation-points': articulationPoints,

    // Dynamic Programming (4)
    'knapsack-01': knapsack01,
    'lcs': lcs,
    'matrix-chain': matrixChain,
    'floyd-warshall': floydWarshall,

    // Greedy (5)
    'fractional-knapsack': fractionalKnapsack,
    'job-scheduling': jobScheduling,
    'prims': prims,
    'kruskals': kruskals,
    'huffman-coding': huffmanCoding,

    // Backtracking (2)
    'n-queen': nQueen,
    'tsp': tsp,

    // String Matching (3)
    'naive-string': naiveStringMatching,
    'rabin-karp': rabinKarp,
    'kmp': kmp,

    // NP-Completeness (1)
    'p-vs-np': pVsNp,
};

// Get all algorithms for a category
export function getAlgorithmsByCategory(category: string): AlgorithmConfig[] {
    return Object.values(algorithmRegistry).filter(algo => algo.category === category);
}

// Check if an algorithm is implemented
export function isAlgorithmImplemented(id: string): boolean {
    return id in algorithmRegistry;
}
