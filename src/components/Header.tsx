import { Link } from 'react-router-dom';
import { PlayStoreButtonSmall } from './PlayStoreCTA';

export default function Header({ search, onSearch }: { search: string; onSearch: (v: string) => void }) {
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link to="/" className="text-orange font-black text-xl tracking-wider shrink-0">
          İNDİVA
        </Link>
        <div className="flex-1 relative max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Ürün, marka veya kategori ara..."
            className="w-full pl-9 pr-3 py-2 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-orange/40"
          />
        </div>
        <div className="shrink-0 hidden sm:block">
          <PlayStoreButtonSmall />
        </div>
      </div>
    </header>
  );
}
