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

function createDirectedGraph(size: number): { nodes: GraphNode[]; edges: GraphEdge[]; adjacency: Map<string, string[]>; reverseAdj: Map<string, string[]> } {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const adjacency = new Map<string, string[]>();
    const reverseAdj = new Map<string, string[]>();

    for (let i = 0; i < size; i++) {
        nodes.push({ id: String(i), label: String(i), state: 'default' });
        adjacency.set(String(i), []);
        reverseAdj.set(String(i), []);
    }

    // Create SCCs by design
    // SCC 1: 0 -> 1 -> 2 -> 0
    if (size >= 3) {
        edges.push({ source: '0', target: '1', state: 'default' });
        edges.push({ source: '1', target: '2', state: 'default' });
        edges.push({ source: '2', target: '0', state: 'default' });
        adjacency.get('0')?.push('1');
        adjacency.get('1')?.push('2');
        adjacency.get('2')?.push('0');
        reverseAdj.get('1')?.push('0');
        reverseAdj.get('2')?.push('1');
        reverseAdj.get('0')?.push('2');
    }

    // SCC 2: 3 -> 4 -> 3 (if size allows)
    if (size >= 5) {
        edges.push({ source: '3', target: '4', state: 'default' });
        edges.push({ source: '4', target: '3', state: 'default' });
        edges.push({ source: '2', target: '3', state: 'default' }); // Connection between SCCs
        adjacency.get('3')?.push('4');
        adjacency.get('4')?.push('3');
        adjacency.get('2')?.push('3');
        reverseAdj.get('4')?.push('3');
        reverseAdj.get('3')?.push('4');
        reverseAdj.get('3')?.push('2');
    }

    // Add more vertices - connect each to the existing graph
    for (let i = 5; i < size; i++) {
        const from = Math.floor(Math.random() * i);
        edges.push({ source: String(from), target: String(i), state: 'default' });
        adjacency.get(String(from))?.push(String(i));
        reverseAdj.get(String(i))?.push(String(from));

        // Optionally create some back edges to form more SCCs
        if (i < size - 1 && Math.random() > 0.6) {
            const to = Math.floor(Math.random() * i);
            if (to !== from) {
                edges.push({ source: String(i), target: String(to), state: 'default' });
                adjacency.get(String(i))?.push(String(to));
                reverseAdj.get(String(to))?.push(String(i));
            }
        }
    }

    return { nodes, edges, adjacency, reverseAdj };
}

