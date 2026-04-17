import { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, ExternalLink } from 'lucide-react';
import { getIcon, ICON_BORDER_MAP, ICON_GLOW_MAP } from '../lib/icons';
import { isSafeUrl } from '../lib/url';
import type { Link } from '../types';

interface LinkCardProps {
  link: Link;
  onEdit: () => void;
  onDelete: () => void;
}

export default function LinkCard({ link, onEdit, onDelete }: LinkCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const borderColor = ICON_BORDER_MAP[link.icon] || 'border-slate-300 dark:border-slate-600';
  const glowColor = ICON_GLOW_MAP[link.icon] || '';
  const IconComponent = getIcon(link.icon);

  const handleDelete = useCallback(() => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    onDelete();
  }, [confirmDelete, onDelete]);

  // Reset confirmation after 3 seconds
  useEffect(() => {
    if (!confirmDelete) return;
    const timer = setTimeout(() => setConfirmDelete(false), 3000);
    return () => clearTimeout(timer);
  }, [confirmDelete]);

  return (
    <div className={`group relative bg-surface-container-lowest dark:bg-dark-surface-container rounded-xl p-6 border-2 ${borderColor} ${glowColor} transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 flex flex-col items-start gap-4`}>
      {/* Action buttons */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1.5 rounded-lg text-outline-variant hover:text-primary hover:bg-surface-container-high/50 dark:hover:bg-dark-surface-container-high/50 transition-colors cursor-pointer"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            confirmDelete
              ? 'text-white bg-error'
              : 'text-outline-variant hover:text-error hover:bg-error-container/30'
          }`}
          title={confirmDelete ? 'Click again to confirm' : 'Delete'}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Card content as link */}
      <a
        href={isSafeUrl(link.url) ? link.url : '#'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => { if (!isSafeUrl(link.url)) e.preventDefault(); }}
        className="flex flex-col items-start gap-4 w-full"
      >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center p-2">
          <IconComponent className="w-full h-full object-contain" />
        </div>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-on-surface dark:text-dark-on-surface">
            {link.name}
          </h3>
          <ExternalLink className="w-3.5 h-3.5 text-on-surface-variant/0 group-hover:text-on-surface-variant/50 transition-all" />
        </div>
        {link.description && (
          <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant line-clamp-2 -mt-2">
            {link.description}
          </p>
        )}
      </a>
    </div>
  );
}
