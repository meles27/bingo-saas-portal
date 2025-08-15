import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React from 'react';

// --- SVG Component (Preserved) ---
const EmptyListIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={48} // Increased size for better visual impact
    height={48}
    viewBox="0 0 33 32"
    fill="none">
    <g id="File Serch">
      <path
        id="Vector"
        d="M19.9762 4V8C19.9762 8.61954 19.9762 8.92931 20.0274 9.18691C20.2379 10.2447 21.0648 11.0717 22.1226 11.2821C22.3802 11.3333 22.69 11.3333 23.3095 11.3333H27.3095M18.6429 19.3333L20.6429 21.3333M19.3095 28H13.9762C10.205 28 8.31934 28 7.14777 26.8284C5.9762 25.6569 5.9762 23.7712 5.9762 20V12C5.9762 8.22876 5.9762 6.34315 7.14777 5.17157C8.31934 4 10.205 4 13.9762 4H19.5812C20.7604 4 21.35 4 21.8711 4.23403C22.3922 4.46805 22.7839 4.90872 23.5674 5.79006L25.9624 8.48446C26.6284 9.23371 26.9614 9.60833 27.1355 10.0662C27.3095 10.524 27.3095 11.0253 27.3095 12.0277V20C27.3095 23.7712 27.3095 25.6569 26.138 26.8284C24.9664 28 23.0808 28 19.3095 28ZM19.3095 16.6667C19.3095 18.5076 17.8171 20 15.9762 20C14.1352 20 12.6429 18.5076 12.6429 16.6667C12.6429 14.8257 14.1352 13.3333 15.9762 13.3333C17.8171 13.3333 19.3095 14.8257 19.3095 16.6667Z"
        className="stroke-primary" // Use theme's primary color
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

// --- Prop Interface ---
interface EmptyListProps {
  /** The name of the item that is missing, e.g., "products", "users". */
  itemName?: string;
  /** An optional message to display below the main title. */
  message?: string;
  /** An optional primary action button to display. */
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  /** An optional callback for a "Clear Filter" style secondary button. */
  clearCallback?: () => void;
  /** Additional class names for the container. */
  className?: string;
}

export const EmptyList: React.FC<EmptyListProps> = ({
  itemName = 'items',
  message = "Try adjusting your search or filters to find what you're looking for.",
  actionButton,
  clearCallback,
  className
}) => {
  return (
    <div
      className={cn(
        'flex h-full min-h-80 w-full items-center justify-center rounded-lg border-2 border-dashed bg-card p-8 text-center',
        className
      )}>
      <div className="flex max-w-sm flex-col items-center gap-6">
        {/* Icon Container */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <EmptyListIcon />
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-card-foreground">
            No {itemName} found
          </h2>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {clearCallback && (
            <Button variant="outline" onClick={clearCallback}>
              Clear Filters
            </Button>
          )}
          {actionButton && (
            <Button onClick={actionButton.onClick}>{actionButton.label}</Button>
          )}
        </div>
      </div>
    </div>
  );
};
