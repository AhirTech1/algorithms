import type { AlgorithmConfig, AnimationStep } from '../../types/algorithm';

interface GraphNode {
    id: string;
    label: string;
    state: 'default' | 'visited' | 'current' | 'processed' | 'path';
}

interface GraphEdge {
    source: string;
    target: string;
    weight: number;
    state: 'default' | 'visited' | 'current' | 'path' | 'mst';
}

function createWeightedGraph(size: number): { nodes: GraphNode[]; edges: GraphEdge[]; adjacency: Map<string, { target: string; weight: number }[]> } {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const adjacency = new Map<string, { target: string; weight: number }[]>();

    for (let i = 0; i < size; i++) {
        nodes.push({ id: String(i), label: String(i), state: 'default' });
        adjacency.set(String(i), []);
    }

    // Create a connected graph with random weights
    for (let i = 0; i < size - 1; i++) {
        const weight = Math.floor(Math.random() * 9) + 1;
        edges.push({ source: String(i), target: String(i + 1), weight, state: 'default' });
        adjacency.get(String(i))?.push({ target: String(i + 1), weight });
        adjacency.get(String(i + 1))?.push({ target: String(i), weight });
    }

    // Add some extra edges
    for (let i = 0; i < size; i++) {
        for (let j = i + 2; j < Math.min(i + 3, size); j++) {
            if (Math.random() > 0.5) {
                const weight = Math.floor(Math.random() * 9) + 1;
                edges.push({ source: String(i), target: String(j), weight, state: 'default' });
                adjacency.get(String(i))?.push({ target: String(j), weight });
                adjacency.get(String(j))?.push({ target: String(i), weight });
            }
        }
    }

    return { nodes, edges, adjacency };
}

export const prims: AlgorithmConfig = {
    id: 'prims',
    name: "Prim's MST",
    category: 'greedy',
    description: "Prim's algorithm finds a Minimum Spanning Tree by starting from a vertex and greedily adding the cheapest edge that connects a new vertex.",
    complexity: {
        time: {
            best: 'O(E log V)',
            average: 'O(E log V)',
            worst: 'O(E log V)',
        },
        space: 'O(V)',
    },
    pseudocode: [
        "procedure prim(G, start)",
        "    key[v] = ∞ for all v",
        "    key[start] = 0",
        "    parent[start] = null",
        "    Q = all vertices",
        "    while Q is not empty do",
        "        u = extractMin(Q)",
        "        for each neighbor v of u do",
        "            if v ∈ Q and weight(u,v) < key[v] then",
        "                parent[v] = u",
        "                key[v] = weight(u,v)",
        "            end if",
        "        end for",
        "    end while",
        "end procedure",
    ],
    visualizerType: 'graph',
    defaultInputSize: 6,
    minInputSize: 4,
    maxInputSize: 10,
    supportsCases: false,

    generateInput(size: number) {
        return createWeightedGraph(size);
    },

    generateSteps(input: unknown): AnimationStep[] {
        const { nodes, edges, adjacency } = input as ReturnType<typeof createWeightedGraph>;
        const steps: AnimationStep[] = [];
        const n = nodes.length;

        const key: number[] = new Array(n).fill(Infinity);
        const parent: (number | null)[] = new Array(n).fill(null);
        const inMST: boolean[] = new Array(n).fill(false);
        let mstWeight = 0;

        const createState = () => ({
            nodes: nodes.map(node => ({ ...node })),
            edges: edges.map(edge => ({ ...edge })),
            queue: [] as string[],
        });

        steps.push({
            id: 0,
            description: "Starting Prim's algorithm from vertex 0",
            pseudocodeLine: 0,
            state: { graph: createState() },
            comparisons: 0,
            swaps: 0,
            memoryUsage: n,
        });

        key[0] = 0;
        nodes[0].state = 'current';

        steps.push({
            id: 1,
            description: "Initialize: key[0] = 0, all others = ∞",
            pseudocodeLine: 2,
            state: { graph: createState() },
            comparisons: 0,
            swaps: 0,
            memoryUsage: n,
        });

        for (let count = 0; count < n; count++) {
            // Find minimum key vertex not in MST
            let minKey = Infinity;
            let u = -1;
            for (let v = 0; v < n; v++) {
                if (!inMST[v] && key[v] < minKey) {
                    minKey = key[v];
                    u = v;
                }
            }

            if (u === -1) break;

            inMST[u] = true;
            nodes[u].state = 'processed';

            // Mark MST edge
            if (parent[u] !== null) {
                const parentStr = String(parent[u]);
                const uStr = String(u);
                const edge = edges.find(e =>
                    (e.source === parentStr && e.target === uStr) ||
                    (e.source === uStr && e.target === parentStr)
                );
                if (edge) {
                    edge.state = 'mst';
                    mstWeight += edge.weight;
                }
            }

            steps.push({
                id: steps.length,
                description: `Add vertex ${u} to MST (key = ${key[u]})${parent[u] !== null ? `, edge from ${parent[u]}` : ''}. MST weight: ${mstWeight}`,
                pseudocodeLine: 6,
                state: { graph: createState() },
                comparisons: count,
                swaps: 0,
                memoryUsage: n,
            });

            // Update keys of adjacent vertices
            const neighbors = adjacency.get(String(u)) || [];
            for (const { target, weight } of neighbors) {
                const v = parseInt(target);
                if (!inMST[v] && weight < key[v]) {
                    key[v] = weight;
                    parent[v] = u;
                    nodes[v].state = 'visited';

                    const edge = edges.find(e =>
                        (e.source === String(u) && e.target === String(v)) ||
                        (e.source === String(v) && e.target === String(u))
                    );
                    if (edge && edge.state !== 'mst') edge.state = 'current';

                    steps.push({
                        id: steps.length,
                        description: `Update: key[${v}] = ${weight} (via edge ${u}-${v})`,
                        pseudocodeLine: 10,
                        state: { graph: createState() },
                        comparisons: count,
                        swaps: 0,
                        memoryUsage: n,
                    });
                }
            }
        }

        steps.push({
            id: steps.length,
            description: `Prim's algorithm complete! MST total weight: ${mstWeight}`,
            pseudocodeLine: 14,
            state: { graph: createState() },
            comparisons: n,
            swaps: 0,
            memoryUsage: n,
        });

        return steps;
    },
};
