// Algorithm category types
export type AlgorithmCategory =
    | 'sorting'
    | 'divide-conquer'
    | 'greedy'
    | 'dynamic-programming'
    | 'graphs'
    | 'backtracking'
    | 'string-matching'
    | 'np-completeness';

// Complexity notation
export interface Complexity {
    time: {
        best: string;
        average: string;
        worst: string;
    };
    space: string;
}

// Animation step for visualization
export interface AnimationStep {
    id: number;
    description: string;
    pseudocodeLine: number;
    state: Record<string, unknown>;
    comparisons: number;
    swaps: number;
    memoryUsage: number;
    highlightIndices?: number[];
    specialIndices?: { index: number; type: string }[];
}

// Array element for sorting visualizations
export interface ArrayElement {
    value: number;
    state: 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'selected';
    originalIndex: number;
}

// Graph node for graph visualizations
export interface GraphNode {
    id: string;
    label: string;
    x: number;
    y: number;
    state: 'default' | 'visited' | 'current' | 'processed' | 'path';
}

// Graph edge for graph visualizations
export interface GraphEdge {
    source: string;
    target: string;
    weight?: number;
    state: 'default' | 'visited' | 'current' | 'path' | 'mst';
}

// Algorithm configuration
export interface AlgorithmConfig {
    id: string;
    name: string;
    category: AlgorithmCategory;
    description: string;
    complexity: Complexity;
    pseudocode: string[];
    cCode: string; // C implementation code
    visualizerType: 'array' | 'graph' | 'tree' | 'matrix' | 'custom';
    defaultInputSize: number;
    minInputSize: number;
    maxInputSize: number;
    supportsCases: boolean;
    generateSteps: (input: unknown, size: number, caseType?: 'best' | 'average' | 'worst') => AnimationStep[];
    generateInput: (size: number, caseType?: 'best' | 'average' | 'worst') => unknown;
}

// Animation engine state
export interface AnimationState {
    isPlaying: boolean;
    isPaused: boolean;
    currentStep: number;
    totalSteps: number;
    speed: number; // milliseconds per step
    steps: AnimationStep[];
}

// Metrics for display
export interface Metrics {
    comparisons: number;
    swaps: number;
    memoryUsage: number;
    currentComplexity: string;
}

// Syllabus structure
export interface SyllabusItem {
    id: string;
    title: string;
    algorithms: {
        id: string;
        name: string;
        path: string;
    }[];
}

// Big-O data point for complexity graph
export interface ComplexityDataPoint {
    n: number;
    operations: number;
    theoretical: number;
}
