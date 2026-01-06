import type { AlgorithmConfig, AnimationStep } from '../../types/algorithm';

interface QueenState {
    board: number[][];
    currentRow: number;
    currentCol: number;
    phase: 'placing' | 'backtracking' | 'checking' | 'solved';
}

function createEmptyBoard(n: number): number[][] {
    return Array(n).fill(null).map(() => Array(n).fill(0));
}

export const nQueen: AlgorithmConfig = {
    id: 'n-queen',
    name: 'N-Queen Problem',
    category: 'backtracking',
    description: 'Place N queens on an N×N chessboard such that no two queens threaten each other. Uses backtracking to explore all valid placements.',
    complexity: {
        time: {
            best: 'O(n!)',
            average: 'O(n!)',
            worst: 'O(n!)',
        },
        space: 'O(n²)',
    },
    pseudocode: [
        'procedure solveNQueen(board, row)',
        '    if row >= N then',
        '        return true  // All queens placed',
        '    end if',
        '    for col = 0 to N-1 do',
        '        if isSafe(board, row, col) then',
        '            place queen at (row, col)',
        '            if solveNQueen(board, row + 1) then',
        '                return true',
        '            end if',
        '            remove queen from (row, col)  // Backtrack',
        '        end if',
        '    end for',
        '    return false',
        'end procedure',
    ],
    cCode: `#include <stdio.h>\n#include <stdbool.h>\n#include <stdlib.h>\n\n#define MAX 20\n\nvoid printSolution(int board[][MAX], int n) {\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++)\n            printf(\"%d \", board[i][j]);\n        printf(\"\\n\");\n    }\n    printf(\"\\n\");\n}\n\nbool isSafe(int board[][MAX], int row, int col, int n) {\n    int i, j;\n    \n    // Check this row on left side\n    for (i = 0; i < col; i++)\n        if (board[row][i])\n            return false;\n    \n    // Check upper diagonal on left side\n    for (i = row, j = col; i >= 0 && j >= 0; i--, j--)\n        if (board[i][j])\n            return false;\n    \n    // Check lower diagonal on left side\n    for (i = row, j = col; j >= 0 && i < n; i++, j--)\n        if (board[i][j])\n            return false;\n    \n    return true;\n}\n\nbool solveNQUtil(int board[][MAX], int col, int n) {\n    // Base case: If all queens are placed\n    if (col >= n)\n        return true;\n    \n    // Consider this column and try placing queen in all rows\n    for (int i = 0; i < n; i++) {\n        if (isSafe(board, i, col, n)) {\n            board[i][col] = 1;\n            \n            // Recur to place rest of the queens\n            if (solveNQUtil(board, col + 1, n))\n                return true;\n            \n            // If placing queen doesn't lead to solution, backtrack\n            board[i][col] = 0;\n        }\n    }\n    \n    return false;\n}\n\nbool solveNQ(int n) {\n    int board[MAX][MAX] = {0};\n    \n    if (!solveNQUtil(board, 0, n)) {\n        printf(\"Solution does not exist\\n\");\n        return false;\n    }\n    \n    printSolution(board, n);\n    return true;\n}`,
    visualizerType: 'matrix',
    defaultInputSize: 4,
    minInputSize: 4,
    maxInputSize: 8,
    supportsCases: false,

    generateInput(size: number): number {
        return size;
    },

    generateSteps(input: unknown): AnimationStep[] {
        const n = input as number;
        const steps: AnimationStep[] = [];
        let comparisons = 0;
        const board = createEmptyBoard(n);

        const createState = (row: number, col: number, phase: QueenState['phase']): QueenState => ({
            board: board.map(r => [...r]),
            currentRow: row,
            currentCol: col,
            phase,
        });

        // Initial state
        steps.push({
            id: 0,
            description: `Solving ${n}-Queen problem. Place ${n} queens so none attack each other.`,
            pseudocodeLine: 0,
            state: { queens: createState(-1, -1, 'placing') },
            comparisons: 0,
            swaps: 0,
            memoryUsage: n * n,
        });

        function isSafe(row: number, col: number): boolean {
            // Check column
            for (let i = 0; i < row; i++) {
                if (board[i][col] === 1) return false;
            }
            // Check upper left diagonal
            for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
                if (board[i][j] === 1) return false;
            }
            // Check upper right diagonal
            for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
                if (board[i][j] === 1) return false;
            }
            return true;
        }

        function solve(row: number): boolean {
            if (row >= n) {
                steps.push({
                    id: steps.length,
                    description: `All ${n} queens placed successfully! Solution found.`,
                    pseudocodeLine: 2,
                    state: { queens: createState(row, -1, 'solved') },
                    comparisons,
                    swaps: 0,
                    memoryUsage: n * n,
                });
                return true;
            }

            for (let col = 0; col < n; col++) {
                comparisons++;

                steps.push({
                    id: steps.length,
                    description: `Trying to place queen at row ${row}, column ${col}`,
                    pseudocodeLine: 5,
                    state: { queens: createState(row, col, 'checking') },
                    comparisons,
                    swaps: 0,
                    memoryUsage: n * n,
                });

                if (isSafe(row, col)) {
                    board[row][col] = 1;

                    steps.push({
                        id: steps.length,
                        description: `Position (${row}, ${col}) is safe! Placed queen.`,
                        pseudocodeLine: 6,
                        state: { queens: createState(row, col, 'placing') },
                        comparisons,
                        swaps: 0,
                        memoryUsage: n * n,
                    });

                    if (solve(row + 1)) {
                        return true;
                    }

                    // Backtrack
                    board[row][col] = 0;

                    steps.push({
                        id: steps.length,
                        description: `Backtracking: removed queen from (${row}, ${col})`,
                        pseudocodeLine: 10,
                        state: { queens: createState(row, col, 'backtracking') },
                        comparisons,
                        swaps: 0,
                        memoryUsage: n * n,
                    });
                } else {
                    steps.push({
                        id: steps.length,
                        description: `Position (${row}, ${col}) is not safe. Queen would be attacked.`,
                        pseudocodeLine: 5,
                        state: { queens: createState(row, col, 'checking') },
                        comparisons,
                        swaps: 0,
                        memoryUsage: n * n,
                    });
                }
            }

            return false;
        }

        solve(0);

        return steps;
    },
};
