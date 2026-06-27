export function formatMoney(value) {
  try {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  } catch {
    return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
  }
}

export function formatDateTime(value) {
  try {
    return new Date(value).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return value;
  }
}

export function buildOrderId() {
  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  return `SC-${datePart}-${randomPart}`;
}

export function parsePrice(value) {
  const raw = String(value).trim().replace(/[^\d.,]/g, '');
  const commaIndex = raw.lastIndexOf(',');
  const dotIndex = raw.lastIndexOf('.');
  const decimalIndex = Math.max(commaIndex, dotIndex);

  if (decimalIndex === -1) {
    return Number(raw.replace(/[^\d]/g, ''));
  }

  const whole = raw.slice(0, decimalIndex).replace(/[^\d]/g, '');
  const cents = raw.slice(decimalIndex + 1).replace(/[^\d]/g, '');
  return Number(`${whole || '0'}.${cents || '0'}`);
}
