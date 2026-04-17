import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ICON_OPTIONS, getIcon } from '../lib/icons';
import { isSafeUrl } from '../lib/url';

interface AddLinkModalProps {
  onClose: () => void;
  onAdd: (name: string, url: string, description: string, icon: string) => Promise<void>;
}

export default function AddLinkModal({ onClose, onAdd }: AddLinkModalProps) {
  const [name, setName] = useState('');
  const [nameManuallyEdited, setNameManuallyEdited] = useState(false);
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleIconSelect = (value: string, label: string) => {
    setIcon(value);
    if (!nameManuallyEdited) {
      setName(label);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim() || !url.trim() || !icon) return;
    if (!isSafeUrl(url.trim())) {
      setError('URL must start with http:// or https://');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onAdd(name.trim(), url.trim(), description.trim(), icon);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add service.');
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-on-surface/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-highest dark:bg-dark-surface-container-highest w-full max-w-lg rounded-2xl shadow-[0px_24px_48px_rgba(0,0,0,0.15)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 flex justify-between items-center border-b border-outline-variant/20 dark:border-dark-outline-variant/20">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-on-surface dark:text-dark-on-surface">
              Connect Service
            </h3>
            <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant">
              Add a new service link
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant dark:text-dark-on-surface-variant hover:text-on-surface dark:hover:text-dark-on-surface bg-surface-container-low dark:bg-dark-surface-container-low p-2 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-surface-container-lowest dark:bg-dark-surface-container-lowest max-h-[60vh] overflow-y-auto">
          {error && (
            <div className="px-4 py-3 bg-error-container text-on-error-container rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Service picker */}
          <div>
            <label className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-2">
              Service
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ICON_OPTIONS.map((opt) => {
                const Icon = getIcon(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleIconSelect(opt.value, opt.label)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      icon === opt.value
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-surface-container-high dark:bg-dark-surface-container-high text-on-surface-variant dark:text-dark-on-surface-variant hover:bg-surface-container-highest dark:hover:bg-dark-surface-container-highest'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-2">
              Service Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameManuallyEdited(true); }}
              placeholder="e.g. BigQuery"
              className="w-full px-4 py-3 bg-surface-container-high dark:bg-dark-surface-container-high rounded-xl border-none text-on-surface dark:text-dark-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/30 outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-2">
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 bg-surface-container-high dark:bg-dark-surface-container-high rounded-xl border-none text-on-surface dark:text-dark-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/30 outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description..."
              className="w-full px-4 py-3 bg-surface-container-high dark:bg-dark-surface-container-high rounded-xl border-none text-on-surface dark:text-dark-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/30 outline-none text-sm"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 py-6 bg-surface-container-highest dark:bg-dark-surface-container-highest border-t border-outline-variant/20 dark:border-dark-outline-variant/20 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-primary hover:bg-primary/5 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !url.trim() || !icon || saving}
            className="px-8 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {saving ? 'Adding...' : 'Add Service'}
          </button>
        </div>
      </div>
    </div>
  );
}
