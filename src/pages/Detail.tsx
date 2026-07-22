import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchDiscountById } from '../services/discountService';
import type { Discount } from '../types';
import { formatPrice, timeAgo } from '../utils/time';
import { PlayStoreBanner, PLAY_STORE_URL } from '../components/PlayStoreCTA';
import { isFavorite as checkFavorite, toggleFavorite } from '../services/favorites';

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const [discount, setDiscount] = useState<Discount | null | undefined>(undefined);
  const [fav, setFav] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchDiscountById(id).then(setDiscount);
    setFav(checkFavorite(id));
  }, [id]);

  const handleShare = async () => {
    const url = `https://indiva.shop/detay/${id}`;
    if (navigator.share) {
      try { await navigator.share({ title: discount?.title, url }); return; } catch { return; }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  if (discount === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange/30 border-t-orange rounded-full animate-spin" />
      </div>
    );
  }

  if (discount === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-4xl">😕</p>
        <p className="text-gray-500">Bu fırsat artık mevcut değil (süresi dolmuş olabilir).</p>
        <Link to="/" className="text-orange font-bold">Anasayfaya dön</Link>
      </div>
    );
  }

  const pct = discount.oldPrice > 0 && discount.newPrice > 0 && discount.oldPrice > discount.newPrice
    ? Math.round(((discount.oldPrice - discount.newPrice) / discount.oldPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/" className="text-gray-500 hover:text-gray-800">← Geri</Link>
          <Link to="/" className="text-orange font-black text-lg tracking-wider ml-auto">İNDİVA</Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => id && setFav(toggleFavorite(id).includes(id))}
              aria-label="Favorile"
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              {fav ? '❤️' : '🤍'}
            </button>
            <button
              onClick={handleShare}
              aria-label="Paylaş"
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              {copied ? '✓' : '🔗'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="relative aspect-square sm:aspect-[16/9] w-full bg-gray-100">
            <img src={discount.imageUrl} alt={discount.title} className="absolute inset-0 w-full h-full object-cover" />
            {pct > 0 && (
              <span className="absolute top-3 left-3 bg-orange text-white text-sm font-black px-2.5 py-1 rounded-lg">
                %{pct} İndirim
              </span>
            )}
          </div>
          <div className="p-5">
            {(discount.category || discount.brand) && (
              <p className="text-xs text-orange font-bold uppercase tracking-wide mb-1">
                {[discount.category, discount.brand].filter(Boolean).join(' · ')}
              </p>
            )}
            <h1 className="text-xl font-bold text-gray-800 mb-3">{discount.title}</h1>
            <div className="flex items-center gap-2 mb-1">
              {discount.oldPrice > 0 ? (
                <span className="text-sm text-white bg-gray-700 px-2 py-1 rounded line-through">
                  {formatPrice(discount.oldPrice)}₺
                </span>
              ) : (
                <span className="text-xs font-bold text-white bg-gray-700 px-2 py-1 rounded">DİP FİYAT</span>
              )}
              <span className="text-2xl font-extrabold text-orange-dark">{formatPrice(discount.newPrice)}₺</span>
            </div>
            <p className="text-xs text-gray-400 mb-5">{timeAgo(discount.createdAt)}</p>

            {discount.link && (
              <a
                href={discount.link}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="block text-center bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded-xl transition-colors mb-4"
              >
                {discount.storeName ? `${discount.storeName}'de Görüntüle` : 'Mağazada Görüntüle'} ↗
              </a>
            )}

            <PlayStoreBanner />

            <p className="text-[11px] text-gray-400 text-center mt-4">
              İNDİVA'yı yükleyerek favorileme, anlık bildirim ve daha fazla fırsata{' '}
              <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="text-orange underline">
                erişebilirsiniz
              </a>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
