import type { AlgorithmConfig, AnimationStep } from '../../types/algorithm';

interface DPCell {
    value: number;
    state: 'default' | 'current' | 'checking' | 'updated' | 'final';
}

interface DPState {
    table: DPCell[][];
    items: { weight: number; value: number; included: boolean }[];
    currentCapacity: number;
    currentItem: number;
}

function createItems(count: number): { weight: number; value: number }[] {
    const items = [];
    for (let i = 0; i < count; i++) {
        items.push({
            weight: Math.floor(Math.random() * 5) + 1,
            value: Math.floor(Math.random() * 10) + 5,
        });
    }
    return items;
}

export const knapsack01: AlgorithmConfig = {
    id: 'knapsack-01',
    name: '0/1 Knapsack',
    category: 'dynamic-programming',
    description: 'A classic dynamic programming problem where we maximize value while staying within a weight capacity. Each item can only be included once (0 or 1).',
    complexity: {
        time: {
            best: 'O(nW)',
            average: 'O(nW)',
            worst: 'O(nW)',
        },
        space: 'O(nW)',
    },
    pseudocode: [
        'procedure knapsack01(items, W)',
        '    n = length(items)',
        '    dp[0..n][0..W] = 0',
        '    for i = 1 to n do',
        '        for w = 0 to W do',
        '            if items[i-1].weight <= w then',
        '                dp[i][w] = max(dp[i-1][w],',
        '                              dp[i-1][w-weight] + value)',
        '            else',
        '                dp[i][w] = dp[i-1][w]',
        '            end if',
        '        end for',
        '    end for',
        '    return dp[n][W]',
        'end procedure',
    ],
    cCode: `#include <stdio.h>

int max(int a, int b) {
    return (a > b) ? a : b;
}

int knapsack(int W, int wt[], int val[], int n) {
    int i, w;
    int dp[n + 1][W + 1];
    
    // Build table dp[][] in bottom-up manner
    for (i = 0; i <= n; i++) {
        for (w = 0; w <= W; w++) {
            if (i == 0 || w == 0)
                dp[i][w] = 0;
            else if (wt[i - 1] <= w)
                dp[i][w] = max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
            else
                dp[i][w] = dp[i - 1][w];
        }
    }
    
    return dp[n][W];
}

// Space optimized version
int knapsackOptimized(int W, int wt[], int val[], int n) {
    int dp[W + 1];
    int i, w;
    
    // Initialize dp array
    for (i = 0; i <= W; i++)
        dp[i] = 0;
    
    // Build table
    for (i = 0; i < n; i++) {
        for (w = W; w >= wt[i]; w--) {
            dp[w] = max(dp[w], val[i] + dp[w - wt[i]]);
        }
    }
    
    return dp[W];
}`,
    visualizerType: 'matrix',
    defaultInputSize: 4,
    minInputSize: 3,
    maxInputSize: 6,
    supportsCases: false,

    generateInput(size: number): { items: { weight: number; value: number }[]; capacity: number } {
        return {
            items: createItems(size),
            capacity: size * 3,
        };
    },

    generateSteps(input: unknown): AnimationStep[] {
        const { items, capacity } = input as { items: { weight: number; value: number }[]; capacity: number };
        const steps: AnimationStep[] = [];
        let comparisons = 0;
        const n = items.length;
        const W = capacity;

        // Initialize DP table
        const dp: number[][] = Array(n + 1).fill(null).map(() => Array(W + 1).fill(0));
        const dpState: DPCell[][] = Array(n + 1).fill(null).map(() =>
            Array(W + 1).fill(null).map(() => ({ value: 0, state: 'default' as const }))
        );

        const createState = (): DPState => ({
            table: dpState.map(row => row.map(cell => ({ ...cell }))),
            items: items.map((item) => ({ ...item, included: false })),
            currentCapacity: 0,
            currentItem: 0,
        });

        // Initial state
        steps.push({
            id: 0,
            description: `Starting 0/1 Knapsack with ${n} items and capacity ${W}`,
            pseudocodeLine: 0,
            state: { dp: createState() },
            comparisons: 0,
            swaps: 0,
            memoryUsage: (n + 1) * (W + 1),
        });

        steps.push({
            id: steps.length,
            description: `Items: ${items.map((it, i) => `Item ${i}: w=${it.weight}, v=${it.value}`).join(' | ')}`,
            pseudocodeLine: 1,
            state: { dp: createState() },
            comparisons,
            swaps: 0,
            memoryUsage: (n + 1) * (W + 1),
        });

        // Fill DP table
        for (let i = 1; i <= n; i++) {
            for (let w = 0; w <= W; w++) {
                comparisons++;
                dpState[i][w].state = 'current';

                if (items[i - 1].weight <= w) {
                    const includeValue = dp[i - 1][w - items[i - 1].weight] + items[i - 1].value;
                    const excludeValue = dp[i - 1][w];

                    if (includeValue > excludeValue) {
                        dp[i][w] = includeValue;
                        dpState[i][w].value = includeValue;
                        dpState[i][w].state = 'updated';

                        steps.push({
                            id: steps.length,
                            description: `Including item ${i - 1} (w=${items[i - 1].weight}, v=${items[i - 1].value}) gives ${includeValue} > ${excludeValue}. Taking it!`,
                            pseudocodeLine: 6,
                            state: { dp: createState() },
                            comparisons,
                            swaps: 0,
                            memoryUsage: (n + 1) * (W + 1),
                        });
                    } else {
                        dp[i][w] = excludeValue;
                        dpState[i][w].value = excludeValue;
                        dpState[i][w].state = 'checking';

                        steps.push({
                            id: steps.length,
                            description: `Including item ${i - 1} gives ${includeValue} ≤ ${excludeValue}. Skipping.`,
                            pseudocodeLine: 6,
                            state: { dp: createState() },
                            comparisons,
                            swaps: 0,
                            memoryUsage: (n + 1) * (W + 1),
                        });
                    }
                } else {
                    dp[i][w] = dp[i - 1][w];
                    dpState[i][w].value = dp[i][w];
                    dpState[i][w].state = 'checking';

                    steps.push({
                        id: steps.length,
                        description: `Item ${i - 1} weight (${items[i - 1].weight}) > capacity ${w}. Can't include.`,
                        pseudocodeLine: 9,
                        state: { dp: createState() },
                        comparisons,
                        swaps: 0,
                        memoryUsage: (n + 1) * (W + 1),
                    });
                }

                dpState[i][w].state = 'default';
            }
        }

        // Final state
        dpState[n][W].state = 'final';

        steps.push({
            id: steps.length,
            description: `Knapsack complete! Maximum value: ${dp[n][W]}`,
            pseudocodeLine: 13,
            state: { dp: createState() },
            comparisons,
            swaps: 0,
            memoryUsage: (n + 1) * (W + 1),
        });

        return steps;
    },
};
