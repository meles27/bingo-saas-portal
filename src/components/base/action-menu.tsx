import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem as DropdownMenuItemPrimitive,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { MoreVertical } from 'lucide-react';
import React from 'react';

// --- Prop Interface for the new Child Component (Unchanged) ---
export interface ActionMenuItemProps {
  /**
   * An optional icon to display next to the label.
   */
  icon?: React.ReactNode;
  /**
   * The text to display for the menu item.
   */
  label: string;
  /**
   * A callback function that is executed on click.
   * It receives the `value` prop.
   */
  callback: () => unknown;
  /**
   * Optional custom class names for the menu item.
   */
  className?: string;
  /**
   * If true, this action will not be rendered.
   */
  hide?: boolean;
}

/**
 * ActionMenuItem is a child component for ActionMenu.
 * It renders a single dropdown item with an icon, label, and callback.
 */
export function ActionMenuItem({
  hide,
  callback,
  className,
  icon,
  label
}: ActionMenuItemProps) {
  // Do not render the component if the `hide` prop is true
  if (hide) {
    return null;
  }

  return (
    <DropdownMenuItemPrimitive
      onClick={() => callback()}
      className={cn(
        'flex cursor-pointer items-center gap-2', // Default styling
        className // Allow custom styling
      )}>
      {icon && (
        <span className="flex h-4 w-4 items-center justify-center flex-shrink-0">
          {icon}
        </span>
      )}
      <span>{label}</span>
    </DropdownMenuItemPrimitive>
  );
}

// --- Prop Interface for the Parent `ActionMenu` (Updated) ---
interface ActionMenuProps {
  /**
   * Optional label to display at the top of the menu.
   */
  label?: string;
  /**
   * The child components to render, typically `ActionMenuItem` components.
   */
  children: React.ReactNode;
  /**
   * An optional custom component to be used as the trigger for the dropdown.
   * If not provided, a default "more vertical" icon button will be used.
   */
  trigger?: React.ReactNode;
}

/**
 * ActionMenu is a wrapper that provides a dropdown menu.
 * It accepts a custom `trigger` and `ActionMenuItem` children.
 */
export function ActionMenu({ label, children, trigger }: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* If a custom trigger is provided, render it. Otherwise, render the default icon button. */}
        {trigger || (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Render the optional label */}
        {label && <DropdownMenuLabel>{label}</DropdownMenuLabel>}
        {/* Render the children passed to the component */}
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
