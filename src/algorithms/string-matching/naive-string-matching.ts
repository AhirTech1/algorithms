import type { AlgorithmConfig, AnimationStep } from '../../types/algorithm';

export const naiveStringMatching: AlgorithmConfig = {
    id: 'naive-string-matching',
    name: 'Naive String Matching',
    category: 'string-matching',
    description: 'The simplest pattern matching algorithm that checks for pattern at every position in the text by comparing character by character.',
    complexity: {
        time: {
            best: 'O(n)',
            average: 'O(nm)',
            worst: 'O(nm)',
        },
        space: 'O(1)',
    },
    pseudocode: [
        'procedure naiveSearch(text, pattern)',
        '    n = length(text)',
        '    m = length(pattern)',
        '    for i = 0 to n - m do',
        '        j = 0',
        '        while j < m and text[i+j] == pattern[j] do',
        '            j = j + 1',
        '        end while',
        '        if j == m then',
        '            print "Pattern found at index", i',
        '        end if',
        '    end for',
        'end procedure',
    ],
    cCode: `#include <stdio.h>
#include <string.h>

void naiveStringMatching(char* text, char* pattern) {
    int n = strlen(text);
    int m = strlen(pattern);
    int i, j;
    
    printf("Pattern found at positions: ");
    int found = 0;
    
    // Slide pattern over text one by one
    for (i = 0; i <= n - m; i++) {
        // Check for pattern match at current position
        for (j = 0; j < m; j++) {
            if (text[i + j] != pattern[j])
                break;
        }
        
        // If pattern matches at position i
        if (j == m) {
            printf("%d ", i);
            found = 1;
        }
    }
    
    if (!found)
        printf("None");
    printf("\n");
}`,
    visualizerType: 'custom',
    defaultInputSize: 20,
    minInputSize: 6,
    maxInputSize: 20,
    supportsCases: false,

    generateInput(size: number): { text: string; pattern: string } {
        const chars = 'ABCD';
        const text = Array.from({ length: size }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        const patternLen = Math.min(3, Math.floor(size / 3));
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

        steps.push({
            id: 0,
            description: `Searching for "${pattern}" in "${text}"`,
            pseudocodeLine: 0,
            state: { stringMatch: { text, pattern, position: -1, matchIndices: [], comparing: -1 } },
            comparisons: 0,
            swaps: 0,
            memoryUsage: 1,
        });

        for (let i = 0; i <= n - m; i++) {
            let j = 0;

            steps.push({
                id: steps.length,
                description: `Trying position ${i}: comparing "${text.substring(i, i + m)}" with "${pattern}"`,
                pseudocodeLine: 3,
                state: { stringMatch: { text, pattern, position: i, matchIndices: [...matches], comparing: -1 } },
                comparisons,
                swaps: 0,
                memoryUsage: 1,
            });

            while (j < m && text[i + j] === pattern[j]) {
                comparisons++;

                steps.push({
                    id: steps.length,
                    description: `Match: text[${i + j}]='${text[i + j]}' == pattern[${j}]='${pattern[j]}'`,
                    pseudocodeLine: 5,
                    state: { stringMatch: { text, pattern, position: i, matchIndices: [...matches], comparing: i + j, matched: j + 1 } },
                    comparisons,
                    swaps: 0,
                    memoryUsage: 1,
                });

                j++;
            }

            if (j === m) {
                matches.push(i);

                steps.push({
                    id: steps.length,
                    description: `Pattern found at index ${i}!`,
                    pseudocodeLine: 9,
                    state: { stringMatch: { text, pattern, position: i, matchIndices: [...matches], found: true } },
                    comparisons,
                    swaps: 0,
                    memoryUsage: 1,
                });
            } else if (j < m) {
                comparisons++;

                steps.push({
                    id: steps.length,
                    description: `Mismatch: text[${i + j}]='${text[i + j]}' ≠ pattern[${j}]='${pattern[j]}'`,
                    pseudocodeLine: 5,
                    state: { stringMatch: { text, pattern, position: i, matchIndices: [...matches], comparing: i + j, mismatch: true } },
                    comparisons,
                    swaps: 0,
                    memoryUsage: 1,
                });
            }
        }

        steps.push({
            id: steps.length,
            description: `Search complete. Found ${matches.length} occurrence(s) at: [${matches.join(', ')}]`,
            pseudocodeLine: 11,
            state: { stringMatch: { text, pattern, position: -1, matchIndices: matches, done: true } },
            comparisons,
            swaps: 0,
            memoryUsage: 1,
        });

        return steps;
    },
};
