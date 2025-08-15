// src/components/ui/password-input.tsx

'use client';

import { Eye, EyeOff } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const toggleVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className={cn('relative', className)}>
      <Input
        type={showPassword ? 'text' : 'password'}
        // Add padding to the right to prevent text from overlapping the icon
        className="pr-10"
        ref={ref}
        {...props}
      />
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full text-muted-foreground hover:bg-transparent"
              onClick={toggleVisibility}
              // Prevent the button from being focused when tabbing through a form
              // This is a stylistic choice; you can remove it if you want the button to be part of the tab order.
              tabIndex={-1}>
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
              <span className="sr-only">
                {showPassword ? 'Hide password' : 'Show password'}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{showPassword ? 'Hide password' : 'Show password'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
});

export default PasswordInput;
