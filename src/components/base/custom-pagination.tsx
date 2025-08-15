import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

// The new, cleaner props interface
interface CustomPaginationProps {
  totalItems: number;
  pageSize: number;
  /** The initial page index (0-based). Defaults to 0. */
  initialPage?: number;
  /** Callback fired when the page changes. Receives the new 0-based page index. */
  onPageChange: (page: number) => void;
}

// The ref interface remains the same, as its purpose is still valid.
export interface CustomPaginationRefIFace {
  /** Resets the customPagination to the first page. */
  reset: () => void;
  /** Returns the current 0-based page index. */
  getCurrentPage: () => number;
}

export const CustomPagination = forwardRef<
  CustomPaginationRefIFace,
  CustomPaginationProps
>(({ totalItems, pageSize, initialPage = 0, onPageChange }, ref) => {
  // Use useState for currentPage to trigger re-renders correctly.
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Calculate total pages. Use Math.max(1, ...) to avoid 0 pages if totalItems is 0.
  const totalPages = Math.ceil(totalItems / pageSize);

  // Effect to sync the internal state if the initialPage prop changes from the parent.
  useEffect(() => {
    // Ensure the initialPage is valid before setting it.
    if (initialPage >= 0 && initialPage < totalPages) {
      setCurrentPage(initialPage);
    }
  }, [initialPage, totalPages]);

  // Expose control methods to the parent component via the ref.
  useImperativeHandle(ref, () => ({
    reset: () => {
      setCurrentPage(0);
      onPageChange(0); // Also notify parent of the reset.
    },
    getCurrentPage: () => currentPage
  }));

  const handlePrevious = () => {
    const newPage = Math.max(0, currentPage - 1);
    setCurrentPage(newPage);
    onPageChange(newPage);
  };

  const handleNext = () => {
    const newPage = Math.min(totalPages - 1, currentPage + 1);
    setCurrentPage(newPage);
    onPageChange(newPage);
  };

  // Don't render the component if there's only one page or no items.
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between w-full">
      <div className="text-sm text-muted-foreground">
        {totalItems} total items
      </div>
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentPage === 0}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <div className="text-sm font-medium">
          Page {currentPage + 1} of {totalPages}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentPage >= totalPages - 1}>
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
});
