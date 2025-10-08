import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import React, { useMemo } from 'react';

interface BingoCardVisualizerProps {
  /** The card layout, an array of [row, col, value]. */
  layout: [number, number, number][];
  /** Whether the center space (2, 2) is a free space. */
  freespaceEnabled: boolean;
  /** Optional className for custom sizing. */
  className?: string;
}

/**
 * Renders a 5x5 Bingo card grid based on layout data.
 */
export const BingoCardVisualizer: React.FC<BingoCardVisualizerProps> = ({
  layout,
  freespaceEnabled,
  className
}) => {
  // Use a Map for efficient O(1) lookups to get the value for a given cell.
  // This is calculated only when the layout prop changes.
  const layoutMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const [row, col, value] of layout) {
      map.set(`${row},${col}`, value);
    }
    return map;
  }, [layout]);

  return (
    <div
      className={cn(
        'grid grid-cols-5 gap-1 p-1 bg-muted/50 rounded-md border aspect-square',
        className
      )}
      role="grid"
      aria-label="Bingo card layout">
      {/* Create a 25-cell (5x5) grid */}
      {Array.from({ length: 25 }).map((_, index) => {
        const row = Math.floor(index / 5);
        const col = index % 5;

        const isFreeSpace = freespaceEnabled && row === 2 && col === 2;
        const cellValue = layoutMap.get(`${row},${col}`);

        return (
          <div
            key={`${row}-${col}`}
            className={cn(
              'flex items-center justify-center rounded-sm bg-background aspect-square',
              'text-sm font-semibold text-foreground',
              isFreeSpace && 'bg-primary/20 text-primary'
            )}>
            {isFreeSpace ? <Star className="h-4 w-4" /> : cellValue}
          </div>
        );
      })}
    </div>
  );
};
