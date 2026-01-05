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
    const addedEdges = new Set<string>();

    for (let i = 0; i < size; i++) {
        nodes.push({
            id: String(i),
            label: String(i),
            state: 'default',
        });
        adjacency.set(String(i), []);
    }

    const addEdge = (s: number, t: number) => {
        const key = s < t ? `${s}-${t}` : `${t}-${s}`;
        if (!addedEdges.has(key) && s !== t && s < size && t < size) {
            addedEdges.add(key);
            edges.push({ source: String(s), target: String(t), state: 'default' });
            adjacency.get(String(s))?.push(String(t));
            adjacency.get(String(t))?.push(String(s));
        }
    };

    // First, create a spanning tree to ensure connectivity
    for (let i = 1; i < size; i++) {
        const parent = Math.floor(Math.random() * i);
        addEdge(parent, i);
    }

    // Add some extra edges (about 50% more) to make it more interesting
    const extraEdges = Math.floor(size * 0.5);
    for (let i = 0; i < extraEdges; i++) {
        const s = Math.floor(Math.random() * size);
        const t = Math.floor(Math.random() * size);
        addEdge(s, t);
    }

    return { nodes, edges, adjacency };
}

export const dfs: AlgorithmConfig = {
    id: 'dfs',
    name: 'Depth-First Search',
    category: 'graphs',
    description: 'A graph traversal algorithm that explores as far as possible along each branch before backtracking. Uses a stack (or recursion) to keep track of vertices.',
    complexity: {
        time: {
            best: 'O(V + E)',
            average: 'O(V + E)',
            worst: 'O(V + E)',
        },
        space: 'O(V)',
    },
    pseudocode: [
        'procedure DFS(G, start)',
        '    create stack S',
        '    push start onto S',
        '    while S is not empty do',
        '        v = pop from S',
        '        if v is not visited then',
        '            mark v as visited',
        '            process v',
        '            for each neighbor u of v do',
        '                push u onto S',
        '            end for',
        '        end if',
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
        const stack: string[] = [];

        const createState = (currentStack: string[]): GraphState => ({
            nodes: nodes.map(n => ({ ...n })),
            edges: edges.map(e => ({ ...e })),
            queue: [...currentStack],
        });

        // Initial state
        steps.push({
            id: 0,
            description: 'Starting DFS from node 0',
            pseudocodeLine: 0,
            state: { graph: createState([]) },
            comparisons: 0,
            swaps: 0,
            memoryUsage: 1,
        });

        // Push start node
        stack.push('0');

        steps.push({
            id: steps.length,
            description: 'Pushed node 0 onto the stack',
            pseudocodeLine: 2,
            state: { graph: createState(stack) },
            comparisons,
            swaps: 0,
            memoryUsage: stack.length,
        });

        while (stack.length > 0) {
            const current = stack.pop()!;
            comparisons++;

            if (!visited.has(current)) {
                visited.add(current);
                nodes.find(n => n.id === current)!.state = 'current';

                steps.push({
                    id: steps.length,
                    description: `Popped node ${current} from stack. Marking as visited.`,
                    pseudocodeLine: 4,
                    state: { graph: createState(stack) },
                    comparisons,
                    swaps: 0,
                    memoryUsage: stack.length,
                });

                // Process
                nodes.find(n => n.id === current)!.state = 'processed';

                steps.push({
                    id: steps.length,
                    description: `Processing node ${current}`,
                    pseudocodeLine: 7,
                    state: { graph: createState(stack) },
                    comparisons,
                    swaps: 0,
                    memoryUsage: stack.length,
                });

                // Push neighbors
                const neighbors = adjacency.get(current) || [];
                for (const neighbor of neighbors.reverse()) { // Reverse for correct DFS order
                    const edge = edges.find(
                        e => (e.source === current && e.target === neighbor) ||
                            (e.target === current && e.source === neighbor)
                    );

                    if (!visited.has(neighbor)) {
                        stack.push(neighbor);
                        nodes.find(n => n.id === neighbor)!.state = 'visited';
                        if (edge) edge.state = 'current';

                        steps.push({
                            id: steps.length,
                            description: `Pushed neighbor ${neighbor} onto stack`,
                            pseudocodeLine: 9,
                            state: { graph: createState(stack) },
                            comparisons,
                            swaps: 0,
                            memoryUsage: stack.length,
                        });

                        if (edge) edge.state = 'visited';
                    }
                }
            } else {
                steps.push({
                    id: steps.length,
                    description: `Node ${current} already visited, skipping`,
                    pseudocodeLine: 5,
                    state: { graph: createState(stack) },
                    comparisons,
                    swaps: 0,
                    memoryUsage: stack.length,
                });
            }
        }

        // Final state
        nodes.forEach(n => n.state = 'processed');
        edges.forEach(e => e.state = 'visited');

        steps.push({
            id: steps.length,
            description: `DFS complete! All ${visited.size} reachable nodes visited.`,
            pseudocodeLine: 13,
            state: { graph: createState([]) },
            comparisons,
            swaps: 0,
            memoryUsage: 0,
        });

        return steps;
    },
};
