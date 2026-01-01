import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    BookOpen,
    PlayCircle,
    Clock,
    TrendingUp,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import { syllabus, categoryIcons, categoryColors, categoryDescriptions } from '../config/syllabus';

export function Home() {
    const totalAlgorithms = syllabus.reduce((acc, cat) => acc + cat.algorithms.length, 0);

    return (
        <div>
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 md:p-12 mb-8"
            >
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
                        <BookOpen size={18} />
                        <span>BTCO13403</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                        Design & Analysis of
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
                            Algorithms
                        </span>
                    </h1>

                    <p className="text-white/80 text-lg max-w-2xl mb-8">
                        Master algorithms through interactive visualizations. Watch each step unfold,
                        understand time & space complexity visually, and learn by doing.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            to="/algorithm/bubble-sort"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 
                       rounded-xl font-semibold hover:bg-white/90 transition-colors shadow-lg"
                        >
                            <PlayCircle size={20} />
                            Start Learning
                        </Link>
                        <a
                            href="#categories"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 
                       text-white rounded-xl font-semibold hover:bg-white/30 
                       transition-colors backdrop-blur-sm"
                        >
                            View All Algorithms
                            <ChevronRight size={18} />
                        </a>
                    </div>
                </div>

                {/* Floating elements */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2"
                >
                    <div className="w-64 h-48 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4">
                        <div className="flex gap-2 mb-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-3 h-3 rounded-full bg-white/30" />
                            ))}
                        </div>
                        <div className="flex items-end gap-1 h-28">
                            {[40, 70, 35, 90, 55, 85, 45].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    className="flex-1 rounded-t bg-gradient-to-t from-white/60 to-white/90"
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {[
                    { icon: BookOpen, label: 'Categories', value: syllabus.length, color: 'text-indigo-400' },
                    { icon: PlayCircle, label: 'Algorithms', value: totalAlgorithms, color: 'text-purple-400' },
                    { icon: Clock, label: 'Interactive', value: '100%', color: 'text-pink-400' },
                    { icon: TrendingUp, label: 'Visualized', value: '100%', color: 'text-emerald-400' },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="bg-[var(--color-bg-secondary)] rounded-xl p-5 border border-[var(--color-border-primary)]
                     hover:border-[var(--color-border-secondary)] transition-colors"
                    >
                        <stat.icon size={24} className={stat.color} />
                        <div className="mt-3">
                            <div className="text-2xl font-bold text-[var(--color-text-primary)]">{stat.value}</div>
                            <div className="text-sm text-[var(--color-text-muted)]">{stat.label}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Categories */}
            <div id="categories" className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="text-indigo-400" size={24} />
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                        Algorithm Categories
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {syllabus.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                            className="group bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border-primary)]
                       hover:border-[var(--color-border-secondary)] transition-all hover:shadow-lg 
                       hover:shadow-indigo-500/5 overflow-hidden"
                        >
                            {/* Category header */}
                            <div className={`p-5 bg-gradient-to-r ${categoryColors[category.id]} bg-opacity-20`}>
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{categoryIcons[category.id]}</span>
                                    <div>
                                        <h3 className="font-bold text-[var(--color-text-primary)]">{category.title}</h3>
                                        <p className="text-xs text-[var(--color-text-muted)]">
                                            {category.algorithms.length} algorithms
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="px-5 py-3 border-b border-[var(--color-border-primary)]">
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                    {categoryDescriptions[category.id]}
                                </p>
                            </div>

                            {/* Algorithm list */}
                            <div className="p-3">
                                <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                                    {category.algorithms.map((algo) => (
                                        <Link
                                            key={algo.id}
                                            to={algo.path}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                               text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]
                               hover:bg-[var(--color-bg-hover)] transition-colors"
                                        >
                                            <ChevronRight size={14} className="opacity-50 flex-shrink-0" />
                                            <span className="truncate">{algo.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Quick Tips */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-[var(--color-bg-secondary)] rounded-xl p-6 border border-[var(--color-border-primary)]"
            >
                <h3 className="font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                    💡 Quick Tips
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-[var(--color-text-secondary)]">
                    <div className="flex gap-3">
                        <span className="text-2xl">⌨️</span>
                        <div>
                            <strong className="text-[var(--color-text-primary)]">Keyboard Shortcuts</strong>
                            <p className="mt-1">Space to play/pause, arrow keys to step through</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <span className="text-2xl">🎚️</span>
                        <div>
                            <strong className="text-[var(--color-text-primary)]">Adjust Speed</strong>
                            <p className="mt-1">Slow down to 0.25x or speed up to 4x</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <span className="text-2xl">📊</span>
                        <div>
                            <strong className="text-[var(--color-text-primary)]">Watch Metrics</strong>
                            <p className="mt-1">Track comparisons and swaps in real-time</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
