// src/lib/currency.ts

/**
 * Returns currency symbol and its position based on locale.
 * @param locale - e.g., "en-US", "de-DE"
 * @param currency - e.g., "USD", "EUR"
 * @returns An object with the symbol and its position ('prefix' or 'postfix').
 */
export function getCurrencyInfo(locale: string, currency: string) {
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    const parts = formatter.formatToParts(1);
    const symbolPart = parts.find((part) => part.type === 'currency');

    // Determine position
    const position = parts[0].type === 'currency' ? 'prefix' : 'postfix';

    return {
      symbol: symbolPart?.value || '$',
      position
    };
  } catch (error) {
    console.error('Failed to get currency info:', error);
    // Fallback for invalid locales/currencies
    return { symbol: '$', position: 'prefix' as const };
  }
}
