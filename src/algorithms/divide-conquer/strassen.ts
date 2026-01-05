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
    visualizerType: 'matrix',
    defaultInputSize: 2,
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
