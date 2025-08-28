import { cn } from '@/lib/utils';
import React from 'react';

/**
 * Props for the PatternVisualizer component.
 */
interface PatternVisualizerProps {
  /** The array of selected coordinates to display, e.g., [[0, 0], [1, 1]] */
  coordinates: [number, number][];
  /** Optional className to apply to the container div for custom sizing or spacing. */
  className?: string;
  /** Optional size for each cell. Defaults to 'h-5 w-5'. */
  cellSize?: string;
}

/**
 * A non-interactive component that displays a visual representation
 * of a bingo pattern on a 5x5 grid.
 */
export const PatternVisualizer: React.FC<PatternVisualizerProps> = ({
  coordinates = [], // Default to empty array to prevent errors
  className,
  cellSize = 'h-5 w-5'
}) => {
  // Use a Set for efficient O(1) lookups to check if a cell is filled.
  const filledCells = React.useMemo(
    () => new Set(coordinates.map(([row, col]) => `${row},${col}`)),
    [coordinates]
  );

  return (
    <div
      className={cn(
        'grid grid-cols-5 gap-1 p-2 bg-background rounded-md border',
        className
      )}>
      {/* Create a 25-cell (5x5) grid */}
      {Array.from({ length: 25 }).map((_, index) => {
        const row = Math.floor(index / 5);
        const col = index % 5;
        const isFilled = filledCells.has(`${row},${col}`);

        return (
          <div
            key={index}
            className={cn(
              'rounded-sm',
              cellSize,
              isFilled ? 'bg-primary' : 'bg-muted'
            )}
            aria-label={`Cell at row ${row + 1}, column ${col + 1} is ${
              isFilled ? 'filled' : 'empty'
            }`}
          />
        );
      })}
    </div>
  );
};
