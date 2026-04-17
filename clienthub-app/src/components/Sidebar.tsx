import { useState } from 'react';
import {
  Plus,
  Search,
  ArrowUpAZ,
  ArrowDownAZ,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import type { Client } from '../types';

interface SidebarProps {
  clients: Client[];
  selectedClientId: string | null;
  onSelectClient: (id: string) => void;
  onAddClient: () => void;
}

export default function Sidebar({
  clients,
  selectedClientId,
  onSelectClient,
  onAddClient,
}: SidebarProps) {
  const { user, signOut } = useAuth();
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const filtered = clients
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortAsc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  const sidebarContent = (
    <div className="p-6 flex flex-col h-full">
      {/* Brand */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="ClientHub" className="w-10 h-10 rounded-xl dark:hidden" />
          <img src="/logo-dark.svg" alt="ClientHub" className="w-10 h-10 rounded-xl hidden dark:block" />
          <h1 className="text-2xl font-extrabold tracking-tight text-on-surface dark:text-dark-on-surface">
            Client<span className="text-primary">Hub</span>
          </h1>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4 mb-8">
        <button
          onClick={onAddClient}
          className="w-full bg-primary text-white py-2.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-primary/20 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          New Client
        </button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-dark-on-surface-variant w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="w-full pl-10 pr-10 py-2 bg-surface-container-lowest/50 dark:bg-dark-surface-container-lowest/50 border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm text-on-surface dark:text-dark-on-surface placeholder:text-on-surface-variant/50 outline-none"
          />
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-dark-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            title={sortAsc ? 'Sort Z-A' : 'Sort A-Z'}
          >
            {sortAsc ? (
              <ArrowUpAZ className="w-4 h-4" />
            ) : (
              <ArrowDownAZ className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Client List */}
      <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
        <p className="px-4 text-[10px] font-bold text-on-surface-variant dark:text-dark-on-surface-variant uppercase tracking-widest mb-2 opacity-60">
          Client Directory
        </p>
        {filtered.map((client) => {
          const isActive = client.id === selectedClientId;
          return (
            <button
              key={client.id}
              onClick={() => {
                onSelectClient(client.id);
                setMobileOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-2 w-full text-left transition-all rounded-none cursor-pointer ${
                isActive
                  ? 'text-primary dark:text-primary-fixed-dim border-l-4 border-primary bg-primary/5 dark:bg-primary/10'
                  : 'text-on-surface-variant dark:text-dark-on-surface-variant hover:text-on-surface dark:hover:text-dark-on-surface hover:bg-surface-container-high/50 dark:hover:bg-dark-surface-container-high/50 border-l-4 border-transparent'
              }`}
            >
              {client.imageUrl ? (
                <img
                  src={client.imageUrl}
                  alt={client.name}
                  className={`w-6 h-6 rounded-md object-cover ${!isActive ? 'opacity-70' : ''}`}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-high dark:bg-dark-surface-container-high text-on-surface-variant dark:text-dark-on-surface-variant'
                  }`}
                >
                  {client.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="flex-1 truncate text-sm font-medium">
                {client.name}
              </span>
              {isActive && (
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-sm text-on-surface-variant/50 dark:text-dark-on-surface-variant/50 text-center">
            {search ? 'No clients found' : 'No clients yet'}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-outline-variant/20 dark:border-dark-outline-variant/20 space-y-1">
        {user && (
          <div className="flex items-center gap-3 px-4 py-2">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <User className="w-5 h-5 text-on-surface-variant dark:text-dark-on-surface-variant" />
            )}
            <span className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant truncate flex-1">
              {user.displayName || user.email}
            </span>
          </div>
        )}
        <ThemeToggle />
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-2 text-on-surface-variant dark:text-dark-on-surface-variant hover:text-error transition-colors duration-200 rounded-lg w-full cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-surface-container-lowest dark:bg-dark-surface-container rounded-lg shadow-md cursor-pointer"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-on-surface/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-40 h-screen w-64 bg-surface-container-low dark:bg-dark-surface-container-low text-sm font-medium tracking-tight transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
