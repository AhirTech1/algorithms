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

export const heapSort: AlgorithmConfig = {
    id: 'heap-sort',
    name: 'Heap Sort',
    category: 'sorting',
    description: 'A comparison-based sorting algorithm that uses a binary heap data structure. It first builds a max-heap and repeatedly extracts the maximum element.',
    complexity: {
        time: {
            best: 'O(n log n)',
            average: 'O(n log n)',
            worst: 'O(n log n)',
        },
        space: 'O(1)',
    },
    pseudocode: [
        'procedure heapSort(A)',
        '    buildMaxHeap(A)',
        '    for i = length(A) - 1 down to 1 do',
        '        swap(A[0], A[i])',
        '        heapSize = heapSize - 1',
        '        maxHeapify(A, 0)',
        '    end for',
        'end procedure',
        '',
        'procedure maxHeapify(A, i)',
        '    left = 2*i + 1',
        '    right = 2*i + 2',
        '    largest = i',
        '    if left < heapSize and A[left] > A[largest]',
        '        largest = left',
        '    if right < heapSize and A[right] > A[largest]',
        '        largest = right',
        '    if largest ≠ i',
        '        swap(A[i], A[largest])',
        '        maxHeapify(A, largest)',
        'end procedure',
    ],
    cCode: `void heapify(int arr[], int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    int temp;
    
    if (left < n && arr[left] > arr[largest])
        largest = left;
    
    if (right < n && arr[right] > arr[largest])
        largest = right;
    
    if (largest != i) {
        temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        
        heapify(arr, n, largest);
    }
}

void heapSort(int arr[], int n) {
    int i, temp;
    
    // Build max heap
    for (i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    
    // Extract elements from heap
    for (i = n - 1; i > 0; i--) {
        temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        
        heapify(arr, i, 0);
    }
}`,
    visualizerType: 'array',
    defaultInputSize: 10,
    minInputSize: 5,
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
        const n = arr.length;
        let heapSize = n;

        steps.push({
            id: 0,
            description: `Starting Heap Sort with ${n} elements`,
            pseudocodeLine: 0,
            state: { array: createArrayElements(arr) },
            comparisons: 0,
            swaps: 0,
            memoryUsage: 1,
        });

        // Heapify helper
        function heapify(i: number, size: number) {
            let largest = i;
            const left = 2 * i + 1;
            const right = 2 * i + 2;

            comparisons++;
            if (left < size && arr[left] > arr[largest]) {
                largest = left;
            }

            comparisons++;
            if (right < size && arr[right] > arr[largest]) {
                largest = right;
            }

            if (largest !== i) {
                // Show comparison
                const compArray = createArrayElements(arr);
                compArray[i].state = 'comparing';
                compArray[largest].state = 'comparing';
                for (let k = size; k < n; k++) compArray[k].state = 'sorted';

                steps.push({
                    id: steps.length,
                    description: `Heapifying: comparing ${arr[i]} with children. Largest is at index ${largest}`,
                    pseudocodeLine: 13,
                    state: { array: compArray },
                    comparisons,
                    swaps,
                    memoryUsage: 1,
                });

                [arr[i], arr[largest]] = [arr[largest], arr[i]];
                swaps++;

                const swapArray = createArrayElements(arr);
                swapArray[i].state = 'swapping';
                swapArray[largest].state = 'swapping';
                for (let k = size; k < n; k++) swapArray[k].state = 'sorted';

                steps.push({
                    id: steps.length,
                    description: `Swapped elements at indices ${i} and ${largest}`,
                    pseudocodeLine: 18,
                    state: { array: swapArray },
                    comparisons,
                    swaps,
                    memoryUsage: 1,
                });

                heapify(largest, size);
            }
        }

        // Build max heap
        steps.push({
            id: steps.length,
            description: 'Building max heap from the array',
            pseudocodeLine: 1,
            state: { array: createArrayElements(arr) },
            comparisons,
            swaps,
            memoryUsage: 1,
        });

        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            heapify(i, n);
        }

        const heapBuiltArray = createArrayElements(arr);
        heapBuiltArray[0].state = 'pivot';

        steps.push({
            id: steps.length,
            description: `Max heap built! Root (${arr[0]}) is the maximum element`,
            pseudocodeLine: 1,
            state: { array: heapBuiltArray },
            comparisons,
            swaps,
            memoryUsage: 1,
        });

        // Extract elements from heap
        for (let i = n - 1; i > 0; i--) {
            // Swap root with last element
            [arr[0], arr[i]] = [arr[i], arr[0]];
            swaps++;
            heapSize = i;

            const extractArray = createArrayElements(arr);
            extractArray[0].state = 'swapping';
            extractArray[i].state = 'sorted';
            for (let k = i + 1; k < n; k++) extractArray[k].state = 'sorted';

            steps.push({
                id: steps.length,
                description: `Extracted max (${arr[i]}) to position ${i}. Heap size now ${heapSize}`,
                pseudocodeLine: 3,
                state: { array: extractArray },
                comparisons,
                swaps,
                memoryUsage: 1,
            });

            // Heapify root
            heapify(0, i);
        }

        steps.push({
            id: steps.length,
            description: `Heap Sort complete! Total comparisons: ${comparisons}, Total swaps: ${swaps}`,
            pseudocodeLine: 7,
            state: { array: createArrayElements(arr).map(el => ({ ...el, state: 'sorted' as const })) },
            comparisons,
            swaps,
            memoryUsage: 1,
        });

        return steps;
    },
};
