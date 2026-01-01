import type { AlgorithmConfig, AnimationStep } from '../../types/algorithm';

export const kmp: AlgorithmConfig = {
    id: 'kmp',
    name: 'KMP Algorithm',
    category: 'string-matching',
    description: 'Knuth-Morris-Pratt algorithm that uses the failure function to avoid redundant comparisons. Achieves linear time complexity.',
    complexity: {
        time: {
            best: 'O(n + m)',
            average: 'O(n + m)',
            worst: 'O(n + m)',
        },
        space: 'O(m)',
    },
    pseudocode: [
        'procedure KMP(text, pattern)',
        '    lps = computeLPS(pattern)',
        '    i = 0, j = 0',
        '    while i < n do',
        '        if pattern[j] == text[i] then',
        '            i++, j++',
        '        end if',
        '        if j == m then',
        '            print "Pattern found at", i-j',
        '            j = lps[j-1]',
        '        else if i < n and pattern[j] ≠ text[i] then',
        '            if j ≠ 0 then',
        '                j = lps[j-1]',
        '            else',
        '                i++',
        '            end if',
        '        end if',
        '    end while',
        'end procedure',
    ],
    visualizerType: 'array',
    defaultInputSize: 12,
    minInputSize: 6,
    maxInputSize: 20,
    supportsCases: false,

    generateInput(size: number): { text: string; pattern: string } {
        const chars = 'ABAB';
        const text = Array.from({ length: size }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        const patternLen = Math.min(4, Math.floor(size / 3));
        const start = Math.floor(Math.random() * (size - patternLen));
        const pattern = text.substring(start, start + patternLen);
        return { text, pattern };
    },

    generateSteps(input: unknown): AnimationStep[] {
        const { text, pattern } = input as { text: string; pattern: string };
        const steps: AnimationStep[] = [];
        const n = text.length;
        const m = pattern.length;
        let comparisons = 0;
        const matches: number[] = [];

        // Compute LPS array
        const lps = new Array(m).fill(0);
        let len = 0;
        let k = 1;

        while (k < m) {
            if (pattern[k] === pattern[len]) {
                len++;
                lps[k] = len;
                k++;
            } else if (len !== 0) {
                len = lps[len - 1];
            } else {
                lps[k] = 0;
                k++;
            }
        }

        steps.push({
            id: 0,
            description: `KMP: Searching "${pattern}" in "${text}". LPS: [${lps.join(', ')}]`,
            pseudocodeLine: 1,
            state: { stringMatch: { text, pattern, position: 0, matchIndices: [], lps } },
            comparisons: 0,
            swaps: 0,
            memoryUsage: m,
        });

        let i = 0, j = 0;

        while (i < n) {
            comparisons++;

            if (pattern[j] === text[i]) {
                steps.push({
                    id: steps.length,
                    description: `Match: text[${i}]='${text[i]}' == pattern[${j}]='${pattern[j]}'`,
                    pseudocodeLine: 4,
                    state: { stringMatch: { text, pattern, position: i - j, matchIndices: [...matches], comparing: i, matched: j + 1 } },
                    comparisons,
                    swaps: 0,
                    memoryUsage: m,
                });

                i++;
                j++;
            }

            if (j === m) {
                matches.push(i - j);

                steps.push({
                    id: steps.length,
                    description: `Pattern found at index ${i - j}!`,
                    pseudocodeLine: 8,
                    state: { stringMatch: { text, pattern, position: i - j, matchIndices: [...matches], found: true } },
                    comparisons,
                    swaps: 0,
                    memoryUsage: m,
                });

                j = lps[j - 1];
            } else if (i < n && pattern[j] !== text[i]) {
                steps.push({
                    id: steps.length,
                    description: `Mismatch at text[${i}]. Using LPS to skip: j = lps[${j - 1}] = ${j !== 0 ? lps[j - 1] : 0}`,
                    pseudocodeLine: 10,
                    state: { stringMatch: { text, pattern, position: i - j, matchIndices: [...matches], comparing: i, mismatch: true } },
                    comparisons,
                    swaps: 0,
                    memoryUsage: m,
                });

                if (j !== 0) {
                    j = lps[j - 1];
                } else {
                    i++;
                }
            }
        }

        steps.push({
            id: steps.length,
            description: `KMP complete. Found ${matches.length} match(es) at: [${matches.join(', ')}]`,
            pseudocodeLine: 17,
            state: { stringMatch: { text, pattern, position: -1, matchIndices: matches, done: true } },
            comparisons,
            swaps: 0,
            memoryUsage: m,
        });

        return steps;
    },
};
