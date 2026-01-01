import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ComplexityGraphProps {
    currentN: number;
    currentOperations: number;
    complexityType: string; // e.g., "O(n²)", "O(n log n)"
    maxN?: number;
}

// Complexity functions
const complexityFunctions: Record<string, (n: number) => number> = {
    'O(1)': () => 1,
    'O(log n)': (n) => Math.log2(n),
    'O(n)': (n) => n,
    'O(n log n)': (n) => n * Math.log2(n),
    'O(n²)': (n) => n * n,
    'O(n³)': (n) => n * n * n,
    'O(2^n)': (n) => Math.pow(2, Math.min(n, 20)),
};

export function ComplexityGraph({
    currentN,
    currentOperations,
    complexityType,
    maxN = 50,
}: ComplexityGraphProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!svgRef.current || !containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = 200;
        const margin = { top: 20, right: 20, bottom: 40, left: 50 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Clear previous content
        d3.select(svgRef.current).selectAll('*').remove();

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Generate data points
        const theoreticalFn = complexityFunctions[complexityType] || complexityFunctions['O(n)'];
        const dataPoints = Array.from({ length: maxN }, (_, i) => ({
            n: i + 1,
            theoretical: theoreticalFn(i + 1),
        }));

        // Scales
        const xScale = d3.scaleLinear()
            .domain([1, maxN])
            .range([0, innerWidth]);

        const maxTheoretical = d3.max(dataPoints, d => d.theoretical) || 1;
        const yMax = Math.max(maxTheoretical, currentOperations) * 1.1;

        const yScale = d3.scaleLinear()
            .domain([0, yMax])
            .range([innerHeight, 0]);

        // Grid lines
        g.append('g')
            .attr('class', 'grid')
            .selectAll('line')
            .data(yScale.ticks(5))
            .enter()
            .append('line')
            .attr('x1', 0)
            .attr('x2', innerWidth)
            .attr('y1', d => yScale(d))
            .attr('y2', d => yScale(d))
            .attr('stroke', 'var(--color-border-primary)')
            .attr('stroke-dasharray', '2,2')
            .attr('opacity', 0.5);

        // Theoretical complexity line
        const line = d3.line<{ n: number; theoretical: number }>()
            .x(d => xScale(d.n))
            .y(d => yScale(d.theoretical))
            .curve(d3.curveMonotoneX);

        g.append('path')
            .datum(dataPoints)
            .attr('fill', 'none')
            .attr('stroke', 'url(#lineGradient)')
            .attr('stroke-width', 2)
            .attr('d', line);

        // Gradient definition
        const gradient = svg.append('defs')
            .append('linearGradient')
            .attr('id', 'lineGradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '0%');

        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#6366f1');

        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#8b5cf6');

        // Current point
        if (currentN > 0 && currentOperations > 0) {
            g.append('circle')
                .attr('cx', xScale(currentN))
                .attr('cy', yScale(currentOperations))
                .attr('r', 6)
                .attr('fill', '#10b981')
                .attr('stroke', 'white')
                .attr('stroke-width', 2)
                .style('filter', 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.5))');

            // Vertical line to current point
            g.append('line')
                .attr('x1', xScale(currentN))
                .attr('x2', xScale(currentN))
                .attr('y1', innerHeight)
                .attr('y2', yScale(currentOperations))
                .attr('stroke', '#10b981')
                .attr('stroke-width', 1)
                .attr('stroke-dasharray', '4,4')
                .attr('opacity', 0.5);
        }

        // X axis
        g.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale).ticks(5).tickFormat(d => `n=${d}`))
            .attr('color', 'var(--color-text-muted)')
            .attr('font-size', '10px');

        // Y axis
        g.append('g')
            .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => d3.format('.0f')(d as number)))
            .attr('color', 'var(--color-text-muted)')
            .attr('font-size', '10px');

        // Labels
        g.append('text')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight + 35)
            .attr('text-anchor', 'middle')
            .attr('fill', 'var(--color-text-muted)')
            .attr('font-size', '11px')
            .text('Input Size (n)');

        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -40)
            .attr('x', -innerHeight / 2)
            .attr('text-anchor', 'middle')
            .attr('fill', 'var(--color-text-muted)')
            .attr('font-size', '11px')
            .text('Operations');

    }, [currentN, currentOperations, complexityType, maxN]);

    return (
        <div className="bg-[var(--color-bg-tertiary)] rounded-xl border border-[var(--color-border-primary)] overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Complexity Graph</h3>
                <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
                    {complexityType}
                </span>
            </div>

            {/* Graph */}
            <div ref={containerRef} className="p-4">
                <svg ref={svgRef} className="w-full" />
            </div>

            {/* Legend */}
            <div className="px-4 pb-4 flex items-center justify-center gap-6 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500" />
                    <span className="text-[var(--color-text-muted)]">Theoretical</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-[var(--color-text-muted)]">Current</span>
                </div>
            </div>
        </div>
    );
}
