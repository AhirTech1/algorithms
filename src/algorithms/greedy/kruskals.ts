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

function createWeightedGraph(size: number): { nodes: GraphNode[]; edges: GraphEdge[] } {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    for (let i = 0; i < size; i++) {
        nodes.push({ id: String(i), label: String(i), state: 'default' });
    }

    // Create a connected graph with random weights
    for (let i = 0; i < size - 1; i++) {
        const weight = Math.floor(Math.random() * 9) + 1;
        edges.push({ source: String(i), target: String(i + 1), weight, state: 'default' });
    }

    // Add some extra edges
    for (let i = 0; i < size; i++) {
        for (let j = i + 2; j < Math.min(i + 3, size); j++) {
            if (Math.random() > 0.4) {
                const weight = Math.floor(Math.random() * 9) + 1;
                edges.push({ source: String(i), target: String(j), weight, state: 'default' });
            }
        }
    }

    return { nodes, edges };
}

// Union-Find data structure
class UnionFind {
    parent: number[];
    rank: number[];

    constructor(n: number) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = new Array(n).fill(0);
    }

    find(x: number): number {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }

    union(x: number, y: number): boolean {
        const rootX = this.find(x);
        const rootY = this.find(y);

        if (rootX === rootY) return false;

        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }
        return true;
    }
}

export const kruskals: AlgorithmConfig = {
    id: 'kruskals',
    name: "Kruskal's MST",
    category: 'greedy',
    description: "Kruskal's algorithm finds a Minimum Spanning Tree by sorting edges by weight and adding them if they don't create a cycle.",
    complexity: {
        time: {
            best: 'O(E log E)',
            average: 'O(E log E)',
            worst: 'O(E log E)',
        },
        space: 'O(V)',
    },
    pseudocode: [
        "procedure kruskal(G)",
        "    sort edges by weight",
        "    MST = empty set",
        "    for each vertex v do",
        "        makeSet(v)",
        "    end for",
        "    for each edge (u, v) in sorted order do",
        "        if find(u) ≠ find(v) then",
        "            MST = MST ∪ {(u, v)}",
        "            union(u, v)",
        "        end if",
        "    end for",
        "    return MST",
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
        const { nodes, edges } = input as ReturnType<typeof createWeightedGraph>;
        const steps: AnimationStep[] = [];
        const n = nodes.length;

        const createState = () => ({
            nodes: nodes.map(node => ({ ...node })),
            edges: edges.map(edge => ({ ...edge })),
            queue: [] as string[],
        });

        steps.push({
            id: 0,
            description: "Starting Kruskal's algorithm",
            pseudocodeLine: 0,
            state: { graph: createState() },
            comparisons: 0,
            swaps: 0,
            memoryUsage: n,
        });

        // Sort edges by weight
        const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);

        steps.push({
            id: 1,
            description: `Sorted ${edges.length} edges by weight: [${sortedEdges.map(e => e.weight).join(', ')}]`,
            pseudocodeLine: 1,
            state: { graph: createState() },
            comparisons: edges.length,
            swaps: 0,
            memoryUsage: n,
        });

        const uf = new UnionFind(n);
        let mstWeight = 0;
        let mstEdges = 0;

        for (const edge of sortedEdges) {
            const u = parseInt(edge.source);
            const v = parseInt(edge.target);

            // Highlight current edge being considered
            const origEdge = edges.find(e => e.source === edge.source && e.target === edge.target);
            if (origEdge) origEdge.state = 'current';

            steps.push({
                id: steps.length,
                description: `Considering edge ${edge.source}-${edge.target} (weight: ${edge.weight})`,
                pseudocodeLine: 6,
                state: { graph: createState() },
                comparisons: steps.length,
                swaps: 0,
                memoryUsage: n,
            });

            if (uf.union(u, v)) {
                // Edge added to MST
                if (origEdge) origEdge.state = 'mst';
                nodes[u].state = 'processed';
                nodes[v].state = 'processed';
                mstWeight += edge.weight;
                mstEdges++;

                steps.push({
                    id: steps.length,
                    description: `Added edge ${edge.source}-${edge.target} to MST. Total weight: ${mstWeight}`,
                    pseudocodeLine: 8,
                    state: { graph: createState() },
                    comparisons: steps.length,
                    swaps: 0,
                    memoryUsage: n,
                });

                if (mstEdges === n - 1) break;
            } else {
                // Edge would create cycle
                if (origEdge) origEdge.state = 'visited';

                steps.push({
                    id: steps.length,
                    description: `Skipped edge ${edge.source}-${edge.target} (would create cycle)`,
                    pseudocodeLine: 7,
                    state: { graph: createState() },
                    comparisons: steps.length,
                    swaps: 0,
                    memoryUsage: n,
                });
            }
        }

        steps.push({
            id: steps.length,
            description: `Kruskal's algorithm complete! MST has ${mstEdges} edges with total weight ${mstWeight}`,
            pseudocodeLine: 12,
            state: { graph: createState() },
            comparisons: edges.length,
            swaps: 0,
            memoryUsage: n,
        });

        return steps;
    },
};
