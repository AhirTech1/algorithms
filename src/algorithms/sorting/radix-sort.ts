import type { AlgorithmConfig, AnimationStep, ArrayElement } from '../../types/algorithm';

function createArrayElements(arr: number[]): ArrayElement[] {
    return arr.map((value, index) => ({
        value,
        state: 'default' as const,
        originalIndex: index,
    }));
}

export const radixSort: AlgorithmConfig = {
    id: 'radix-sort',
    name: 'Radix Sort',
    category: 'sorting',
    description: 'A non-comparative sorting algorithm that sorts integers by processing digits from least to most significant. Very efficient for fixed-length integer keys.',
    complexity: {
        time: {
            best: 'O(nk)',
            average: 'O(nk)',
            worst: 'O(nk)',
        },
        space: 'O(n + k)',
    },
    pseudocode: [
        'procedure radixSort(arr)',
        '    max = getMax(arr)',
        '    for exp = 1 while max/exp > 0 do',
        '        countSort(arr, exp)',
        '        exp = exp * 10',
        '    end for',
        'end procedure',
        '',
        'procedure countSort(arr, exp)',
        '    count[0..9] = 0',
        '    for i = 0 to n-1 do',
        '        digit = (arr[i] / exp) % 10',
        '        count[digit]++',
        '    end for',
        '    for i = 1 to 9 do',
        '        count[i] += count[i-1]',
        '    end for',
        '    for i = n-1 downto 0 do',
        '        digit = (arr[i] / exp) % 10',
        '        output[count[digit]-1] = arr[i]',
        '        count[digit]--',
        '    end for',
        '    copy output to arr',
        'end procedure',
    ],
    cCode: `int getMax(int arr[], int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++)
        if (arr[i] > max)
            max = arr[i];
    return max;
}

void countSort(int arr[], int n, int exp) {
    int output[n];
    int count[10] = {0};
    
    // Store count of occurrences
    for (int i = 0; i < n; i++)
        count[(arr[i] / exp) % 10]++;
    
    // Change count[i] so it contains actual position
    for (int i = 1; i < 10; i++)
        count[i] += count[i - 1];
    
    // Build output array
    for (int i = n - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }
    
    // Copy output to arr
    for (int i = 0; i < n; i++)
        arr[i] = output[i];
}

void radixSort(int arr[], int n) {
    int m = getMax(arr, n);
    
    // Do counting sort for every digit
    for (int exp = 1; m / exp > 0; exp *= 10)
        countSort(arr, n, exp);
}`,
    visualizerType: 'array',
    defaultInputSize: 12,
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
                memoryUsage: n + 10,
            });
        };

        addStep(`Starting Radix Sort on ${n} elements`, 0);

        const max = Math.max(...arr);
        addStep(`Maximum value: ${max}. Will process digits from right to left.`, 1);

        for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
            const digitName = exp === 1 ? 'ones' : exp === 10 ? 'tens' : 'hundreds';
            addStep(`Processing ${digitName} digit (exp = ${exp})`, 2);

            // Count occurrences
            const count = new Array(10).fill(0);
            for (let i = 0; i < n; i++) {
                const digit = Math.floor(arr[i] / exp) % 10;
                count[digit]++;
                addStep(`arr[${i}] = ${arr[i]}, digit = ${digit}. count[${digit}] = ${count[digit]}`, 11, [i]);
            }

            // Build cumulative count
            for (let i = 1; i < 10; i++) {
                count[i] += count[i - 1];
            }
            addStep(`Built cumulative count array for positioning`, 14);

            // Build output array
            const output = new Array(n);
            for (let i = n - 1; i >= 0; i--) {
                const digit = Math.floor(arr[i] / exp) % 10;
                output[count[digit] - 1] = arr[i];
                count[digit]--;
                swaps++;
                addStep(`Placing ${arr[i]} at position ${count[digit]} (digit=${digit})`, 17, [i]);
            }

            // Copy output to arr
            for (let i = 0; i < n; i++) {
                arr[i] = output[i];
            }

            const sortedStates: Record<number, ArrayElement['state']> = {};
            for (let i = 0; i < n; i++) {
                sortedStates[i] = 'selected';
            }
            addStep(`Completed ${digitName} digit pass. Array partially sorted.`, 22, [], sortedStates);
        }

        // Mark all as sorted
        const finalStates: Record<number, ArrayElement['state']> = {};
        for (let i = 0; i < n; i++) {
            finalStates[i] = 'sorted';
        }
        addStep(`Radix Sort complete!`, 6, [], finalStates);

        return steps;
    },
};
