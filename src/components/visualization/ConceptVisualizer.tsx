import { motion } from 'framer-motion';

interface ConceptVisualizerProps {
    concept: 'p-vs-np' | 'reduction';
    currentPhase?: number;
    highlightClass?: 'P' | 'NP' | 'NP-Complete' | 'NP-Hard';
    examples?: { problem: string; class: string }[];
    verificationSteps?: number;
    solvingSteps?: number;
}

export function ConceptVisualizer({
    concept,
    currentPhase = 0,
    highlightClass,
    examples = [],
    verificationSteps,
    solvingSteps,
}: ConceptVisualizerProps) {
    if (concept === 'p-vs-np') {
        return (
            <div className="w-full bg-[var(--color-bg-tertiary)] rounded-xl p-6 border border-[var(--color-border-primary)]">
                {/* Venn Diagram */}
                <div className="relative h-80 flex items-center justify-center">
                    {/* NP-Hard circle (background) */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: currentPhase >= 3 ? 1 : 0.3 }}
                        transition={{ delay: 0.3 }}
                        className={`absolute w-72 h-72 rounded-full border-2 border-dashed
                            ${highlightClass === 'NP-Hard' ? 'border-red-500 bg-red-500/10' : 'border-zinc-600 bg-zinc-800/20'}
                        `}
                        style={{ left: '50%', transform: 'translateX(-30%)' }}
                    >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-red-400">
                            NP-Hard
                        </span>
                    </motion.div>

                    {/* NP circle */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: currentPhase >= 1 ? 1 : 0.3 }}
                        transition={{ delay: 0.1 }}
                        className={`absolute w-56 h-56 rounded-full border-2
                            ${highlightClass === 'NP' ? 'border-purple-500 bg-purple-500/20' : 'border-purple-500/50 bg-purple-500/5'}
                        `}
                    >
                        <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-purple-400 font-medium">
                            NP
                        </span>
                    </motion.div>

                    {/* NP-Complete intersection */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: currentPhase >= 2 ? 1 : 0.3 }}
                        transition={{ delay: 0.2 }}
                        className={`absolute w-24 h-24 rounded-full border-2
                            ${highlightClass === 'NP-Complete' ? 'border-orange-500 bg-orange-500/30' : 'border-orange-500/50 bg-orange-500/10'}
                        `}
                        style={{ left: '55%', transform: 'translateX(-50%)' }}
                    >
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-orange-400 whitespace-nowrap">
                            NP-Complete
                        </span>
                    </motion.div>

                    {/* P circle */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: currentPhase >= 0 ? 1 : 0.3 }}
                        className={`absolute w-32 h-32 rounded-full border-2
                            ${highlightClass === 'P' ? 'border-emerald-500 bg-emerald-500/30' : 'border-emerald-500/50 bg-emerald-500/10'}
                        `}
                        style={{ left: '35%', transform: 'translateX(-50%)' }}
                    >
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-emerald-400 font-bold">
                            P
                        </span>
                    </motion.div>

                    {/* The big question */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: currentPhase >= 4 ? 1 : 0 }}
                        transition={{ delay: 0.5 }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center"
                    >
                        <div className="text-2xl font-bold text-amber-400">P = NP ?</div>
                        <div className="text-xs text-[var(--color-text-muted)]">
                            Millennium Prize Problem ($1,000,000)
                        </div>
                    </motion.div>
                </div>

                {/* Comparison section */}
                {(verificationSteps !== undefined || solvingSteps !== undefined) && (
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[var(--color-border-primary)]">
                        <div className="text-center p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                            <div className="text-xs text-[var(--color-text-muted)] mb-1">Verifying a Solution</div>
                            <div className="text-2xl font-bold text-emerald-400">
                                O(n{verificationSteps !== undefined ? `^${verificationSteps}` : ''})
                            </div>
                            <div className="text-xs text-emerald-400/70">Polynomial Time ✓</div>
                        </div>
                        <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                            <div className="text-xs text-[var(--color-text-muted)] mb-1">Finding a Solution</div>
                            <div className="text-2xl font-bold text-red-400">
                                O({solvingSteps !== undefined ? `${solvingSteps}^n` : '2^n'})
                            </div>
                            <div className="text-xs text-red-400/70">Exponential Time ✗</div>
                        </div>
                    </div>
                )}

                {/* Example problems */}
                {examples.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[var(--color-border-primary)]">
                        <h4 className="text-xs text-[var(--color-text-muted)] mb-2 text-center">Example Problems</h4>
                        <div className="flex flex-wrap justify-center gap-2">
                            {examples.map((ex, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium
                                        ${ex.class === 'P' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : ''}
                                        ${ex.class === 'NP-Complete' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : ''}
                                        ${ex.class === 'NP-Hard' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : ''}
                                    `}
                                >
                                    {ex.problem}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-[var(--color-border-primary)]">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-xs text-[var(--color-text-muted)]">P (Polynomial)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                        <span className="text-xs text-[var(--color-text-muted)]">NP (Verifiable)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                        <span className="text-xs text-[var(--color-text-muted)]">NP-Complete</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-xs text-[var(--color-text-muted)]">NP-Hard</span>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
