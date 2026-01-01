interface CaseSelectorProps {
    value: 'best' | 'average' | 'worst';
    onChange: (value: 'best' | 'average' | 'worst') => void;
    disabled?: boolean;
}

const cases = [
    { id: 'best', label: 'Best', description: 'Already sorted', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { id: 'average', label: 'Average', description: 'Random order', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { id: 'worst', label: 'Worst', description: 'Reverse sorted', color: 'text-red-400 bg-red-500/10 border-red-500/30' },
] as const;

export function CaseSelector({ value, onChange, disabled = false }: CaseSelectorProps) {
    return (
        <div className="bg-[var(--color-bg-tertiary)] rounded-xl p-4 border border-[var(--color-border-primary)]">
            <label className="text-sm font-medium text-[var(--color-text-primary)] block mb-3">
                Input Case
            </label>

            <div className="grid grid-cols-3 gap-2">
                {cases.map((caseOption) => (
                    <button
                        key={caseOption.id}
                        onClick={() => onChange(caseOption.id)}
                        disabled={disabled}
                        className={`p-3 rounded-lg border transition-all text-center disabled:opacity-50
                      ${value === caseOption.id
                                ? caseOption.color + ' border'
                                : 'bg-[var(--color-bg-secondary)] border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                            }`}
                    >
                        <div className="text-sm font-medium">{caseOption.label}</div>
                        <div className="text-[10px] opacity-70 mt-0.5">{caseOption.description}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}
