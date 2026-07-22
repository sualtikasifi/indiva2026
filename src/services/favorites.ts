const KEY = 'indiva_shop_favorites';

function readAll(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getFavorites(): string[] {
  return readAll();
}

export function isFavorite(id: string): boolean {
  return readAll().includes(id);
}

export function toggleFavorite(id: string): string[] {
  const current = readAll();
  const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  return next;
}