export const scc: AlgorithmConfig = {
    id: 'scc',
    name: 'Strongly Connected Components',
    category: 'graphs',
    description: "Kosaraju's algorithm finds all Strongly Connected Components in a directed graph using two DFS passes.",
    complexity: {
        time: {
            best: 'O(V + E)',
            average: 'O(V + E)',
            worst: 'O(V + E)',
        },
        space: 'O(V)',
    },
    pseudocode: [
        "procedure kosaraju(G)",
        "    // First DFS to get finish order",
        "    stack = []",
        "    for each vertex v do",
        "        if v not visited then",
        "            DFS1(v, stack)",
        "        end if",
        "    end for",
        "    // Create transpose graph",
        "    G_T = transpose(G)",
        "    // Second DFS in reverse finish order",
        "    while stack not empty do",
        "        v = stack.pop()",
        "        if v not visited then",
        "            DFS2(v) // collect SCC",
        "        end if",
        "    end while",
        "end procedure",
    ],
    visualizerType: 'graph',
    defaultInputSize: 5,
    minInputSize: 4,
    maxInputSize: 8,
    supportsCases: false,

    generateInput(size: number) {
        return createDirectedGraph(size);
    },

    generateSteps(input: unknown): AnimationStep[] {
        const { nodes, edges, adjacency, reverseAdj } = input as ReturnType<typeof createDirectedGraph>;
        const steps: AnimationStep[] = [];

        const visited1 = new Set<string>();
        const visited2 = new Set<string>();
        const stack: string[] = [];
        const sccs: string[][] = [];

        const createState = () => ({
            nodes: nodes.map(node => ({ ...node })),
            edges: edges.map(edge => ({ ...edge })),
            queue: [...stack],
        });

        steps.push({
            id: 0,
            description: "Kosaraju's SCC Algorithm: Finding strongly connected components",
            pseudocodeLine: 0,
            state: { graph: createState() },
            comparisons: 0,
            swaps: 0,
            memoryUsage: nodes.length,
        });

        // First DFS
        const dfs1 = (v: string) => {
            visited1.add(v);
            const node = nodes.find(n => n.id === v);
            if (node) node.state = 'current';

            steps.push({
                id: steps.length,
                description: `First DFS: Visiting vertex ${v}`,
                pseudocodeLine: 5,
                state: { graph: createState() },
                comparisons: steps.length,
                swaps: 0,
                memoryUsage: nodes.length,
            });

            for (const neighbor of adjacency.get(v) || []) {
                if (!visited1.has(neighbor)) {
                    const edge = edges.find(e => e.source === v && e.target === neighbor);
                    if (edge) edge.state = 'current';
                    dfs1(neighbor);
                }
            }

            if (node) node.state = 'visited';
            stack.push(v);

            steps.push({
                id: steps.length,
                description: `Finished vertex ${v}, pushed to stack. Stack: [${stack.join(', ')}]`,
                pseudocodeLine: 5,
                state: { graph: createState() },
                comparisons: steps.length,
                swaps: 0,
                memoryUsage: nodes.length,
            });
        };

        for (const node of nodes) {
            if (!visited1.has(node.id)) {
                dfs1(node.id);
            }
        }

        steps.push({
            id: steps.length,
            description: `First DFS complete. Finish order: [${[...stack].reverse().join(', ')}]`,
            pseudocodeLine: 7,
            state: { graph: createState() },
            comparisons: steps.length,
            swaps: 0,
            memoryUsage: nodes.length,
        });

        // Reset for second pass
        for (const node of nodes) {
            node.state = 'default';
        }
        for (const edge of edges) {
            edge.state = 'default';
        }

        steps.push({
            id: steps.length,
            description: 'Processing transpose graph (reversed edges)',
            pseudocodeLine: 9,
            state: { graph: createState() },
            comparisons: steps.length,
            swaps: 0,
            memoryUsage: nodes.length,
        });

        // Second DFS
        const dfs2 = (v: string, currentSCC: string[]) => {
            visited2.add(v);
            currentSCC.push(v);
            const node = nodes.find(n => n.id === v);
            if (node) node.state = 'current';

            for (const neighbor of reverseAdj.get(v) || []) {
                if (!visited2.has(neighbor)) {
                    dfs2(neighbor, currentSCC);
                }
            }
        };

        while (stack.length > 0) {
            const v = stack.pop()!;
            if (!visited2.has(v)) {
                const currentSCC: string[] = [];
                dfs2(v, currentSCC);
                sccs.push(currentSCC);

                // Mark this SCC as processed
                for (const nodeId of currentSCC) {
                    const node = nodes.find(n => n.id === nodeId);
                    if (node) node.state = 'processed';
                }

                steps.push({
                    id: steps.length,
                    description: `Found SCC ${sccs.length}: {${currentSCC.join(', ')}}`,
                    pseudocodeLine: 14,
                    state: { graph: createState() },
                    comparisons: steps.length,
                    swaps: 0,
                    memoryUsage: nodes.length,
                });
            }
        }

        steps.push({
            id: steps.length,
            description: `Kosaraju's algorithm complete! Found ${sccs.length} SCC(s): ${sccs.map(s => `{${s.join(',')}}`).join(', ')}`,
            pseudocodeLine: 17,
            state: { graph: createState() },
            comparisons: steps.length,
            swaps: 0,
            memoryUsage: nodes.length,
        });

        return steps;
    },
};
