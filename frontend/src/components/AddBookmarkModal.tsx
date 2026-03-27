'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link, Tag, Type, AlignLeft, FolderOpen, Loader2 } from 'lucide-react';
import { Category, Bookmark } from '@/lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Bookmark>) => void;
  categories: Category[];
  editBookmark?: Bookmark | null;
}

export default function AddBookmarkModal({ isOpen, onClose, onSave, categories, editBookmark }: Props) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editBookmark) {
      setTitle(editBookmark.title || '');
      setUrl(editBookmark.url || '');
      setDescription(editBookmark.description || '');
      setCategoryId(editBookmark.categoryId || editBookmark.category_id || '');
      setTags((() => { try { return JSON.parse(editBookmark.tags || '[]').join(', '); } catch { return ''; } })());
    } else {
      setTitle(''); setUrl(''); setDescription(''); setCategoryId(''); setTags('');
    }
  }, [editBookmark, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        title,
        url,
        description,
        categoryId: categoryId || undefined,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean) as any,
      });
      onClose();
      setTitle(''); setUrl(''); setDescription(''); setCategoryId(''); setTags('');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/60 transition-all";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-md bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
                <h2 className="font-semibold text-[15px]">
                  {editBookmark ? 'Edit Bookmark' : 'Add Bookmark'}
                </h2>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--background)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--muted)] mb-1.5">
                    <Link size={12} /> URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--muted)] mb-1.5">
                    <Type size={12} /> Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Bookmark title"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--muted)] mb-1.5">
                    <AlignLeft size={12} /> Description
                  </label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Optional description..."
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--muted)] mb-1.5">
                      <FolderOpen size={12} /> Category
                    </label>
                    <select
                      value={categoryId}
                      onChange={e => setCategoryId(e.target.value ? parseInt(e.target.value) : '')}
                      className={inputClass}
                    >
                      <option value="">None</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--muted)] mb-1.5">
                      <Tag size={12} /> Tags
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={e => setTags(e.target.value)}
                      placeholder="react, tools..."
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    {editBookmark ? 'Save Changes' : 'Add Bookmark'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
