'use client';
import { motion } from 'framer-motion';
import { ExternalLink, Trash2, Edit2, Calendar } from 'lucide-react';
import { Bookmark } from '@/lib/api';

interface Props {
    bookmark: Bookmark;
    onDelete: (id: number) => void;
    onEdit: (bookmark: Bookmark) => void;
    index: number;
}

export default function BookmarkCard({ bookmark, onDelete, onEdit, index }: Props) {
    const domain = (() => {
        try { return new URL(bookmark.url).hostname.replace('www.', ''); }
        catch { return bookmark.url; }
    })();

    const tags = (() => {
        try { return JSON.parse(bookmark.tags || '[]') as string[]; }
        catch { return []; }
    })();

    const date = new Date(bookmark.created_at).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="group relative bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-200"
        >
            {/* Actions */}
            <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-150">
                <button
                    onClick={() => onEdit(bookmark)}
                    className="p-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--muted)] hover:text-primary-500 transition-colors"
                >
                    <Edit2 size={13} />
                </button>
                <button
                    onClick={() => onDelete(bookmark.id)}
                    className="p-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--muted)] hover:text-red-500 transition-colors"
                >
                    <Trash2 size={13} />
                </button>
            </div>

            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--background)] border border-[var(--border)] flex items-center justify-center shrink-0 overflow-hidden">
                    {bookmark.favicon ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={bookmark.favicon}
                            alt=""
                            width={20}
                            height={20}
                            className="w-5 h-5 object-contain"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    ) : (
                        <span className="text-[10px] font-bold text-[var(--muted)] uppercase">
                            {domain.slice(0, 2)}
                        </span>
                    )}
                </div>
                <div className="flex-1 min-w-0 pr-12">
                    <h3 className="font-semibold text-[14px] text-[var(--foreground)] truncate leading-tight">
                        {bookmark.title}
                    </h3>
                    <p className="text-[12px] text-[var(--muted)] truncate mt-0.5">{domain}</p>
                </div>
            </div>

            {/* Description */}
            {bookmark.description && (
                <p className="text-[13px] text-[var(--muted)] mb-3 line-clamp-2 leading-relaxed">
                    {bookmark.description}
                </p>
            )}

            {/* Tags */}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-md bg-primary-600/10 text-primary-500 dark:text-primary-400 text-[11px] font-medium">
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                <div className="flex items-center gap-1 text-[11px] text-[var(--muted)]">
                    <Calendar size={11} />
                    <span>{date}</span>
                </div>
                <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[12px] text-primary-500 hover:text-primary-400 font-medium transition-colors"
                >
                    Open
                    <ExternalLink size={11} />
                </a>
            </div>
        </motion.div>
    );
}
