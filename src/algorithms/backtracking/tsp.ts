import type { AlgorithmConfig, AnimationStep } from '../../types/algorithm';

interface GraphNode {
    id: string;
    label: string;
    state: 'default' | 'visited' | 'current' | 'processed' | 'path';
    x?: number;
    y?: number;
}

interface GraphEdge {
    source: string;
    target: string;
    weight: number;
    state: 'default' | 'visited' | 'current' | 'path' | 'mst';
}

function createTSPGraph(size: number): { nodes: GraphNode[]; edges: GraphEdge[]; distances: number[][] } {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const distances: number[][] = [];

    // Create nodes in a rough circle
    for (let i = 0; i < size; i++) {
        const angle = (2 * Math.PI * i) / size;
        nodes.push({
            id: String(i),
            label: String(i),
            state: 'default',
            x: 150 + 100 * Math.cos(angle),
            y: 150 + 100 * Math.sin(angle),
        });
        distances[i] = [];
    }

    // Create complete graph with random weights
    for (let i = 0; i < size; i++) {
        for (let j = i + 1; j < size; j++) {
            const weight = Math.floor(Math.random() * 20) + 5;
            edges.push({ source: String(i), target: String(j), weight, state: 'default' });
            distances[i][j] = weight;
            distances[j][i] = weight;
        }
        distances[i][i] = 0;
    }

    return { nodes, edges, distances };
}

export const tsp: AlgorithmConfig = {
    id: 'tsp',
    name: 'Travelling Salesman Problem',
    category: 'backtracking',
    description: 'Find the shortest possible route that visits each city exactly once and returns to the starting city. Uses backtracking with branch and bound.',
    complexity: {
        time: {
            best: 'O(n!)',
            average: 'O(n!)',
            worst: 'O(n!)',
        },
        space: 'O(n)',
    },
    pseudocode: [
        'procedure TSP(G, start)',
        '    minCost = ∞',
        '    bestPath = null',
        '    path = [start]',
        '    visited[start] = true',
        '    backtrack(path, 0)',
        '    return bestPath, minCost',
        'end procedure',
        '',
        'procedure backtrack(path, cost)',
        '    if path.length == n then',
        '        totalCost = cost + dist[last][start]',
        '        if totalCost < minCost then',
        '            minCost = totalCost',
        '            bestPath = path',
        '        end if',
        '        return',
        '    end if',
        '    for each unvisited city c do',
        '        if cost + dist[last][c] < minCost then',
        '            visited[c] = true',
        '            backtrack(path + [c], cost + dist[last][c])',
        '            visited[c] = false',
        '        end if',
        '    end for',
        'end procedure',
    ],
    visualizerType: 'graph',
    defaultInputSize: 4,
    minInputSize: 3,
    maxInputSize: 6,
    supportsCases: false,

    generateInput(size: number) {
        return createTSPGraph(size);
    },

    generateSteps(input: unknown): AnimationStep[] {
        const { nodes, edges, distances } = input as ReturnType<typeof createTSPGraph>;
        const steps: AnimationStep[] = [];
        const n = nodes.length;

        let minCost = Infinity;
        let bestPath: number[] = [];
        const currentPath: number[] = [0];
        const visited: boolean[] = new Array(n).fill(false);
        visited[0] = true;

        const createState = (pathHighlight: number[] = []) => {
            // Reset states
            for (const node of nodes) {
                node.state = 'default';
            }
            for (const edge of edges) {
                edge.state = 'default';
            }

            // Highlight current path
            for (let i = 0; i < pathHighlight.length; i++) {
                nodes[pathHighlight[i]].state = 'visited';
            }
            if (pathHighlight.length > 0) {
                nodes[pathHighlight[pathHighlight.length - 1]].state = 'current';
            }

            // Highlight path edges
            for (let i = 0; i < pathHighlight.length - 1; i++) {
                const from = pathHighlight[i];
                const to = pathHighlight[i + 1];
                const edge = edges.find(e =>
                    (e.source === String(from) && e.target === String(to)) ||
                    (e.source === String(to) && e.target === String(from))
                );
                if (edge) edge.state = 'current';
            }

            // Highlight best path
            if (bestPath.length > 0) {
                for (let i = 0; i < bestPath.length - 1; i++) {
                    const from = bestPath[i];
                    const to = bestPath[i + 1];
                    const edge = edges.find(e =>
                        (e.source === String(from) && e.target === String(to)) ||
                        (e.source === String(to) && e.target === String(from))
                    );
                    if (edge && edge.state !== 'current') edge.state = 'path';
                }
                // Return edge
                const returnEdge = edges.find(e =>
                    (e.source === String(bestPath[bestPath.length - 1]) && e.target === '0') ||
                    (e.source === '0' && e.target === String(bestPath[bestPath.length - 1]))
                );
                if (returnEdge && returnEdge.state !== 'current') returnEdge.state = 'path';
            }

            return {
                nodes: nodes.map(node => ({ ...node })),
                edges: edges.map(edge => ({ ...edge })),
                queue: bestPath.map(String),
            };
        };

        steps.push({
            id: 0,
            description: `TSP: Finding shortest tour through ${n} cities starting from city 0`,
            pseudocodeLine: 0,
            state: { graph: createState([0]) },
            comparisons: 0,
            swaps: 0,
            memoryUsage: n,
        });

        let stepCount = 0;
        const maxSteps = 100; // Limit steps for larger inputs

        const backtrack = (path: number[], cost: number) => {
            if (stepCount > maxSteps) return;

            if (path.length === n) {
                const totalCost = cost + distances[path[path.length - 1]][0];
                stepCount++;

                steps.push({
                    id: steps.length,
                    description: `Complete tour: [${path.join(' → ')} → 0]. Cost: ${totalCost}${totalCost < minCost ? ' (New best!)' : ''}`,
                    pseudocodeLine: 11,
                    state: { graph: createState(path) },
                    comparisons: stepCount,
                    swaps: 0,
                    memoryUsage: n,
                });

                if (totalCost < minCost) {
                    minCost = totalCost;
                    bestPath = [...path];
                }
                return;
            }

            const last = path[path.length - 1];
            for (let c = 0; c < n; c++) {
                if (visited[c]) continue;

                const newCost = cost + distances[last][c];

                // Branch and bound: prune if already worse
                if (newCost >= minCost) {
                    stepCount++;
                    if (stepCount <= maxSteps) {
                        steps.push({
                            id: steps.length,
                            description: `Pruning: path to ${c} costs ${newCost} >= best ${minCost}`,
                            pseudocodeLine: 19,
                            state: { graph: createState(path) },
                            comparisons: stepCount,
                            swaps: 0,
                            memoryUsage: n,
                        });
                    }
                    continue;
                }

                visited[c] = true;
                path.push(c);

                stepCount++;
                if (stepCount <= maxSteps) {
                    steps.push({
                        id: steps.length,
                        description: `Exploring city ${c}. Path: [${path.join(' → ')}], Cost so far: ${newCost}`,
                        pseudocodeLine: 21,
                        state: { graph: createState(path) },
                        comparisons: stepCount,
                        swaps: 0,
                        memoryUsage: n,
                    });
                }

                backtrack(path, newCost);

                path.pop();
                visited[c] = false;
            }
        };

        backtrack(currentPath, 0);

        steps.push({
            id: steps.length,
            description: `TSP complete! Best tour: [${bestPath.join(' → ')} → 0] with cost ${minCost}`,
            pseudocodeLine: 6,
            state: { graph: createState(bestPath) },
            comparisons: stepCount,
            swaps: 0,
            memoryUsage: n,
        });

        return steps;
    },
};
