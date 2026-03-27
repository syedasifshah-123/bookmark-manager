'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { Category } from '@/lib/api';

const ICONS = ['📁', '💻', '⚽', '🎬', '📰', '🎵', '📚', '🛒', '🎮', '🍕', '✈️', '💡', '🔧', '🎨', '📊', '🌐', '❤️', '⭐', '📷', '☕'];
const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#f97316'];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Category>) => void;
}

export default function AddCategoryModal({ isOpen, onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📁');
  const [color, setColor] = useState('#3b82f6');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({ name, icon, color });
      onClose();
      setName(''); setIcon('📁'); setColor('#3b82f6');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-sm bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
                {/* Preview */}
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all"
                    style={{ backgroundColor: color + '25' }}
                  >
                    {icon}
                  </div>
                  <span className="font-semibold text-[15px]">{name || 'New Category'}</span>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--background)] text-[var(--muted)] transition-colors">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="text-[12px] font-medium text-[var(--muted)] mb-1.5 block">Name</label>
                  <input
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Category name"
                    className="w-full px-3 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/60 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[12px] font-medium text-[var(--muted)] mb-2 block">Icon</label>
                  <div className="flex flex-wrap gap-1.5">
                    {ICONS.map(i => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setIcon(i)}
                        className={`w-9 h-9 rounded-lg text-lg transition-all ${
                          icon === i
                            ? 'ring-2 ring-offset-1 ring-offset-[var(--surface)] scale-105'
                            : 'bg-[var(--background)] hover:bg-[var(--border)]'
                        }`}
                        style={icon === i ? { backgroundColor: color + '25' } : {}}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[12px] font-medium text-[var(--muted)] mb-2 block">Color</label>
                  <div className="flex gap-2">
                    {COLORS.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-7 h-7 rounded-full transition-all ${color === c ? 'ring-2 ring-offset-2 ring-offset-[var(--surface)] scale-110' : 'hover:scale-105'}`}
                        style={{ backgroundColor: c, outlineColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2.5 pt-1">
                  <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--muted)] hover:bg-[var(--background)] transition-all">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 rounded-lg text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                    style={{ backgroundColor: color }}
                  >
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    Create
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
