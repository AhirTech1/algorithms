import React from 'react';
import { motion } from 'framer-motion';

interface TreeNode {
    id: string;
    label: string;
    value?: number;
    left?: TreeNode;
    right?: TreeNode;
    state: 'default' | 'active' | 'merged' | 'highlight';
}

interface TreeVisualizerProps {
    root: TreeNode | null;
    title?: string;
    encoding?: Record<string, string>;  // For Huffman coding
}

export function TreeVisualizer({ root, title, encoding }: TreeVisualizerProps) {
    if (!root) {
        return (
            <div className="w-full bg-[var(--color-bg-tertiary)] rounded-xl p-6 border border-[var(--color-border-primary)] text-center text-[var(--color-text-muted)]">
                No tree data available
            </div>
        );
    }

    // Calculate tree dimensions
    const getDepth = (node: TreeNode | null | undefined): number => {
        if (!node) return 0;
        return 1 + Math.max(getDepth(node.left), getDepth(node.right));
    };

    const depth = getDepth(root);
    const width = Math.pow(2, depth) * 50;
    const height = depth * 80;

    const nodeColors = {
        default: '#6366f1',
        active: '#f59e0b',
        merged: '#10b981',
        highlight: '#ec4899',
    };

    // Render node recursively
    const renderNode = (
        node: TreeNode | null | undefined,
        x: number,
        y: number,
        spread: number,
        level: number
    ): React.ReactNode => {
        if (!node) return null;

        const leftChild = node.left ? renderNode(node.left, x - spread, y + 70, spread / 2, level + 1) : null;
        const rightChild = node.right ? renderNode(node.right, x + spread, y + 70, spread / 2, level + 1) : null;

        return (
            <g key={node.id}>
                {/* Lines to children */}
                {node.left && (
                    <motion.line
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: level * 0.1 }}
                        x1={x}
                        y1={y + 15}
                        x2={x - spread}
                        y2={y + 70 - 15}
                        stroke="var(--color-border-primary)"
                        strokeWidth={2}
                    />
                )}
                {node.right && (
                    <motion.line
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: level * 0.1 }}
                        x1={x}
                        y1={y + 15}
                        x2={x + spread}
                        y2={y + 70 - 15}
                        stroke="var(--color-border-primary)"
                        strokeWidth={2}
                    />
                )}

                {/* Edge labels (0 for left, 1 for right) */}
                {node.left && (
                    <text
                        x={x - spread / 2 - 8}
                        y={y + 40}
                        fill="var(--color-text-muted)"
                        fontSize="10"
                    >
                        0
                    </text>
                )}
                {node.right && (
                    <text
                        x={x + spread / 2 + 4}
                        y={y + 40}
                        fill="var(--color-text-muted)"
                        fontSize="10"
                    >
                        1
                    </text>
                )}

                {leftChild}
                {rightChild}

                {/* Node circle */}
                <motion.circle
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: level * 0.1, type: 'spring' }}
                    cx={x}
                    cy={y}
                    r={18}
                    fill={nodeColors[node.state]}
                    style={{
                        filter: node.state !== 'default' ? `drop-shadow(0 0 8px ${nodeColors[node.state]})` : 'none'
                    }}
                />

                {/* Node label */}
                <text
                    x={x}
                    y={y + 4}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                >
                    {node.label}
                </text>

                {/* Value below (if exists) */}
                {node.value !== undefined && (
                    <text
                        x={x}
                        y={y + 32}
                        textAnchor="middle"
                        fill="var(--color-text-muted)"
                        fontSize="9"
                    >
                        {node.value}
                    </text>
                )}
            </g>
        );
    };

    return (
        <div className="w-full bg-[var(--color-bg-tertiary)] rounded-xl p-6 border border-[var(--color-border-primary)]">
            {title && (
                <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-4 text-center">
                    {title}
                </h3>
            )}

            {/* Tree SVG */}
            <div className="overflow-x-auto">
                <svg
                    width={Math.max(width, 300)}
                    height={Math.max(height + 40, 150)}
                    className="mx-auto"
                >
                    {renderNode(root, width / 2, 30, width / 4, 0)}
                </svg>
            </div>

            {/* Encoding table for Huffman */}
            {encoding && Object.keys(encoding).length > 0 && (
                <div className="mt-4 pt-4 border-t border-[var(--color-border-primary)]">
                    <h4 className="text-xs text-[var(--color-text-muted)] mb-2 text-center">Encoding Table</h4>
                    <div className="flex flex-wrap justify-center gap-2">
                        {Object.entries(encoding).map(([char, code]) => (
                            <div
                                key={char}
                                className="px-2 py-1 bg-[var(--color-bg-secondary)] rounded border border-[var(--color-border-primary)]"
                            >
                                <span className="text-indigo-400 font-bold">{char}</span>
                                <span className="text-[var(--color-text-muted)]"> → </span>
                                <span className="font-mono text-emerald-400">{code}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-[var(--color-border-primary)]">
                {Object.entries(nodeColors).map(([state, color]) => (
                    <div key={state} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-xs text-[var(--color-text-muted)] capitalize">{state}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
