import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimationEngine, SPEED_PRESETS, type SpeedPreset } from './AnimationEngine';
import type { AnimationStep, AnimationState, Metrics } from '../types/algorithm';

interface UseAnimationOptions {
    autoPlay?: boolean;
    initialSpeed?: SpeedPreset;
}

interface UseAnimationReturn {
    // State
    currentStep: number;
    totalSteps: number;
    isPlaying: boolean;
    isPaused: boolean;
    speed: number;
    currentStepData: AnimationStep | null;
    metrics: Metrics;
    progress: number;

    // Controls
    play: () => void;
    pause: () => void;
    stop: () => void;
    stepForward: () => void;
    stepBackward: () => void;
    goToStep: (step: number) => void;
    setSpeed: (speed: SpeedPreset) => void;
    loadSteps: (steps: AnimationStep[]) => void;
}

export function useAnimation(options: UseAnimationOptions = {}): UseAnimationReturn {
    const { autoPlay = false, initialSpeed = '1x' } = options;

    const [state, setState] = useState<AnimationState>({
        isPlaying: false,
        isPaused: false,
        currentStep: 0,
        totalSteps: 0,
        speed: SPEED_PRESETS[initialSpeed],
        steps: [],
    });

    const engineRef = useRef<AnimationEngine | null>(null);

    useEffect(() => {
        engineRef.current = new AnimationEngine((newState) => {
            setState({ ...newState });
        });

        return () => {
            engineRef.current?.destroy();
        };
    }, []);

    const loadSteps = useCallback((steps: AnimationStep[]) => {
        engineRef.current?.loadSteps(steps);
        if (autoPlay && steps.length > 0) {
            setTimeout(() => engineRef.current?.play(), 100);
        }
    }, [autoPlay]);

    const play = useCallback(() => {
        engineRef.current?.play();
    }, []);

    const pause = useCallback(() => {
        engineRef.current?.pause();
    }, []);

    const stop = useCallback(() => {
        engineRef.current?.stop();
    }, []);

    const stepForward = useCallback(() => {
        engineRef.current?.stepForward();
    }, []);

    const stepBackward = useCallback(() => {
        engineRef.current?.stepBackward();
    }, []);

    const goToStep = useCallback((step: number) => {
        engineRef.current?.goToStep(step);
    }, []);

    const setSpeed = useCallback((speedPreset: SpeedPreset) => {
        engineRef.current?.setSpeed(SPEED_PRESETS[speedPreset]);
    }, []);

    const currentStepData = state.steps[state.currentStep] || null;

    const metrics: Metrics = {
        comparisons: currentStepData?.comparisons || 0,
        swaps: currentStepData?.swaps || 0,
        memoryUsage: currentStepData?.memoryUsage || 0,
        currentComplexity: '',
    };

    const progress = state.totalSteps > 0
        ? (state.currentStep / (state.totalSteps - 1)) * 100
        : 0;

    return {
        currentStep: state.currentStep,
        totalSteps: state.totalSteps,
        isPlaying: state.isPlaying,
        isPaused: state.isPaused,
        speed: state.speed,
        currentStepData,
        metrics,
        progress,
        play,
        pause,
        stop,
        stepForward,
        stepBackward,
        goToStep,
        setSpeed,
        loadSteps,
    };
}

// Keyboard shortcuts hook
export function useAnimationKeyboard(
    play: () => void,
    pause: () => void,
    isPlaying: boolean,
    stepForward: () => void,
    stepBackward: () => void,
    stop: () => void
) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger if user is typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            switch (e.key) {
                case ' ':
                    e.preventDefault();
                    isPlaying ? pause() : play();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    stepForward();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    stepBackward();
                    break;
                case 'Escape':
                    e.preventDefault();
                    stop();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [play, pause, isPlaying, stepForward, stepBackward, stop]);
}
