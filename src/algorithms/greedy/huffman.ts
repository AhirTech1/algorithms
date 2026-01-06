import type { AlgorithmConfig, AnimationStep } from '../../types/algorithm';

interface HuffmanNode {
    char: string;
    freq: number;
    left?: HuffmanNode;
    right?: HuffmanNode;
}

export const huffmanCoding: AlgorithmConfig = {
    id: 'huffman-coding',
    name: 'Huffman Coding',
    category: 'greedy',
    description: 'A greedy algorithm for lossless data compression. Builds a binary tree based on character frequencies, assigning shorter codes to more frequent characters.',
    complexity: {
        time: {
            best: 'O(n log n)',
            average: 'O(n log n)',
            worst: 'O(n log n)',
        },
        space: 'O(n)',
    },
    pseudocode: [
        'procedure huffman(C)',
        '    n = |C|',
        '    Q = priority_queue(C)',
        '    for i = 1 to n-1 do',
        '        z = new node',
        '        z.left = x = extract_min(Q)',
        '        z.right = y = extract_min(Q)',
        '        z.freq = x.freq + y.freq',
        '        insert(Q, z)',
        '    end for',
        '    return extract_min(Q)',
        'end procedure',
    ],
    cCode: `#include <stdlib.h>
#include <string.h>

typedef struct MinHeapNode {
    char data;
    unsigned freq;
    struct MinHeapNode *left, *right;
} MinHeapNode;

typedef struct MinHeap {
    unsigned size;
    unsigned capacity;
    MinHeapNode** array;
} MinHeap;

MinHeapNode* newNode(char data, unsigned freq) {
    MinHeapNode* temp = (MinHeapNode*)malloc(sizeof(MinHeapNode));
    temp->left = temp->right = NULL;
    temp->data = data;
    temp->freq = freq;
    return temp;
}

MinHeap* createMinHeap(unsigned capacity) {
    MinHeap* minHeap = (MinHeap*)malloc(sizeof(MinHeap));
    minHeap->size = 0;
    minHeap->capacity = capacity;
    minHeap->array = (MinHeapNode**)malloc(minHeap->capacity * sizeof(MinHeapNode*));
    return minHeap;
}

void swapMinHeapNode(MinHeapNode** a, MinHeapNode** b) {
    MinHeapNode* t = *a;
    *a = *b;
    *b = t;
}

void minHeapify(MinHeap* minHeap, int idx) {
    int smallest = idx;
    int left = 2 * idx + 1;
    int right = 2 * idx + 2;
    
    if (left < minHeap->size && minHeap->array[left]->freq < minHeap->array[smallest]->freq)
        smallest = left;
    
    if (right < minHeap->size && minHeap->array[right]->freq < minHeap->array[smallest]->freq)
        smallest = right;
    
    if (smallest != idx) {
        swapMinHeapNode(&minHeap->array[smallest], &minHeap->array[idx]);
        minHeapify(minHeap, smallest);
    }
}

MinHeapNode* extractMin(MinHeap* minHeap) {
    MinHeapNode* temp = minHeap->array[0];
    minHeap->array[0] = minHeap->array[minHeap->size - 1];
    --minHeap->size;
    minHeapify(minHeap, 0);
    return temp;
}

void insertMinHeap(MinHeap* minHeap, MinHeapNode* minHeapNode) {
    ++minHeap->size;
    int i = minHeap->size - 1;
    
    while (i && minHeapNode->freq < minHeap->array[(i - 1) / 2]->freq) {
        minHeap->array[i] = minHeap->array[(i - 1) / 2];
        i = (i - 1) / 2;
    }
    minHeap->array[i] = minHeapNode;
}

MinHeapNode* buildHuffmanTree(char data[], int freq[], int size) {
    MinHeapNode *left, *right, *top;
    MinHeap* minHeap = createMinHeap(size);
    
    for (int i = 0; i < size; ++i)
        minHeap->array[i] = newNode(data[i], freq[i]);
    minHeap->size = size;
    
    for (int i = (minHeap->size - 1) / 2; i >= 0; --i)
        minHeapify(minHeap, i);
    
    while (minHeap->size != 1) {
        left = extractMin(minHeap);
        right = extractMin(minHeap);
        
        top = newNode('$', left->freq + right->freq);
        top->left = left;
        top->right = right;
        
        insertMinHeap(minHeap, top);
    }
    
    return extractMin(minHeap);
}

void printCodes(MinHeapNode* root, int arr[], int top) {
    if (root->left) {
        arr[top] = 0;
        printCodes(root->left, arr, top + 1);
    }
    
    if (root->right) {
        arr[top] = 1;
        printCodes(root->right, arr, top + 1);
    }
    
    if (!root->left && !root->right) {
        printf("%c: ", root->data);
        for (int i = 0; i < top; ++i)
            printf("%d", arr[i]);
        printf("\n");
    }
}

void huffmanCodes(char data[], int freq[], int size) {
    MinHeapNode* root = buildHuffmanTree(data, freq, size);
    int arr[100], top = 0;
    printCodes(root, arr, top);
}`,
    visualizerType: 'custom',
    defaultInputSize: 6,
    minInputSize: 4,
    maxInputSize: 8,
    supportsCases: false,

    generateInput(size: number): { chars: string[]; freqs: number[] } {
        const chars = 'ABCDEFGH'.split('').slice(0, size);
        const freqs = Array.from({ length: size }, () => Math.floor(Math.random() * 30) + 5);
        return { chars, freqs };
    },

    generateSteps(input: unknown): AnimationStep[] {
        const { chars, freqs } = input as { chars: string[]; freqs: number[] };
        const steps: AnimationStep[] = [];

        // Create initial nodes
        const nodes: HuffmanNode[] = chars.map((char, i) => ({ char, freq: freqs[i] }));

        // Min-heap simulation
        let heap: HuffmanNode[] = [...nodes].sort((a, b) => a.freq - b.freq);
        const codes: Map<string, string> = new Map();

        steps.push({
            id: 0,
            description: `Huffman Coding: ${chars.length} characters with frequencies [${freqs.join(', ')}]`,
            pseudocodeLine: 0,
            state: {
                huffman: {
                    heap: heap.map(n => ({ char: n.char, freq: n.freq })),
                    codes: Object.fromEntries(codes),
                    phase: 'init',
                }
            },
            comparisons: 0,
            swaps: 0,
            memoryUsage: nodes.length,
        });

        steps.push({
            id: steps.length,
            description: `Initial priority queue (sorted by frequency): [${heap.map(n => `${n.char}:${n.freq}`).join(', ')}]`,
            pseudocodeLine: 2,
            state: {
                huffman: {
                    heap: heap.map(n => ({ char: n.char, freq: n.freq })),
                    codes: Object.fromEntries(codes),
                    phase: 'building',
                }
            },
            comparisons: 0,
            swaps: 0,
            memoryUsage: heap.length,
        });

        // Build Huffman tree
        let stepCount = 0;
        while (heap.length > 1) {
            // Extract two minimum
            const left = heap.shift()!;
            const right = heap.shift()!;
            stepCount++;

            steps.push({
                id: steps.length,
                description: `Extracted two minimum: '${left.char}' (${left.freq}) and '${right.char}' (${right.freq})`,
                pseudocodeLine: 5,
                state: {
                    huffman: {
                        heap: heap.map(n => ({ char: n.char, freq: n.freq })),
                        extracting: [left.char, right.char],
                        codes: Object.fromEntries(codes),
                        phase: 'extracting',
                    }
                },
                comparisons: stepCount,
                swaps: 0,
                memoryUsage: heap.length + 2,
            });

            // Create new internal node
            const combined: HuffmanNode = {
                char: `(${left.char}${right.char})`,
                freq: left.freq + right.freq,
                left,
                right,
            };

            // Insert back and re-sort
            heap.push(combined);
            heap.sort((a, b) => a.freq - b.freq);

            steps.push({
                id: steps.length,
                description: `Created internal node '${combined.char}' with freq ${combined.freq}. Inserted back into queue.`,
                pseudocodeLine: 8,
                state: {
                    huffman: {
                        heap: heap.map(n => ({ char: n.char, freq: n.freq })),
                        newNode: { char: combined.char, freq: combined.freq },
                        codes: Object.fromEntries(codes),
                        phase: 'inserting',
                    }
                },
                comparisons: stepCount,
                swaps: 0,
                memoryUsage: heap.length,
            });
        }

        // Extract codes from the tree
        const root = heap[0];
        const extractCodes = (node: HuffmanNode | undefined, code: string) => {
            if (!node) return;
            if (!node.left && !node.right) {
                // Leaf node
                codes.set(node.char, code || '0');
            } else {
                extractCodes(node.left, code + '0');
                extractCodes(node.right, code + '1');
            }
        };
        extractCodes(root, '');

        steps.push({
            id: steps.length,
            description: `Huffman tree complete! Root has frequency ${root.freq}.`,
            pseudocodeLine: 10,
            state: {
                huffman: {
                    heap: [{ char: root.char, freq: root.freq }],
                    codes: Object.fromEntries(codes),
                    phase: 'complete',
                }
            },
            comparisons: stepCount,
            swaps: 0,
            memoryUsage: 1,
        });

        // Final step showing all codes
        const codesDisplay = Array.from(codes.entries())
            .map(([char, code]) => `'${char}': ${code}`)
            .join(', ');

        steps.push({
            id: steps.length,
            description: `Generated Huffman codes: ${codesDisplay}`,
            pseudocodeLine: 10,
            state: {
                huffman: {
                    heap: [{ char: root.char, freq: root.freq }],
                    codes: Object.fromEntries(codes),
                    phase: 'done',
                }
            },
            comparisons: stepCount,
            swaps: 0,
            memoryUsage: codes.size,
        });

        return steps;
    },
};
