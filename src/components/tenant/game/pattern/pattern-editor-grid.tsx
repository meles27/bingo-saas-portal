import { cn } from '@/lib/utils';
import React, { useMemo } from 'react';

/**
 * The props for the PatternEditorGrid component.
 * It's designed to be easily integrated with react-hook-form.
 */
interface PatternEditorGridProps {
  /** The current array of selected coordinates, e.g., [[0, 0], [1, 1]] */
  value: [number, number][];
  /** A callback function that fires with the new array of coordinates when a cell is clicked. */
  onChange: (coords: [number, number][]) => void;
  /** Optional className to apply to the container div */
  className?: string;
}

/**
 * A visual 5x5 grid editor for selecting bingo pattern coordinates.
 * It allows users to toggle cells on and off to define a shape.
 */
export const PatternEditorGrid: React.FC<PatternEditorGridProps> = ({
  value = [], // Default to empty array to prevent errors
  onChange,
  className
}) => {
  // Use a Set for efficient O(1) lookups to check if a cell is selected.
  // Memoize it so it only recalculates when the `value` prop changes.
  const selectedCells = useMemo(
    () => new Set(value.map(([row, col]) => `${row},${col}`)),
    [value]
  );

  const handleCellClick = (row: number, col: number) => {
    const key = `${row},${col}`;
    const newSelected = new Set(selectedCells);

    // Toggle the cell's selection state
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }

    // Convert the Set of string keys back to an array of coordinate tuples
    const newCoordinates = Array.from(newSelected).map((k) =>
      k.split(',').map(Number)
    ) as [number, number][];

    // Fire the onChange callback to update the form state in the parent
    onChange(newCoordinates);
  };

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
        const isSelected = selectedCells.has(`${row},${col}`);

        return (
          <button
            type="button" // Important: prevents the button from submitting the form
            key={index}
            onClick={() => handleCellClick(row, col)}
            aria-pressed={isSelected}
            className={cn(
              'h-9 w-9 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              isSelected
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted hover:bg-muted/80'
            )}
          />
        );
      })}
    </div>
  );
};
