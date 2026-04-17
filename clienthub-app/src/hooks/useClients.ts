import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';
import type { Client } from '../types';

export function useClients() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setClients([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, 'users', user.uid, 'clients'),
      orderBy('createdAt', 'asc')
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Client));
        setClients(data);
        setLoading(false);
      },
      (error) => {
        console.error('Firestore clients error:', error);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [user]);

  const addClient = useCallback(
    async (name: string, description: string, imageUrl: string) => {
      if (!user) return;
      await addDoc(collection(db, 'users', user.uid, 'clients'), {
        name,
        description,
        imageUrl,
        createdAt: serverTimestamp(),
      });
    },
    [user]
  );

  const updateClient = useCallback(
    async (clientId: string, data: Partial<Omit<Client, 'id'>>) => {
      if (!user) return;
      await updateDoc(doc(db, 'users', user.uid, 'clients', clientId), data);
    },
    [user]
  );

  const deleteClient = useCallback(
    async (clientId: string) => {
      if (!user) return;
      await deleteDoc(doc(db, 'users', user.uid, 'clients', clientId));
    },
    [user]
  );

  return { clients, loading, addClient, updateClient, deleteClient };
}
