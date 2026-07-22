import { Link } from 'react-router-dom';
import type { Discount } from '../types';
import { formatPrice, timeAgo } from '../utils/time';

export default function DiscountCard({ d }: { d: Discount }) {
  const pct = d.oldPrice > 0 && d.newPrice > 0 && d.oldPrice > d.newPrice
    ? Math.round(((d.oldPrice - d.newPrice) / d.oldPrice) * 100)
    : 0;

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
      </div>
      <div className="p-3 flex flex-col flex-1 gap-1">
        {(d.category || d.brand) && (
          <p className="text-[10px] text-orange font-bold uppercase tracking-wide truncate">
            {[d.category, d.brand].filter(Boolean).join(' · ')}
          </p>
        )}
        <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2 flex-1">{d.title}</p>
        <div className="flex items-center gap-1.5 mt-1">
          {d.oldPrice > 0 && d.oldPrice > d.newPrice && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(d.oldPrice)}₺</span>
          )}
          <span className="text-sm font-extrabold text-orange-dark">{formatPrice(d.newPrice)}₺</span>
        </div>
      </div>
    </Link>
  );
}
