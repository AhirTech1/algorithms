import type { AlgorithmConfig, AnimationStep } from '../../types/algorithm';

interface Item {
    weight: number;
    value: number;
    ratio: number;
}

export const fractionalKnapsack: AlgorithmConfig = {
    id: 'fractional-knapsack',
    name: 'Fractional Knapsack',
    category: 'greedy',
    description: 'A greedy algorithm that maximizes value by selecting items with the highest value-to-weight ratio. Unlike 0/1 knapsack, items can be taken partially.',
    complexity: {
        time: {
            best: 'O(n log n)',
            average: 'O(n log n)',
            worst: 'O(n log n)',
        },
        space: 'O(n)',
    },
    pseudocode: [
        'procedure fractionalKnapsack(items, W)',
        '    for each item compute ratio = value/weight',
        '    sort items by ratio (descending)',
        '    totalValue = 0',
        '    for each item in sorted order do',
        '        if weight <= remaining capacity',
        '            take whole item',
        '            totalValue += value',
        '        else',
        '            take fraction of item',
        '            totalValue += value * (remaining/weight)',
        '            break',
        '        end if',
        '    end for',
        '    return totalValue',
        'end procedure',
    ],
    cCode: `#include <stdlib.h>\n\ntypedef struct {\n    int value;\n    int weight;\n    double ratio;\n} Item;\n\nint compare(const void* a, const void* b) {\n    Item* item1 = (Item*)a;\n    Item* item2 = (Item*)b;\n    if (item2->ratio > item1->ratio) return 1;\n    if (item2->ratio < item1->ratio) return -1;\n    return 0;\n}\n\ndouble fractionalKnapsack(int W, Item items[], int n) {\n    int i;\n    \n    // Calculate value/weight ratio for each item\n    for (i = 0; i < n; i++)\n        items[i].ratio = (double)items[i].value / items[i].weight;\n    \n    // Sort items by ratio in descending order\n    qsort(items, n, sizeof(Item), compare);\n    \n    double totalValue = 0.0;\n    int currentWeight = 0;\n    \n    for (i = 0; i < n; i++) {\n        if (currentWeight + items[i].weight <= W) {\n            // Take whole item\n            currentWeight += items[i].weight;\n            totalValue += items[i].value;\n        } else {\n            // Take fraction of item\n            int remain = W - currentWeight;\n            totalValue += items[i].value * ((double)remain / items[i].weight);\n            break;\n        }\n    }\n    \n    return totalValue;\n}`,
    visualizerType: 'array',
    defaultInputSize: 5,
    minInputSize: 3,
    maxInputSize: 8,
    supportsCases: false,

    generateInput(size: number): { items: Item[]; capacity: number } {
        const items: Item[] = [];
        for (let i = 0; i < size; i++) {
            const weight = Math.floor(Math.random() * 10) + 5;
            const value = Math.floor(Math.random() * 50) + 20;
            items.push({ weight, value, ratio: value / weight });
        }
        return { items, capacity: size * 8 };
    },

    generateSteps(input: unknown): AnimationStep[] {
        const { items, capacity } = input as { items: Item[]; capacity: number };
        const steps: AnimationStep[] = [];
        let remaining = capacity;
        let totalValue = 0;

        steps.push({
            id: 0,
            description: `Fractional Knapsack: ${items.length} items, capacity ${capacity}`,
            pseudocodeLine: 0,
            state: { items: items.map(it => ({ ...it, taken: 0 })) },
            comparisons: 0,
            swaps: 0,
            memoryUsage: items.length,
        });

        // Sort by ratio
        const sorted = [...items].sort((a, b) => b.ratio - a.ratio);

        steps.push({
            id: steps.length,
            description: `Sorted by value/weight ratio: ${sorted.map(it => it.ratio.toFixed(2)).join(', ')}`,
            pseudocodeLine: 2,
            state: { items: sorted.map(it => ({ ...it, taken: 0 })) },
            comparisons: items.length * Math.log2(items.length),
            swaps: 0,
            memoryUsage: items.length,
        });

        // Greedy selection
        for (let i = 0; i < sorted.length && remaining > 0; i++) {
            const item = sorted[i];

            if (item.weight <= remaining) {
                remaining -= item.weight;
                totalValue += item.value;

                steps.push({
                    id: steps.length,
                    description: `Taking 100% of item (w=${item.weight}, v=${item.value}). Remaining: ${remaining}. Total: ${totalValue.toFixed(2)}`,
                    pseudocodeLine: 6,
                    state: { items: sorted.map((it, idx) => ({ ...it, taken: idx <= i ? 100 : 0 })) },
                    comparisons: 0,
                    swaps: 0,
                    memoryUsage: items.length,
                });
            } else {
                const fraction = remaining / item.weight;
                totalValue += item.value * fraction;

                steps.push({
                    id: steps.length,
                    description: `Taking ${(fraction * 100).toFixed(1)}% of item (w=${item.weight}, v=${item.value}). Total: ${totalValue.toFixed(2)}`,
                    pseudocodeLine: 9,
                    state: { items: sorted.map((it, idx) => ({ ...it, taken: idx < i ? 100 : idx === i ? fraction * 100 : 0 })) },
                    comparisons: 0,
                    swaps: 0,
                    memoryUsage: items.length,
                });

                remaining = 0;
            }
        }

        steps.push({
            id: steps.length,
            description: `Maximum value achieved: ${totalValue.toFixed(2)}`,
            pseudocodeLine: 14,
            state: { items: sorted.map(it => ({ ...it })) },
            comparisons: 0,
            swaps: 0,
            memoryUsage: items.length,
        });

        return steps;
    },
};
