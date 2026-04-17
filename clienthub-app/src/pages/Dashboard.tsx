import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ClientDetail from '../components/ClientDetail';
import AddClientModal from '../components/AddClientModal';
import EditClientModal from '../components/EditClientModal';
import AddLinkModal from '../components/AddLinkModal';
import EditLinkModal from '../components/EditLinkModal';
import { useClients } from '../hooks/useClients';
import { useLinks } from '../hooks/useLinks';
import type { Link } from '../types';

export default function Dashboard() {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const { clients, loading: clientsLoading, addClient, updateClient, deleteClient } = useClients();
  const { links, loading: linksLoading, addLink, updateLink, deleteLink } = useLinks(selectedClientId);

  const [showAddClient, setShowAddClient] = useState(false);
  const [showEditClient, setShowEditClient] = useState(false);
  const [showAddLink, setShowAddLink] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  const selectedClient = clients.find((c) => c.id === selectedClientId) || null;

  // Auto-select first client if none selected
  useEffect(() => {
    if (!selectedClientId && clients.length > 0 && !clientsLoading) {
      setSelectedClientId(clients[0].id);
    }
  }, [selectedClientId, clients, clientsLoading]);

  return (
    <div className="flex h-screen bg-surface dark:bg-dark-surface text-on-surface dark:text-dark-on-surface overflow-hidden">
      <Sidebar
        clients={clients}
        selectedClientId={selectedClientId}
        onSelectClient={setSelectedClientId}
        onAddClient={() => setShowAddClient(true)}
      />

      {/* Main content */}
      <main className="lg:ml-64 flex-1 h-screen flex flex-col relative">
        {clientsLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : selectedClient ? (
          <ClientDetail
            client={selectedClient}
            links={links}
            linksLoading={linksLoading}
            onEditClient={() => setShowEditClient(true)}
            onAddLink={() => setShowAddLink(true)}
            onEditLink={(link) => setEditingLink(link)}
            onDeleteLink={(linkId) => deleteLink(linkId)}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
            <img src="/logo.svg" alt="ClientHub" className="w-20 h-20 rounded-2xl shadow-xl shadow-primary/20 dark:hidden" />
            <img src="/logo-dark.svg" alt="ClientHub" className="w-20 h-20 rounded-2xl shadow-xl shadow-primary/20 hidden dark:block" />
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold tracking-tight mb-2">
                Welcome to ClientHub
              </h2>
              <p className="text-on-surface-variant dark:text-dark-on-surface-variant">
                {clients.length === 0
                  ? 'Create your first client to get started.'
                  : 'Select a client from the sidebar to view their services.'}
              </p>
            </div>
            {clients.length === 0 && (
              <button
                onClick={() => setShowAddClient(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-bold shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] cursor-pointer"
              >
                Create First Client
              </button>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {showAddClient && (
        <AddClientModal
          onClose={() => setShowAddClient(false)}
          onAdd={addClient}
        />
      )}

      {showEditClient && selectedClient && (
        <EditClientModal
          client={selectedClient}
          onClose={() => setShowEditClient(false)}
          onUpdate={async (data) => {
            await updateClient(selectedClient.id, data);
          }}
          onDelete={async () => {
            await deleteClient(selectedClient.id);
            setSelectedClientId(null);
          }}
        />
      )}

      {showAddLink && (
        <AddLinkModal
          onClose={() => setShowAddLink(false)}
          onAdd={addLink}
        />
      )}

      {editingLink && (
        <EditLinkModal
          link={editingLink}
          onClose={() => setEditingLink(null)}
          onUpdate={async (data) => {
            await updateLink(editingLink.id, data);
          }}
          onDelete={async () => {
            await deleteLink(editingLink.id);
          }}
        />
      )}
    </div>
  );
}
