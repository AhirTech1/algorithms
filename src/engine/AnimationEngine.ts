import type { AnimationStep, AnimationState } from '../types/algorithm';

export class AnimationEngine {
    private state: AnimationState;
    private onUpdate: (state: AnimationState) => void;
    private intervalId: number | null = null;

    constructor(onUpdate: (state: AnimationState) => void) {
        this.state = {
            isPlaying: false,
            isPaused: false,
            currentStep: 0,
            totalSteps: 0,
            speed: 500, // ms per step
            steps: [],
        };
        this.onUpdate = onUpdate;
    }

    loadSteps(steps: AnimationStep[]): void {
        this.stop();
        this.state = {
            ...this.state,
            steps,
            totalSteps: steps.length,
            currentStep: 0,
            isPlaying: false,
            isPaused: false,
        };
        this.onUpdate(this.state);
    }

    play(): void {
        if (this.state.steps.length === 0) return;
        if (this.state.currentStep >= this.state.totalSteps - 1) {
            this.state.currentStep = 0;
        }

        this.state.isPlaying = true;
        this.state.isPaused = false;
        this.onUpdate(this.state);

        this.intervalId = window.setInterval(() => {
            if (this.state.currentStep < this.state.totalSteps - 1) {
                this.state.currentStep++;
                this.onUpdate(this.state);
            } else {
                this.pause();
            }
        }, this.state.speed);
    }

    pause(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.state.isPlaying = false;
        this.state.isPaused = true;
        this.onUpdate(this.state);
    }

    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.state.isPlaying = false;
        this.state.isPaused = false;
        this.state.currentStep = 0;
        this.onUpdate(this.state);
    }

    stepForward(): void {
        if (this.state.currentStep < this.state.totalSteps - 1) {
            this.pause();
            this.state.currentStep++;
            this.onUpdate(this.state);
        }
    }

    stepBackward(): void {
        if (this.state.currentStep > 0) {
            this.pause();
            this.state.currentStep--;
            this.onUpdate(this.state);
        }
    }

    goToStep(step: number): void {
        if (step >= 0 && step < this.state.totalSteps) {
            this.pause();
            this.state.currentStep = step;
            this.onUpdate(this.state);
        }
    }

    setSpeed(speed: number): void {
        this.state.speed = speed;
        if (this.state.isPlaying) {
            this.pause();
            this.play();
        }
        this.onUpdate(this.state);
    }

    getCurrentStep(): AnimationStep | null {
        return this.state.steps[this.state.currentStep] || null;
    }

    getState(): AnimationState {
        return { ...this.state };
    }

    destroy(): void {
        this.stop();
    }
}

// Speed presets in milliseconds
export const SPEED_PRESETS = {
    '0.25x': 2000,
    '0.5x': 1000,
    '1x': 500,
    '2x': 250,
    '4x': 125,
} as const;

export type SpeedPreset = keyof typeof SPEED_PRESETS;
