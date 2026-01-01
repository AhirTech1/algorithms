import { motion } from 'framer-motion';
import { Activity, Repeat, HardDrive, Clock } from 'lucide-react';
import type { Metrics } from '../../types/algorithm';

interface MetricsDisplayProps {
    metrics: Metrics;
    complexity: {
        time: { best: string; average: string; worst: string };
        space: string;
    };
    currentCase?: 'best' | 'average' | 'worst';
}

export function MetricsDisplay({ metrics, complexity, currentCase = 'average' }: MetricsDisplayProps) {
    const metricItems = [
        {
            icon: Activity,
            label: 'Comparisons',
            value: metrics.comparisons,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
        },
        {
            icon: Repeat,
            label: 'Swaps',
            value: metrics.swaps,
            color: 'text-amber-400',
            bgColor: 'bg-amber-500/10',
        },
        {
            icon: HardDrive,
            label: 'Memory (aux)',
            value: `${metrics.memoryUsage} units`,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10',
        },
    ];

    return (
        <div className="bg-[var(--color-bg-tertiary)] rounded-xl border border-[var(--color-border-primary)] overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Live Metrics</h3>
            </div>

            {/* Metrics grid */}
            <div className="p-4 grid grid-cols-1 gap-3">
                {metricItems.map((item) => (
                    <div
                        key={item.label}
                        className={`flex items-center gap-3 p-3 rounded-lg ${item.bgColor}`}
                    >
                        <item.icon size={18} className={item.color} />
                        <div className="flex-1">
                            <div className="text-xs text-[var(--color-text-muted)]">{item.label}</div>
                            <motion.div
                                key={String(item.value)}
                                initial={{ scale: 1.2, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`text-lg font-bold font-mono ${item.color}`}
                            >
                                {item.value}
                            </motion.div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Complexity section */}
            <div className="px-4 pb-4">
                <div className="p-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)]">
                    <div className="flex items-center gap-2 mb-3">
                        <Clock size={16} className="text-emerald-400" />
                        <span className="text-sm font-medium text-[var(--color-text-primary)]">
                            Time Complexity
                        </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {(['best', 'average', 'worst'] as const).map((caseType) => (
                            <div
                                key={caseType}
                                className={`text-center p-2 rounded-lg transition-all ${currentCase === caseType
                                        ? 'bg-indigo-500/20 border border-indigo-500/30'
                                        : 'bg-[var(--color-bg-tertiary)]'
                                    }`}
                            >
                                <div className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)] mb-1">
                                    {caseType}
                                </div>
                                <div className={`text-sm font-mono font-bold ${currentCase === caseType ? 'text-indigo-400' : 'text-[var(--color-text-secondary)]'
                                    }`}>
                                    {complexity.time[caseType]}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-3 pt-3 border-t border-[var(--color-border-primary)]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-[var(--color-text-muted)]">Space Complexity</span>
                            <span className="text-sm font-mono font-bold text-violet-400">
                                {complexity.space}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
