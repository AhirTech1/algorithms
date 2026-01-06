import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Info } from 'lucide-react';
import { useAnimation, useAnimationKeyboard, type SpeedPreset } from '../engine';
import {
    ArrayVisualizer,
    GraphVisualizer,
    MatrixVisualizer,
    StringVisualizer,
    ChessboardVisualizer,
    ConceptVisualizer
} from '../components/visualization';
import { AnimationControls, InputSizeSlider } from '../components/controls';
import { PseudocodeViewer, CaseSelector } from '../components/common';
import { MetricsDisplay, ComplexityGraph } from '../components/complexity';
import { algorithmRegistry } from '../algorithms';
import type { ArrayElement } from '../types/algorithm';

// Type definitions for different visualizer states
interface GraphNode {
    id: string;
    label: string;
    state: 'default' | 'visited' | 'current' | 'processed' | 'path';
}

interface GraphEdge {
    source: string;
    target: string;
    weight?: number;
    state: 'default' | 'visited' | 'current' | 'path' | 'mst';
}

interface GraphState {
    nodes: GraphNode[];
    edges: GraphEdge[];
    queue?: string[];
}

export function AlgorithmPage() {
    const { algorithmId } = useParams<{ algorithmId: string }>();
    const [inputSize, setInputSize] = useState(10);
    const [caseType, setCaseType] = useState<'best' | 'average' | 'worst'>('average');
    const [arrayState, setArrayState] = useState<ArrayElement[]>([]);

    const algorithm = algorithmId ? algorithmRegistry[algorithmId] : null;

    const {
        currentStep,
        totalSteps,
        isPlaying,
        isPaused,
        speed,
        progress,
        currentStepData,
        metrics,
        play,
        pause,
        stop,
        stepForward,
        stepBackward,
        goToStep,
        setSpeed,
        loadSteps,
    } = useAnimation();

    // Enable keyboard shortcuts
    useAnimationKeyboard(play, pause, isPlaying, stepForward, stepBackward, stop);

    // Set initial input size from algorithm defaults
    useEffect(() => {
        if (algorithm) {
            setInputSize(algorithm.defaultInputSize);
        }
    }, [algorithm]);

    // Generate new input when size or case changes
    const regenerateInput = useCallback(() => {
        if (!algorithm) return;

        const input = algorithm.generateInput(inputSize, caseType);
        const steps = algorithm.generateSteps(input, inputSize, caseType);
        loadSteps(steps);

        // Set initial array state for array-based visualizations
        if (steps.length > 0 && steps[0].state.array) {
            setArrayState(steps[0].state.array as ArrayElement[]);
        }
    }, [algorithm, inputSize, caseType, loadSteps]);

    useEffect(() => {
        regenerateInput();
    }, [regenerateInput]);

    // Update array state when step changes
    useEffect(() => {
        if (currentStepData?.state.array) {
            setArrayState(currentStepData.state.array as ArrayElement[]);
        }
    }, [currentStepData]);

    const handleInputSizeChange = (newSize: number) => {
        stop();
        setInputSize(newSize);
    };

    const handleCaseChange = (newCase: 'best' | 'average' | 'worst') => {
        stop();
        setCaseType(newCase);
    };

    // Render the appropriate visualizer based on algorithm type
    const renderVisualizer = () => {
        if (!algorithm || !currentStepData) {
            return (
                <div className="w-full h-[300px] bg-[var(--color-bg-tertiary)] rounded-xl border border-[var(--color-border-primary)] flex items-center justify-center text-[var(--color-text-muted)]">
                    Loading visualization...
                </div>
            );
        }

        const state = currentStepData.state;
        const algId = algorithm.id;

        // STRING MATCHING ALGORITHMS - check for stringMatch state structure
        if (state.stringMatch) {
            const sm = state.stringMatch as { text: string; pattern: string; position: number; matchIndices: number[]; matched?: number; comparing?: number; mismatch?: boolean; lps?: number[]; done?: boolean };
            return (
                <StringVisualizer
                    text={sm.text}
                    pattern={sm.pattern}
                    position={sm.position}
                    matchedCount={sm.matched}
                    comparing={sm.comparing}
                    matchIndices={sm.matchIndices || []}
                    lps={sm.lps}
                    mismatch={sm.mismatch}
                    done={sm.done}
                />
            );
        }

        // GRAPH ALGORITHMS - BFS, DFS, Topological Sort, SCC, Articulation Points, MST algorithms, TSP
        if (algorithm.visualizerType === 'graph' || state.graph) {
            const graphState = state.graph as GraphState | undefined;
            if (graphState && graphState.nodes && graphState.edges) {
                return (
                    <GraphVisualizer
                        nodes={graphState.nodes}
                        edges={graphState.edges}
                        directed={algId.includes('topological') || algId === 'scc'}
                        weighted={algId.includes('prim') || algId.includes('kruskal') || algId === 'tsp' || algId.includes('dijkstra')}
                        queueOrStack={graphState.queue}
                        showQueueStack={!!graphState.queue}
                        queueStackLabel={algId === 'bfs' ? 'Queue' : algId === 'dfs' ? 'Stack' : 'Order'}
                    />
                );
            }
        }

        // MATRIX ALGORITHMS - DP tables, Matrix structures
        if (algorithm.visualizerType === 'matrix') {
            // LCS
            if (state.lcs) {
                const lcsState = state.lcs as { dp: number[][]; str1: string; str2: string; i: number; j: number; done?: boolean };
                const rowHeaders = ['', ...lcsState.str1.split('')];
                const colHeaders = ['', ...lcsState.str2.split('')];
                return (
                    <MatrixVisualizer
                        matrix={lcsState.dp}
                        rowHeaders={rowHeaders}
                        colHeaders={colHeaders}
                        currentCell={lcsState.done ? undefined : { row: lcsState.i, col: lcsState.j }}
                        title={`LCS of "${lcsState.str1}" and "${lcsState.str2}"`}
                    />
                );
            }

            // Strassen's Matrix Multiplication - show A, B, and C
            if (state.strassen && state.matrix) {
                const strassen = state.strassen as { a: number[][]; b: number[][]; c: number[][]; currentOp?: string; phase: string };
                const _matrixState = state.matrix as { m: number[][]; n: number; i?: number; j?: number; done?: boolean; title?: string };
                void _matrixState; // Used for type checking

                return (
                    <div className="space-y-4">
                        {/* Three matrices side by side */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Matrix A */}
                            <div className="bg-[var(--color-bg-tertiary)] rounded-xl p-4 border border-[var(--color-border-primary)]">
                                <h4 className="text-sm font-medium text-indigo-400 mb-3 text-center">Matrix A</h4>
                                <div className="flex flex-col items-center gap-1">
                                    {strassen.a.map((row, i) => (
                                        <div key={i} className="flex gap-1">
                                            {row.map((val, j) => (
                                                <div
                                                    key={j}
                                                    className="w-10 h-10 flex items-center justify-center rounded-md bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-mono text-sm"
                                                >
                                                    {val}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Matrix B */}
                            <div className="bg-[var(--color-bg-tertiary)] rounded-xl p-4 border border-[var(--color-border-primary)]">
                                <h4 className="text-sm font-medium text-purple-400 mb-3 text-center">Matrix B</h4>
                                <div className="flex flex-col items-center gap-1">
                                    {strassen.b.map((row, i) => (
                                        <div key={i} className="flex gap-1">
                                            {row.map((val, j) => (
                                                <div
                                                    key={j}
                                                    className="w-10 h-10 flex items-center justify-center rounded-md bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono text-sm"
                                                >
                                                    {val}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Result Matrix C */}
                            <div className="bg-[var(--color-bg-tertiary)] rounded-xl p-4 border border-[var(--color-border-primary)]">
                                <h4 className="text-sm font-medium text-emerald-400 mb-3 text-center">C = A × B</h4>
                                <div className="flex flex-col items-center gap-1">
                                    {strassen.c.map((row, i) => (
                                        <div key={i} className="flex gap-1">
                                            {row.map((val, j) => {
                                                const isCurrent = matrixState.i === i && matrixState.j === j;
                                                return (
                                                    <motion.div
                                                        key={j}
                                                        animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                                                        transition={{ duration: 0.3 }}
                                                        className={`w-10 h-10 flex items-center justify-center rounded-md font-mono text-sm ${isCurrent
                                                                ? 'bg-amber-500/30 border-2 border-amber-500 text-amber-300'
                                                                : val !== 0
                                                                    ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                                                                    : 'bg-zinc-700/30 border border-zinc-600 text-zinc-400'
                                                            }`}
                                                    >
                                                        {val}
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Current operation indicator */}
                        {strassen.currentOp && (
                            <div className="text-center text-sm text-[var(--color-text-muted)]">
                                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300">
                                    {strassen.currentOp}
                                </span>
                            </div>
                        )}
                    </div>
                );
            }

            // Matrix Chain or generic matrix
            if (state.matrix) {
                const matrixState = state.matrix as { m: (number | string)[][]; n: number; i?: number; j?: number; done?: boolean; title?: string };
                const size = matrixState.n;
                const rowHeaders = Array.from({ length: size }, (_, i) => `${i}`);
                const colHeaders = Array.from({ length: size }, (_, i) => `${i}`);
                return (
                    <MatrixVisualizer
                        matrix={matrixState.m}
                        rowHeaders={rowHeaders}
                        colHeaders={colHeaders}
                        currentCell={matrixState.done ? undefined : { row: matrixState.i || 0, col: matrixState.j || 0 }}
                        title={matrixState.title || "Matrix Computation"}
                    />
                );
            }

            // Floyd-Warshall
            if (state.distMatrix) {
                const distMatrix = state.distMatrix as number[][];
                const fwSize = distMatrix.length;
                const headers = Array.from({ length: fwSize }, (_, i) => String(i));
                return (
                    <MatrixVisualizer
                        matrix={distMatrix}
                        rowHeaders={headers}
                        colHeaders={headers}
                        currentCell={(state.i !== undefined && state.j !== undefined)
                            ? { row: state.i as number, col: state.j as number }
                            : undefined}
                        title="Shortest Path Distance Matrix"
                        showInfinity={true}
                    />
                );
            }

            // 0/1 Knapsack
            if (state.dp && (state.dp as { table?: unknown }).table) {
                const dpState = state.dp as { table: { value: number; state: string }[][]; items: unknown[]; currentCapacity: number; currentItem: number };
                const matrix = dpState.table.map(row => row.map(cell => cell.value));
                const rowHeaders = ['0', ...dpState.items.map((_, i) => `Item ${i}`)];
                const colHeaders = Array.from({ length: dpState.table[0].length }, (_, i) => String(i));
                return (
                    <MatrixVisualizer
                        matrix={matrix}
                        rowHeaders={rowHeaders}
                        colHeaders={colHeaders}
                        currentCell={{ row: dpState.currentItem, col: dpState.currentCapacity }}
                        title="0/1 Knapsack DP Table"
                    />
                );
            }

            // N-Queen - stored in state.queens
            if (state.queens) {
                const queenState = state.queens as { board: number[][]; currentRow: number; currentCol: number; phase: string };
                const board = queenState.board;
                const n = board.length;
                // Convert board to queens array format
                const queens: number[] = new Array(n).fill(-1);
                for (let row = 0; row < n; row++) {
                    for (let col = 0; col < n; col++) {
                        if (board[row][col] === 1) {
                            queens[col] = row;
                        }
                    }
                }
                return (
                    <ChessboardVisualizer
                        size={n}
                        queens={queens}
                        currentCol={queenState.currentCol >= 0 ? queenState.currentCol : undefined}
                        tryingPosition={queenState.currentRow >= 0 ? { row: queenState.currentRow, col: queenState.currentCol } : undefined}
                        backtracking={queenState.phase === 'backtracking'}
                    />
                );
            }
        }

        // P vs NP Concept Visualization
        if (algId === 'p-vs-np' && state.concept) {
            const conceptState = state.concept as { concept: string; phase: number; highlightClass?: string; examples?: { problem: string; class: string }[] };
            return (
                <ConceptVisualizer
                    concept={conceptState.concept as 'p-vs-np'}
                    currentPhase={conceptState.phase}
                    highlightClass={conceptState.highlightClass as 'P' | 'NP' | 'NP-Complete' | 'NP-Hard' | undefined}
                    examples={conceptState.examples}
                />
            );
        }

        // HUFFMAN CODING VISUALIZATION
        if (state.huffman) {
            const hf = state.huffman as {
                heap: { char: string; freq: number }[];
                codes: Record<string, string>;
                phase: string;
                extracting?: string[];
                newNode?: { char: string; freq: number };
            };
            return (
                <div className="bg-[var(--color-bg-tertiary)] rounded-xl p-6 border border-[var(--color-border-primary)]">
                    <h4 className="text-sm font-medium text-[var(--color-text-secondary)] mb-4">Priority Queue (Min-Heap)</h4>
                    <div className="flex gap-2 flex-wrap mb-4">
                        {hf.heap.map((node, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`px-4 py-2 rounded-lg border text-center ${hf.newNode?.char === node.char ? 'bg-emerald-500/20 border-emerald-500' :
                                    hf.extracting?.includes(node.char) ? 'bg-amber-500/20 border-amber-500' :
                                        'bg-[var(--color-bg-secondary)] border-[var(--color-border-primary)]'
                                    }`}
                            >
                                <div className="font-bold text-[var(--color-text-primary)]">{node.char}</div>
                                <div className="text-xs text-[var(--color-text-muted)]">freq: {node.freq}</div>
                            </motion.div>
                        ))}
                    </div>

                    {Object.keys(hf.codes).length > 0 && (
                        <div className="mt-4 pt-4 border-t border-[var(--color-border-primary)]">
                            <h5 className="text-xs text-[var(--color-text-muted)] mb-2">Huffman Codes</h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {Object.entries(hf.codes).map(([char, code]) => (
                                    <div key={char} className="bg-[var(--color-bg-secondary)] rounded-lg p-2 border border-indigo-500/30">
                                        <span className="font-bold text-indigo-400">'{char}'</span>
                                        <span className="text-[var(--color-text-muted)]"> → </span>
                                        <span className="font-mono text-emerald-400">{code}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // KNAPSACK VISUALIZATION (Fractional and greedy algorithms with items)
        if (state.items && Array.isArray(state.items)) {
            const items = state.items as { weight: number; value: number; ratio?: number; taken?: number }[];
            // Create a bar chart representation for knapsack items
            const elements: ArrayElement[] = items.map((item, idx) => ({
                value: item.value,
                state: item.taken === 100 ? 'sorted' as const :
                    item.taken && item.taken > 0 ? 'selected' as const : 'default' as const,
                originalIndex: idx,
            }));
            return (
                <div className="space-y-4">
                    <ArrayVisualizer
                        array={elements}
                        showIndices={true}
                        showValues={true}
                        height={200}
                    />
                    <div className="bg-[var(--color-bg-tertiary)] rounded-xl p-4 border border-[var(--color-border-primary)]">
                        <h4 className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">Items</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {items.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`p-2 rounded-lg border text-xs ${item.taken === 100 ? 'bg-emerald-500/20 border-emerald-500' :
                                        item.taken && item.taken > 0 ? 'bg-amber-500/20 border-amber-500' :
                                            'bg-[var(--color-bg-secondary)] border-[var(--color-border-primary)]'
                                        }`}
                                >
                                    <div className="font-medium text-[var(--color-text-primary)]">Item {idx}</div>
                                    <div className="text-[var(--color-text-muted)]">
                                        W: {item.weight} | V: {item.value}
                                        {item.ratio && <span> | R: {item.ratio.toFixed(2)}</span>}
                                    </div>
                                    {item.taken !== undefined && item.taken > 0 && (
                                        <div className="text-emerald-400 font-bold">{item.taken.toFixed(0)}% taken</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        // JOB SCHEDULING VISUALIZATION - state.jobs is an object, not array
        if (state.jobs && typeof state.jobs === 'object' && !Array.isArray(state.jobs)) {
            const jobsData = state.jobs as {
                original: { id: string; deadline: number; profit: number }[];
                slots: (null | { id: string; profit: number })[];
                scheduled: { id: string; profit: number }[];
                trying?: { id: string; profit: number };
                rejected?: { id: string; profit: number };
                done?: boolean;
                totalProfit?: number;
            };
            const jobs = jobsData.original || [];
            const scheduled = jobsData.scheduled || [];
            const scheduledIds = new Set(scheduled.map(j => j.id));

            return (
                <div className="bg-[var(--color-bg-tertiary)] rounded-xl p-6 border border-[var(--color-border-primary)]">
                    <h4 className="text-sm font-medium text-[var(--color-text-secondary)] mb-4">Job Schedule</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {jobs.map((job, idx) => {
                            const isScheduled = scheduledIds.has(job.id);
                            const isTrying = jobsData.trying?.id === job.id;
                            const isRejected = jobsData.rejected?.id === job.id;
                            return (
                                <motion.div
                                    key={job.id || idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`p-3 rounded-lg border ${isScheduled ? 'bg-emerald-500/20 border-emerald-500' :
                                        isTrying ? 'bg-amber-500/20 border-amber-500' :
                                            isRejected ? 'bg-red-500/20 border-red-500' :
                                                'bg-[var(--color-bg-secondary)] border-[var(--color-border-primary)]'
                                        }`}
                                >
                                    <div className="font-bold text-[var(--color-text-primary)]">Job {job.id}</div>
                                    <div className="text-xs text-[var(--color-text-muted)]">
                                        Deadline: {job.deadline}
                                    </div>
                                    <div className="text-xs text-[var(--color-text-muted)]">
                                        Profit: <span className="text-amber-400 font-medium">${job.profit}</span>
                                    </div>
                                    {isScheduled && (
                                        <div className="text-xs text-emerald-400 mt-1 font-bold">✓ Scheduled</div>
                                    )}
                                    {isTrying && (
                                        <div className="text-xs text-amber-400 mt-1 font-bold">⏳ Trying...</div>
                                    )}
                                    {isRejected && (
                                        <div className="text-xs text-red-400 mt-1 font-bold">✗ Rejected</div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                    {jobsData.slots && (
                        <div className="mt-4 pt-4 border-t border-[var(--color-border-primary)]">
                            <h5 className="text-xs text-[var(--color-text-muted)] mb-2">Time Slots</h5>
                            <div className="flex gap-2 flex-wrap">
                                {jobsData.slots.map((slot, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-12 h-10 rounded flex items-center justify-center text-sm font-bold ${slot ? 'bg-emerald-500/30 border border-emerald-500' : 'bg-zinc-700/30 border border-zinc-600'
                                            }`}
                                    >
                                        {slot ? slot.id : '-'}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {jobsData.done && jobsData.totalProfit !== undefined && (
                        <div className="mt-4 text-center">
                            <span className="text-lg font-bold text-emerald-400">Total Profit: ${jobsData.totalProfit}</span>
                        </div>
                    )}
                </div>
            );
        }

        // DEFAULT: Array Visualization (sorting, searching algorithms)
        if (arrayState.length > 0) {
            return (
                <ArrayVisualizer
                    array={arrayState}
                    showIndices={true}
                    showValues={true}
                    height={300}
                    highlightIndices={currentStepData?.highlightIndices}
                    specialIndices={currentStepData?.specialIndices}
                />
            );
        }

        // Ultimate fallback
        return (
            <div className="w-full h-[300px] bg-[var(--color-bg-tertiary)] rounded-xl border border-[var(--color-border-primary)] flex items-center justify-center text-[var(--color-text-muted)]">
                <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <div>Visualization loading...</div>
                </div>
            </div>
        );
    };

    if (!algorithm) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[var(--color-bg-secondary)] rounded-2xl p-8 border border-[var(--color-border-primary)] max-w-md"
                >
                    <div className="text-6xl mb-4">🚧</div>
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                        Coming Soon
                    </h2>
                    <p className="text-[var(--color-text-muted)] mb-6">
                        This algorithm visualization is currently under development.
                        Check back soon!
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white 
                     rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back to Home
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-[var(--color-text-muted)] 
                   hover:text-[var(--color-text-primary)] transition-colors mb-4"
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm">Back to Home</span>
                </Link>

                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                            {algorithm.name}
                        </h1>
                        <p className="text-[var(--color-text-secondary)] max-w-2xl">
                            {algorithm.description}
                        </p>
                    </div>

                    {/* Complexity badges */}
                    <div className="flex flex-wrap gap-2">
                        <div className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
                            <span className="text-xs text-[var(--color-text-muted)]">Time: </span>
                            <span className="text-sm font-mono font-bold text-indigo-400">
                                {algorithm.complexity.time.average}
                            </span>
                        </div>
                        <div className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30">
                            <span className="text-xs text-[var(--color-text-muted)]">Space: </span>
                            <span className="text-sm font-mono font-bold text-purple-400">
                                {algorithm.complexity.space}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main content grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left column - Visualization and controls */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Step description */}
                    {currentStepData && (
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-[var(--color-bg-secondary)] rounded-xl p-4 border border-[var(--color-border-primary)]
                       flex items-start gap-3"
                        >
                            <Info size={20} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                            <p className="text-[var(--color-text-primary)]">
                                {currentStepData.description}
                            </p>
                        </motion.div>
                    )}

                    {/* Dynamic Visualizer */}
                    {renderVisualizer()}

                    {/* Animation Controls */}
                    <AnimationControls
                        isPlaying={isPlaying}
                        isPaused={isPaused}
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                        speed={speed}
                        progress={progress}
                        onPlay={play}
                        onPause={pause}
                        onStop={stop}
                        onStepForward={stepForward}
                        onStepBackward={stepBackward}
                        onSpeedChange={(preset: SpeedPreset) => setSpeed(preset)}
                        onSeek={goToStep}
                    />

                    {/* Input controls */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <InputSizeSlider
                            value={inputSize}
                            min={algorithm.minInputSize}
                            max={algorithm.maxInputSize}
                            onChange={handleInputSizeChange}
                            disabled={isPlaying}
                        />
                        {algorithm.supportsCases && (
                            <CaseSelector
                                value={caseType}
                                onChange={handleCaseChange}
                                disabled={isPlaying}
                            />
                        )}
                    </div>
                </div>

                {/* Right column - Pseudocode and metrics */}
                <div className="space-y-6">
                    {/* Pseudocode */}
                    <PseudocodeViewer
                        code={algorithm.pseudocode}
                        currentLine={currentStepData?.pseudocodeLine ?? -1}
                    />

                    {/* Metrics */}
                    <MetricsDisplay
                        metrics={metrics}
                        complexity={algorithm.complexity}
                        currentCase={caseType}
                    />

                    {/* Complexity graph */}
                    <ComplexityGraph
                        currentN={inputSize}
                        currentOperations={metrics.comparisons + metrics.swaps}
                        complexityType={algorithm.complexity.time.average}
                        maxN={algorithm.maxInputSize}
                    />
                </div>
            </div>
        </div>
    );
}
