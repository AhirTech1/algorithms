import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Menu, X, Home, BookOpen } from 'lucide-react';
import { syllabus, categoryIcons } from '../../config/syllabus';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const [expandedCategories, setExpandedCategories] = useState<string[]>(['sorting']);
    const [isDesktop, setIsDesktop] = useState(false);
    const location = useLocation();

    // Check if we're on desktop
    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const isActive = (path: string) => location.pathname === path;

    // On desktop, sidebar is always visible. On mobile, it slides in/out
    const sidebarX = isDesktop ? 0 : (isOpen ? 0 : -280);

    return (
        <>
            {/* Mobile overlay */}
            <AnimatePresence>
                {isOpen && !isDesktop && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ x: sidebarX }}
                transition={{ type: 'tween', duration: 0.2 }}
                className="fixed left-0 top-0 h-full w-[280px] bg-[var(--color-bg-secondary)] border-r border-[var(--color-border-primary)] z-50 flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--color-border-primary)]">
                    <Link to="/" className="flex items-center gap-3 group" onClick={onClose}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/25 transition-shadow">
                            <BookOpen size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-[var(--color-text-primary)] text-lg leading-tight">AlgoViz</h1>
                            <p className="text-xs text-[var(--color-text-muted)]">BTCO13403</p>
                        </div>
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Home link */}
                <Link
                    to="/"
                    onClick={onClose}
                    className={`flex items-center gap-3 mx-3 mt-4 px-3 py-2.5 rounded-lg transition-all ${isActive('/')
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]'
                        }`}
                >
                    <Home size={18} />
                    <span className="font-medium">Home</span>
                </Link>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
                    {syllabus.map((category) => (
                        <div key={category.id} className="mb-2">
                            {/* Category header */}
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-all group"
                            >
                                <span className="text-lg">{categoryIcons[category.id]}</span>
                                <span className="flex-1 text-left font-medium text-sm">{category.title}</span>
                                <motion.div
                                    animate={{ rotate: expandedCategories.includes(category.id) ? 90 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronRight size={16} className="text-[var(--color-text-muted)]" />
                                </motion.div>
                            </button>

                            {/* Category items */}
                            <AnimatePresence>
                                {expandedCategories.includes(category.id) && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="ml-4 mt-1 space-y-0.5 border-l border-[var(--color-border-primary)] pl-3">
                                            {category.algorithms.map((algo) => (
                                                <Link
                                                    key={algo.id}
                                                    to={algo.path}
                                                    onClick={onClose}
                                                    className={`block px-3 py-2 rounded-lg text-sm transition-all ${isActive(algo.path)
                                                            ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                                                            : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]'
                                                        }`}
                                                >
                                                    {algo.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-[var(--color-border-primary)]">
                    <div className="text-xs text-[var(--color-text-muted)] text-center">
                        Design & Analysis of Algorithms
                    </div>
                </div>
            </motion.aside>
        </>
    );
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="lg:hidden fixed top-4 left-4 z-30 p-2.5 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors shadow-lg"
        >
            <Menu size={22} />
        </button>
    );
}
