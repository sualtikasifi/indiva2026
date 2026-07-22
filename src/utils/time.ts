export function timeAgo(ts: any): string {
  if (!ts) return '';
  const ms = typeof ts.toMillis === 'function'
    ? ts.toMillis()
    : typeof ts.seconds === 'number'
      ? ts.seconds * 1000
      : Number(ts) || 0;
  if (!ms) return '';
  const diff = Math.floor((Date.now() - ms) / 60000);
  if (diff < 1) return 'Az önce';
  if (diff < 60) return `${diff} dk önce`;
  const h = Math.floor(diff / 60);
  if (h < 24) return `${h} sa önce`;
  return `${Math.floor(h / 24)} gün önce`;
}

export function formatPrice(price: number): string {
  return Math.floor(price).toLocaleString('tr-TR');
}
