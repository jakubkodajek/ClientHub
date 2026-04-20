import { useState } from 'react';
import { Settings, Plus } from 'lucide-react';
import LinkCard from './LinkCard';
import type { Client, Link } from '../types';

interface ClientDetailProps {
  client: Client;
  links: Link[];
  linksLoading: boolean;
  onEditClient: () => void;
  onAddLink: () => void;
  onEditLink: (link: Link) => void;
  onDeleteLink: (linkId: string) => void;
  onReorderLinks: (orderedIds: string[]) => Promise<void> | void;
}

export default function ClientDetail({
  client,
  links,
  linksLoading,
  onEditClient,
  onAddLink,
  onEditLink,
  onDeleteLink,
  onReorderLinks,
}: ClientDetailProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  const handleDrop = (targetId: string) => {
    if (!draggingId || draggingId === targetId) {
      setDraggingId(null);
      setDropTargetId(null);
      return;
    }
    const ids = links.map((l) => l.id);
    const fromIdx = ids.indexOf(draggingId);
    const toIdx = ids.indexOf(targetId);
    if (fromIdx === -1 || toIdx === -1) {
      setDraggingId(null);
      setDropTargetId(null);
      return;
    }
    ids.splice(fromIdx, 1);
    ids.splice(toIdx, 0, draggingId);
    setDraggingId(null);
    setDropTargetId(null);
    void onReorderLinks(ids);
  };

  return (
    <section className="flex-1 overflow-y-auto overflow-x-hidden">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 flex justify-between items-center px-8 h-16 bg-surface-container-lowest/80 dark:bg-dark-surface-container/80 backdrop-blur-md border-b border-outline-variant/10 dark:border-dark-outline-variant/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {client.imageUrl ? (
              <img
                src={client.imageUrl}
                alt={client.name}
                className="w-8 h-8 rounded-lg shadow-sm object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold">
                {client.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-on-surface dark:text-dark-on-surface font-semibold">
              {client.name}
            </span>
          </div>
          <div className="h-4 w-px bg-outline-variant/30" />
          <button
            onClick={onEditClient}
            className="p-2 hover:bg-surface-container-low dark:hover:bg-dark-surface-container-low rounded-lg transition-colors text-on-surface-variant dark:text-dark-on-surface-variant cursor-pointer"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="p-8 bg-surface dark:bg-dark-surface min-h-[calc(100vh-4rem)]">
        {/* Hero Header */}
        <div className="mb-10 max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-on-surface dark:text-dark-on-surface mb-2">
                Service Ecosystem
              </h2>
              <p className="text-on-surface-variant dark:text-dark-on-surface-variant max-w-lg">
                {client.description || `Manage connected services and links for ${client.name}.`}
              </p>
            </div>
            <button
              onClick={onAddLink}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-bold shadow-lg shadow-primary/25 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer shrink-0"
            >
              <Plus className="w-5 h-5" />
              Connect Service
            </button>
          </div>
        </div>

        {/* Link Grid */}
        {linksLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl">
            {links.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                isDragging={draggingId === link.id}
                isDropTarget={
                  dropTargetId === link.id &&
                  draggingId !== null &&
                  draggingId !== link.id
                }
                onEdit={() => onEditLink(link)}
                onDelete={() => onDeleteLink(link.id)}
                onDragStart={() => setDraggingId(link.id)}
                onDragEnter={() => {
                  if (draggingId && draggingId !== link.id) {
                    setDropTargetId(link.id);
                  }
                }}
                onDrop={() => handleDrop(link.id)}
                onDragEnd={() => {
                  setDraggingId(null);
                  setDropTargetId(null);
                }}
              />
            ))}

            {/* Add Integration Placeholder */}
            <button
              onClick={onAddLink}
              className="group relative bg-surface-container-low dark:bg-dark-surface-container-low border-2 border-dashed border-outline-variant/30 dark:border-dark-outline-variant/30 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-surface-container-high dark:hover:bg-dark-surface-container-high hover:border-primary/50 min-h-[140px]"
            >
              <div className="w-12 h-12 rounded-full bg-surface-container-lowest dark:bg-dark-surface-container-lowest flex items-center justify-center text-on-surface-variant dark:text-dark-on-surface-variant mb-4 shadow-sm group-hover:text-primary transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-on-surface-variant dark:text-dark-on-surface-variant group-hover:text-primary">
                Add Integration
              </p>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
