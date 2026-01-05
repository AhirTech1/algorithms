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
