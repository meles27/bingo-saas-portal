import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function to conditionally join class names together.
 * It merges Tailwind CSS classes and resolves conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Enhanced formatDate Utility ---

// Define the available formatting options for better type-safety and auto-completion.
type TFormatDateVariant =
  | 'full' // e.g., "Wednesday, June 26, 2024"
  | 'long' // e.g., "June 26, 2024"
  | 'short' // e.g., "6/26/2024"
  | 'dateTime' // e.g., "June 26, 2024, 5:30 PM"
  | 'relative' // e.g., "2 hours ago"
  | 'time'; // e.g., "5:30 PM"

interface FormatDateOptions {
  /** The desired format preset. Defaults to 'long'. */
  variant?: TFormatDateVariant;
  /** The locale to use for formatting. Defaults to the user's browser language. */
  locale?: string;
}

/**
 * A modern and versatile date formatting utility.
 *
 * @param dateInput The date to format (can be a Date object, string, or timestamp).
 * @param options Configuration options for formatting, including the variant.
 * @returns A formatted date string, or a fallback for invalid dates.
 */
export const formatDate = (
  dateInput: Date | string | number | null,
  options: FormatDateOptions = {}
): string => {
  const { variant = 'long', locale = 'en-US' } = options;
  if (!dateInput) {
    return 'N/A';
  }
  // 1. Create a valid Date object or return a fallback.
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  // 2. Handle the 'relative' time format variant.
  if (variant === 'relative') {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    let count;
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      count = Math.floor(seconds / secondsInUnit);
      if (count > 0) {
        return rtf.format(-count, unit as Intl.RelativeTimeFormatUnit);
      }
    }
    return 'just now';
  }

  // 3. Define formatting options for other variants.
  const formatOptions: Record<
    Exclude<TFormatDateVariant, 'relative'>,
    Intl.DateTimeFormatOptions
  > = {
    full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    short: { year: 'numeric', month: 'numeric', day: 'numeric' },
    dateTime: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    },
    time: { hour: 'numeric', minute: '2-digit' }
  };

  // 4. Format the date using the selected variant.
  return new Intl.DateTimeFormat(locale, formatOptions[variant]).format(date);
};
