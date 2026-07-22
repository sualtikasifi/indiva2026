import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { PLAY_STORE_URL } from '../components/PlayStoreCTA';

export default function AppOnly({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header search="" onSearch={() => {}} />
      <main className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">{icon}</p>
        <h1 className="text-lg font-bold text-gray-800 mb-2">{title}</h1>
        <p className="text-sm text-gray-500 mb-6">{body}</p>
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-orange hover:bg-orange-dark text-white font-bold px-5 py-3 rounded-xl transition-colors"
        >
          📲 Play Store'da Aç
        </a>
      </main>
      <BottomNav />
    </div>
  );
}
