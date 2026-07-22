import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Discount } from '../types';
import { formatPrice, timeAgo } from '../utils/time';
import { isFavorite as checkFavorite, toggleFavorite } from '../services/favorites';

export default function DiscountCard({ d }: { d: Discount }) {
  const [fav, setFav] = useState(() => checkFavorite(d.id));
  const [copied, setCopied] = useState(false);

  const pct = d.oldPrice > 0 && d.newPrice > 0 && d.oldPrice > d.newPrice
    ? Math.round(((d.oldPrice - d.newPrice) / d.oldPrice) * 100)
    : 0;

  const shareUrl = `https://indiva.shop/detay/${d.id}`;

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setFav(toggleFavorite(d.id).includes(d.id));
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      try { await navigator.share({ title: d.title, url: shareUrl }); return; } catch { return; }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const handleGoToDeal = (e: React.MouseEvent) => {
    e.preventDefault();
    if (d.link) window.open(d.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <Link
      to={`/detay/${d.id}`}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-square w-full bg-gray-100">
        <img src={d.imageUrl} alt={d.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        {pct > 0 && (
          <span className="absolute top-2 left-2 bg-orange text-white text-[11px] font-black px-2 py-0.5 rounded-lg">
            %{pct}
          </span>
        )}
        <span className="absolute bottom-2 right-2 text-[10px] text-white bg-black/60 px-1.5 py-0.5 rounded">
          {timeAgo(d.createdAt)}
        </span>

        <div className="absolute top-2 right-2 flex flex-col gap-1.5">
          <button
            onClick={handleFavorite}
            aria-label="Favorile"
            className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/55 flex items-center justify-center text-sm transition-colors"
          >
            {fav ? '❤️' : '🤍'}
          </button>
          <button
            onClick={handleShare}
            aria-label="Paylaş"
            className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/55 flex items-center justify-center text-sm transition-colors"
          >
            {copied ? '✓' : '🔗'}
          </button>
        </div>
      </div>

      <div className="p-3 flex flex-col flex-1 gap-1">
        {(d.category || d.brand) && (
          <p className="text-[10px] text-orange font-bold uppercase tracking-wide truncate">
            {[d.category, d.brand].filter(Boolean).join(' · ')}
          </p>
        )}
        <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2 flex-1">{d.title}</p>

        <div className="flex items-center gap-1.5 mt-1">
          {d.oldPrice > 0 ? (
            <>
              <span className="text-[11px] text-white bg-gray-700 px-1.5 py-0.5 rounded line-through">
                {formatPrice(d.oldPrice)}₺
              </span>
              <span className="text-sm font-extrabold text-orange-dark">{formatPrice(d.newPrice)}₺</span>
            </>
          ) : (
            <>
              <span className="text-[10px] font-bold text-white bg-gray-700 px-1.5 py-0.5 rounded">DİP FİYAT</span>
              <span className="text-sm font-extrabold text-orange-dark">{formatPrice(d.newPrice)}₺</span>
            </>
          )}
        </div>

        <button
          onClick={handleGoToDeal}
          className="mt-2 bg-orange hover:bg-orange-dark text-white text-xs font-bold py-2 rounded-lg transition-colors"
        >
          İndirime Git
        </button>
      </div>
    </Link>
  );
}
