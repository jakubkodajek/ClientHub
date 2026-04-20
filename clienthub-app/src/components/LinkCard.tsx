import { useState, useEffect, useCallback, useRef } from 'react';
import { Pencil, Trash2, ExternalLink, GripVertical } from 'lucide-react';
import { getIcon, ICON_BORDER_MAP, ICON_GLOW_MAP } from '../lib/icons';
import { isSafeUrl } from '../lib/url';
import type { Link } from '../types';

interface LinkCardProps {
  link: Link;
  isDragging?: boolean;
  isDropTarget?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export default function LinkCard({
  link,
  isDragging = false,
  isDropTarget = false,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDrop,
  onDragEnd,
}: LinkCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [draggable, setDraggable] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!confirmDelete) return;
    const timer = setTimeout(() => setConfirmDelete(false), 3000);
    return () => clearTimeout(timer);
  }, [confirmDelete]);

  return (
    <div
      ref={cardRef}
      draggable={draggable}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', link.id);
        onDragStart?.(e);
      }}
      onDragEnter={onDragEnter}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        onDragOver?.(e);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDraggable(false);
        onDrop?.(e);
      }}
      onDragEnd={(e) => {
        setDraggable(false);
        onDragEnd?.(e);
      }}
      className={`group relative bg-surface-container-lowest dark:bg-dark-surface-container rounded-xl p-6 border-2 ${borderColor} ${glowColor} transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 flex flex-col items-start gap-4 ${
        isDragging ? 'opacity-40 scale-[0.98]' : ''
      } ${
        isDropTarget
          ? 'ring-4 ring-primary/60 ring-offset-2 ring-offset-surface dark:ring-offset-dark-surface scale-[1.02]'
          : ''
      }`}
    >
      {/* Action buttons */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onMouseDown={() => setDraggable(true)}
          onMouseUp={() => setDraggable(false)}
          onMouseLeave={() => setDraggable(false)}
          onClick={(e) => e.stopPropagation()}
          title="Drag to reorder"
          className="p-1.5 rounded-lg text-outline-variant hover:text-primary hover:bg-surface-container-high/50 dark:hover:bg-dark-surface-container-high/50 transition-colors cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
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
        onClick={(e) => {
          if (!isSafeUrl(link.url) || isDragging) e.preventDefault();
        }}
        draggable={false}
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
