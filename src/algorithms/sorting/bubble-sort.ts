import type { AlgorithmConfig, AnimationStep, ArrayElement } from '../../types/algorithm';

function generateArray(size: number, caseType: 'best' | 'average' | 'worst'): number[] {
    switch (caseType) {
        case 'best':
            // Already sorted
            return Array.from({ length: size }, (_, i) => i + 1);
        case 'worst':
            // Reverse sorted
            return Array.from({ length: size }, (_, i) => size - i);
        case 'average':
        default:
            // Random
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

export const bubbleSort: AlgorithmConfig = {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    description: 'A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
    complexity: {
        time: {
            best: 'O(n)',
            average: 'O(n²)',
            worst: 'O(n²)',
        },
        space: 'O(1)',
    },
    pseudocode: [
        'procedure bubbleSort(A: list of sortable items)',
        '    n = length(A)',
        '    for i = 0 to n-1 do',
        '        swapped = false',
        '        for j = 0 to n-i-2 do',
        '            if A[j] > A[j+1] then',
        '                swap(A[j], A[j+1])',
        '                swapped = true',
        '            end if',
        '        end for',
        '        if not swapped then',
        '            break  // Array is sorted',
        '        end if',
        '    end for',
        'end procedure',
    ],
    cCode: `void bubbleSort(int arr[], int n) {
    int i, j, temp;
    int swapped;
    
    for (i = 0; i < n - 1; i++) {
        swapped = 0;
        
        for (j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap arr[j] and arr[j+1]
                temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = 1;
            }
        }
        
        // If no swaps occurred, array is sorted
        if (swapped == 0)
            break;
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

        // Initial state
        steps.push({
            id: 0,
            description: `Starting Bubble Sort with ${arr.length} elements`,
            pseudocodeLine: 0,
            state: { array: createArrayElements(arr) },
            comparisons: 0,
            swaps: 0,
            memoryUsage: 1,
        });

        const n = arr.length;

        for (let i = 0; i < n - 1; i++) {
            let swapped = false;

            steps.push({
                id: steps.length,
                description: `Pass ${i + 1}: Starting to bubble up the ${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} largest element`,
                pseudocodeLine: 2,
                state: { array: createArrayElements(arr) },
                comparisons,
                swaps,
                memoryUsage: 1,
            });

            for (let j = 0; j < n - i - 1; j++) {
                // Highlight comparing elements
                const comparingArray = createArrayElements(arr);
                comparingArray[j].state = 'comparing';
                comparingArray[j + 1].state = 'comparing';
                // Mark already sorted elements
                for (let k = n - i; k < n; k++) {
                    comparingArray[k].state = 'sorted';
                }

                comparisons++;
                steps.push({
                    id: steps.length,
                    description: `Comparing ${arr[j]} and ${arr[j + 1]}`,
                    pseudocodeLine: 5,
                    state: { array: comparingArray },
                    comparisons,
                    swaps,
                    memoryUsage: 1,
                    highlightIndices: [j, j + 1],
                });

                if (arr[j] > arr[j + 1]) {
                    // Swap
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    swapped = true;
                    swaps++;

                    // Show swapping state
                    const swappingArray = createArrayElements(arr);
                    swappingArray[j].state = 'swapping';
                    swappingArray[j + 1].state = 'swapping';
                    for (let k = n - i; k < n; k++) {
                        swappingArray[k].state = 'sorted';
                    }

                    steps.push({
                        id: steps.length,
                        description: `Swapped! ${arr[j]} < ${arr[j + 1]}, so we swap their positions`,
                        pseudocodeLine: 6,
                        state: { array: swappingArray },
                        comparisons,
                        swaps,
                        memoryUsage: 1,
                        highlightIndices: [j, j + 1],
                    });
                }
            }

            // Mark the element that bubbled up as sorted
            const afterPassArray = createArrayElements(arr);
            for (let k = n - i - 1; k < n; k++) {
                afterPassArray[k].state = 'sorted';
            }

            steps.push({
                id: steps.length,
                description: `Pass ${i + 1} complete. Element ${arr[n - i - 1]} is now in its correct position.`,
                pseudocodeLine: 9,
                state: { array: afterPassArray },
                comparisons,
                swaps,
                memoryUsage: 1,
            });

            if (!swapped) {
                steps.push({
                    id: steps.length,
                    description: 'No swaps in this pass - array is already sorted! Algorithm terminates early.',
                    pseudocodeLine: 11,
                    state: { array: createArrayElements(arr).map(el => ({ ...el, state: 'sorted' as const })) },
                    comparisons,
                    swaps,
                    memoryUsage: 1,
                });
                break;
            }
        }

        // Final sorted state
        steps.push({
            id: steps.length,
            description: `Sorting complete! Total comparisons: ${comparisons}, Total swaps: ${swaps}`,
            pseudocodeLine: 14,
            state: { array: createArrayElements(arr).map(el => ({ ...el, state: 'sorted' as const })) },
            comparisons,
            swaps,
            memoryUsage: 1,
        });

        return steps;
    },
};
