import { useEffect, useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import DiscountCard from '../components/DiscountCard';
import { fetchDiscountById } from '../services/discountService';
import { getFavorites } from '../services/favorites';
import type { Discount } from '../types';

export default function Favorites() {
  const [discounts, setDiscounts] = useState<Discount[] | null>(null);

  useEffect(() => {
    const ids = getFavorites();
    if (ids.length === 0) { setDiscounts([]); return; }
    Promise.all(ids.map(fetchDiscountById)).then(results => {
      setDiscounts(results.filter((d): d is Discount => d !== null));
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header search="" onSearch={() => {}} />
      <main className="max-w-6xl mx-auto px-4 py-4">
        <h1 className="text-lg font-bold text-gray-800 mb-4 text-center">Favorilerim</h1>

        {discounts === null ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-orange/30 border-t-orange rounded-full animate-spin" />
          </div>
        ) : discounts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🤍</p>
            <p>Henüz favori eklemediniz.</p>
            <p className="text-xs mt-1">Ürün kartlarındaki kalp ikonuna dokunarak favorileyin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {discounts.map(d => <DiscountCard key={d.id} d={d} />)}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
