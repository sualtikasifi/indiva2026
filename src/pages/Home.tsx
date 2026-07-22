import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Header from '../components/Header';
import CategoryChips from '../components/CategoryChips';
import DiscountCard from '../components/DiscountCard';
import { PlayStoreBanner } from '../components/PlayStoreCTA';
import BottomNav from '../components/BottomNav';
import { fetchFirstPage, fetchPage, type DiscountsPage } from '../services/discountService';
import type { Discount } from '../types';

export default function Home() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [category, setCategory] = useState('Tümü');
  const [search, setSearch] = useState('');

  // loadMore çağrıldığı anda en güncel cursor/hasMore/loadingMore değerlerini
  // okuyabilmek için ref'te tutuluyor — IntersectionObserver callback'i içinde
  // state kapanışının (closure) bayatlamasını önler.
  const stateRef = useRef({ cursor, hasMore, loadingMore });
  stateRef.current = { cursor, hasMore, loadingMore };

  useEffect(() => {
    fetchFirstPage().then((page: DiscountsPage) => {
      setDiscounts(page.discounts);
      setCursor(page.cursor);
      setHasMore(page.hasMore);
      setLoading(false);
    });
  }, []);

  const loadMore = useCallback(async () => {
    const { cursor, hasMore, loadingMore } = stateRef.current;
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const page = await fetchPage(cursor);
    setDiscounts(prev => {
      const ids = new Set(prev.map(d => d.id));
      return [...prev, ...page.discounts.filter(d => !ids.has(d.id))];
    });
    setCursor(page.cursor);
    setHasMore(page.hasMore);
    setLoadingMore(false);
  }, []);

  // Sonsuz kaydırma: callback ref kullanılıyor çünkü sentinel div sadece
  // yükleme bitince DOM'a giriyor — plain ref + useEffect kombinasyonu, efekt
  // sentinel henüz yokken (mount anında) çalışıp bir daha hiç yeniden
  // kurulmadığı için gözlemciyi asla gerçek elemente bağlayamıyordu (panelde
  // aynı sınıf hatayı düzelttik). Callback ref, elemanın DOM'a her giriş/
  // çıkışında tetiklendiği için bu sorunu kökten ortadan kaldırıyor.
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    observerRef.current?.disconnect();
    if (!node) return;
    observerRef.current = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: '600px' },
    );
    observerRef.current.observe(node);
  }, [loadMore]);

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

  const showInfiniteScroll = !search && category === 'Tümü';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header search={search} onSearch={setSearch} />

      <main className="max-w-6xl mx-auto px-4 py-4">
        <div className="mb-4">
          <PlayStoreBanner compact />
        </div>

        <div className="mb-8">
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

            {showInfiniteScroll && (
              <div ref={sentinelRef} className="flex justify-center py-6">
                {loadingMore ? (
                  <div className="w-6 h-6 border-2 border-orange/30 border-t-orange rounded-full animate-spin" />
                ) : !hasMore && discounts.length > 0 ? (
                  <p className="text-xs text-gray-400">Tüm fırsatlar yüklendi 🎉</p>
                ) : null}
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
