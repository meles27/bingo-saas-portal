import { useDynamicHeader } from '@/hooks/base/use-dynamic-header';
import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';

export interface MobileNavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}

export interface MobileNavigationProps {
  items: MobileNavigationItem[];
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  items
}) => {
  const config = useDynamicHeader();

  return (
    <nav
      className="sticky bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 overflow-x-auto"
      aria-label="Mobile Navigation">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-3">
        {items.map((item) => {
          const isActive = config.id === item.id;
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="lg"
              onClick={item.onClick}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center gap-1 transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}>
              <item.icon className="h-6 w-6" aria-hidden="true" />
              <span
                className={cn(
                  'text-xs leading-none',
                  isActive && 'font-semibold'
                )}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};
