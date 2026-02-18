import type { AlgorithmConfig, AnimationStep, ArrayElement } from '../../types/algorithm';

function generateArray(size: number, caseType: 'best' | 'average' | 'worst'): number[] {
    switch (caseType) {
        case 'best':
            return Array.from({ length: size }, (_, i) => i + 1);
        case 'worst':
            return Array.from({ length: size }, (_, i) => size - i);
        case 'average':
        default:
            return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    }
}

function createArrayElements(arr: number[]): ArrayElement[] {
    return arr.map((value, index) => ({
        value,
        state: 'default' as const,
        originalIndex: index,
    }));
}

export const insertionSort: AlgorithmConfig = {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'sorting',
    description: 'A simple sorting algorithm that builds the final sorted array one item at a time, inserting each element into its correct position among the previously sorted elements.',
    complexity: {
        time: {
            best: 'O(n)',
            average: 'O(n²)',
            worst: 'O(n²)',
        },
        space: 'O(1)',
    },
    pseudocode: [
        'procedure insertionSort(A: list of sortable items)',
        '    n = length(A)',
        '    for i = 1 to n-1 do',
        '        key = A[i]',
        '        j = i - 1',
        '        while j >= 0 and A[j] > key do',
        '            A[j+1] = A[j]  // Shift element right',
        '            j = j - 1',
        '        end while',
        '        A[j+1] = key  // Insert key in correct position',
        '    end for',
        'end procedure',
    ],
    cCode: `void insertionSort(int arr[], int n) {
    int i, key, j;
    
    for (i = 1; i < n; i++) {
        key = arr[i];
        j = i - 1;
        
        // Move elements greater than key one position ahead
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
    visualizerType: 'array',
    defaultInputSize: 10,
    minInputSize: 5,
    maxInputSize: 30,
    supportsCases: true,

    generateInput(size: number, caseType: 'best' | 'average' | 'worst' = 'average'): number[] {
        return generateArray(size, caseType);
    },

    generateSteps(input: unknown): AnimationStep[] {
        const arr = [...(input as number[])];
        const steps: AnimationStep[] = [];
        let comparisons = 0;
        let swaps = 0;
        const n = arr.length;

        steps.push({
            id: 0,
            description: `Starting Insertion Sort with ${n} elements. First element is considered sorted.`,
            pseudocodeLine: 0,
            state: {
                array: createArrayElements(arr).map((el, i) => ({
                    ...el,
                    state: i === 0 ? 'sorted' as const : 'default' as const
                }))
            },
            comparisons: 0,
            swaps: 0,
            memoryUsage: 1,
        });

        for (let i = 1; i < n; i++) {
            const key = arr[i];
            let j = i - 1;

            // Show key being extracted
            const extractArray = createArrayElements(arr);
            for (let k = 0; k < i; k++) extractArray[k].state = 'sorted';
            extractArray[i].state = 'selected';

            steps.push({
                id: steps.length,
                description: `Inserting element ${key} at index ${i} into the sorted portion`,
                pseudocodeLine: 3,
                state: { array: extractArray },
                comparisons,
                swaps,
                memoryUsage: 1,
                specialIndices: [{ index: i, type: 'key' }],
            });

            while (j >= 0 && arr[j] > key) {
                comparisons++;

                const compareArray = createArrayElements(arr);
                for (let k = 0; k < i; k++) {
                    if (k <= j) compareArray[k].state = 'sorted';
                }
                compareArray[j].state = 'comparing';
                compareArray[i].state = 'selected';

                steps.push({
                    id: steps.length,
                    description: `Comparing key (${key}) with element at index ${j} (${arr[j]}). ${arr[j]} > ${key}, so shift right.`,
                    pseudocodeLine: 5,
                    state: { array: compareArray },
                    comparisons,
                    swaps,
                    memoryUsage: 1,
                    highlightIndices: [j, i],
                });

                arr[j + 1] = arr[j];
                swaps++;

                const shiftArray = createArrayElements(arr);
                for (let k = 0; k <= j; k++) shiftArray[k].state = 'sorted';
                shiftArray[j + 1].state = 'swapping';

                steps.push({
                    id: steps.length,
                    description: `Shifted ${arr[j + 1]} to the right`,
                    pseudocodeLine: 6,
                    state: { array: shiftArray },
                    comparisons,
                    swaps,
                    memoryUsage: 1,
                });

                j--;
            }

            if (j >= 0) {
                comparisons++;
                steps.push({
                    id: steps.length,
                    description: `Element at index ${j} (${arr[j]}) ≤ key (${key}). Found insertion point.`,
                    pseudocodeLine: 5,
                    state: {
                        array: createArrayElements(arr).map((el, k) => ({
                            ...el,
                            state: k <= i ? 'sorted' as const : 'default' as const
                        }))
                    },
                    comparisons,
                    swaps,
                    memoryUsage: 1,
                });
            }

            arr[j + 1] = key;

            const insertArray = createArrayElements(arr);
            for (let k = 0; k <= i; k++) insertArray[k].state = 'sorted';
            insertArray[j + 1].state = 'pivot';

            steps.push({
                id: steps.length,
                description: `Inserted ${key} at position ${j + 1}`,
                pseudocodeLine: 9,
                state: { array: insertArray },
                comparisons,
                swaps,
                memoryUsage: 1,
                specialIndices: [{ index: j + 1, type: 'inserted' }],
            });
        }

        steps.push({
            id: steps.length,
            description: `Sorting complete! Total comparisons: ${comparisons}, Total shifts: ${swaps}`,
            pseudocodeLine: 11,
            state: { array: createArrayElements(arr).map(el => ({ ...el, state: 'sorted' as const })) },
            comparisons,
            swaps,
            memoryUsage: 1,
        });

        return steps;
    },
};
