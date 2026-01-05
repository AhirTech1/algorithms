import type { AlgorithmConfig, AnimationStep } from '../../types/algorithm';

export { pVsNp };

const pVsNp: AlgorithmConfig = {
    id: 'p-vs-np',
    name: 'P vs NP',
    category: 'np-completeness',
    description: 'Understanding the P vs NP problem - one of the most important open problems in computer science. Explores complexity classes and what makes problems "hard".',
    complexity: {
        time: {
            best: 'N/A',
            average: 'N/A',
            worst: 'N/A',
        },
        space: 'N/A',
    },
    pseudocode: [
        '// P vs NP: The Millennium Prize Problem',
        '',
        '// Class P: Problems solvable in polynomial time',
        '//   - Sorting (O(n log n))',
        '//   - Searching (O(log n))',
        '//   - Shortest path (O(V²))',
        '',
        '// Class NP: Problems verifiable in polynomial time',
        '//   - Given a solution, can check it quickly',
        '//   - Finding the solution may be hard',
        '',
        '// NP-Complete: Hardest problems in NP',
        '//   - SAT, Traveling Salesman, Graph Coloring',
        '//   - If ANY can be solved in P, then P = NP',
        '',
        '// The Big Question: P = NP ?',
        '//   - Can every problem that can be verified',
        '//     quickly also be solved quickly?',
        '//   - $1,000,000 prize for a proof!',
    ],
    visualizerType: 'custom',
    defaultInputSize: 1,
    minInputSize: 1,
    maxInputSize: 1,
    supportsCases: false,

    generateInput(): number {
        return 1;
    },

    generateSteps(): AnimationStep[] {
        const steps: AnimationStep[] = [];

        const createState = (
            phase: number,
            highlightClass?: 'P' | 'NP' | 'NP-Complete' | 'NP-Hard',
            examples: { problem: string; class: string }[] = []
        ) => ({
            concept: {
                concept: 'p-vs-np' as const,
                phase,
                highlightClass,
                examples,
            }
        });

        // Phase 0: Introduce P
        steps.push({
            id: 0,
            description: 'Class P: Problems solvable in polynomial time (efficiently)',
            pseudocodeLine: 2,
            state: createState(0, 'P', [
                { problem: 'Sorting', class: 'P' },
                { problem: 'Binary Search', class: 'P' },
                { problem: 'Shortest Path', class: 'P' },
            ]),
            comparisons: 0,
            swaps: 0,
            memoryUsage: 0,
        });

        // Phase 1: Introduce NP
        steps.push({
            id: 1,
            description: 'Class NP: Problems whose solutions can be VERIFIED in polynomial time',
            pseudocodeLine: 7,
            state: createState(1, 'NP', [
                { problem: 'Sudoku', class: 'NP-Complete' },
                { problem: 'Boolean SAT', class: 'NP-Complete' },
            ]),
            comparisons: 0,
            swaps: 0,
            memoryUsage: 0,
        });

        // Phase 2: NP-Complete
        steps.push({
            id: 2,
            description: 'NP-Complete: The hardest problems in NP. If ONE is in P, then P = NP!',
            pseudocodeLine: 11,
            state: createState(2, 'NP-Complete', [
                { problem: 'TSP', class: 'NP-Complete' },
                { problem: 'Graph Coloring', class: 'NP-Complete' },
                { problem: 'Subset Sum', class: 'NP-Complete' },
                { problem: 'Hamiltonian Path', class: 'NP-Complete' },
            ]),
            comparisons: 0,
            swaps: 0,
            memoryUsage: 0,
        });

        // Phase 3: NP-Hard
        steps.push({
            id: 3,
            description: 'NP-Hard: At least as hard as NP-Complete (may not even be in NP)',
            pseudocodeLine: 11,
            state: createState(3, 'NP-Hard', [
                { problem: 'Halting Problem', class: 'NP-Hard' },
                { problem: 'Optimization TSP', class: 'NP-Hard' },
            ]),
            comparisons: 0,
            swaps: 0,
            memoryUsage: 0,
        });

        // Phase 4: The Big Question
        steps.push({
            id: 4,
            description: 'P = NP? If true, every NP problem can be solved efficiently. $1M prize!',
            pseudocodeLine: 15,
            state: createState(4, undefined, [
                { problem: 'Sorting', class: 'P' },
                { problem: 'Binary Search', class: 'P' },
                { problem: 'TSP', class: 'NP-Complete' },
                { problem: 'SAT', class: 'NP-Complete' },
                { problem: 'Halting Problem', class: 'NP-Hard' },
            ]),
            comparisons: 0,
            swaps: 0,
            memoryUsage: 0,
        });

        // Verification vs Solving
        steps.push({
            id: 5,
            description: 'Key insight: Verifying a Sudoku solution is O(n²), but solving may be exponential!',
            pseudocodeLine: 7,
            state: {
                concept: {
                    concept: 'p-vs-np' as const,
                    phase: 4,
                    examples: [
                        { problem: 'Verification', class: 'P' },
                        { problem: 'Finding Solution', class: 'NP-Complete' },
                    ],
                    verificationSteps: 2,
                    solvingSteps: 2,
                }
            },
            comparisons: 0,
            swaps: 0,
            memoryUsage: 0,
        });

        // Practical implications
        steps.push({
            id: 6,
            description: 'If P ≠ NP (most believe): Some problems have NO efficient algorithm. We use approximations.',
            pseudocodeLine: 18,
            state: createState(4, undefined, [
                { problem: 'Cryptography relies on P ≠ NP', class: 'P' },
                { problem: 'RSA would break if P = NP', class: 'NP-Complete' },
            ]),
            comparisons: 0,
            swaps: 0,
            memoryUsage: 0,
        });

        return steps;
    },
};
