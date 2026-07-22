import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { Brochure } from '../types';

export async function fetchBrochures(storeSlug: string): Promise<Brochure[]> {
  const col = collection(db, `circulars/${storeSlug}/brochures`);
  const q = query(col, orderBy('createdAt', 'desc'), limit(20));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Brochure));
}
