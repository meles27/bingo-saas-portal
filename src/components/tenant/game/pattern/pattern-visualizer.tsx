import { cn } from '@/lib/utils';
import { Star } from 'lucide-react'; // Using an icon for the free space
import React from 'react';

/**
 * Props for the modern PatternVisualizer component.
 */
interface PatternVisualizerProps {
  /** The array of selected coordinates to display, e.g., [[0, 0], [1, 1]] */
  coordinates: [number, number][];
  /** Show the center cell (2, 2) as a "free space". Defaults to true. */
  showFreeSpace?: boolean;
  /** Optional className to apply to the container for custom sizing or spacing. */
  className?: string;
}

/**
 * A single cell within the pattern grid.
 * Encapsulating the cell logic makes the main component cleaner.
 */
const Cell = React.memo(
  ({ isFilled, isFreeSpace }: { isFilled: boolean; isFreeSpace: boolean }) => {
    return (
      <div
        className={cn(
          // Base styles for all cells
          'aspect-square rounded-sm flex items-center justify-center transition-all duration-300 ease-in-out',
          {
            'bg-primary scale-105 shadow-md': isFilled && !isFreeSpace,
            'bg-muted/50': !isFilled && !isFreeSpace,
            'bg-primary/20 text-primary': isFreeSpace
          }
        )}
        aria-hidden="true" // Decorative element; main container has ARIA info
      >
        {isFreeSpace && <Star className="h-3/4 w-3/4" />}
      </div>
    );
  }
);
Cell.displayName = 'PatternCell';

/**
 * A non-interactive component that displays a modern, visually appealing
 * representation of a bingo pattern on a 5x5 grid.
 */
export const PatternVisualizer: React.FC<PatternVisualizerProps> = ({
  coordinates = [],
  showFreeSpace = true,
  className
}) => {
  // Use a Set for efficient O(1) lookups to check if a cell is filled.
  const filledCells = React.useMemo(
    () => new Set(coordinates.map(([row, col]) => `${row},${col}`)),
    [coordinates]
  );

  return (
    <div
      className={cn(
        'grid grid-cols-5 gap-1.5 p-1 bg-background rounded-md',
        className
      )}
      role="grid"
      aria-label="Bingo pattern visualizer">
      {Array.from({ length: 25 }).map((_, index) => {
        const row = Math.floor(index / 5);
        const col = index % 5;

        const isCenterCell = row === 2 && col === 2;
        const isFreeSpace = showFreeSpace && isCenterCell;
        const isFilled = filledCells.has(`${row},${col}`);

        return (
          <Cell
            key={`${row}-${col}`}
            isFilled={isFilled}
            isFreeSpace={isFreeSpace}
          />
        );
      })}
    </div>
  );
};
