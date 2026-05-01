import { CurrencyCode } from '@/constants';
import { useAppStore } from '@/store/useAppStore';

const FALLBACK = { CNY_USD: 0.14, CNY_SAR: 0.52, USD_SAR: 3.75 };

function getRates() {
  const s = useAppStore.getState().settings;
  return {
    CNY_USD: s?.rate_cny_usd ?? FALLBACK.CNY_USD,
    CNY_SAR: s?.rate_cny_sar ?? FALLBACK.CNY_SAR,
    USD_SAR: s?.rate_usd_sar ?? FALLBACK.USD_SAR,
  };
}

export function convertCurrency(amount: number, from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return amount;
  const r = getRates();
  // Convert via USD as pivot
  let usd = amount;
  if (from === 'CNY') usd = amount * r.CNY_USD;
  else if (from === 'SAR') usd = amount / r.USD_SAR;
  // Now convert from USD to target
  if (to === 'USD') return usd;
  if (to === 'CNY') return usd / r.CNY_USD;
  if (to === 'SAR') return usd * r.USD_SAR;
  return amount;
}

export function formatCurrency(amount: number, currency: CurrencyCode): string {
  const symbols: Record<CurrencyCode, string> = { CNY: '¥', USD: '$', SAR: 'ر.س' };
  const formatted = amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return `${symbols[currency]}${formatted}`;
}

export function getCurrencySymbol(currency: CurrencyCode): string {
  const symbols: Record<CurrencyCode, string> = { CNY: '¥', USD: '$', SAR: 'ر.س' };
  return symbols[currency];
}
