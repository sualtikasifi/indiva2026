const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.indiva.app';

export function PlayStoreBanner() {
  return (
    <div className="bg-gradient-to-r from-orange to-orange-dark rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 flex-wrap">
      <div>
        <p className="text-white font-extrabold text-base sm:text-lg">Bildirimler ve favoriler için</p>
        <p className="text-white/90 text-sm">İNDİVA uygulamasını indirin — fırsatları kaçırmayın.</p>
      </div>
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 inline-flex items-center gap-2 bg-white text-orange-dark font-bold px-4 py-2.5 rounded-xl hover:bg-orange-50 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5" fill="currentColor">
          <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
        </svg>
        Play Store'da Aç
      </a>
    </div>
  );
}

export function PlayStoreButtonSmall() {
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 bg-orange text-white font-bold text-xs px-3 py-2 rounded-lg hover:bg-orange-dark transition-colors"
    >
      📲 Uygulamayı İndir
    </a>
  );
}

export { PLAY_STORE_URL };
