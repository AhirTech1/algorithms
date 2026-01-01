import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Info } from 'lucide-react';
import { useAnimation, useAnimationKeyboard, type SpeedPreset } from '../engine';
import { ArrayVisualizer } from '../components/visualization';
import { AnimationControls, InputSizeSlider } from '../components/controls';
import { PseudocodeViewer, CaseSelector } from '../components/common';
import { MetricsDisplay, ComplexityGraph } from '../components/complexity';
import { algorithmRegistry } from '../algorithms';
import type { ArrayElement } from '../types/algorithm';

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

    // Generate new input when size or case changes
    const regenerateInput = useCallback(() => {
        if (!algorithm) return;

        const input = algorithm.generateInput(inputSize, caseType);
        const steps = algorithm.generateSteps(input, inputSize, caseType);
        loadSteps(steps);

        // Set initial array state
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

                    {/* Array Visualizer */}
                    <ArrayVisualizer
                        array={arrayState}
                        showIndices={true}
                        showValues={true}
                        height={300}
                        highlightIndices={currentStepData?.highlightIndices}
                        specialIndices={currentStepData?.specialIndices}
                    />

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
