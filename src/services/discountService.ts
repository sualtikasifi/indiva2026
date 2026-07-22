import {
  collection, query, orderBy, limit, startAfter, getDocs, getDoc, doc,
  type QueryDocumentSnapshot, type DocumentData,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { Discount } from '../types';

const PAGE_SIZE = 24;
// Aynı edge-cache proxy'yi mobil app da kullanıyor — ilk sayfa için Firestore
// yerine Vercel'in CDN'inden okunur (binlerce ziyaretçi olsa da tek okuma).
const EDGE_PROXY = 'https://indiva-proxy.vercel.app/api/discounts';

export interface DiscountsPage {
  discounts: Discount[];
  lastVisible: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

export async function fetchFirstPage(): Promise<DiscountsPage> {
  try {
    const res = await fetch(EDGE_PROXY, { headers: { Accept: 'application/json' } });
    if (res.ok) {
      const json = (await res.json()) as { success?: boolean; discounts?: Discount[] };
      if (json.success && Array.isArray(json.discounts) && json.discounts.length > 0) {
        return { discounts: json.discounts.filter(d => !d.isAd), lastVisible: null, hasMore: false };
      }
    }
  } catch {
    // Edge cache'e ulaşılamadı — Firestore'a düş
  }
  return fetchPage(null);
}

export async function fetchPage(cursor: QueryDocumentSnapshot<DocumentData> | null): Promise<DiscountsPage> {
  const col = collection(db, 'discounts');
  const q = cursor
    ? query(col, orderBy('createdAt', 'desc'), startAfter(cursor), limit(PAGE_SIZE))
    : query(col, orderBy('createdAt', 'desc'), limit(PAGE_SIZE));
  const snap = await getDocs(q);
  const discounts = snap.docs
    .map(d => ({ id: d.id, ...d.data() } as Discount))
    .filter(d => !d.isAd);
  return {
    discounts,
    lastVisible: snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null,
    hasMore: snap.docs.length === PAGE_SIZE,
  };
}

export async function fetchDiscountById(id: string): Promise<Discount | null> {
  const snap = await getDoc(doc(db, 'discounts', id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Discount) : null;
}
