'use client';
import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Search, Bookmark, X } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import BookmarkCard from '@/components/BookmarkCard';
import AddBookmarkModal from '@/components/AddBookmarkModal';
import AddCategoryModal from '@/components/AddCategoryModal';
import LoginPage from '@/components/LoginPage';
import { categoriesApi, bookmarksApi, Category, Bookmark as IBookmark } from '@/lib/api';

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('bm_auth');
        setIsAuthenticated(token === 'authenticated');
        setAuthChecked(true);
    }, []);

    const [categories, setCategories] = useState<Category[]>([]);
    const [bookmarks, setBookmarks] = useState<IBookmark[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [showAddBookmark, setShowAddBookmark] = useState(false);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [editBookmark, setEditBookmark] = useState<IBookmark | null>(null);
    const [loading, setLoading] = useState(true);

    const loadCategories = useCallback(async () => {
        const res = await categoriesApi.getAll();
        setCategories(res.data);
    }, []);

    const loadBookmarks = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (selectedCategory) params.category = selectedCategory;
            if (search) params.search = search;
            const res = await bookmarksApi.getAll(params);
            setBookmarks(res.data);
        } finally {
            setLoading(false);
        }
    }, [selectedCategory, search]);

    useEffect(() => { loadCategories(); }, [loadCategories]);
    useEffect(() => {
        const t = setTimeout(loadBookmarks, 200);
        return () => clearTimeout(t);
    }, [loadBookmarks]);

    const handleAddBookmark = async (data: Partial<IBookmark>) => {
        if (editBookmark) {
            await bookmarksApi.update(editBookmark.id, data);
            setEditBookmark(null);  
        } else {
            await bookmarksApi.create(data);
        }
        loadBookmarks();
    };

    const handleDeleteBookmark = async (id: number) => {
        await bookmarksApi.delete(id);
        setBookmarks(prev => prev.filter(b => b.id !== id));
    };

    const handleAddCategory = async (data: Partial<Category>) => {
        await categoriesApi.create(data);
        loadCategories();
    };

    const handleDeleteCategory = async (id: number) => {
        await categoriesApi.delete(id);
        if (selectedCategory === id) setSelectedCategory(null);
        loadCategories();
    };

    const currentCategory = categories.find(c => c.id === selectedCategory);

    if (!authChecked) return null;
    if (!isAuthenticated) return <LoginPage onLogin={() => setIsAuthenticated(true)} />;

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--background)]">
            <Sidebar
                categories={categories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
                onAddCategory={() => setShowAddCategory(true)}
                onDeleteCategory={handleDeleteCategory}
            />

            {/* Main */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <header className="px-6 py-4 border-b border-[var(--border)] bg-[var(--background)] flex items-center gap-4">
                    <div className="flex-1">
                        <h1 className="font-semibold text-[16px] flex items-center gap-2">
                            {currentCategory ? (
                                <>
                                    <currentCategory.icon />
                                    <span>{currentCategory.name}</span>
                                </>
                            ) : (
                                'All Bookmarks'
                            )}
                        </h1>
                        <p className="text-[12px] text-[var(--muted)] mt-0.5">
                            {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative w-72">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search bookmarks..."
                            className="w-full pl-9 pr-9 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm placeholder-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                                <X size={13} />
                            </button>
                        )}
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={() => setShowAddBookmark(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold transition-all shadow-lg shadow-primary-600/20 hover:shadow-primary-500/30 active:scale-95"
                    >
                        <Plus size={15} />
                        Add Bookmark
                    </button>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {loading ? (
                        <div className="flex items-center justify-center h-48">
                            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : bookmarks.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center h-48 text-center"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-4">
                                <Bookmark size={22} className="text-[var(--muted)]" />
                            </div>
                            <p className="font-medium text-[var(--foreground)] mb-1">No bookmarks yet</p>
                            <p className="text-sm text-[var(--muted)]">
                                {search ? 'No results found' : 'Click "Add Bookmark" to get started'}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
                        >
                            <AnimatePresence>
                                {bookmarks.map((bookmark, i) => (
                                    <BookmarkCard
                                        key={bookmark.id}
                                        bookmark={bookmark}
                                        onDelete={handleDeleteBookmark}
                                        onEdit={(b) => { setEditBookmark(b); setShowAddBookmark(true); }}
                                        index={i}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </main>

            {/* Modals */}
            <AddBookmarkModal
                isOpen={showAddBookmark}
                onClose={() => { setShowAddBookmark(false); setEditBookmark(null); }}
                onSave={handleAddBookmark}
                categories={categories}
                editBookmark={editBookmark}
            />
            <AddCategoryModal
                isOpen={showAddCategory}
                onClose={() => setShowAddCategory(false)}
                onSave={handleAddCategory}
            />
        </div>
    );
}
