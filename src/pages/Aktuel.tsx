import { Link } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const STORES = [
  { slug: 'bim', logo: '/logos/bim.png' },
  { slug: 'a101', logo: '/logos/a101.png' },
  { slug: 'sok', logo: '/logos/sok.png' },
];

export default function Aktuel() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header search="" onSearch={() => {}} />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-lg font-bold text-gray-800 mb-4 text-center">Aktüel Ürünler</h1>
        <div className="grid grid-cols-3 gap-3">
          {STORES.map(store => (
            <Link
              key={store.slug}
              to={`/aktuel/${store.slug}`}
              className="aspect-square bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center p-4 hover:border-orange transition-colors shadow-sm"
            >
              <img src={store.logo} alt={store.slug} className="w-full h-full object-contain" />
            </Link>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
