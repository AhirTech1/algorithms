import { motion } from 'framer-motion';

interface ChessboardVisualizerProps {
    size: number;
    queens: number[];  // queens[col] = row of queen in that column, -1 if none
    currentCol?: number;
    conflicts?: { row: number; col: number }[];
    tryingPosition?: { row: number; col: number };
    backtracking?: boolean;
    solutionCount?: number;
}

export function ChessboardVisualizer({
    size,
    queens,
    currentCol,
    conflicts = [],
    tryingPosition,
    backtracking = false,
    solutionCount,
}: ChessboardVisualizerProps) {
    const cellSize = Math.max(32, Math.min(56, 450 / size));

    const isQueenAt = (row: number, col: number) => {
        return queens[col] === row;
    };

    const isConflict = (row: number, col: number) => {
        return conflicts.some(c => c.row === row && c.col === col);
    };

    const isTrying = (row: number, col: number) => {
        return tryingPosition?.row === row && tryingPosition?.col === col;
    };

    const isThreatened = (row: number, col: number) => {
        // Check if this cell is threatened by any queen
        for (let c = 0; c < queens.length; c++) {
            const qRow = queens[c];
            if (qRow === -1) continue;

            // Same row
            if (qRow === row) return true;
            // Same diagonal
            if (Math.abs(qRow - row) === Math.abs(c - col)) return true;
        }
        return false;
    };

    const getCellState = (row: number, col: number) => {
        if (isQueenAt(row, col)) return 'queen';
        if (isTrying(row, col)) return backtracking ? 'backtrack' : 'trying';
        if (isConflict(row, col)) return 'conflict';
        if (isThreatened(row, col) && currentCol !== undefined && col >= currentCol) return 'threatened';
        return 'default';
    };

    const cellStyles = {
        default: '',
        queen: 'bg-indigo-500/40 border-indigo-500',
        trying: 'bg-amber-500/30 border-amber-500',
        backtrack: 'bg-red-500/30 border-red-500',
        conflict: 'bg-red-500/20 border-red-500/50',
        threatened: 'bg-red-500/10 border-red-500/20',
    };

    return (
        <div className="w-full bg-[var(--color-bg-tertiary)] rounded-xl p-6 border border-[var(--color-border-primary)]">
            {/* Solution count */}
            {solutionCount !== undefined && (
                <div className="text-center mb-4">
                    <span className="text-sm text-[var(--color-text-muted)]">
                        Solutions found: <span className="font-bold text-emerald-400">{solutionCount}</span>
                    </span>
                </div>
            )}

            {/* Chessboard */}
            <div className="flex justify-center">
                <div className="inline-block">
                    {/* Column headers */}
                    <div className="flex mb-1" style={{ marginLeft: `${cellSize + 4}px` }}>
                        {Array.from({ length: size }, (_, i) => (
                            <div
                                key={i}
                                className="text-xs font-mono text-[var(--color-text-muted)] text-center"
                                style={{ width: `${cellSize}px` }}
                            >
                                {i}
                            </div>
                        ))}
                    </div>

                    {/* Board rows */}
                    {Array.from({ length: size }, (_, row) => (
                        <div key={row} className="flex items-center gap-1">
                            {/* Row header */}
                            <div
                                className="text-xs font-mono text-[var(--color-text-muted)] text-right pr-1"
                                style={{ width: `${cellSize}px` }}
                            >
                                {row}
                            </div>

                            {/* Cells */}
                            {Array.from({ length: size }, (_, col) => {
                                const isDark = (row + col) % 2 === 1;
                                const state = getCellState(row, col);
                                const hasQueen = isQueenAt(row, col);

                                return (
                                    <motion.div
                                        key={col}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: (row * size + col) * 0.01 }}
                                        className={`
                                            flex items-center justify-center rounded-sm border
                                            transition-all duration-200
                                            ${isDark ? 'bg-zinc-700/50' : 'bg-zinc-800/30'}
                                            ${cellStyles[state]}
                                            ${state === 'trying' || state === 'backtrack' ? 'shadow-lg' : ''}
                                        `}
                                        style={{
                                            width: `${cellSize}px`,
                                            height: `${cellSize}px`,
                                        }}
                                    >
                                        {hasQueen && (
                                            <motion.span
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                className="text-2xl"
                                                style={{ fontSize: `${cellSize * 0.6}px` }}
                                            >
                                                ♛
                                            </motion.span>
                                        )}
                                        {isTrying(row, col) && !hasQueen && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: [0.3, 0.8, 0.3] }}
                                                transition={{ repeat: Infinity, duration: 1 }}
                                                className={`text-xl ${backtracking ? 'text-red-400' : 'text-amber-400'}`}
                                                style={{ fontSize: `${cellSize * 0.5}px` }}
                                            >
                                                ?
                                            </motion.span>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Current state info */}
            {currentCol !== undefined && (
                <div className="text-center mt-4">
                    <span className="text-sm text-[var(--color-text-secondary)]">
                        {backtracking ? (
                            <span className="text-red-400">Backtracking from column {currentCol}</span>
                        ) : (
                            <span>Placing queen in column {currentCol}</span>
                        )}
                    </span>
                </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-[var(--color-border-primary)]">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm bg-indigo-500/40 border border-indigo-500 flex items-center justify-center text-xs">♛</div>
                    <span className="text-xs text-[var(--color-text-muted)]">Queen</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-amber-500/30 border border-amber-500" />
                    <span className="text-xs text-[var(--color-text-muted)]">Trying</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-red-500/30 border border-red-500" />
                    <span className="text-xs text-[var(--color-text-muted)]">Backtrack</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-red-500/10 border border-red-500/20" />
                    <span className="text-xs text-[var(--color-text-muted)]">Threatened</span>
                </div>
            </div>
        </div>
    );
}
