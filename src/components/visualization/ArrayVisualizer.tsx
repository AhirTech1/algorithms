import { motion } from 'framer-motion';
import type { ArrayElement } from '../../types/algorithm';

interface ArrayVisualizerProps {
    array: ArrayElement[];
    maxValue?: number;
    showIndices?: boolean;
    showValues?: boolean;
    height?: number;
    highlightIndices?: number[];
    specialIndices?: { index: number; type: string }[];
}

const stateColors: Record<ArrayElement['state'], string> = {
    default: 'bg-indigo-500',
    comparing: 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]',
    swapping: 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]',
    sorted: 'bg-emerald-500',
    pivot: 'bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]',
    selected: 'bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]',
};

export function ArrayVisualizer({
    array,
    maxValue,
    showIndices = true,
    showValues = true,
    height = 300,
    highlightIndices = [],
    specialIndices = [],
}: ArrayVisualizerProps) {
    const max = maxValue || Math.max(...array.map(el => el.value), 1);
    const barWidth = Math.max(100 / array.length - 1, 2);

    const getSpecialType = (index: number) => {
        const special = specialIndices.find(s => s.index === index);
        return special?.type;
    };

    return (
        <div className="w-full bg-[var(--color-bg-tertiary)] rounded-xl p-6 border border-[var(--color-border-primary)]">
            {/* Bars container */}
            <div
                className="relative flex items-end justify-center gap-[2px]"
                style={{ height: `${height}px` }}
            >
                {array.map((element, index) => {
                    const barHeight = (element.value / max) * 100;
                    const isHighlighted = highlightIndices.includes(index);
                    const specialType = getSpecialType(index);

                    return (
                        <motion.div
                            key={element.originalIndex}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                height: `${barHeight}%`,
                            }}
                            transition={{
                                layout: { duration: 0.3, type: 'spring', stiffness: 300, damping: 30 },
                                height: { duration: 0.3 },
                            }}
                            className={`relative rounded-t-md transition-colors duration-200 ${stateColors[element.state]}`}
                            style={{
                                width: `${barWidth}%`,
                                minWidth: '8px',
                            }}
                        >
                            {/* Value label */}
                            {showValues && array.length <= 20 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-mono 
                           text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] 
                           px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap"
                                >
                                    {element.value}
                                </motion.div>
                            )}

                            {/* Special type indicator */}
                            {specialType && (
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-bold 
                              text-pink-400 uppercase tracking-wide">
                                    {specialType}
                                </div>
                            )}

                            {/* Highlight ring */}
                            {isHighlighted && (
                                <motion.div
                                    initial={{ scale: 1 }}
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                    className="absolute inset-0 border-2 border-white/50 rounded-t-md"
                                />
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Index labels */}
            {showIndices && array.length <= 30 && (
                <div className="flex justify-center gap-[2px] mt-2">
                    {array.map((_, index) => (
                        <div
                            key={index}
                            className="text-[10px] font-mono text-[var(--color-text-muted)] text-center"
                            style={{
                                width: `${barWidth}%`,
                                minWidth: '8px',
                            }}
                        >
                            {index}
                        </div>
                    ))}
                </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-[var(--color-border-primary)]">
                {Object.entries(stateColors).map(([state, colorClass]) => (
                    <div key={state} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-sm ${colorClass.split(' ')[0]}`} />
                        <span className="text-xs text-[var(--color-text-muted)] capitalize">{state}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
