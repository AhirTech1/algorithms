import type { AlgorithmConfig, AnimationStep } from '../../types/algorithm';

export const lcs: AlgorithmConfig = {
    id: 'lcs',
    name: 'Longest Common Subsequence',
    category: 'dynamic-programming',
    description: 'A classic DP problem that finds the longest subsequence common to two sequences. Used in diff tools, bioinformatics, and version control.',
    complexity: {
        time: {
            best: 'O(mn)',
            average: 'O(mn)',
            worst: 'O(mn)',
        },
        space: 'O(mn)',
    },
    pseudocode: [
        'procedure LCS(X, Y)',
        '    m = length(X), n = length(Y)',
        '    dp[0..m][0..n] = 0',
        '    for i = 1 to m do',
        '        for j = 1 to n do',
        '            if X[i-1] == Y[j-1] then',
        '                dp[i][j] = dp[i-1][j-1] + 1',
        '            else',
        '                dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
        '            end if',
        '        end for',
        '    end for',
        '    return dp[m][n]',
        'end procedure',
    ],
    cCode: `#include <stdio.h>
#include <string.h>

int max(int a, int b) {
    return (a > b) ? a : b;
}

int lcs(char* X, char* Y, int m, int n) {
    int L[m + 1][n + 1];
    int i, j;
    
    // Build LCS table in bottom-up fashion
    for (i = 0; i <= m; i++) {
        for (j = 0; j <= n; j++) {
            if (i == 0 || j == 0)
                L[i][j] = 0;
            else if (X[i - 1] == Y[j - 1])
                L[i][j] = L[i - 1][j - 1] + 1;
            else
                L[i][j] = max(L[i - 1][j], L[i][j - 1]);
        }
    }
    
    return L[m][n];
}

// Function to print LCS
void printLCS(char* X, char* Y, int m, int n) {
    int L[m + 1][n + 1];
    int i, j;
    
    // Build LCS table
    for (i = 0; i <= m; i++) {
        for (j = 0; j <= n; j++) {
            if (i == 0 || j == 0)
                L[i][j] = 0;
            else if (X[i - 1] == Y[j - 1])
                L[i][j] = L[i - 1][j - 1] + 1;
            else
                L[i][j] = max(L[i - 1][j], L[i][j - 1]);
        }
    }
    
    // Following code is used to print LCS
    int index = L[m][n];
    char lcs[index + 1];
    lcs[index] = '\0';
    
    i = m; j = n;
    while (i > 0 && j > 0) {
        if (X[i - 1] == Y[j - 1]) {
            lcs[index - 1] = X[i - 1];
            i--; j--; index--;
        }
        else if (L[i - 1][j] > L[i][j - 1])
            i--;
        else
            j--;
    }
    
    printf("LCS: %s\n", lcs);
}`,
    visualizerType: 'matrix',
    defaultInputSize: 6,
    minInputSize: 3,
    maxInputSize: 8,
    supportsCases: false,

    generateInput(size: number): { str1: string; str2: string } {
        const chars = 'ABCD';
        const str1 = Array.from({ length: size }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        const str2 = Array.from({ length: size }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        return { str1, str2 };
    },

    generateSteps(input: unknown): AnimationStep[] {
        const { str1, str2 } = input as { str1: string; str2: string };
        const steps: AnimationStep[] = [];
        const m = str1.length;
        const n = str2.length;
        const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

        steps.push({
            id: 0,
            description: `Finding LCS of "${str1}" and "${str2}"`,
            pseudocodeLine: 0,
            state: { lcs: { dp, str1, str2, i: 0, j: 0 } },
            comparisons: 0,
            swaps: 0,
            memoryUsage: (m + 1) * (n + 1),
        });

        let comparisons = 0;

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                comparisons++;

                if (str1[i - 1] === str2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;

                    steps.push({
                        id: steps.length,
                        description: `Match! X[${i - 1}]='${str1[i - 1]}' == Y[${j - 1}]='${str2[j - 1]}'. dp[${i}][${j}] = ${dp[i][j]}`,
                        pseudocodeLine: 6,
                        state: { lcs: { dp: dp.map(r => [...r]), str1, str2, i, j, match: true } },
                        comparisons,
                        swaps: 0,
                        memoryUsage: (m + 1) * (n + 1),
                    });
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);

                    steps.push({
                        id: steps.length,
                        description: `No match: '${str1[i - 1]}' ≠ '${str2[j - 1]}'. dp[${i}][${j}] = max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}`,
                        pseudocodeLine: 8,
                        state: { lcs: { dp: dp.map(r => [...r]), str1, str2, i, j, match: false } },
                        comparisons,
                        swaps: 0,
                        memoryUsage: (m + 1) * (n + 1),
                    });
                }
            }
        }

        steps.push({
            id: steps.length,
            description: `LCS length: ${dp[m][n]}`,
            pseudocodeLine: 12,
            state: { lcs: { dp, str1, str2, i: m, j: n, done: true } },
            comparisons,
            swaps: 0,
            memoryUsage: (m + 1) * (n + 1),
        });

        return steps;
    },
};
