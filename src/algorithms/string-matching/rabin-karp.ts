import type { AlgorithmConfig, AnimationStep } from '../../types/algorithm';

export const rabinKarp: AlgorithmConfig = {
    id: 'rabin-karp',
    name: 'Rabin-Karp Algorithm',
    category: 'string-matching',
    description: 'A string-searching algorithm that uses hashing to find patterns. Computes hash of pattern and slides through text comparing hashes before character matching.',
    complexity: {
        time: {
            best: 'O(n + m)',
            average: 'O(n + m)',
            worst: 'O(nm)',
        },
        space: 'O(1)',
    },
    pseudocode: [
        'procedure rabinKarp(text, pattern)',
        '    d = 256  // number of characters',
        '    q = 101  // prime number',
        '    compute pattern hash',
        '    compute first window hash',
        '    for i = 0 to n - m do',
        '        if patternHash == windowHash then',
        '            if pattern matches text[i..i+m-1] then',
        '                print "Pattern found at", i',
        '            end if',
        '        end if',
        '        compute next window hash using rolling hash',
        '    end for',
        'end procedure',
    ],
    cCode: `#include <stdio.h>
#include <string.h>

#define d 256  // Number of characters in input alphabet

void rabinKarpSearch(char* pattern, char* text, int q) {
    int M = strlen(pattern);
    int N = strlen(text);
    int i, j;
    int p = 0;  // hash value for pattern
    int t = 0;  // hash value for text
    int h = 1;
    
    // The value of h would be "pow(d, M-1) % q"
    for (i = 0; i < M - 1; i++)
        h = (h * d) % q;
    
    // Calculate hash value of pattern and first window of text
    for (i = 0; i < M; i++) {
        p = (d * p + pattern[i]) % q;
        t = (d * t + text[i]) % q;
    }
    
    printf("Pattern found at positions: ");
    int found = 0;
    
    // Slide the pattern over text one by one
    for (i = 0; i <= N - M; i++) {
        // Check if hash values match
        if (p == t) {
            // Check characters one by one
            for (j = 0; j < M; j++) {
                if (text[i + j] != pattern[j])
                    break;
            }
            
            if (j == M) {
                printf("%d ", i);
                found = 1;
            }
        }
        
        // Calculate hash value for next window of text
        if (i < N - M) {
            t = (d * (t - text[i] * h) + text[i + M]) % q;
            
            // We might get negative value of t, converting it to positive
            if (t < 0)
                t = (t + q);
        }
    }
    
    if (!found)
        printf("None");
    printf("\n");
}

void searchPattern(char* text, char* pattern) {
    int q = 101;  // A prime number
    rabinKarpSearch(pattern, text, q);
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
        const d = 256;
        const q = 101;
        let comparisons = 0;
        const matches: number[] = [];

        // Calculate hash value for pattern and first window
        let patternHash = 0;
        let windowHash = 0;
        let h = 1;

        for (let i = 0; i < m - 1; i++) {
            h = (h * d) % q;
        }

        for (let i = 0; i < m; i++) {
            patternHash = (d * patternHash + pattern.charCodeAt(i)) % q;
            windowHash = (d * windowHash + text.charCodeAt(i)) % q;
        }

        steps.push({
            id: 0,
            description: `Rabin-Karp: pattern hash = ${patternHash}, first window hash = ${windowHash}`,
            pseudocodeLine: 4,
            state: { stringMatch: { text, pattern, position: 0, matchIndices: [], patternHash, windowHash } },
            comparisons: 0,
            swaps: 0,
            memoryUsage: 4,
        });

        for (let i = 0; i <= n - m; i++) {
            steps.push({
                id: steps.length,
                description: `Position ${i}: windowHash=${windowHash}, patternHash=${patternHash}`,
                pseudocodeLine: 6,
                state: { stringMatch: { text, pattern, position: i, matchIndices: [...matches], comparing: i, windowHash } },
                comparisons,
                swaps: 0,
                memoryUsage: 4,
            });

            if (patternHash === windowHash) {
                let match = true;
                for (let j = 0; j < m; j++) {
                    comparisons++;
                    if (text[i + j] !== pattern[j]) {
                        match = false;
                        break;
                    }
                }

                if (match) {
                    matches.push(i);
                    steps.push({
                        id: steps.length,
                        description: `Hash match! Pattern found at index ${i}`,
                        pseudocodeLine: 8,
                        state: { stringMatch: { text, pattern, position: i, matchIndices: [...matches], found: true } },
                        comparisons,
                        swaps: 0,
                        memoryUsage: 4,
                    });
                }
            }

            if (i < n - m) {
                windowHash = (d * (windowHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
                if (windowHash < 0) windowHash += q;
            }
        }

        steps.push({
            id: steps.length,
            description: `Rabin-Karp complete. Found ${matches.length} match(es) at: [${matches.join(', ')}]`,
            pseudocodeLine: 12,
            state: { stringMatch: { text, pattern, position: -1, matchIndices: matches, done: true } },
            comparisons,
            swaps: 0,
            memoryUsage: 4,
        });

        return steps;
    },
};
