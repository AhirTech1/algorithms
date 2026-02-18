import { motion } from 'framer-motion';

interface PseudocodeViewerProps {
    code: string[];
    currentLine: number;
    title?: string;
}

export function PseudocodeViewer({ code, currentLine, title = 'Pseudocode' }: PseudocodeViewerProps) {
    return (
        <div className="bg-[var(--color-bg-tertiary)] rounded-xl border border-[var(--color-border-primary)] overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{title}</h3>
            </div>

            {/* Code lines */}
            <div className="p-2 max-h-[400px] overflow-y-auto">
                {code.map((line, index) => {
                    const isActive = index === currentLine;
                    const lineNumber = index + 1;

                    return (
                        <motion.div
                            key={index}
                            animate={{
                                backgroundColor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                            }}
                            className={`flex font-mono text-sm relative ${isActive ? 'text-indigo-300' : 'text-[var(--color-text-muted)]'
                                }`}
                        >
                            {/* Line number */}
                            <span className="w-8 flex-shrink-0 text-right pr-3 select-none text-[var(--color-text-muted)] opacity-60">
                                {lineNumber}
                            </span>

                            {/* Active indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeLine"
                                    className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r"
                                    initial={false}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}

                            {/* Code content */}
                            <pre className="flex-1 py-1 px-2 whitespace-pre-wrap break-words">
                                <code>{line || ' '}</code>
                            </pre>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
