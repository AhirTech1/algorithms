import type { AlgorithmConfig, AnimationStep } from '../../types/algorithm';

interface GraphNode {
    id: string;
    label: string;
    state: 'default' | 'visited' | 'current' | 'processed' | 'path';
}

interface GraphEdge {
    source: string;
    target: string;
    state: 'default' | 'visited' | 'current' | 'path' | 'mst';
}

interface GraphState {
    nodes: GraphNode[];
    edges: GraphEdge[];
    queue: string[];
}

function createDefaultGraph(size: number): { nodes: GraphNode[]; edges: GraphEdge[]; adjacency: Map<string, string[]> } {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const adjacency = new Map<string, string[]>();

    // Create nodes
    for (let i = 0; i < size; i++) {
        nodes.push({
            id: String(i),
            label: String(i),
            state: 'default',
        });
        adjacency.set(String(i), []);
    }

    // Create edges (connected graph)
    const edgePairs = [
        [0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6], [3, 7], [4, 7], [5, 6]
    ];

    edgePairs.slice(0, Math.min(edgePairs.length, size)).forEach(([s, t]) => {
        if (s < size && t < size) {
            edges.push({ source: String(s), target: String(t), state: 'default' });
            adjacency.get(String(s))?.push(String(t));
            adjacency.get(String(t))?.push(String(s)); // Undirected
        }
    });

    return { nodes, edges, adjacency };
}

export const bfs: AlgorithmConfig = {
    id: 'bfs',
    name: 'Breadth-First Search',
    category: 'graphs',
    description: 'A graph traversal algorithm that explores all neighbor nodes at the present depth before moving to nodes at the next depth level.',
    complexity: {
        time: {
            best: 'O(V + E)',
            average: 'O(V + E)',
            worst: 'O(V + E)',
        },
        space: 'O(V)',
    },
    pseudocode: [
        'procedure BFS(G, start)',
        '    create queue Q',
        '    mark start as visited',
        '    enqueue start onto Q',
        '    while Q is not empty do',
        '        v = dequeue from Q',
        '        process v',
        '        for each neighbor u of v do',
        '            if u is not visited then',
        '                mark u as visited',
        '                enqueue u onto Q',
        '            end if',
        '        end for',
        '    end while',
        'end procedure',
    ],
    visualizerType: 'graph',
    defaultInputSize: 8,
    minInputSize: 4,
    maxInputSize: 12,
    supportsCases: false,

    generateInput(size: number): { nodes: GraphNode[]; edges: GraphEdge[]; adjacency: Map<string, string[]> } {
        return createDefaultGraph(size);
    },

    generateSteps(input: unknown): AnimationStep[] {
        const { nodes, edges, adjacency } = input as { nodes: GraphNode[]; edges: GraphEdge[]; adjacency: Map<string, string[]> };
        const steps: AnimationStep[] = [];
        let comparisons = 0;

        const visited = new Set<string>();
        const queue: string[] = [];

        // Helper to create current state
        const createState = (currentQueue: string[]): GraphState => ({
            nodes: nodes.map(n => ({ ...n })),
            edges: edges.map(e => ({ ...e })),
            queue: [...currentQueue],
        });

        // Initial state
        steps.push({
            id: 0,
            description: 'Starting BFS from node 0',
            pseudocodeLine: 0,
            state: { graph: createState([]) },
            comparisons: 0,
            swaps: 0,
            memoryUsage: 1,
        });

        // Start BFS
        const startNode = '0';
        visited.add(startNode);
        queue.push(startNode);
        nodes.find(n => n.id === startNode)!.state = 'visited';

        steps.push({
            id: steps.length,
            description: `Marked node ${startNode} as visited and added to queue`,
            pseudocodeLine: 3,
            state: { graph: createState(queue) },
            comparisons,
            swaps: 0,
            memoryUsage: queue.length,
        });

        while (queue.length > 0) {
            const current = queue.shift()!;
            nodes.find(n => n.id === current)!.state = 'current';

            steps.push({
                id: steps.length,
                description: `Dequeued node ${current} from the queue`,
                pseudocodeLine: 5,
                state: { graph: createState(queue) },
                comparisons,
                swaps: 0,
                memoryUsage: queue.length,
            });

            // Process current node
            nodes.find(n => n.id === current)!.state = 'processed';

            steps.push({
                id: steps.length,
                description: `Processing node ${current}`,
                pseudocodeLine: 6,
                state: { graph: createState(queue) },
                comparisons,
                swaps: 0,
                memoryUsage: queue.length,
            });

            // Visit neighbors
            const neighbors = adjacency.get(current) || [];
            for (const neighbor of neighbors) {
                comparisons++;

                // Highlight edge
                const edge = edges.find(
                    e => (e.source === current && e.target === neighbor) ||
                        (e.target === current && e.source === neighbor)
                );
                if (edge) edge.state = 'current';

                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                    nodes.find(n => n.id === neighbor)!.state = 'visited';
                    if (edge) edge.state = 'visited';

                    steps.push({
                        id: steps.length,
                        description: `Discovered unvisited neighbor ${neighbor}, added to queue`,
                        pseudocodeLine: 9,
                        state: { graph: createState(queue) },
                        comparisons,
                        swaps: 0,
                        memoryUsage: queue.length,
                    });
                } else {
                    if (edge) edge.state = 'visited';

                    steps.push({
                        id: steps.length,
                        description: `Neighbor ${neighbor} already visited, skipping`,
                        pseudocodeLine: 8,
                        state: { graph: createState(queue) },
                        comparisons,
                        swaps: 0,
                        memoryUsage: queue.length,
                    });
                }
            }
        }

        // Final state - all processed
        nodes.forEach(n => n.state = 'processed');
        edges.forEach(e => e.state = 'visited');

        steps.push({
            id: steps.length,
            description: `BFS complete! All ${nodes.length} nodes visited.`,
            pseudocodeLine: 14,
            state: { graph: createState([]) },
            comparisons,
            swaps: 0,
            memoryUsage: 0,
        });

        return steps;
    },
};
