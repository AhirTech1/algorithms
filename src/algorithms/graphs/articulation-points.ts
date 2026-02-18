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

function createUndirectedGraph(size: number): { nodes: GraphNode[]; edges: GraphEdge[]; adjacency: Map<string, string[]> } {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const adjacency = new Map<string, string[]>();

    for (let i = 0; i < size; i++) {
        nodes.push({ id: String(i), label: String(i), state: 'default' });
        adjacency.set(String(i), []);
    }

    // Create a connected graph with some articulation points
    // Node 1 is an articulation point connecting 0 to the rest
    if (size >= 4) {
        edges.push({ source: '0', target: '1', state: 'default' });
        edges.push({ source: '1', target: '2', state: 'default' });
        edges.push({ source: '1', target: '3', state: 'default' });
        edges.push({ source: '2', target: '3', state: 'default' });

        adjacency.get('0')?.push('1');
        adjacency.get('1')?.push('0', '2', '3');
        adjacency.get('2')?.push('1', '3');
        adjacency.get('3')?.push('1', '2');
    }

    // Add more vertices
    for (let i = 4; i < size; i++) {
        const connectTo = Math.floor(Math.random() * (i - 1)) + 1;
        edges.push({ source: String(connectTo), target: String(i), state: 'default' });
        adjacency.get(String(connectTo))?.push(String(i));
        adjacency.get(String(i))?.push(String(connectTo));

        // Maybe add another edge
        if (Math.random() > 0.5 && i > 1) {
            const another = Math.floor(Math.random() * (i - 1));
            if (another !== connectTo) {
                edges.push({ source: String(another), target: String(i), state: 'default' });
                adjacency.get(String(another))?.push(String(i));
                adjacency.get(String(i))?.push(String(another));
            }
        }
    }

    return { nodes, edges, adjacency };
}

