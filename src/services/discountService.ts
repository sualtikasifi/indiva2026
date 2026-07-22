import {
  collection, query, orderBy, limit, startAfter, getDocs, getDoc, doc, Timestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { Discount } from '../types';

const PAGE_SIZE = 24;
// Aynı edge-cache proxy'yi mobil app da kullanıyor — ilk sayfa için Firestore
// yerine Vercel'in CDN'inden okunur (binlerce ziyaretçi olsa da tek okuma).
const EDGE_PROXY = 'https://indiva-proxy.vercel.app/api/discounts';

// Cursor olarak QueryDocumentSnapshot yerine milisaniye kullanılıyor — proxy'den
// gelen ilk sayfanın createdAt'i zaten ham sayı (bkz. vercel-proxy/api/discounts.ts),
// bu sayede proxy ile Firestore sayfaları arasında sorunsuz geçiş yapılabiliyor
// (önceki sürümde ilk sayfa proxy'den geldiğinde hasMore hep false kalıyor,
// "Daha Fazla Göster" hiç çıkmıyordu — bu yüzden düzeltildi).
function tsToMs(ts: any): number | null {
  if (!ts) return null;
  if (typeof ts.toMillis === 'function') return ts.toMillis();
  if (typeof ts.seconds === 'number') return ts.seconds * 1000;
  const ms = new Date(ts).getTime();
  return isNaN(ms) ? null : ms;
}

export interface DiscountsPage {
  discounts: Discount[];
  cursor: number | null;
  hasMore: boolean;
}

export async function fetchFirstPage(): Promise<DiscountsPage> {
  try {
    const res = await fetch(EDGE_PROXY, { headers: { Accept: 'application/json' } });
    if (res.ok) {
      const json = (await res.json()) as { success?: boolean; discounts?: Discount[] };
      if (json.success && Array.isArray(json.discounts) && json.discounts.length > 0) {
        const discounts = json.discounts.filter(d => !d.isAd);
        const last = json.discounts[json.discounts.length - 1];
        return {
          discounts,
          cursor: tsToMs(last?.createdAt),
          hasMore: json.discounts.length >= PAGE_SIZE / 2, // proxy sabit boyut döndürmeyebilir, kaba tahmin
        };
      }
    }
  } catch {
    // Edge cache'e ulaşılamadı — Firestore'a düş
  }
  return fetchPage(null);
}

export async function fetchPage(cursor: number | null): Promise<DiscountsPage> {
  const col = collection(db, 'discounts');
  const q = cursor
    ? query(col, orderBy('createdAt', 'desc'), startAfter(Timestamp.fromMillis(cursor)), limit(PAGE_SIZE))
    : query(col, orderBy('createdAt', 'desc'), limit(PAGE_SIZE));
  const snap = await getDocs(q);
  const discounts = snap.docs
    .map(d => ({ id: d.id, ...d.data() } as Discount))
    .filter(d => !d.isAd);
  const lastDoc = snap.docs[snap.docs.length - 1];
  return {
    discounts,
    cursor: lastDoc ? tsToMs((lastDoc.data() as any).createdAt) : null,
    hasMore: snap.docs.length === PAGE_SIZE,
  };
}

export async function fetchDiscountById(id: string): Promise<Discount | null> {
  const snap = await getDoc(doc(db, 'discounts', id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Discount) : null;
}
