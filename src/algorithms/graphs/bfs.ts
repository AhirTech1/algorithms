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

    // Create nodes
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
            adjacency.get(String(t))?.push(String(s)); // Undirected
        }
    };

    // First, create a spanning tree to ensure connectivity
    for (let i = 1; i < size; i++) {
        // Connect to a random lower-indexed node to ensure connectivity
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
    cCode: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX 100

// Queue structure
struct Queue {
    int items[MAX];
    int front;
    int rear;
};

struct Queue* createQueue() {
    struct Queue* q = (struct Queue*)malloc(sizeof(struct Queue));
    q->front = -1;
    q->rear = -1;
    return q;
}

bool isEmpty(struct Queue* q) {
    return q->rear == -1;
}

void enqueue(struct Queue* q, int value) {
    if (q->rear == MAX - 1)
        return;
    if (q->front == -1)
        q->front = 0;
    q->rear++;
    q->items[q->rear] = value;
}

int dequeue(struct Queue* q) {
    int item;
    if (isEmpty(q))
        return -1;
    item = q->items[q->front];
    q->front++;
    if (q->front > q->rear) {
        q->front = q->rear = -1;
    }
    return item;
}

void BFS(int graph[][MAX], int vertices, int startVertex) {
    bool visited[MAX] = {false};
    struct Queue* q = createQueue();
    
    visited[startVertex] = true;
    enqueue(q, startVertex);
    
    printf("BFS Traversal: ");
    
    while (!isEmpty(q)) {
        int currentVertex = dequeue(q);
        printf("%d ", currentVertex);
        
        for (int i = 0; i < vertices; i++) {
            if (graph[currentVertex][i] == 1 && !visited[i]) {
                visited[i] = true;
                enqueue(q, i);
            }
        }
    }
    printf("\n");
}`,
    visualizerType: 'graph',
    defaultInputSize: 7,
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
