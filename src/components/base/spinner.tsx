import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

// 1. CVA for the OUTER CONTAINER: Now with the 'page' variant.
const spinnerContainerVariants = cva('flex items-center justify-center', {
  variants: {
    variant: {
      default: '',
      // The 'screen' variant for a full-page, fixed overlay
      screen:
        'fixed inset-0 z-50 h-screen w-screen bg-background/60 backdrop-blur-sm',
      // The new 'page' variant for a large section of the page
      page: 'h-[50vh] w-full'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

// 2. CVA for the INNER CONTENT: Arranges the label and dots.
const spinnerContentVariants = cva('flex items-center', {
  variants: {
    direction: {
      horizontal: 'flex-row',
      vertical: 'flex-col'
    },
    size: {
      sm: '',
      md: '',
      lg: ''
    }
  },
  compoundVariants: [
    { direction: 'horizontal', className: 'gap-x-2' },
    { direction: 'vertical', className: 'gap-y-2' }
  ],
  defaultVariants: {
    direction: 'horizontal'
  }
});

// 3. CVA for the individual DOTS.
const dotVariants = cva('animate-pulse', {
  variants: {
    size: {
      sm: 'h-2.5 w-2.5',
      md: 'h-3.5 w-3.5',
      lg: 'h-5 w-5'
    },
    shape: {
      circle: 'rounded-full',
      square: 'rounded-sm'
    },
    color: {
      primary: 'bg-primary/60',
      secondary: 'bg-secondary/60',
      destructive: 'bg-destructive/60',
      success: 'bg-green-500/70',
      warning: 'bg-yellow-500/70'
    }
  },
  defaultVariants: {
    size: 'md',
    shape: 'circle',
    color: 'primary'
  }
});

// --- Prop Interface ---

export interface SpinnerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof spinnerContainerVariants> {
  direction?: VariantProps<typeof spinnerContentVariants>['direction'];
  size?: VariantProps<typeof dotVariants>['size'];
  shape?: VariantProps<typeof dotVariants>['shape'];
  color?: VariantProps<typeof dotVariants>['color'];
  label?: string;
  labelClassName?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  className,
  variant,
  direction,
  size,
  shape,
  color,
  label,
  labelClassName,
  ...props
}) => {
  const animationDelays = [
    '[animation-delay:-0.3s]',
    '[animation-delay:-0.15s]',
    '[animation-delay:0s]'
  ];

  const defaultLabelClasses = 'text-sm font-medium text-muted-foreground';

  return (
    <div
      className={cn(spinnerContainerVariants({ variant, className }))}
      {...props}
      role="status"
      aria-live="polite"
      aria-label={label ? label : 'Loading...'}>
      <div className={cn(spinnerContentVariants({ direction, size }))}>
        {label && (
          <span className={cn(defaultLabelClasses, labelClassName)}>
            {label}
          </span>
        )}
        {!label && <span className="sr-only">Loading...</span>}

        {animationDelays.map((delay, index) => (
          <div
            key={index}
            className={cn(dotVariants({ size, shape, color }), delay)}
          />
        ))}
      </div>
    </div>
  );
};
