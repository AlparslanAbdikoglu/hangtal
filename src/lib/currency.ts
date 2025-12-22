const DEFAULT_CURRENCY = import.meta.env.VITE_WOO_CURRENCY || "HUF";
const DEFAULT_LOCALE = import.meta.env.VITE_WOO_CURRENCY_LOCALE || "hu-HU";

export const formatWooPrice = (value: number) => {
  try {
    return new Intl.NumberFormat(DEFAULT_LOCALE, {
      style: "currency",
      currency: DEFAULT_CURRENCY,
      maximumFractionDigits: DEFAULT_CURRENCY === "HUF" ? 0 : 2,
    }).format(value);
  } catch {
    const symbol = DEFAULT_CURRENCY === "HUF" ? "Ft" : DEFAULT_CURRENCY;
    return `${value.toFixed(DEFAULT_CURRENCY === "HUF" ? 0 : 2)} ${symbol}`;
  }
};

export const wooCurrencyCode = DEFAULT_CURRENCY;
