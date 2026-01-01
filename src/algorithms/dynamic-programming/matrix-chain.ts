import type { AlgorithmConfig, AnimationStep } from '../../types/algorithm';

export const matrixChain: AlgorithmConfig = {
    id: 'matrix-chain',
    name: 'Matrix Chain Multiplication',
    category: 'dynamic-programming',
    description: 'Finds the optimal way to parenthesize matrix products to minimize scalar multiplications. A classic DP problem with optimal substructure.',
    complexity: {
        time: {
            best: 'O(n³)',
            average: 'O(n³)',
            worst: 'O(n³)',
        },
        space: 'O(n²)',
    },
    pseudocode: [
        'procedure matrixChain(dims)',
        '    n = length(dims) - 1',
        '    m[1..n][1..n] = 0',
        '    for len = 2 to n do',
        '        for i = 1 to n - len + 1 do',
        '            j = i + len - 1',
        '            m[i][j] = ∞',
        '            for k = i to j - 1 do',
        '                cost = m[i][k] + m[k+1][j] +',
        '                       dims[i-1] * dims[k] * dims[j]',
        '                if cost < m[i][j] then',
        '                    m[i][j] = cost',
        '                end if',
        '            end for',
        '        end for',
        '    end for',
        '    return m[1][n]',
        'end procedure',
    ],
    visualizerType: 'matrix',
    defaultInputSize: 4,
    minInputSize: 3,
    maxInputSize: 6,
    supportsCases: false,

    generateInput(size: number): number[] {
        // Generate matrix dimensions: e.g., [10, 30, 5, 60] means 3 matrices: 10x30, 30x5, 5x60
        return Array.from({ length: size + 1 }, () => Math.floor(Math.random() * 40) + 5);
    },

    generateSteps(input: unknown): AnimationStep[] {
        const dims = input as number[];
        const steps: AnimationStep[] = [];
        const n = dims.length - 1;
        const m: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));
        let comparisons = 0;

        // Matrix descriptions
        const matrices = dims.slice(0, -1).map((_, i) => `M${i + 1}(${dims[i]}×${dims[i + 1]})`);

        steps.push({
            id: 0,
            description: `Matrix Chain: ${matrices.join(' × ')}`,
            pseudocodeLine: 0,
            state: { matrix: { m: m.map(r => [...r]), dims, n, i: 0, j: 0 } },
            comparisons: 0,
            swaps: 0,
            memoryUsage: n * n,
        });

        for (let len = 2; len <= n; len++) {
            for (let i = 0; i < n - len + 1; i++) {
                const j = i + len - 1;
                m[i][j] = Infinity;

                steps.push({
                    id: steps.length,
                    description: `Computing optimal cost for M${i + 1}..M${j + 1}`,
                    pseudocodeLine: 4,
                    state: { matrix: { m: m.map(r => [...r]), dims, n, i, j, current: true } },
                    comparisons,
                    swaps: 0,
                    memoryUsage: n * n,
                });

                for (let k = i; k < j; k++) {
                    comparisons++;
                    const cost = m[i][k] + m[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];

                    steps.push({
                        id: steps.length,
                        description: `Split at k=${k + 1}: cost = ${m[i][k]} + ${m[k + 1][j]} + ${dims[i]}×${dims[k + 1]}×${dims[j + 1]} = ${cost}`,
                        pseudocodeLine: 8,
                        state: { matrix: { m: m.map(r => [...r]), dims, n, i, j, k, cost } },
                        comparisons,
                        swaps: 0,
                        memoryUsage: n * n,
                    });

                    if (cost < m[i][j]) {
                        m[i][j] = cost;

                        steps.push({
                            id: steps.length,
                            description: `New minimum! m[${i + 1}][${j + 1}] = ${cost}`,
                            pseudocodeLine: 11,
                            state: { matrix: { m: m.map(r => [...r]), dims, n, i, j, updated: true } },
                            comparisons,
                            swaps: 0,
                            memoryUsage: n * n,
                        });
                    }
                }
            }
        }

        steps.push({
            id: steps.length,
            description: `Minimum multiplications: ${m[0][n - 1]}`,
            pseudocodeLine: 16,
            state: { matrix: { m, dims, n, done: true } },
            comparisons,
            swaps: 0,
            memoryUsage: n * n,
        });

        return steps;
    },
};
