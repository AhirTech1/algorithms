import { motion } from 'framer-motion';

interface MatrixVisualizerProps {
    matrix: (number | string)[][];
    rowHeaders?: string[];
    colHeaders?: string[];
    currentCell?: { row: number; col: number };
    highlightedCells?: { row: number; col: number; state: string }[];
    title?: string;
    showInfinity?: boolean;
}

const cellColors: Record<string, string> = {
    default: 'bg-[var(--color-bg-secondary)]',
    computing: 'bg-amber-500/30 border-amber-500',
    computed: 'bg-indigo-500/20 border-indigo-500/50',
    optimal: 'bg-emerald-500/30 border-emerald-500',
    current: 'bg-pink-500/30 border-pink-500',
};

export function MatrixVisualizer({
    matrix,
    rowHeaders,
    colHeaders,
    currentCell,
    highlightedCells = [],
    title,
    showInfinity = true,
}: MatrixVisualizerProps) {
    if (!matrix || matrix.length === 0) {
        return (
            <div className="w-full bg-[var(--color-bg-tertiary)] rounded-xl p-6 border border-[var(--color-border-primary)] text-center text-[var(--color-text-muted)]">
                No matrix data available
            </div>
        );
    }

    const getCellState = (row: number, col: number): string => {
        if (currentCell && currentCell.row === row && currentCell.col === col) {
            return 'current';
        }
        const highlighted = highlightedCells.find(c => c.row === row && c.col === col);
        return highlighted?.state || 'default';
    };

    const formatValue = (val: number | string): string => {
        if (val === Infinity || val === 'Infinity') return showInfinity ? '∞' : '-';
        if (val === -Infinity || val === '-Infinity') return '-∞';
        if (typeof val === 'number') {
            return Number.isInteger(val) ? String(val) : val.toFixed(1);
        }
        return String(val);
    };

    const rows = matrix.length;
    const cols = matrix[0]?.length || 0;
    const cellSize = Math.max(32, Math.min(48, 400 / Math.max(rows, cols)));

    return (
        <div className="w-full bg-[var(--color-bg-tertiary)] rounded-xl p-6 border border-[var(--color-border-primary)]">
            {title && (
                <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-4 text-center">
                    {title}
                </h3>
            )}

            <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                    {/* Column headers */}
                    {colHeaders && (
                        <div className="flex" style={{ marginLeft: rowHeaders ? `${cellSize + 8}px` : 0 }}>
                            {colHeaders.map((header, i) => (
                                <div
                                    key={i}
                                    className="text-xs font-mono text-[var(--color-text-muted)] text-center mb-1"
                                    style={{ width: `${cellSize}px`, minWidth: `${cellSize}px` }}
                                >
                                    {header}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Matrix rows */}
                    {matrix.map((row, rowIdx) => (
                        <div key={rowIdx} className="flex items-center gap-1 mb-1">
                            {/* Row header */}
                            {rowHeaders && (
                                <div
                                    className="text-xs font-mono text-[var(--color-text-muted)] text-right pr-2"
                                    style={{ width: `${cellSize}px`, minWidth: `${cellSize}px` }}
                                >
                                    {rowHeaders[rowIdx]}
                                </div>
                            )}

                            {/* Cells */}
                            {row.map((cell, colIdx) => {
                                const state = getCellState(rowIdx, colIdx);
                                return (
                                    <motion.div
                                        key={colIdx}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: (rowIdx * cols + colIdx) * 0.01 }}
                                        className={`
                                            flex items-center justify-center rounded-md border
                                            text-xs font-mono font-medium transition-all duration-200
                                            ${cellColors[state] || cellColors.default}
                                            ${state === 'current' ? 'shadow-lg shadow-pink-500/20' : ''}
                                            ${state === 'computing' ? 'shadow-lg shadow-amber-500/20' : ''}
                                        `}
                                        style={{
                                            width: `${cellSize}px`,
                                            height: `${cellSize}px`,
                                            minWidth: `${cellSize}px`,
                                        }}
                                    >
                                        <span className={`
                                            ${state === 'optimal' ? 'text-emerald-400' : ''}
                                            ${state === 'current' ? 'text-pink-400' : ''}
                                            ${state === 'computing' ? 'text-amber-400' : ''}
                                            ${state === 'computed' ? 'text-indigo-300' : ''}
                                            ${state === 'default' ? 'text-[var(--color-text-secondary)]' : ''}
                                        `}>
                                            {formatValue(cell)}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-[var(--color-border-primary)]">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-amber-500/30 border border-amber-500" />
                    <span className="text-xs text-[var(--color-text-muted)]">Computing</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-indigo-500/20 border border-indigo-500/50" />
                    <span className="text-xs text-[var(--color-text-muted)]">Computed</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-emerald-500/30 border border-emerald-500" />
                    <span className="text-xs text-[var(--color-text-muted)]">Optimal</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-pink-500/30 border border-pink-500" />
                    <span className="text-xs text-[var(--color-text-muted)]">Current</span>
                </div>
            </div>
        </div>
    );
}
