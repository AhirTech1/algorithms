import type { AlgorithmConfig, AnimationStep } from '../../types/algorithm';

export const floydWarshall: AlgorithmConfig = {
    id: 'floyd-warshall',
    name: 'Floyd-Warshall Algorithm',
    category: 'dynamic-programming',
    description: 'All-Pairs Shortest Path algorithm that finds shortest paths between all pairs of vertices in a weighted graph. Works with negative weights but not negative cycles.',
    complexity: {
        time: {
            best: 'O(V³)',
            average: 'O(V³)',
            worst: 'O(V³)',
        },
        space: 'O(V²)',
    },
    pseudocode: [
        'procedure floydWarshall(W)',
        '    D = W  // Initialize distance matrix',
        '    for k = 0 to V-1 do',
        '        for i = 0 to V-1 do',
        '            for j = 0 to V-1 do',
        '                if D[i][k] + D[k][j] < D[i][j] then',
        '                    D[i][j] = D[i][k] + D[k][j]',
        '                end if',
        '            end for',
        '        end for',
        '    end for',
        '    return D',
        'end procedure',
    ],
    cCode: `#include <stdio.h>
#define INF 99999
#define V 4  // Number of vertices

void printSolution(int dist[][V]) {
    printf("Shortest distances between every pair of vertices:\n");
    for (int i = 0; i < V; i++) {
        for (int j = 0; j < V; j++) {
            if (dist[i][j] == INF)
                printf("%7s", "INF");
            else
                printf("%7d", dist[i][j]);
        }
        printf("\n");
    }
}

void floydWarshall(int graph[][V]) {
    int dist[V][V], i, j, k;
    
    // Initialize the solution matrix same as input graph matrix
    for (i = 0; i < V; i++)
        for (j = 0; j < V; j++)
            dist[i][j] = graph[i][j];
    
    // Add all vertices one by one to the set of intermediate vertices
    for (k = 0; k < V; k++) {
        // Pick all vertices as source one by one
        for (i = 0; i < V; i++) {
            // Pick all vertices as destination for the above picked source
            for (j = 0; j < V; j++) {
                // If vertex k is on the shortest path from i to j,
                // then update the value of dist[i][j]
                if (dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];
            }
        }
    }
    
    printSolution(dist);
}

// Check for negative cycle
int hasNegativeCycle(int graph[][V]) {
    int dist[V][V], i, j, k;
    
    for (i = 0; i < V; i++)
        for (j = 0; j < V; j++)
            dist[i][j] = graph[i][j];
    
    for (k = 0; k < V; k++) {
        for (i = 0; i < V; i++) {
            for (j = 0; j < V; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];
            }
        }
    }
    
    // Check for negative cycle
    for (i = 0; i < V; i++)
        if (dist[i][i] < 0)
            return 1;
    
    return 0;
}`,
    visualizerType: 'matrix',
    defaultInputSize: 4,
    minInputSize: 3,
    maxInputSize: 6,
    supportsCases: false,

    generateInput(size: number): number[][] {
        const INF = Infinity;
        const dist: number[][] = [];

        for (let i = 0; i < size; i++) {
            dist[i] = [];
            for (let j = 0; j < size; j++) {
                if (i === j) {
                    dist[i][j] = 0;
                } else if (Math.random() > 0.3) {
                    dist[i][j] = Math.floor(Math.random() * 9) + 1;
                } else {
                    dist[i][j] = INF;
                }
            }
        }

        return dist;
    },

    generateSteps(input: unknown): AnimationStep[] {
        const initialDist = input as number[][];
        const n = initialDist.length;
        const dist: number[][] = initialDist.map(row => [...row]);
        const steps: AnimationStep[] = [];
        let comparisons = 0;

        const formatMatrix = (matrix: number[][]): (number | string)[][] => {
            return matrix.map(row =>
                row.map(val => val === Infinity ? '∞' : val)
            );
        };


        steps.push({
            id: 0,
            description: `Floyd-Warshall: Finding all-pairs shortest paths for ${n} vertices`,
            pseudocodeLine: 0,
            state: {
                distMatrix: dist.map(r => [...r]),
                matrix: {
                    m: formatMatrix(dist),
                    dims: [],
                    n,
                    title: 'Initial Distance Matrix'
                }
            },
            comparisons: 0,
            swaps: 0,
            memoryUsage: n * n,
        });

        // Main algorithm
        for (let k = 0; k < n; k++) {
            steps.push({
                id: steps.length,
                description: `Using vertex ${k} as intermediate vertex`,
                pseudocodeLine: 2,
                state: {
                    distMatrix: dist.map(r => [...r]),
                    k,
                    matrix: {
                        m: formatMatrix(dist),
                        dims: [],
                        n,
                        title: `Intermediate vertex: ${k}`
                    }
                },
                comparisons,
                swaps: 0,
                memoryUsage: n * n,
            });

            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    if (i === j || i === k || j === k) continue;

                    comparisons++;
                    const newDist = dist[i][k] + dist[k][j];

                    if (newDist < dist[i][j]) {
                        const oldVal = dist[i][j] === Infinity ? '∞' : dist[i][j];
                        dist[i][j] = newDist;

                        steps.push({
                            id: steps.length,
                            description: `Update: D[${i}][${j}] = D[${i}][${k}] + D[${k}][${j}] = ${dist[i][k]} + ${dist[k][j]} = ${newDist} (was ${oldVal})`,
                            pseudocodeLine: 6,
                            state: {
                                distMatrix: dist.map(r => [...r]),
                                i, j, k,
                                matrix: {
                                    m: formatMatrix(dist),
                                    dims: [],
                                    n,
                                    i, j,
                                    current: true,
                                    title: `D[${i}][${j}] updated via vertex ${k}`
                                }
                            },
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
            description: 'Floyd-Warshall complete! Final shortest path distances computed.',
            pseudocodeLine: 11,
            state: {
                distMatrix: dist.map(r => [...r]),
                matrix: {
                    m: formatMatrix(dist),
                    dims: [],
                    n,
                    done: true,
                    title: 'Final Distance Matrix (All-Pairs Shortest Paths)'
                }
            },
            comparisons,
            swaps: 0,
            memoryUsage: n * n,
        });

        return steps;
    },
};
