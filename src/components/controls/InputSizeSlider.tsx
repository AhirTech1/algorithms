interface InputSizeSliderProps {
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
    label?: string;
    disabled?: boolean;
}

export function InputSizeSlider({
    value,
    min,
    max,
    onChange,
    label = 'Array Size (n)',
    disabled = false,
}: InputSizeSliderProps) {
    return (
        <div className="bg-[var(--color-bg-tertiary)] rounded-xl p-4 border border-[var(--color-border-primary)]">
            <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-[var(--color-text-primary)]">
                    {label}
                </label>
                <span className="text-lg font-bold font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg">
                    n = {value}
                </span>
            </div>

            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                disabled={disabled}
                className="w-full h-2 bg-[var(--color-bg-secondary)] rounded-lg appearance-none cursor-pointer
                 disabled:opacity-50 disabled:cursor-not-allowed
                 [&::-webkit-slider-thumb]:appearance-none
                 [&::-webkit-slider-thumb]:w-5
                 [&::-webkit-slider-thumb]:h-5
                 [&::-webkit-slider-thumb]:rounded-full
                 [&::-webkit-slider-thumb]:bg-gradient-to-r
                 [&::-webkit-slider-thumb]:from-indigo-500
                 [&::-webkit-slider-thumb]:to-purple-500
                 [&::-webkit-slider-thumb]:shadow-lg
                 [&::-webkit-slider-thumb]:cursor-pointer
                 [&::-webkit-slider-thumb]:border-2
                 [&::-webkit-slider-thumb]:border-white
                 [&::-moz-range-thumb]:w-5
                 [&::-moz-range-thumb]:h-5
                 [&::-moz-range-thumb]:rounded-full
                 [&::-moz-range-thumb]:bg-gradient-to-r
                 [&::-moz-range-thumb]:from-indigo-500
                 [&::-moz-range-thumb]:to-purple-500
                 [&::-moz-range-thumb]:shadow-lg
                 [&::-moz-range-thumb]:cursor-pointer
                 [&::-moz-range-thumb]:border-2
                 [&::-moz-range-thumb]:border-white"
            />

            <div className="flex justify-between text-xs text-[var(--color-text-muted)] mt-2">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );
}
