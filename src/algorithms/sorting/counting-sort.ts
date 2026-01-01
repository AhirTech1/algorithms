import type { AlgorithmConfig, AnimationStep, ArrayElement } from '../../types/algorithm';

function createArrayElements(arr: number[]): ArrayElement[] {
    return arr.map((value, index) => ({
        value,
        state: 'default' as const,
        originalIndex: index,
    }));
}

export const countingSort: AlgorithmConfig = {
    id: 'counting-sort',
    name: 'Counting Sort',
    category: 'sorting',
    description: 'A non-comparison based sorting algorithm that counts the occurrences of each element and uses arithmetic to determine positions. Works best with small range of integers.',
    complexity: {
        time: {
            best: 'O(n + k)',
            average: 'O(n + k)',
            worst: 'O(n + k)',
        },
        space: 'O(k)',
    },
    pseudocode: [
        'procedure countingSort(A, k)  // k is max value',
        '    count[0..k] = 0',
        '    for each element x in A do',
        '        count[x] = count[x] + 1',
        '    end for',
        '    // Calculate cumulative counts',
        '    for i = 1 to k do',
        '        count[i] = count[i] + count[i-1]',
        '    end for',
        '    // Build output array',
        '    for i = n-1 down to 0 do',
        '        output[count[A[i]] - 1] = A[i]',
        '        count[A[i]] = count[A[i]] - 1',
        '    end for',
        'end procedure',
    ],
    visualizerType: 'array',
    defaultInputSize: 10,
    minInputSize: 5,
    maxInputSize: 20,
    supportsCases: false,

    generateInput(size: number): number[] {
        return Array.from({ length: size }, () => Math.floor(Math.random() * 10) + 1);
    },

    generateSteps(input: unknown): AnimationStep[] {
        const arr = [...(input as number[])];
        const steps: AnimationStep[] = [];
        const n = arr.length;
        const max = Math.max(...arr);
        const count = new Array(max + 1).fill(0);
        const output = new Array(n).fill(0);

        steps.push({
            id: 0,
            description: `Starting Counting Sort. Max value: ${max}`,
            pseudocodeLine: 0,
            state: { array: createArrayElements(arr) },
            comparisons: 0,
            swaps: 0,
            memoryUsage: max + 1,
        });

        // Count occurrences
        for (let i = 0; i < n; i++) {
            count[arr[i]]++;
            const countArray = createArrayElements(arr);
            countArray[i].state = 'comparing';

            steps.push({
                id: steps.length,
                description: `Counting: element ${arr[i]} at index ${i}. Count[${arr[i]}] = ${count[arr[i]]}`,
                pseudocodeLine: 3,
                state: { array: countArray },
                comparisons: 0,
                swaps: 0,
                memoryUsage: max + 1,
            });
        }

        // Cumulative count
        for (let i = 1; i <= max; i++) {
            count[i] += count[i - 1];
        }

        steps.push({
            id: steps.length,
            description: 'Calculated cumulative counts for positioning',
            pseudocodeLine: 7,
            state: { array: createArrayElements(arr) },
            comparisons: 0,
            swaps: 0,
            memoryUsage: max + 1,
        });

        // Build output
        for (let i = n - 1; i >= 0; i--) {
            output[count[arr[i]] - 1] = arr[i];
            count[arr[i]]--;

            const outputArray = createArrayElements(output);
            for (let j = 0; j < n; j++) {
                if (output[j] > 0) outputArray[j].state = 'sorted';
            }
            outputArray[count[arr[i]]].state = 'swapping';

            steps.push({
                id: steps.length,
                description: `Placed ${arr[i]} at position ${count[arr[i]]}`,
                pseudocodeLine: 11,
                state: { array: outputArray },
                comparisons: 0,
                swaps: 0,
                memoryUsage: max + 1,
            });
        }

        steps.push({
            id: steps.length,
            description: 'Counting Sort complete!',
            pseudocodeLine: 14,
            state: { array: createArrayElements(output).map(el => ({ ...el, state: 'sorted' as const })) },
            comparisons: 0,
            swaps: 0,
            memoryUsage: max + 1,
        });

        return steps;
    },
};
