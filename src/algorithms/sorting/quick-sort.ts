import type { AlgorithmConfig, AnimationStep, ArrayElement } from '../../types/algorithm';

function generateArray(size: number, caseType: 'best' | 'average' | 'worst'): number[] {
    switch (caseType) {
        case 'best':
            // Random for quick sort (best case is when pivot divides evenly)
            return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
        case 'worst':
            // Already sorted causes worst case with first element pivot
            return Array.from({ length: size }, (_, i) => i + 1);
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

export const quickSort: AlgorithmConfig = {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    description: 'An efficient, in-place divide-and-conquer sorting algorithm. It picks a pivot element and partitions the array around it, then recursively sorts the partitions.',
    complexity: {
        time: {
            best: 'O(n log n)',
            average: 'O(n log n)',
            worst: 'O(n²)',
        },
        space: 'O(log n)',
    },
    pseudocode: [
        'procedure quickSort(A, low, high)',
        '    if low < high then',
        '        pivotIndex = partition(A, low, high)',
        '        quickSort(A, low, pivotIndex - 1)',
        '        quickSort(A, pivotIndex + 1, high)',
        '    end if',
        'end procedure',
        '',
        'procedure partition(A, low, high)',
        '    pivot = A[high]  // Choose last element as pivot',
        '    i = low - 1      // Index of smaller element',
        '    for j = low to high - 1 do',
        '        if A[j] <= pivot then',
        '            i = i + 1',
        '            swap(A[i], A[j])',
        '        end if',
        '    end for',
        '    swap(A[i+1], A[high])  // Place pivot in correct position',
        '    return i + 1',
        'end procedure',
    ],
    visualizerType: 'array',
    defaultInputSize: 10,
    minInputSize: 5,
    maxInputSize: 25,
    supportsCases: true,

    generateInput(size: number, caseType: 'best' | 'average' | 'worst' = 'average'): number[] {
        return generateArray(size, caseType);
    },

    generateSteps(input: unknown): AnimationStep[] {
        const arr = [...(input as number[])];
        const steps: AnimationStep[] = [];
        let comparisons = 0;
        let swaps = 0;
        const sortedIndices = new Set<number>();

        steps.push({
            id: 0,
            description: `Starting Quick Sort with ${arr.length} elements`,
            pseudocodeLine: 0,
            state: { array: createArrayElements(arr) },
            comparisons: 0,
            swaps: 0,
            memoryUsage: Math.ceil(Math.log2(arr.length)),
        });

        function quickSortHelper(low: number, high: number): void {
            if (low < high) {
                const pivotIndex = partition(low, high);
                sortedIndices.add(pivotIndex);

                quickSortHelper(low, pivotIndex - 1);
                quickSortHelper(pivotIndex + 1, high);
            } else if (low === high) {
                sortedIndices.add(low);
            }
        }

        function partition(low: number, high: number): number {
            const pivot = arr[high];

            // Show pivot selection
            const pivotArray = createArrayElements(arr);
            pivotArray[high].state = 'pivot';
            for (let k = low; k < high; k++) {
                pivotArray[k].state = 'selected';
            }
            sortedIndices.forEach(idx => {
                if (idx < low || idx > high) pivotArray[idx].state = 'sorted';
            });

            steps.push({
                id: steps.length,
                description: `Partitioning [${low}..${high}]. Pivot = ${pivot} (last element)`,
                pseudocodeLine: 9,
                state: { array: pivotArray },
                comparisons,
                swaps,
                memoryUsage: Math.ceil(Math.log2(arr.length)),
                specialIndices: [{ index: high, type: 'pivot' }],
            });

            let i = low - 1;

            for (let j = low; j < high; j++) {
                comparisons++;

                const compareArray = createArrayElements(arr);
                compareArray[high].state = 'pivot';
                compareArray[j].state = 'comparing';
                if (i >= low) compareArray[i].state = 'selected';
                sortedIndices.forEach(idx => {
                    if (idx < low || idx > high) compareArray[idx].state = 'sorted';
                });

                steps.push({
                    id: steps.length,
                    description: `Comparing ${arr[j]} with pivot ${pivot}`,
                    pseudocodeLine: 12,
                    state: { array: compareArray },
                    comparisons,
                    swaps,
                    memoryUsage: Math.ceil(Math.log2(arr.length)),
                    highlightIndices: [j, high],
                });

                if (arr[j] <= pivot) {
                    i++;
                    if (i !== j) {
                        [arr[i], arr[j]] = [arr[j], arr[i]];
                        swaps++;

                        const swapArray = createArrayElements(arr);
                        swapArray[high].state = 'pivot';
                        swapArray[i].state = 'swapping';
                        swapArray[j].state = 'swapping';
                        sortedIndices.forEach(idx => {
                            if (idx < low || idx > high) swapArray[idx].state = 'sorted';
                        });

                        steps.push({
                            id: steps.length,
                            description: `${arr[j]} ≤ ${pivot}. Swapping elements at positions ${i} and ${j}`,
                            pseudocodeLine: 14,
                            state: { array: swapArray },
                            comparisons,
                            swaps,
                            memoryUsage: Math.ceil(Math.log2(arr.length)),
                        });
                    }
                }
            }

            // Place pivot in correct position
            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
            if (i + 1 !== high) swaps++;

            const finalPivotArray = createArrayElements(arr);
            finalPivotArray[i + 1].state = 'sorted';
            sortedIndices.forEach(idx => {
                finalPivotArray[idx].state = 'sorted';
            });

            steps.push({
                id: steps.length,
                description: `Placed pivot ${arr[i + 1]} in its final position at index ${i + 1}`,
                pseudocodeLine: 17,
                state: { array: finalPivotArray },
                comparisons,
                swaps,
                memoryUsage: Math.ceil(Math.log2(arr.length)),
                specialIndices: [{ index: i + 1, type: 'placed' }],
            });

            return i + 1;
        }

        quickSortHelper(0, arr.length - 1);

        steps.push({
            id: steps.length,
            description: `Sorting complete! Total comparisons: ${comparisons}, Total swaps: ${swaps}`,
            pseudocodeLine: 6,
            state: { array: createArrayElements(arr).map(el => ({ ...el, state: 'sorted' as const })) },
            comparisons,
            swaps,
            memoryUsage: Math.ceil(Math.log2(arr.length)),
        });

        return steps;
    },
};
