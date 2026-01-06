import type { AlgorithmConfig, AnimationStep, ArrayElement } from '../../types/algorithm';

function generateSortedArray(size: number): number[] {
    return Array.from({ length: size }, (_, i) => (i + 1) * Math.floor(100 / size));
}

function createArrayElements(arr: number[]): ArrayElement[] {
    return arr.map((value, index) => ({
        value,
        state: 'default' as const,
        originalIndex: index,
    }));
}

export const binarySearch: AlgorithmConfig = {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'divide-conquer',
    description: 'An efficient search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.',
    complexity: {
        time: {
            best: 'O(1)',
            average: 'O(log n)',
            worst: 'O(log n)',
        },
        space: 'O(1)',
    },
    pseudocode: [
        'procedure binarySearch(A, target)',
        '    left = 0',
        '    right = length(A) - 1',
        '    while left <= right do',
        '        mid = (left + right) / 2',
        '        if A[mid] == target then',
        '            return mid  // Found!',
        '        else if A[mid] < target then',
        '            left = mid + 1  // Search right half',
        '        else',
        '            right = mid - 1  // Search left half',
        '        end if',
        '    end while',
        '    return -1  // Not found',
        'end procedure',
    ],
    cCode: `int binarySearch(int arr[], int l, int r, int x) {
    if (r >= l) {
        int mid = l + (r - l) / 2;
        
        // If element is at middle
        if (arr[mid] == x)
            return mid;
        
        // If element is smaller, search left half
        if (arr[mid] > x)
            return binarySearch(arr, l, mid - 1, x);
        
        // Else search right half
        return binarySearch(arr, mid + 1, r, x);
    }
    
    // Element not present
    return -1;
}

// Iterative version
int binarySearchIterative(int arr[], int l, int r, int x) {
    while (l <= r) {
        int mid = l + (r - l) / 2;
        
        if (arr[mid] == x)
            return mid;
        
        if (arr[mid] < x)
            l = mid + 1;
        else
            r = mid - 1;
    }
    
    return -1;
}`,
    visualizerType: 'array',
    defaultInputSize: 15,
    minInputSize: 8,
    maxInputSize: 30,
    supportsCases: true,

    generateInput(size: number, caseType: 'best' | 'average' | 'worst' = 'average'): { array: number[]; target: number } {
        const array = generateSortedArray(size);
        let target: number;

        switch (caseType) {
            case 'best':
                // Target is in the middle
                target = array[Math.floor(size / 2)];
                break;
            case 'worst':
                // Target is at the end or doesn't exist
                target = array[size - 1];
                break;
            case 'average':
            default:
                // Random existing target
                target = array[Math.floor(Math.random() * size)];
        }

        return { array, target };
    },

    generateSteps(input: unknown): AnimationStep[] {
        const { array: arr, target } = input as { array: number[]; target: number };
        const steps: AnimationStep[] = [];
        let comparisons = 0;

        steps.push({
            id: 0,
            description: `Searching for ${target} in a sorted array of ${arr.length} elements`,
            pseudocodeLine: 0,
            state: { array: createArrayElements(arr) },
            comparisons: 0,
            swaps: 0,
            memoryUsage: 3, // left, right, mid
        });

        let left = 0;
        let right = arr.length - 1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);

            // Show current search range
            const rangeArray = createArrayElements(arr);
            for (let i = 0; i < arr.length; i++) {
                if (i < left || i > right) {
                    rangeArray[i].state = 'sorted'; // Already eliminated
                } else if (i === mid) {
                    rangeArray[i].state = 'pivot';
                } else {
                    rangeArray[i].state = 'selected';
                }
            }

            steps.push({
                id: steps.length,
                description: `Search range: [${left}..${right}]. Middle index: ${mid}, Middle value: ${arr[mid]}`,
                pseudocodeLine: 4,
                state: { array: rangeArray },
                comparisons,
                swaps: 0,
                memoryUsage: 3,
                specialIndices: [
                    { index: left, type: 'L' },
                    { index: right, type: 'R' },
                    { index: mid, type: 'M' },
                ],
            });

            comparisons++;

            if (arr[mid] === target) {
                // Found the target!
                const foundArray = createArrayElements(arr);
                foundArray[mid].state = 'sorted';

                steps.push({
                    id: steps.length,
                    description: `Found ${target} at index ${mid}!`,
                    pseudocodeLine: 6,
                    state: { array: foundArray },
                    comparisons,
                    swaps: 0,
                    memoryUsage: 3,
                    highlightIndices: [mid],
                });
                break;
            } else if (arr[mid] < target) {
                const compareArray = createArrayElements(arr);
                compareArray[mid].state = 'comparing';
                for (let i = left; i < mid; i++) {
                    compareArray[i].state = 'sorted'; // Eliminated
                }

                steps.push({
                    id: steps.length,
                    description: `${arr[mid]} < ${target}. Eliminating left half, searching right.`,
                    pseudocodeLine: 8,
                    state: { array: compareArray },
                    comparisons,
                    swaps: 0,
                    memoryUsage: 3,
                });

                left = mid + 1;
            } else {
                const compareArray = createArrayElements(arr);
                compareArray[mid].state = 'comparing';
                for (let i = mid + 1; i <= right; i++) {
                    compareArray[i].state = 'sorted'; // Eliminated
                }

                steps.push({
                    id: steps.length,
                    description: `${arr[mid]} > ${target}. Eliminating right half, searching left.`,
                    pseudocodeLine: 10,
                    state: { array: compareArray },
                    comparisons,
                    swaps: 0,
                    memoryUsage: 3,
                });

                right = mid - 1;
            }
        }

        if (left > right) {
            steps.push({
                id: steps.length,
                description: `Target ${target} not found in the array. Total comparisons: ${comparisons}`,
                pseudocodeLine: 13,
                state: { array: createArrayElements(arr) },
                comparisons,
                swaps: 0,
                memoryUsage: 3,
            });
        }

        return steps;
    },
};
