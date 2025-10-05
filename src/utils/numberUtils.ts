// Utility functions for number formatting and localization

// Persian digits mapping
const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/**
 * Converts Western/Arabic numerals to Persian numerals
 * @param input - String or number to convert
 * @returns String with Persian numerals
 */
export const toPersianNumbers = (input: string | number): string => {
  const str = String(input);
  return str.replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
};

/**
 * Formats numbers based on language locale
 * NOTE: Generic conversion (currently only Persian digits). No grouping here.
 */
export const formatNumber = (number: string | number, language: string): string => {
  const str = String(number);
  
  switch (language) {
    case 'fa':
      return toPersianNumbers(str);
    default:
      return str;
  }
};

/**
 * Formats phone numbers based on language
 * Keeps original structure; only digits are localized for 'fa'.
 */
export const formatPhoneNumber = (phone: string, language: string): string => {
  return formatNumber(phone, language);
};

/**
 * Add dot thousands separators to the integer part of a numeric string.
 * Examples: 30000 -> 30.000, 1234567.89 -> 1.234.567.89 (decimal kept as provided)
 */
const addDotThousands = (input: string): string => {
  if (!input) return '';
  // Normalize: keep digits, optional sign, and one decimal separator if present (either '.' or ',')
  const cleaned = String(input).trim();
  // Split by the last occurrence of '.' or ',' to preserve decimals when present
  const match = cleaned.match(/^(.*?)([.,])(\d+)$/);
  if (match) {
    const intPartRaw = match[1].replace(/[^0-9-]/g, '');
    const sep = match[2];
    const decPart = match[3];
    const intPart = intPartRaw.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${intPart}${sep}${decPart}`;
  }
  const intOnly = cleaned.replace(/[^0-9-]/g, '');
  return intOnly.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Formats currency/price based on language with dot thousands separators.
 * - Applies 1.000 style grouping for all languages
 * - Then localizes digits for Persian (fa)
 */
export const formatPrice = (price: string | number, language: string): string => {
  const grouped = addDotThousands(String(price));
  return language === 'fa' ? toPersianNumbers(grouped) : grouped;
};

/**
 * Formats amounts (e.g., 1.234.567.89) with dot thousands separators
 * and supports Persian digits for 'fa' language.
 */
export const formatAmount = (amount: string | number, language: string): string => {
  const grouped = addDotThousands(String(amount));
  return language === 'fa' ? toPersianNumbers(grouped) : grouped;
};