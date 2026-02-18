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

function createArrayElements(arr: number[], sortedUpTo: number = -1): ArrayElement[] {
    return arr.map((value, index) => ({
        value,
        state: index < sortedUpTo ? 'sorted' as const : 'default' as const,
        originalIndex: index,
    }));
}

export const selectionSort: AlgorithmConfig = {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'sorting',
    description: 'An in-place comparison sorting algorithm that divides the input into a sorted and unsorted region, repeatedly selecting the minimum element from the unsorted region.',
    complexity: {
        time: {
            best: 'O(n²)',
            average: 'O(n²)',
            worst: 'O(n²)',
        },
        space: 'O(1)',
    },
    pseudocode: [
        'procedure selectionSort(A: list of sortable items)',
        '    n = length(A)',
        '    for i = 0 to n-1 do',
        '        minIndex = i',
        '        for j = i+1 to n-1 do',
        '            if A[j] < A[minIndex] then',
        '                minIndex = j',
        '            end if',
        '        end for',
        '        if minIndex ≠ i then',
        '            swap(A[i], A[minIndex])',
        '        end if',
        '    end for',
        'end procedure',
    ],
    cCode: `void selectionSort(int arr[], int n) {
    int i, j, min_idx, temp;
    
    for (i = 0; i < n - 1; i++) {
        // Find the minimum element in unsorted array
        min_idx = i;
        
        for (j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx])
                min_idx = j;
        }
        
        // Swap the found minimum element with the first element
        if (min_idx != i) {
            temp = arr[min_idx];
            arr[min_idx] = arr[i];
            arr[i] = temp;
        }
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
            description: `Starting Selection Sort with ${n} elements`,
            pseudocodeLine: 0,
            state: { array: createArrayElements(arr) },
            comparisons: 0,
            swaps: 0,
            memoryUsage: 1,
        });

        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;

            // Show current position being filled
            const startArray = createArrayElements(arr, i);
            startArray[i].state = 'selected';

            steps.push({
                id: steps.length,
                description: `Pass ${i + 1}: Finding minimum element for position ${i}`,
                pseudocodeLine: 3,
                state: { array: startArray },
                comparisons,
                swaps,
                memoryUsage: 1,
                specialIndices: [{ index: i, type: 'current' }],
            });

            for (let j = i + 1; j < n; j++) {
                comparisons++;

                const comparingArray = createArrayElements(arr, i);
                comparingArray[i].state = 'selected';
                comparingArray[minIndex].state = 'pivot';
                comparingArray[j].state = 'comparing';

                steps.push({
                    id: steps.length,
                    description: `Comparing element at ${j} (value: ${arr[j]}) with current min at ${minIndex} (value: ${arr[minIndex]})`,
                    pseudocodeLine: 5,
                    state: { array: comparingArray },
                    comparisons,
                    swaps,
                    memoryUsage: 1,
                    highlightIndices: [minIndex, j],
                });

                if (arr[j] < arr[minIndex]) {
                    minIndex = j;

                    const newMinArray = createArrayElements(arr, i);
                    newMinArray[i].state = 'selected';
                    newMinArray[minIndex].state = 'pivot';

                    steps.push({
                        id: steps.length,
                        description: `Found new minimum: ${arr[minIndex]} at index ${minIndex}`,
                        pseudocodeLine: 6,
                        state: { array: newMinArray },
                        comparisons,
                        swaps,
                        memoryUsage: 1,
                        specialIndices: [{ index: minIndex, type: 'min' }],
                    });
                }
            }

            if (minIndex !== i) {
                [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
                swaps++;

                const swapArray = createArrayElements(arr, i);
                swapArray[i].state = 'swapping';
                swapArray[minIndex].state = 'swapping';

                steps.push({
                    id: steps.length,
                    description: `Swapping ${arr[minIndex]} at position ${minIndex} with ${arr[i]} at position ${i}`,
                    pseudocodeLine: 10,
                    state: { array: swapArray },
                    comparisons,
                    swaps,
                    memoryUsage: 1,
                });
            }

            // Mark position as sorted
            const afterPassArray = createArrayElements(arr, i + 1);
            steps.push({
                id: steps.length,
                description: `Position ${i} is now sorted with value ${arr[i]}`,
                pseudocodeLine: 11,
                state: { array: afterPassArray },
                comparisons,
                swaps,
                memoryUsage: 1,
            });
        }

        steps.push({
            id: steps.length,
            description: `Sorting complete! Total comparisons: ${comparisons}, Total swaps: ${swaps}`,
            pseudocodeLine: 13,
            state: { array: createArrayElements(arr).map(el => ({ ...el, state: 'sorted' as const })) },
            comparisons,
            swaps,
            memoryUsage: 1,
        });

        return steps;
    },
};
