import { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';

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

interface GraphVisualizerProps {
    nodes: GraphNode[];
    edges: GraphEdge[];
    directed?: boolean;
    weighted?: boolean;
    currentNode?: string;
    queueOrStack?: string[];
    showQueueStack?: boolean;
    queueStackLabel?: string;
}

const nodeColors: Record<GraphNode['state'], string> = {
    default: '#6366f1',
    visited: '#8b5cf6',
    current: '#f59e0b',
    processed: '#10b981',
    path: '#ec4899',
};

const edgeColors: Record<GraphEdge['state'], string> = {
    default: '#3f3f46',
    visited: '#8b5cf6',
    current: '#f59e0b',
    path: '#ec4899',
    mst: '#10b981',
};

export function GraphVisualizer({
    nodes,
    edges,
    directed = false,
    currentNode,
    queueOrStack = [],
    showQueueStack = true,
    queueStackLabel = 'Queue/Stack',
}: GraphVisualizerProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Calculate node positions in a circle layout
    const nodePositions = useMemo(() => {
        const positions: Record<string, { x: number; y: number }> = {};
        const centerX = 200;
        const centerY = 150;
        const radius = 100;

        nodes.forEach((node, i) => {
            const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
            positions[node.id] = {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle),
            };
        });

        return positions;
    }, [nodes]);

    useEffect(() => {
        if (!svgRef.current || !containerRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const width = containerRef.current.clientWidth;
        const height = 300;
        const scaleX = width / 400;
        const scaleY = height / 300;

        svg.attr('width', width).attr('height', height);

        // Arrow marker for directed graphs
        if (directed) {
            svg.append('defs').append('marker')
                .attr('id', 'arrowhead')
                .attr('viewBox', '-0 -5 10 10')
                .attr('refX', 25)
                .attr('refY', 0)
                .attr('orient', 'auto')
                .attr('markerWidth', 6)
                .attr('markerHeight', 6)
                .append('path')
                .attr('d', 'M 0,-5 L 10,0 L 0,5')
                .attr('fill', '#6366f1');
        }

        // Draw edges
        edges.forEach((edge) => {
            const source = nodePositions[edge.source];
            const target = nodePositions[edge.target];
            if (!source || !target) return;

            const line = svg.append('line')
                .attr('x1', source.x * scaleX)
                .attr('y1', source.y * scaleY)
                .attr('x2', target.x * scaleX)
                .attr('y2', target.y * scaleY)
                .attr('stroke', edgeColors[edge.state])
                .attr('stroke-width', edge.state === 'current' ? 3 : 2)
                .attr('opacity', edge.state === 'default' ? 0.5 : 1);

            if (directed) {
                line.attr('marker-end', 'url(#arrowhead)');
            }

            // Weight label
            if (edge.weight !== undefined) {
                const midX = (source.x + target.x) / 2 * scaleX;
                const midY = (source.y + target.y) / 2 * scaleY;
                svg.append('text')
                    .attr('x', midX)
                    .attr('y', midY - 5)
                    .attr('text-anchor', 'middle')
                    .attr('fill', 'var(--color-text-muted)')
                    .attr('font-size', '10px')
                    .text(edge.weight);
            }
        });

        // Draw nodes
        nodes.forEach((node) => {
            const pos = nodePositions[node.id];
            if (!pos) return;

            const x = pos.x * scaleX;
            const y = pos.y * scaleY;

            // Node circle
            svg.append('circle')
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', 20)
                .attr('fill', nodeColors[node.state])
                .attr('stroke', node.id === currentNode ? '#fff' : 'transparent')
                .attr('stroke-width', 3)
                .style('filter', node.state !== 'default' ? 'drop-shadow(0 0 8px ' + nodeColors[node.state] + ')' : 'none');

            // Node label
            svg.append('text')
                .attr('x', x)
                .attr('y', y + 4)
                .attr('text-anchor', 'middle')
                .attr('fill', 'white')
                .attr('font-size', '12px')
                .attr('font-weight', 'bold')
                .text(node.label);
        });
    }, [nodes, edges, nodePositions, directed, currentNode]);

    return (
        <div className="bg-[var(--color-bg-tertiary)] rounded-xl border border-[var(--color-border-primary)] overflow-hidden">
            {/* Graph canvas */}
            <div ref={containerRef} className="p-4">
                <svg ref={svgRef} className="w-full" />
            </div>

            {/* Queue/Stack display */}
            {showQueueStack && queueOrStack.length > 0 && (
                <div className="px-4 pb-4">
                    <div className="bg-[var(--color-bg-secondary)] rounded-lg p-3 border border-[var(--color-border-primary)]">
                        <div className="text-xs text-[var(--color-text-muted)] mb-2">{queueStackLabel}</div>
                        <div className="flex gap-2 flex-wrap">
                            {queueOrStack.map((item, i) => (
                                <motion.div
                                    key={`${item}-${i}`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 
                           flex items-center justify-center text-sm font-bold text-indigo-400"
                                >
                                    {item}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="px-4 pb-4 flex flex-wrap justify-center gap-4 border-t border-[var(--color-border-primary)] pt-4">
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
