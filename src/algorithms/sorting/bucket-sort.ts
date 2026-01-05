import type { AlgorithmConfig, AnimationStep, ArrayElement } from '../../types/algorithm';

function createArrayElements(arr: number[]): ArrayElement[] {
    return arr.map((value, index) => ({
        value,
        state: 'default' as const,
        originalIndex: index,
    }));
}

export const bucketSort: AlgorithmConfig = {
    id: 'bucket-sort',
    name: 'Bucket Sort',
    category: 'sorting',
    description: 'A distribution sort that divides elements into buckets, sorts each bucket, and concatenates results. Works best when input is uniformly distributed.',
    complexity: {
        time: {
            best: 'O(n + k)',
            average: 'O(n + k)',
            worst: 'O(n²)',
        },
        space: 'O(n + k)',
    },
    pseudocode: [
        'procedure bucketSort(arr, n)',
        '    find min and max values',
        '    create k empty buckets',
        '    for i = 0 to n-1 do',
        '        bucketIndex = (arr[i] - min) / range * (k-1)',
        '        insert arr[i] into bucket[bucketIndex]',
        '    end for',
        '    for each bucket do',
        '        sort bucket (insertion sort)',
        '    end for',
        '    concatenate all buckets',
        'end procedure',
    ],
    visualizerType: 'array',
    defaultInputSize: 10,
    minInputSize: 5,
    maxInputSize: 20,
    supportsCases: false,

    generateInput(size: number): number[] {
        return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    },

    generateSteps(input: unknown): AnimationStep[] {
        const arr = [...(input as number[])];
        const steps: AnimationStep[] = [];
        const n = arr.length;
        let comparisons = 0;
        let swaps = 0;

        const addStep = (desc: string, line: number, highlights: number[] = [], states: Record<number, ArrayElement['state']> = {}) => {
            const elements = createArrayElements(arr);
            for (const [idx, state] of Object.entries(states)) {
                elements[parseInt(idx)].state = state;
            }
            for (const idx of highlights) {
                if (elements[idx]) elements[idx].state = 'comparing';
            }
            steps.push({
                id: steps.length,
                description: desc,
                pseudocodeLine: line,
                state: { array: elements },
                comparisons,
                swaps,
                memoryUsage: n * 2,
            });
        };

        addStep(`Starting Bucket Sort on ${n} elements`, 0);

        const min = Math.min(...arr);
        const max = Math.max(...arr);
        const range = max - min || 1;
        const bucketCount = Math.ceil(Math.sqrt(n));

        addStep(`Min: ${min}, Max: ${max}. Creating ${bucketCount} buckets.`, 1);

        // Create buckets
        const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

        // Distribute into buckets
        for (let i = 0; i < n; i++) {
            const bucketIndex = Math.min(
                Math.floor(((arr[i] - min) / range) * (bucketCount - 1)),
                bucketCount - 1
            );
            buckets[bucketIndex].push(arr[i]);
            addStep(`Placing ${arr[i]} into bucket ${bucketIndex}`, 5, [i]);
        }

        // Sort each bucket using insertion sort
        let sortedIndex = 0;
        for (let b = 0; b < bucketCount; b++) {
            if (buckets[b].length === 0) continue;

            addStep(`Sorting bucket ${b} with ${buckets[b].length} elements: [${buckets[b].join(', ')}]`, 8);

            // Insertion sort on bucket
            for (let i = 1; i < buckets[b].length; i++) {
                const key = buckets[b][i];
                let j = i - 1;
                comparisons++;

                while (j >= 0 && buckets[b][j] > key) {
                    buckets[b][j + 1] = buckets[b][j];
                    j--;
                    comparisons++;
                    swaps++;
                }
                buckets[b][j + 1] = key;
            }

            // Copy sorted bucket back to array
            for (let i = 0; i < buckets[b].length; i++) {
                arr[sortedIndex] = buckets[b][i];
                const sortedStates: Record<number, ArrayElement['state']> = {};
                for (let s = 0; s <= sortedIndex; s++) {
                    sortedStates[s] = 'sorted';
                }
                addStep(`Placing ${buckets[b][i]} at position ${sortedIndex}`, 10, [sortedIndex], sortedStates);
                sortedIndex++;
            }
        }

        // Final sorted state
        const finalStates: Record<number, ArrayElement['state']> = {};
        for (let i = 0; i < n; i++) {
            finalStates[i] = 'sorted';
        }
        addStep(`Bucket Sort complete!`, 11, [], finalStates);

        return steps;
    },
};
