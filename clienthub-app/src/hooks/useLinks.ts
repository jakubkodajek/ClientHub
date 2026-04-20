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
  writeBatch,
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
        data.sort((a, b) => {
          const oa = a.order ?? Number.MAX_SAFE_INTEGER;
          const ob = b.order ?? Number.MAX_SAFE_INTEGER;
          if (oa !== ob) return oa - ob;
          const ta = a.createdAt?.toMillis?.() ?? 0;
          const tb = b.createdAt?.toMillis?.() ?? 0;
          return ta - tb;
        });
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

  const reorderLinks = useCallback(
    async (orderedIds: string[]) => {
      if (!user || !clientId) return;
      let snapshot: Link[] = [];
      setLinks((prev) => {
        snapshot = prev;
        const map = new Map(prev.map((l) => [l.id, l]));
        const next: Link[] = [];
        orderedIds.forEach((id, idx) => {
          const l = map.get(id);
          if (l) next.push({ ...l, order: idx });
        });
        return next;
      });
      try {
        const batch = writeBatch(db);
        orderedIds.forEach((id, idx) => {
          batch.update(
            doc(db, 'users', user.uid, 'clients', clientId, 'links', id),
            { order: idx }
          );
        });
        await batch.commit();
      } catch (err) {
        console.error('Failed to reorder links:', err);
        setLinks(snapshot);
      }
    },
    [user, clientId]
  );

  return { links, loading, addLink, updateLink, deleteLink, reorderLinks };
}
