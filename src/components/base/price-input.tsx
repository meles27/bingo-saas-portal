// src/components/ui/price-input.tsx
'use client';

import { Input } from '@/components/ui/input';
import { getCurrencyInfo } from '@/lib/currency';
import { cn } from '@/lib/utils';
import * as React from 'react';

// You can keep the config import if you have one
// import config from "@/config";

// Extend the standard InputProps for full compatibility
export interface PriceInputProps extends React.ComponentProps<'input'> {
  currency?: string;
  locale?: string;
}

export const PriceInput = React.forwardRef<HTMLInputElement, PriceInputProps>(
  (
    {
      className,
      currency = 'USD' /* config.CURRENCY */,
      locale = 'en-US',
      ...props
    },
    ref
  ) => {
    const currencyInfo = React.useMemo(
      () => getCurrencyInfo(locale, currency),
      [currency, locale]
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow navigation and modification keys
      if (
        [
          'Backspace',
          'Tab',
          'ArrowLeft',
          'ArrowRight',
          'Delete',
          'Home',
          'End'
        ].includes(e.key)
      ) {
        return;
      }

      // Prevent multiple decimal points
      if (e.key === '.' && e.currentTarget.value.includes('.')) {
        e.preventDefault();
      }

      // Allow only numbers and a single decimal point
      if (!/^[0-9.]$/.test(e.key)) {
        e.preventDefault();
      }
    };

    return (
      <div className={cn('relative w-full', className)}>
        {/* Render symbol as a prefix */}
        {currencyInfo.position === 'prefix' && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {currencyInfo.symbol}
          </span>
        )}

        <Input
          type="text" // Use text to avoid browser's number input spinners
          inputMode="decimal"
          ref={ref}
          onKeyDown={handleKeyDown}
          className={cn(
            // Add padding based on symbol position
            {
              'pl-12': currencyInfo.position === 'prefix',
              'pr-12': currencyInfo.position === 'postfix'
            }
          )}
          {...props}
        />

        {/* Render symbol as a postfix */}
        {currencyInfo.position === 'postfix' && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {currencyInfo.symbol}
          </span>
        )}
      </div>
    );
  }
);
