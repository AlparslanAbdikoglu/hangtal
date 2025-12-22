export interface CurrencySource {
  currency?: string;
  currency_code?: string;
  currency_symbol?: string;
  prices?: { currency_code?: string; currency_symbol?: string };
  meta_data?: { key: string; value: unknown }[];
  price_html?: string;
}

export interface CurrencyInfo {
  code: string;
  symbol: string;
}

const DEFAULT_CURRENCY: CurrencyInfo = { code: "HUF", symbol: "Ft" };

const META_CURRENCY_KEYS = ["currency", "_currency", "_order_currency", "current_currency"];

const extractSymbolFromHtml = (priceHtml?: string): string | undefined => {
  if (!priceHtml) return undefined;
  const stripped = priceHtml.replace(/<[^>]+>/g, " ");
  const match = stripped.match(/([^\d.,\s]+)/);
  return match?.[1]?.trim() || undefined;
};

const getIntlSymbol = (code: string): string | undefined => {
  try {
    const parts = new Intl.NumberFormat("hu-HU", {
      style: "currency",
      currency: code,
      minimumFractionDigits: 2,
    }).formatToParts(0);
    return parts.find((p) => p.type === "currency")?.value;
  } catch {
    return undefined;
  }
};

export const getCurrencyInfo = (source?: CurrencySource | null): CurrencyInfo => {
  if (!source) return DEFAULT_CURRENCY;

  const metaCurrency = source.meta_data?.find((meta) => META_CURRENCY_KEYS.includes(meta.key))?.value;
  const metaCurrencyCode = typeof metaCurrency === "string" ? metaCurrency : undefined;
  const explicitSymbol =
    source.currency_symbol ||
    source.prices?.currency_symbol ||
    (typeof metaCurrency === "object" && metaCurrency !== null && "symbol" in (metaCurrency as Record<string, unknown>)
      ? String((metaCurrency as Record<string, unknown>).symbol)
      : undefined);

  const code =
    source.currency ||
    source.currency_code ||
    source.prices?.currency_code ||
    metaCurrencyCode ||
    DEFAULT_CURRENCY.code;

  const symbol =
    explicitSymbol ||
    extractSymbolFromHtml(source.price_html) ||
    getIntlSymbol(code) ||
    DEFAULT_CURRENCY.symbol;

  return { code, symbol };
};

export const formatMoney = (amount: number, currency: CurrencyInfo): string => {
  if (!Number.isFinite(amount)) return `${currency.symbol} 0.00`;
  try {
    return new Intl.NumberFormat("hu-HU", {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency.symbol || currency.code}`;
  }
};

export { DEFAULT_CURRENCY };
