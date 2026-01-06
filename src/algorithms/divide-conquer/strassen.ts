import type { AlgorithmConfig, AnimationStep } from '../../types/algorithm';

interface MatrixState {
    a: number[][];
    b: number[][];
    c: number[][];
    currentOp?: string;
    phase: 'divide' | 'multiply' | 'combine' | 'done';
    level: number;
}

export const strassen: AlgorithmConfig = {
    id: 'strassen',
    name: "Strassen's Matrix Multiplication",
    category: 'divide-conquer',
    description: "Strassen's algorithm multiplies two matrices using 7 multiplications instead of 8, achieving O(n^2.807) complexity for large matrices.",
    complexity: {
        time: {
            best: 'O(n^2.807)',
            average: 'O(n^2.807)',
            worst: 'O(n^2.807)',
        },
        space: 'O(n²)',
    },
    pseudocode: [
        "procedure strassen(A, B, n)",
        "    if n == 1 then",
        "        return A * B",
        "    end if",
        "    partition A into A11, A12, A21, A22",
        "    partition B into B11, B12, B21, B22",
        "    P1 = strassen(A11, B12 - B22)",
        "    P2 = strassen(A11 + A12, B22)",
        "    P3 = strassen(A21 + A22, B11)",
        "    P4 = strassen(A22, B21 - B11)",
        "    P5 = strassen(A11 + A22, B11 + B22)",
        "    P6 = strassen(A12 - A22, B21 + B22)",
        "    P7 = strassen(A21 - A11, B11 + B12)",
        "    C11 = P5 + P4 - P2 + P6",
        "    C12 = P1 + P2",
        "    C21 = P3 + P4",
        "    C22 = P1 + P5 - P3 - P7",
        "    return C",
        "end procedure",
    ],
    cCode: `#include <stdlib.h>

void addMatrix(int n, int A[][n], int B[][n], int C[][n]) {
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            C[i][j] = A[i][j] + B[i][j];
}

void subMatrix(int n, int A[][n], int B[][n], int C[][n]) {
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            C[i][j] = A[i][j] - B[i][j];
}

void strassen(int n, int A[][n], int B[][n], int C[][n]) {
    if (n == 1) {
        C[0][0] = A[0][0] * B[0][0];
        return;
    }
    
    int newSize = n / 2;
    int A11[newSize][newSize], A12[newSize][newSize];
    int A21[newSize][newSize], A22[newSize][newSize];
    int B11[newSize][newSize], B12[newSize][newSize];
    int B21[newSize][newSize], B22[newSize][newSize];
    int M1[newSize][newSize], M2[newSize][newSize];
    int M3[newSize][newSize], M4[newSize][newSize];
    int M5[newSize][newSize], M6[newSize][newSize];
    int M7[newSize][newSize];
    int temp1[newSize][newSize], temp2[newSize][newSize];
    
    // Divide matrices into sub-matrices
    for (int i = 0; i < newSize; i++) {
        for (int j = 0; j < newSize; j++) {
            A11[i][j] = A[i][j];
            A12[i][j] = A[i][j + newSize];
            A21[i][j] = A[i + newSize][j];
            A22[i][j] = A[i + newSize][j + newSize];
            B11[i][j] = B[i][j];
            B12[i][j] = B[i][j + newSize];
            B21[i][j] = B[i + newSize][j];
            B22[i][j] = B[i + newSize][j + newSize];
        }
    }
    
    // Calculate M1 to M7
    addMatrix(newSize, A11, A22, temp1);
    addMatrix(newSize, B11, B22, temp2);
    strassen(newSize, temp1, temp2, M1);
    
    addMatrix(newSize, A21, A22, temp1);
    strassen(newSize, temp1, B11, M2);
    
    subMatrix(newSize, B12, B22, temp1);
    strassen(newSize, A11, temp1, M3);
    
    subMatrix(newSize, B21, B11, temp1);
    strassen(newSize, A22, temp1, M4);
    
    addMatrix(newSize, A11, A12, temp1);
    strassen(newSize, temp1, B22, M5);
    
    subMatrix(newSize, A21, A11, temp1);
    addMatrix(newSize, B11, B12, temp2);
    strassen(newSize, temp1, temp2, M6);
    
    subMatrix(newSize, A12, A22, temp1);
    addMatrix(newSize, B21, B22, temp2);
    strassen(newSize, temp1, temp2, M7);
    
    // Combine results into C
    int C11[newSize][newSize], C12[newSize][newSize];
    int C21[newSize][newSize], C22[newSize][newSize];
    
    addMatrix(newSize, M1, M4, temp1);
    subMatrix(newSize, temp1, M5, temp2);
    addMatrix(newSize, temp2, M7, C11);
    
    addMatrix(newSize, M3, M5, C12);
    addMatrix(newSize, M2, M4, C21);
    
    addMatrix(newSize, M1, M3, temp1);
    subMatrix(newSize, temp1, M2, temp2);
    addMatrix(newSize, temp2, M6, C22);
    
    // Store result in C
    for (int i = 0; i < newSize; i++) {
        for (int j = 0; j < newSize; j++) {
            C[i][j] = C11[i][j];
            C[i][j + newSize] = C12[i][j];
            C[i + newSize][j] = C21[i][j];
            C[i + newSize][j + newSize] = C22[i][j];
        }
    }
}`,
    visualizerType: 'matrix',
    defaultInputSize: 4,
    minInputSize: 2,
    maxInputSize: 4,
    supportsCases: false,

    generateInput(size: number): { a: number[][]; b: number[][] } {
        // Clamp size to prevent memory issues
        const n = Math.min(Math.max(size, 2), 4);
        const a: number[][] = [];
        const b: number[][] = [];
        for (let i = 0; i < n; i++) {
            a[i] = [];
            b[i] = [];
            for (let j = 0; j < n; j++) {
                a[i][j] = Math.floor(Math.random() * 10);
                b[i][j] = Math.floor(Math.random() * 10);
            }
        }
        return { a, b };
    },

    generateSteps(input: unknown): AnimationStep[] {
        const { a, b } = input as { a: number[][]; b: number[][] };
        const steps: AnimationStep[] = [];
        const n = a.length;

        // Simple matrix multiplication for visualization (not actual Strassen for small matrices)
        const c: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));
        let operations = 0;

        const createState = (phase: MatrixState['phase'], currentOp?: string): MatrixState => ({
            a: a.map(row => [...row]),
            b: b.map(row => [...row]),
            c: c.map(row => [...row]),
            currentOp,
            phase,
            level: 0,
        });

        steps.push({
            id: 0,
            description: `Strassen's Matrix Multiplication: ${n}×${n} matrices`,
            pseudocodeLine: 0,
            state: {
                matrix: {
                    m: a,
                    dims: [],
                    n: a.length,
                    title: 'Matrix A'
                },
                strassen: createState('divide')
            },
            comparisons: 0,
            swaps: 0,
            memoryUsage: n * n * 3,
        });

        steps.push({
            id: 1,
            description: `Matrix A (${n}×${n}) and Matrix B (${n}×${n}) - Computing C = A × B`,
            pseudocodeLine: 0,
            state: {
                matrix: {
                    m: b,
                    dims: [],
                    n: b.length,
                    title: 'Matrix B'
                },
                strassen: createState('divide')
            },
            comparisons: 0,
            swaps: 0,
            memoryUsage: n * n * 3,
        });

        if (n <= 2) {
            // Show the 7 products conceptually for 2×2
            steps.push({
                id: steps.length,
                description: `For 2×2: Using 7 multiplications instead of 8`,
                pseudocodeLine: 6,
                state: {
                    matrix: { m: a, dims: [], n, title: 'Computing P1-P7' },
                    strassen: createState('multiply', 'Computing 7 products')
                },
                comparisons: 0,
                swaps: 0,
                memoryUsage: n * n * 3,
            });
        } else {
            // Divide phase
            steps.push({
                id: steps.length,
                description: `Dividing ${n}×${n} matrices into ${n / 2}×${n / 2} submatrices`,
                pseudocodeLine: 4,
                state: {
                    matrix: { m: a, dims: [], n, title: 'Dividing A' },
                    strassen: createState('divide')
                },
                comparisons: 0,
                swaps: 0,
                memoryUsage: n * n * 3,
            });
        }

        // Compute result using standard multiplication for visualization
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                for (let k = 0; k < n; k++) {
                    c[i][j] += a[i][k] * b[k][j];
                    operations++;
                }

                steps.push({
                    id: steps.length,
                    description: `Computing C[${i}][${j}] = ${c[i][j]}`,
                    pseudocodeLine: n <= 2 ? 13 : 6,
                    state: {
                        matrix: {
                            m: c.map(row => [...row]),
                            dims: [],
                            n,
                            i,
                            j,
                            title: 'Result Matrix C'
                        },
                        strassen: createState('combine', `C[${i}][${j}]`)
                    },
                    comparisons: operations,
                    swaps: 0,
                    memoryUsage: n * n * 3,
                });
            }
        }

        steps.push({
            id: steps.length,
            description: `Matrix multiplication complete! Result is a ${n}×${n} matrix.`,
            pseudocodeLine: 17,
            state: {
                matrix: { m: c, dims: [], n, done: true, title: 'Final Result C = A × B' },
                strassen: createState('done')
            },
            comparisons: operations,
            swaps: 0,
            memoryUsage: n * n * 3,
        });

        return steps;
    },
};
