// src/components/ui/site-logo.tsx

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { KanbanSquare } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const logoVariants = cva(
  // Base classes for the container
  'relative inline-flex items-center gap-2 whitespace-nowrap font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-2xl'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
);

const iconVariants = cva('', {
  variants: {
    size: {
      sm: 'h-6 w-6',
      md: 'h-8 w-8',
      lg: 'h-10 w-10'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export interface SiteLogoProps
  extends React.HTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof logoVariants> {
  /**
   * The text to display next to the icon.
   * Not required if `asChild` is true, as content will be passed as children.
   */
  logoText?: string;
  /**
   * An optional custom icon.
   * Not required if `asChild` is true.
   */
  icon?: React.ReactNode;
  /**
   * If true, the component will render its child and pass all props to it.
   * Useful for wrapping with react-router-dom's <Link>.
   */
  asChild?: boolean;
}

export const SiteLogo = React.forwardRef<HTMLAnchorElement, SiteLogoProps>(
  (
    { className, size, logoText, icon, asChild = false, children, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'a';

    // When asChild is false, we must have logoText to render something meaningful.
    if (!asChild && !logoText) {
      console.warn(
        'SiteLogo: `logoText` prop is required when `asChild` is false.'
      );
      return null;
    }

    return (
      <Comp
        className={cn(logoVariants({ size, className }))}
        ref={ref}
        {...props}>
        {/*
          THIS IS THE FIX:
          - If asChild is true, we render the 'children' passed by the parent.
            This ensures <Slot> receives a single child element (e.g., <Link>).
          - If asChild is false, we render the default internal structure.
        */}
        {asChild ? (
          children
        ) : (
          <>
            {icon || (
              <KanbanSquare
                className={cn(iconVariants({ size }), 'text-primary')}
              />
            )}
            <span className="text-foreground">{logoText}</span>
          </>
        )}
      </Comp>
    );
  }
);
