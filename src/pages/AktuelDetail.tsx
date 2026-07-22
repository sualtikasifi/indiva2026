import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { fetchBrochures } from '../services/brochureService';
import type { Brochure } from '../types';

const STORE_LABELS: Record<string, string> = { bim: 'BİM', a101: 'A101', sok: 'ŞOK' };

export default function AktuelDetail() {
  const { store } = useParams<{ store: string }>();
  const [brochures, setBrochures] = useState<Brochure[] | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    if (!store) return;
    setBrochures(null);
    fetchBrochures(store).then(setBrochures);
  }, [store]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header search="" onSearch={() => {}} />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/aktuel" className="text-gray-500 hover:text-gray-800">← Geri</Link>
          <h1 className="text-lg font-bold text-gray-800">{STORE_LABELS[store || ''] || store} Aktüel</h1>
        </div>

        {brochures === null ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-orange/30 border-t-orange rounded-full animate-spin" />
          </div>
        ) : brochures.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p>Şu anda aktüel katalog bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {brochures.map((b, i) => (
              <button
                key={b.id}
                onClick={() => setLightbox(i)}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[3/4] bg-gray-100">
                  <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                {b.validityDate && (
                  <p className="text-[11px] text-gray-500 py-1.5 px-2 truncate">{b.validityDate}</p>
                )}
              </button>
            ))}
          </div>
        )}
      </main>

      {lightbox !== null && brochures && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            aria-label="Kapat"
            className="absolute top-4 right-4 text-white text-2xl w-10 h-10 flex items-center justify-center"
          >
            ✕
          </button>
          <img
            src={brochures[lightbox].imageUrl}
            alt={brochures[lightbox].title}
            className="max-w-full max-h-full object-contain"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      <BottomNav />
    </div>
  );
}
