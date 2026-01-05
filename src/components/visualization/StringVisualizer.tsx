import { motion } from 'framer-motion';

interface StringVisualizerProps {
    text: string;
    pattern: string;
    position: number;  // Where pattern is aligned in text
    matchedCount?: number;  // How many chars of pattern matched
    comparing?: number;  // Index in text being compared
    matchIndices?: number[];  // Indices where full matches were found
    lps?: number[];  // LPS array for KMP
    hashValues?: { text: string; pattern: string };  // For Rabin-Karp
    mismatch?: boolean;
    done?: boolean;
}

export function StringVisualizer({
    text,
    pattern,
    position,
    matchedCount = 0,
    comparing,
    matchIndices = [],
    lps,
    hashValues,
    mismatch = false,
    done = false,
}: StringVisualizerProps) {
    const getTextCharState = (index: number) => {
        // Check if this is a found match location
        for (const matchStart of matchIndices) {
            if (index >= matchStart && index < matchStart + pattern.length) {
                return 'found';
            }
        }

        // Current comparison
        if (comparing !== undefined && index === comparing) {
            return mismatch ? 'mismatch' : 'comparing';
        }

        // Currently matched portion
        if (position >= 0 && index >= position && index < position + matchedCount) {
            return 'matched';
        }

        return 'default';
    };

    const getPatternCharState = (index: number) => {
        if (index < matchedCount) {
            return 'matched';
        }
        if (index === matchedCount && comparing !== undefined) {
            return mismatch ? 'mismatch' : 'comparing';
        }
        return 'default';
    };

    const charColors = {
        default: 'bg-[var(--color-bg-secondary)] border-[var(--color-border-primary)] text-[var(--color-text-secondary)]',
        comparing: 'bg-amber-500/30 border-amber-500 text-amber-300',
        matched: 'bg-emerald-500/30 border-emerald-500 text-emerald-300',
        mismatch: 'bg-red-500/30 border-red-500 text-red-300',
        found: 'bg-indigo-500/30 border-indigo-500 text-indigo-300',
    };

    return (
        <div className="w-full bg-[var(--color-bg-tertiary)] rounded-xl p-6 border border-[var(--color-border-primary)]">
            {/* Hash values for Rabin-Karp */}
            {hashValues && (
                <div className="flex justify-center gap-6 mb-4">
                    <div className="text-xs text-[var(--color-text-muted)]">
                        Text hash: <span className="font-mono text-indigo-400">{hashValues.text}</span>
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                        Pattern hash: <span className="font-mono text-purple-400">{hashValues.pattern}</span>
                    </div>
                </div>
            )}

            {/* Text string */}
            <div className="mb-2">
                <span className="text-xs text-[var(--color-text-muted)] mb-2 block">Text:</span>
                <div className="flex flex-wrap gap-1">
                    {text.split('').map((char, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.02 }}
                            className={`
                                w-8 h-10 flex flex-col items-center justify-center
                                rounded-md border text-sm font-mono font-bold
                                ${charColors[getTextCharState(i)]}
                            `}
                        >
                            <span>{char}</span>
                            <span className="text-[8px] opacity-50">{i}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Pattern alignment */}
            <div className="mb-4">
                <span className="text-xs text-[var(--color-text-muted)] mb-2 block">Pattern:</span>
                <div className="flex flex-wrap gap-1" style={{ paddingLeft: position >= 0 ? `${position * 36}px` : 0 }}>
                    {pattern.split('').map((char, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                x: 0,
                            }}
                            transition={{ delay: i * 0.02 }}
                            className={`
                                w-8 h-10 flex flex-col items-center justify-center
                                rounded-md border text-sm font-mono font-bold
                                ${charColors[getPatternCharState(i)]}
                            `}
                        >
                            <span>{char}</span>
                            <span className="text-[8px] opacity-50">{i}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* LPS Array for KMP */}
            {lps && (
                <div className="mb-4 pt-4 border-t border-[var(--color-border-primary)]">
                    <span className="text-xs text-[var(--color-text-muted)] mb-2 block">LPS Array (Failure Function):</span>
                    <div className="flex gap-1">
                        {lps.map((val, i) => (
                            <div
                                key={i}
                                className="w-8 h-8 flex items-center justify-center rounded-md
                                    bg-purple-500/20 border border-purple-500/30
                                    text-xs font-mono text-purple-300"
                            >
                                {val}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Match results */}
            {done && (
                <div className="pt-4 border-t border-[var(--color-border-primary)]">
                    <div className="text-center">
                        <span className="text-sm text-[var(--color-text-secondary)]">
                            Found <span className="font-bold text-emerald-400">{matchIndices.length}</span> match(es)
                            {matchIndices.length > 0 && (
                                <span className="text-[var(--color-text-muted)]">
                                    {' '}at position(s): [{matchIndices.join(', ')}]
                                </span>
                            )}
                        </span>
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-[var(--color-border-primary)]">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-amber-500/30 border border-amber-500" />
                    <span className="text-xs text-[var(--color-text-muted)]">Comparing</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-emerald-500/30 border border-emerald-500" />
                    <span className="text-xs text-[var(--color-text-muted)]">Matched</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-red-500/30 border border-red-500" />
                    <span className="text-xs text-[var(--color-text-muted)]">Mismatch</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-indigo-500/30 border border-indigo-500" />
                    <span className="text-xs text-[var(--color-text-muted)]">Found</span>
                </div>
            </div>
        </div>
    );
}
