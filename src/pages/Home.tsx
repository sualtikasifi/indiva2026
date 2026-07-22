import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import CategoryChips from '../components/CategoryChips';
import DiscountCard from '../components/DiscountCard';
import { PlayStoreBanner } from '../components/PlayStoreCTA';
import BottomNav from '../components/BottomNav';
import { fetchFirstPage, fetchPage, type DiscountsPage } from '../services/discountService';
import type { Discount } from '../types';
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

export default function Home() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [category, setCategory] = useState('Tümü');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchFirstPage().then((page: DiscountsPage) => {
      setDiscounts(page.discounts);
      setLastVisible(page.lastVisible);
      setHasMore(page.hasMore);
      setLoading(false);
    });
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    const page = await fetchPage(lastVisible);
    setDiscounts(prev => {
      const ids = new Set(prev.map(d => d.id));
      return [...prev, ...page.discounts.filter(d => !ids.has(d.id))];
    });
    setLastVisible(page.lastVisible);
    setHasMore(page.hasMore);
    setLoadingMore(false);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return discounts.filter(d => {
      if (category !== 'Tümü' && d.category !== category) return false;
      if (!q) return true;
      return (
        d.title?.toLowerCase().includes(q) ||
        d.brand?.toLowerCase().includes(q) ||
        d.category?.toLowerCase().includes(q)
      );
    });
  }, [discounts, category, search]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header search={search} onSearch={setSearch} />

      <main className="max-w-6xl mx-auto px-4 py-4">
        <div className="mb-4">
          <PlayStoreBanner compact />
        </div>

        <div className="mb-4">
          <CategoryChips selected={category} onSelect={setCategory} />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">😕</p>
            <p>Kriterlerinize uygun fırsat bulunamadı.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filtered.map(d => <DiscountCard key={d.id} d={d} />)}
            </div>

            {hasMore && !search && category === 'Tümü' && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="bg-white border border-gray-200 hover:border-orange text-gray-700 font-semibold px-6 py-2.5 rounded-full disabled:opacity-50 transition-colors"
                >
                  {loadingMore ? 'Yükleniyor…' : 'Daha Fazla Göster'}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="mt-10 border-t border-gray-100 py-8 text-center text-xs text-gray-400">
        <p>© {new Date().getFullYear()} İNDİVA — En iyi indirim fırsatları</p>
      </footer>
      <BottomNav />
    </div>
  );
}
