'use client';
import { Bookmark, Plus, Hash, Trash2, Sun, Moon, ChevronRight } from 'lucide-react';
import { Category } from '@/lib/api';
import { useTheme } from './ThemeProvider';
import clsx from 'clsx';

interface Props {
    categories: Category[];
    selected: number | null;
    onSelect: (id: number | null) => void;
    onAddCategory: () => void;
    onDeleteCategory: (id: number) => void;
}

export default function Sidebar({ categories, selected, onSelect, onAddCategory, onDeleteCategory }: Props) {
    const { theme, toggle } = useTheme();

    return (
        <aside className="w-64 h-screen flex flex-col border-r border-[var(--border)] bg-[var(--surface)] shrink-0">
            {/* Logo */}
            <div className="px-5 py-5 border-b border-[var(--border)]">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-600/20">
                        <Bookmark size={16} className="text-white" />
                    </div>
                    <span className="font-semibold text-[15px] text-[var(--foreground)]">Bookmarks</span>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {/* All */}
                <button
                    onClick={() => onSelect(null)}
                    className={clsx(
                        'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                        selected === null
                            ? 'bg-primary-600/10 text-primary-500 dark:text-primary-400'
                            : 'text-[var(--muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)]'
                    )}
                >
                    <Hash size={15} />
                    <span>All Bookmarks</span>
                    {selected === null && <ChevronRight size={12} className="ml-auto opacity-50" />}
                </button>

                {/* Categories */}
                <div className="pt-2">
                    <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--muted)] opacity-60">
                        Categories
                    </p>
                    {categories.map((cat) => (
                            <div key={cat.id} className="group flex items-center">
                                <button
                                    onClick={() => onSelect(cat.id)}
                                    className={clsx(
                                        'flex-1 flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                                        selected === cat.id
                                            ? 'text-[var(--foreground)]'
                                            : 'text-[var(--muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)]'
                                    )}
                                    style={selected === cat.id ? { backgroundColor: cat.color + '18' } : {}}
                                >
                                    <div
                                        className="w-6 h-6 rounded-md flex items-center justify-center text-sm shrink-0"
                                        style={{ backgroundColor: cat.color + '25' }}
                                    >
                                        {cat.icon}
                                    </div>
                                    <span className="truncate">{cat.name}</span>
                                    {selected === cat.id && <ChevronRight size={12} className="ml-auto opacity-40" />}
                                </button>
                                <button
                                    onClick={() => onDeleteCategory(cat.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 mr-1 rounded text-[var(--muted)] hover:text-red-500 transition-all duration-150"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                    ))}
                </div>

                {/* Add Category Button */}
                <button
                    onClick={onAddCategory}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)] transition-all duration-150 mt-1 border border-dashed border-[var(--border)]"
                >
                    <Plus size={14} />
                    <span>Add Category</span>
                </button>
            </nav>

            {/* Footer */}
            <div className="px-3 py-4 border-t border-[var(--border)] flex items-center justify-between">
                <button
                    onClick={toggle}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)] transition-all"
                >
                    {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                    <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
                </button>
            </div>
        </aside>
    );
}
