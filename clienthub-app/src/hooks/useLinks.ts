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
import type { Link } from '../types';

export function useLinks(clientId: string | null) {
  const { user } = useAuth();
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !clientId) {
      setLinks([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, 'users', user.uid, 'clients', clientId, 'links'),
      orderBy('createdAt', 'asc')
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Link));
        setLinks(data);
        setLoading(false);
      },
      (error) => {
        console.error('Firestore links error:', error);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [user, clientId]);

  const addLink = useCallback(
    async (name: string, url: string, description: string, icon: string) => {
      if (!user || !clientId) return;
      await addDoc(
        collection(db, 'users', user.uid, 'clients', clientId, 'links'),
        { name, url, description, icon, createdAt: serverTimestamp() }
      );
    },
    [user, clientId]
  );

  const updateLink = useCallback(
    async (linkId: string, data: Partial<Omit<Link, 'id'>>) => {
      if (!user || !clientId) return;
      await updateDoc(
        doc(db, 'users', user.uid, 'clients', clientId, 'links', linkId),
        data
      );
    },
    [user, clientId]
  );

  const deleteLink = useCallback(
    async (linkId: string) => {
      if (!user || !clientId) return;
      await deleteDoc(
        doc(db, 'users', user.uid, 'clients', clientId, 'links', linkId)
      );
    },
    [user, clientId]
  );

  return { links, loading, addLink, updateLink, deleteLink };
}
