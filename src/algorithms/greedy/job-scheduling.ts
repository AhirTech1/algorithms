import type { AlgorithmConfig, AnimationStep } from '../../types/algorithm';

interface Job {
    id: string;
    deadline: number;
    profit: number;
}

export const jobScheduling: AlgorithmConfig = {
    id: 'job-scheduling',
    name: 'Job Scheduling',
    category: 'greedy',
    description: 'Maximizes profit by scheduling jobs before their deadlines. Uses greedy approach to select highest profit jobs that can be completed in time.',
    complexity: {
        time: {
            best: 'O(n²)',
            average: 'O(n²)',
            worst: 'O(n²)',
        },
        space: 'O(n)',
    },
    pseudocode: [
        'procedure jobScheduling(jobs)',
        '    sort jobs by profit (descending)',
        '    slots[1..maxDeadline] = empty',
        '    for each job in sorted order do',
        '        for slot = deadline down to 1 do',
        '            if slots[slot] is empty then',
        '                slots[slot] = job',
        '                break',
        '            end if',
        '        end for',
        '    end for',
        '    return scheduled jobs',
        'end procedure',
    ],
    cCode: `#include <stdlib.h>\n\ntypedef struct {\n    char id;\n    int deadline;\n    int profit;\n} Job;\n\nint compare(const void* a, const void* b) {\n    Job* job1 = (Job*)a;\n    Job* job2 = (Job*)b;\n    return job2->profit - job1->profit;\n}\n\nvoid jobScheduling(Job jobs[], int n) {\n    int i, j;\n    \n    // Sort jobs by profit in descending order\n    qsort(jobs, n, sizeof(Job), compare);\n    \n    // Find maximum deadline\n    int maxDeadline = 0;\n    for (i = 0; i < n; i++)\n        if (jobs[i].deadline > maxDeadline)\n            maxDeadline = jobs[i].deadline;\n    \n    // Create time slots array\n    int* result = (int*)malloc(maxDeadline * sizeof(int));\n    int* slot = (int*)malloc(maxDeadline * sizeof(int));\n    \n    // Initialize all slots as free\n    for (i = 0; i < maxDeadline; i++)\n        slot[i] = 0;\n    \n    int totalProfit = 0;\n    int jobCount = 0;\n    \n    // Iterate through all jobs\n    for (i = 0; i < n; i++) {\n        // Find a free slot for this job (starting from last possible slot)\n        for (j = jobs[i].deadline - 1; j >= 0; j--) {\n            if (slot[j] == 0) {\n                slot[j] = 1;\n                result[j] = i;\n                totalProfit += jobs[i].profit;\n                jobCount++;\n                break;\n            }\n        }\n    }\n    \n    printf(\"Scheduled jobs: \");\n    for (i = 0; i < maxDeadline; i++) {\n        if (slot[i])\n            printf(\"%c \", jobs[result[i]].id);\n    }\n    printf(\"\\nTotal Profit: %d\\n\", totalProfit);\n    \n    free(result);\n    free(slot);\n}`,
    visualizerType: 'array',
    defaultInputSize: 5,
    minInputSize: 3,
    maxInputSize: 8,
    supportsCases: false,

    generateInput(size: number): Job[] {
        return Array.from({ length: size }, (_, i) => ({
            id: String.fromCharCode(65 + i),
            deadline: Math.floor(Math.random() * size) + 1,
            profit: Math.floor(Math.random() * 50) + 10,
        }));
    },

    generateSteps(input: unknown): AnimationStep[] {
        const jobs = input as Job[];
        const steps: AnimationStep[] = [];
        const maxDeadline = Math.max(...jobs.map(j => j.deadline));
        const slots: (Job | null)[] = new Array(maxDeadline).fill(null);
        let totalProfit = 0;

        steps.push({
            id: 0,
            description: `Job Scheduling: ${jobs.length} jobs, max deadline ${maxDeadline}`,
            pseudocodeLine: 0,
            state: { jobs: { original: jobs, slots: [...slots], scheduled: [] } },
            comparisons: 0,
            swaps: 0,
            memoryUsage: maxDeadline,
        });

        // Sort by profit
        const sorted = [...jobs].sort((a, b) => b.profit - a.profit);

        steps.push({
            id: steps.length,
            description: `Sorted by profit: ${sorted.map(j => `${j.id}($${j.profit})`).join(' > ')}`,
            pseudocodeLine: 1,
            state: { jobs: { original: sorted, slots: [...slots], scheduled: [] } },
            comparisons: jobs.length * Math.log2(jobs.length),
            swaps: 0,
            memoryUsage: maxDeadline,
        });

        const scheduled: Job[] = [];

        for (const job of sorted) {
            let placed = false;

            steps.push({
                id: steps.length,
                description: `Trying to schedule Job ${job.id} (profit=$${job.profit}, deadline=${job.deadline})`,
                pseudocodeLine: 3,
                state: { jobs: { original: sorted, slots: [...slots], scheduled: [...scheduled], trying: job } },
                comparisons: 0,
                swaps: 0,
                memoryUsage: maxDeadline,
            });

            for (let slot = job.deadline - 1; slot >= 0 && !placed; slot--) {
                if (slots[slot] === null) {
                    slots[slot] = job;
                    scheduled.push(job);
                    totalProfit += job.profit;
                    placed = true;

                    steps.push({
                        id: steps.length,
                        description: `Scheduled Job ${job.id} in slot ${slot + 1}. Total profit: $${totalProfit}`,
                        pseudocodeLine: 6,
                        state: { jobs: { original: sorted, slots: [...slots], scheduled: [...scheduled] } },
                        comparisons: 0,
                        swaps: 0,
                        memoryUsage: maxDeadline,
                    });
                }
            }

            if (!placed) {
                steps.push({
                    id: steps.length,
                    description: `Job ${job.id} could not be scheduled (no free slot before deadline)`,
                    pseudocodeLine: 4,
                    state: { jobs: { original: sorted, slots: [...slots], scheduled: [...scheduled], rejected: job } },
                    comparisons: 0,
                    swaps: 0,
                    memoryUsage: maxDeadline,
                });
            }
        }

        steps.push({
            id: steps.length,
            description: `Scheduling complete! ${scheduled.length} jobs scheduled for total profit: $${totalProfit}`,
            pseudocodeLine: 11,
            state: { jobs: { original: sorted, slots, scheduled, done: true, totalProfit } },
            comparisons: 0,
            swaps: 0,
            memoryUsage: maxDeadline,
        });

        return steps;
    },
};
