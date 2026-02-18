import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Square } from 'lucide-react';
import { SPEED_PRESETS, type SpeedPreset } from '../../engine';

interface AnimationControlsProps {
    isPlaying: boolean;
    isPaused: boolean;
    currentStep: number;
    totalSteps: number;
    speed: number;
    progress: number;
    onPlay: () => void;
    onPause: () => void;
    onStop: () => void;
    onStepForward: () => void;
    onStepBackward: () => void;
    onSpeedChange: (speed: SpeedPreset) => void;
    onSeek: (step: number) => void;
}

export function AnimationControls({
    isPlaying,
    currentStep,
    totalSteps,
    speed,
    progress,
    onPlay,
    onPause,
    onStop,
    onStepForward,
    onStepBackward,
    onSpeedChange,
    onSeek,
}: AnimationControlsProps) {
    const currentSpeedPreset = Object.entries(SPEED_PRESETS).find(
        ([, value]) => value === speed
    )?.[0] as SpeedPreset || '1x';

    return (
        <div className="bg-[var(--color-bg-tertiary)] rounded-xl p-4 border border-[var(--color-border-primary)]">
            {/* Progress bar */}
            <div className="mb-4">
                <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-2">
                    <span>Step {currentStep + 1} of {totalSteps}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="relative h-2 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
                    <motion.div
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.2 }}
                    />
                    {/* Clickable seek area */}
                    <input
                        type="range"
                        min={0}
                        max={Math.max(totalSteps - 1, 0)}
                        value={currentStep}
                        onChange={(e) => onSeek(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-center gap-2">
                {/* Reset */}
                <button
                    onClick={onStop}
                    className="p-2.5 rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]
                   hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]
                   transition-colors disabled:opacity-50"
                    title="Reset (Esc)"
                >
                    <RotateCcw size={18} />
                </button>

                {/* Step backward */}
                <button
                    onClick={onStepBackward}
                    disabled={currentStep === 0}
                    className="p-2.5 rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]
                   hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Step Back (←)"
                >
                    <SkipBack size={18} />
                </button>

                {/* Play/Pause */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={isPlaying ? onPause : onPlay}
                    className="p-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 
                   text-white shadow-lg hover:shadow-indigo-500/25 transition-shadow"
                    title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
                </motion.button>

                {/* Step forward */}
                <button
                    onClick={onStepForward}
                    disabled={currentStep >= totalSteps - 1}
                    className="p-2.5 rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]
                   hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Step Forward (→)"
                >
                    <SkipForward size={18} />
                </button>

                {/* Stop */}
                <button
                    onClick={onStop}
                    className="p-2.5 rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]
                   hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]
                   transition-colors"
                    title="Stop"
                >
                    <Square size={18} />
                </button>
            </div>

            {/* Speed control */}
            <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-[var(--color-border-primary)]">
                <span className="text-xs text-[var(--color-text-muted)] mr-2">Speed:</span>
                {(Object.keys(SPEED_PRESETS) as SpeedPreset[]).map((preset) => (
                    <button
                        key={preset}
                        onClick={() => onSpeedChange(preset)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                      ${currentSpeedPreset === preset
                                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                                : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                            }`}
                    >
                        {preset}
                    </button>
                ))}
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="text-center mt-3 text-[10px] text-[var(--color-text-muted)]">
                Space: Play/Pause • ←→: Step • Esc: Reset
            </div>
        </div>
    );
}
