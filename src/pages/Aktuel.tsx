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
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header search="" onSearch={() => {}} />
      <main className="flex-1 flex flex-col gap-3 p-3 pb-20 overflow-hidden">
        {STORES.map(store => (
          <Link
            key={store.slug}
            to={`/aktuel/${store.slug}`}
            className="flex-1 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center p-6 hover:border-orange transition-colors shadow-sm"
          >
            <img src={store.logo} alt={store.slug} className="max-w-[60%] max-h-[65%] object-contain" />
          </Link>
        ))}
      </main>
      <BottomNav />
    </div>
  );
}
