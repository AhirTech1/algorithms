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

export const mergeSort: AlgorithmConfig = {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'sorting',
    description: 'An efficient, stable, divide-and-conquer sorting algorithm. It divides the array into halves, recursively sorts them, and then merges the sorted halves.',
    complexity: {
        time: {
            best: 'O(n log n)',
            average: 'O(n log n)',
            worst: 'O(n log n)',
        },
        space: 'O(n)',
    },
    pseudocode: [
        'procedure mergeSort(A, left, right)',
        '    if left < right then',
        '        mid = (left + right) / 2',
        '        mergeSort(A, left, mid)      // Sort left half',
        '        mergeSort(A, mid+1, right)   // Sort right half',
        '        merge(A, left, mid, right)   // Merge sorted halves',
        '    end if',
        'end procedure',
        '',
        'procedure merge(A, left, mid, right)',
        '    Create temp arrays L and R',
        '    Copy A[left..mid] to L',
        '    Copy A[mid+1..right] to R',
        '    Merge L and R back into A[left..right]',
        'end procedure',
    ],
    cCode: `void merge(int arr[], int l, int m, int r) {
    int i, j, k;
    int n1 = m - l + 1;
    int n2 = r - m;
    
    // Create temp arrays
    int L[n1], R[n2];
    
    // Copy data to temp arrays
    for (i = 0; i < n1; i++)
        L[i] = arr[l + i];
    for (j = 0; j < n2; j++)
        R[j] = arr[m + 1 + j];
    
    // Merge the temp arrays back
    i = 0; j = 0; k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    
    // Copy remaining elements
    while (i < n1) {
        arr[k] = L[i];
        i++; k++;
    }
    while (j < n2) {
        arr[k] = R[j];
        j++; k++;
    }
}

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
    visualizerType: 'array',
    defaultInputSize: 10,
    minInputSize: 4,
    maxInputSize: 20,
    supportsCases: true,

    generateInput(size: number, caseType: 'best' | 'average' | 'worst' = 'average'): number[] {
        return generateArray(size, caseType);
    },

    generateSteps(input: unknown): AnimationStep[] {
        const arr = [...(input as number[])];
        const steps: AnimationStep[] = [];
        let comparisons = 0;
        let swaps = 0;

        steps.push({
            id: 0,
            description: `Starting Merge Sort with ${arr.length} elements`,
            pseudocodeLine: 0,
            state: { array: createArrayElements(arr) },
            comparisons: 0,
            swaps: 0,
            memoryUsage: arr.length,
        });

        function mergeSortHelper(left: number, right: number, depth: number = 0): void {
            if (left >= right) return;

            const mid = Math.floor((left + right) / 2);

            // Show division
            const divideArray = createArrayElements(arr);
            for (let i = left; i <= mid; i++) {
                divideArray[i].state = 'selected';
            }
            for (let i = mid + 1; i <= right; i++) {
                divideArray[i].state = 'comparing';
            }

            steps.push({
                id: steps.length,
                description: `Dividing array at index ${mid}. Left: [${left}..${mid}], Right: [${mid + 1}..${right}]`,
                pseudocodeLine: 2,
                state: { array: divideArray },
                comparisons,
                swaps,
                memoryUsage: arr.length,
                highlightIndices: [mid],
            });

            // Recursively sort both halves
            mergeSortHelper(left, mid, depth + 1);
            mergeSortHelper(mid + 1, right, depth + 1);

            // Merge
            merge(left, mid, right);
        }

        function merge(left: number, mid: number, right: number): void {
            const leftArr = arr.slice(left, mid + 1);
            const rightArr = arr.slice(mid + 1, right + 1);

            steps.push({
                id: steps.length,
                description: `Merging [${leftArr.join(', ')}] and [${rightArr.join(', ')}]`,
                pseudocodeLine: 9,
                state: { array: createArrayElements(arr) },
                comparisons,
                swaps,
                memoryUsage: arr.length + leftArr.length + rightArr.length,
            });

            let i = 0, j = 0, k = left;

            while (i < leftArr.length && j < rightArr.length) {
                comparisons++;

                const compareArray = createArrayElements(arr);
                for (let idx = left; idx <= right; idx++) {
                    compareArray[idx].state = 'comparing';
                }

                if (leftArr[i] <= rightArr[j]) {
                    arr[k] = leftArr[i];
                    steps.push({
                        id: steps.length,
                        description: `Comparing ${leftArr[i]} ≤ ${rightArr[j]}. Placing ${leftArr[i]} at position ${k}`,
                        pseudocodeLine: 13,
                        state: {
                            array: createArrayElements(arr).map((el, idx) => ({
                                ...el,
                                state: idx >= left && idx <= k ? 'pivot' as const : idx > k && idx <= right ? 'comparing' as const : 'default' as const
                            }))
                        },
                        comparisons,
                        swaps,
                        memoryUsage: arr.length + leftArr.length + rightArr.length,
                    });
                    i++;
                } else {
                    arr[k] = rightArr[j];
                    swaps++;
                    steps.push({
                        id: steps.length,
                        description: `Comparing ${leftArr[i]} > ${rightArr[j]}. Placing ${rightArr[j]} at position ${k}`,
                        pseudocodeLine: 13,
                        state: {
                            array: createArrayElements(arr).map((el, idx) => ({
                                ...el,
                                state: idx >= left && idx <= k ? 'pivot' as const : idx > k && idx <= right ? 'comparing' as const : 'default' as const
                            }))
                        },
                        comparisons,
                        swaps,
                        memoryUsage: arr.length + leftArr.length + rightArr.length,
                    });
                    j++;
                }
                k++;
            }

            // Copy remaining elements
            while (i < leftArr.length) {
                arr[k] = leftArr[i];
                i++;
                k++;
            }

            while (j < rightArr.length) {
                arr[k] = rightArr[j];
                j++;
                k++;
            }

            // Show merged result
            const mergedArray = createArrayElements(arr);
            for (let idx = left; idx <= right; idx++) {
                mergedArray[idx].state = 'sorted';
            }

            steps.push({
                id: steps.length,
                description: `Merged: [${arr.slice(left, right + 1).join(', ')}]`,
                pseudocodeLine: 14,
                state: { array: mergedArray },
                comparisons,
                swaps,
                memoryUsage: arr.length,
            });
        }

        mergeSortHelper(0, arr.length - 1);

        steps.push({
            id: steps.length,
            description: `Sorting complete! Total comparisons: ${comparisons}`,
            pseudocodeLine: 7,
            state: { array: createArrayElements(arr).map(el => ({ ...el, state: 'sorted' as const })) },
            comparisons,
            swaps,
            memoryUsage: arr.length,
        });

        return steps;
    },
};