export const articulationPoints: AlgorithmConfig = {
    id: 'articulation-points',
    name: 'Articulation Points',
    category: 'graphs',
    description: 'Find articulation points (cut vertices) in an undirected graph. Removing an articulation point disconnects the graph.',
    complexity: {
        time: {
            best: 'O(V + E)',
            average: 'O(V + E)',
            worst: 'O(V + E)',
        },
        space: 'O(V)',
    },
    pseudocode: [
        'procedure findAP(G)',
        '    disc[] = low[] = -1',
        '    for each vertex u do',
        '        if disc[u] == -1 then',
        '            DFS(u, -1)',
        '        end if',
        '    end for',
        'end procedure',
        '',
        'procedure DFS(u, parent)',
        '    disc[u] = low[u] = timer++',
        '    children = 0',
        '    for each neighbor v of u do',
        '        if disc[v] == -1 then',
        '            children++',
        '            DFS(v, u)',
        '            low[u] = min(low[u], low[v])',
        '            if parent == -1 and children > 1 then',
        '                u is articulation point (root)',
        '            if parent != -1 and low[v] >= disc[u] then',
        '                u is articulation point',
        '            end if',
        '        else if v != parent then',
        '            low[u] = min(low[u], disc[v])',
        '        end if',
        '    end for',
        'end procedure',
    ],
    cCode: `#include <stdio.h>
#include <stdbool.h>

#define MAX 100

int min(int a, int b) {
    return (a < b) ? a : b;
}

void APUtil(int graph[][MAX], int u, bool visited[], int disc[], int low[], int parent[], bool ap[], int vertices, int* time) {
    int children = 0;
    
    visited[u] = true;
    disc[u] = low[u] = ++(*time);
    
    for (int v = 0; v < vertices; v++) {
        if (graph[u][v] == 1) {
            if (!visited[v]) {
                children++;
                parent[v] = u;
                APUtil(graph, v, visited, disc, low, parent, ap, vertices, time);
                
                low[u] = min(low[u], low[v]);
                
                // u is an articulation point in following cases:
                // (1) u is root of DFS tree and has two or more children
                if (parent[u] == -1 && children > 1)
                    ap[u] = true;
                
                // (2) u is not root and low value of one of its child is more than discovery value of u
                if (parent[u] != -1 && low[v] >= disc[u])
                    ap[u] = true;
            }
            else if (v != parent[u])
                low[u] = min(low[u], disc[v]);
        }
    }
}

void findArticulationPoints(int graph[][MAX], int vertices) {
    bool visited[MAX] = {false};
    int disc[MAX];
    int low[MAX];
    int parent[MAX];
    bool ap[MAX] = {false};
    int time = 0;
    
    for (int i = 0; i < vertices; i++) {
        parent[i] = -1;
    }
    
    for (int i = 0; i < vertices; i++) {
        if (!visited[i])
            APUtil(graph, i, visited, disc, low, parent, ap, vertices, &time);
    }
    
    printf("Articulation Points: ");
    for (int i = 0; i < vertices; i++) {
        if (ap[i])
            printf("%d ", i);
    }
    printf("\n");
}`,
    visualizerType: 'graph',
    defaultInputSize: 7,
    minInputSize: 4,
    maxInputSize: 10,
    supportsCases: false,

    generateInput(size: number) {
        return createUndirectedGraph(size);
    },

    generateSteps(input: unknown): AnimationStep[] {
        const { nodes, edges, adjacency } = input as ReturnType<typeof createUndirectedGraph>;
        const steps: AnimationStep[] = [];
        const n = nodes.length;

        const disc: number[] = new Array(n).fill(-1);
        const low: number[] = new Array(n).fill(-1);
        const parent: number[] = new Array(n).fill(-1);
        const ap: Set<number> = new Set();
        let timer = 0;

        const createState = () => ({
            nodes: nodes.map(node => ({ ...node })),
            edges: edges.map(edge => ({ ...edge })),
            queue: Array.from(ap).map(String),
        });

        steps.push({
            id: 0,
            description: 'Finding articulation points (cut vertices)',
            pseudocodeLine: 0,
            state: { graph: createState() },
            comparisons: 0,
            swaps: 0,
            memoryUsage: n * 3,
        });

        const dfs = (u: number, p: number) => {
            disc[u] = low[u] = timer++;
            let children = 0;
            nodes[u].state = 'current';

            steps.push({
                id: steps.length,
                description: `Visiting vertex ${u}: disc[${u}] = low[${u}] = ${disc[u]}`,
                pseudocodeLine: 10,
                state: { graph: createState() },
                comparisons: steps.length,
                swaps: 0,
                memoryUsage: n * 3,
            });

            for (const neighbor of adjacency.get(String(u)) || []) {
                const v = parseInt(neighbor);

                if (disc[v] === -1) {
                    children++;
                    parent[v] = u;

                    const edge = edges.find(e =>
                        (e.source === String(u) && e.target === String(v)) ||
                        (e.source === String(v) && e.target === String(u))
                    );
                    if (edge) edge.state = 'current';

                    dfs(v, u);

                    low[u] = Math.min(low[u], low[v]);

                    steps.push({
                        id: steps.length,
                        description: `Back from ${v}: low[${u}] = min(low[${u}], low[${v}]) = min(${low[u]}, ${low[v]}) = ${Math.min(low[u], low[v])}`,
                        pseudocodeLine: 16,
                        state: { graph: createState() },
                        comparisons: steps.length,
                        swaps: 0,
                        memoryUsage: n * 3,
                    });

                    // Check articulation point conditions
                    if (p === -1 && children > 1) {
                        ap.add(u);
                        nodes[u].state = 'path';
                        steps.push({
                            id: steps.length,
                            description: `Vertex ${u} is an articulation point (root with ${children} children)`,
                            pseudocodeLine: 18,
                            state: { graph: createState() },
                            comparisons: steps.length,
                            swaps: 0,
                            memoryUsage: n * 3,
                        });
                    }

                    if (p !== -1 && low[v] >= disc[u]) {
                        ap.add(u);
                        nodes[u].state = 'path';
                        steps.push({
                            id: steps.length,
                            description: `Vertex ${u} is an articulation point (low[${v}]=${low[v]} >= disc[${u}]=${disc[u]})`,
                            pseudocodeLine: 20,
                            state: { graph: createState() },
                            comparisons: steps.length,
                            swaps: 0,
                            memoryUsage: n * 3,
                        });
                    }

                    if (edge) edge.state = 'visited';
                } else if (v !== p) {
                    low[u] = Math.min(low[u], disc[v]);
                    steps.push({
                        id: steps.length,
                        description: `Back edge to ${v}: low[${u}] = min(low[${u}], disc[${v}]) = ${low[u]}`,
                        pseudocodeLine: 23,
                        state: { graph: createState() },
                        comparisons: steps.length,
                        swaps: 0,
                        memoryUsage: n * 3,
                    });
                }
            }

            if (!ap.has(u)) {
                nodes[u].state = 'processed';
            }
        };

        for (let i = 0; i < n; i++) {
            if (disc[i] === -1) {
                dfs(i, -1);
            }
        }

        // Final state: highlight articulation points
        for (const node of nodes) {
            if (ap.has(parseInt(node.id))) {
                node.state = 'path';
            }
        }

        steps.push({
            id: steps.length,
            description: `Found ${ap.size} articulation point(s): {${Array.from(ap).join(', ')}}`,
            pseudocodeLine: 6,
            state: { graph: createState() },
            comparisons: steps.length,
            swaps: 0,
            memoryUsage: n * 3,
        });

        return steps;
    },
};
