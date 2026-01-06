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

function createDAG(size: number): { nodes: GraphNode[]; edges: GraphEdge[]; adjacency: Map<string, string[]> } {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const adjacency = new Map<string, string[]>();

    for (let i = 0; i < size; i++) {
        nodes.push({ id: String(i), label: String(i), state: 'default' });
        adjacency.set(String(i), []);
    }

    // Create DAG edges (only forward edges)
    for (let i = 0; i < size - 1; i++) {
        for (let j = i + 1; j < Math.min(i + 3, size); j++) {
            if (Math.random() > 0.3) {
                edges.push({ source: String(i), target: String(j), state: 'default' });
                adjacency.get(String(i))?.push(String(j));
            }
        }
    }

    return { nodes, edges, adjacency };
}

export const topologicalSort: AlgorithmConfig = {
    id: 'topological-sort',
    name: 'Topological Sort',
    category: 'graphs',
    description: 'A linear ordering of vertices in a DAG such that for every directed edge (u,v), vertex u comes before v. Used in task scheduling, dependency resolution.',
    complexity: {
        time: {
            best: 'O(V + E)',
            average: 'O(V + E)',
            worst: 'O(V + E)',
        },
        space: 'O(V)',
    },
    pseudocode: [
        'procedure topologicalSort(G)',
        '    for each vertex v in G do',
        '        if v not visited then',
        '            DFS(v)',
        '        end if',
        '    end for',
        '    return stack (reversed)',
        'end procedure',
        '',
        'procedure DFS(v)',
        '    mark v as visited',
        '    for each neighbor u of v do',
        '        if u not visited then',
        '            DFS(u)',
        '        end if',
        '    end for',
        '    push v to stack',
        'end procedure',
    ],
    cCode: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX 100

void topologicalSortUtil(int graph[][MAX], int v, bool visited[], int stack[], int* top, int vertices) {
    visited[v] = true;
    
    for (int i = 0; i < vertices; i++) {
        if (graph[v][i] == 1 && !visited[i])
            topologicalSortUtil(graph, i, visited, stack, top, vertices);
    }
    
    stack[++(*top)] = v;
}

void topologicalSort(int graph[][MAX], int vertices) {
    int stack[MAX];
    int top = -1;
    bool visited[MAX] = {false};
    
    // Call recursive helper for all vertices
    for (int i = 0; i < vertices; i++) {
        if (!visited[i])
            topologicalSortUtil(graph, i, visited, stack, &top, vertices);
    }
    
    printf("Topological Sort: ");
    while (top >= 0) {
        printf("%d ", stack[top--]);
    }
    printf("\n");
}

// Kahn's Algorithm (BFS approach)
void topologicalSortKahn(int graph[][MAX], int vertices) {
    int inDegree[MAX] = {0};
    int queue[MAX];
    int front = 0, rear = 0;
    int count = 0;
    
    // Calculate in-degree for each vertex
    for (int i = 0; i < vertices; i++)
        for (int j = 0; j < vertices; j++)
            if (graph[i][j] == 1)
                inDegree[j]++;
    
    // Enqueue vertices with in-degree 0
    for (int i = 0; i < vertices; i++)
        if (inDegree[i] == 0)
            queue[rear++] = i;
    
    printf("Topological Sort (Kahn): ");
    
    while (front < rear) {
        int u = queue[front++];
        printf("%d ", u);
        count++;
        
        // Decrease in-degree of adjacent vertices
        for (int v = 0; v < vertices; v++) {
            if (graph[u][v] == 1) {
                inDegree[v]--;
                if (inDegree[v] == 0)
                    queue[rear++] = v;
            }
        }
    }
    
    if (count != vertices)
        printf("\nGraph has a cycle!");
    printf("\n");
}`,
    visualizerType: 'graph',
    defaultInputSize: 6,
    minInputSize: 4,
    maxInputSize: 10,
    supportsCases: false,

    generateInput(size: number) {
        return createDAG(size);
    },

    generateSteps(input: unknown): AnimationStep[] {
        const { nodes, edges, adjacency } = input as { nodes: GraphNode[]; edges: GraphEdge[]; adjacency: Map<string, string[]> };
        const steps: AnimationStep[] = [];
        const visited = new Set<string>();
        const stack: string[] = [];

        const createState = () => ({
            nodes: nodes.map(n => ({ ...n })),
            edges: edges.map(e => ({ ...e })),
            queue: [...stack],
        });

        steps.push({
            id: 0,
            description: 'Starting Topological Sort on DAG',
            pseudocodeLine: 0,
            state: { graph: createState() },
            comparisons: 0,
            swaps: 0,
            memoryUsage: nodes.length,
        });

        function dfs(v: string) {
            visited.add(v);
            nodes.find(n => n.id === v)!.state = 'current';

            steps.push({
                id: steps.length,
                description: `Visiting vertex ${v}`,
                pseudocodeLine: 10,
                state: { graph: createState() },
                comparisons: 0,
                swaps: 0,
                memoryUsage: nodes.length,
            });

            const neighbors = adjacency.get(v) || [];
            for (const u of neighbors) {
                if (!visited.has(u)) {
                    const edge = edges.find(e => e.source === v && e.target === u);
                    if (edge) edge.state = 'current';

                    steps.push({
                        id: steps.length,
                        description: `Exploring edge ${v} → ${u}`,
                        pseudocodeLine: 11,
                        state: { graph: createState() },
                        comparisons: 0,
                        swaps: 0,
                        memoryUsage: nodes.length,
                    });

                    if (edge) edge.state = 'visited';
                    dfs(u);
                }
            }

            nodes.find(n => n.id === v)!.state = 'processed';
            stack.push(v);

            steps.push({
                id: steps.length,
                description: `Finished ${v}, pushed to stack. Stack: [${[...stack].reverse().join(', ')}]`,
                pseudocodeLine: 16,
                state: { graph: createState() },
                comparisons: 0,
                swaps: 0,
                memoryUsage: nodes.length,
            });
        }

        for (const node of nodes) {
            if (!visited.has(node.id)) {
                dfs(node.id);
            }
        }

        steps.push({
            id: steps.length,
            description: `Topological Order: ${[...stack].reverse().join(' → ')}`,
            pseudocodeLine: 6,
            state: { graph: createState() },
            comparisons: 0,
            swaps: 0,
            memoryUsage: nodes.length,
        });

        return steps;
    },
};
