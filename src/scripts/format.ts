export function fmtVND(n: number): string {
  const sign = n < 0 ? '−' : '';
  return sign + Math.round(Math.abs(n)).toLocaleString('vi-VN');
}

export function fmtTr(n: number, dec = 2): string {
  const sign = n < 0 ? '−' : '';
  return (
    sign +
    (Math.abs(n) / 1e6).toLocaleString('vi-VN', {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
    }) +
    ' tr'
  );
}

export function fmtK(n: number): string {
  const sign = n < 0 ? '−' : '';
  const abs = Math.abs(n);
  if (abs >= 1e6) return sign + (abs / 1e6).toFixed(2).replace('.', ',') + 'tr';
  if (abs >= 1000) return sign + (abs / 1000).toFixed(abs >= 100000 ? 0 : 1).replace('.', ',') + 'k';
  return sign + Math.round(abs).toString();
}

export function escAttr(str: string | number): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function escHtml(str: string | number): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
