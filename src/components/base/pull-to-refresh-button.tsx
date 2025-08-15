import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';
import * as React from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface PullToRefreshButtonProps {
  /** An async function to be called when the refresh is triggered. */
  onRefresh: () => Promise<unknown> | unknown;
  /** The vertical distance in pixels the user must drag to trigger a refresh. */
  refreshThreshold?: number;
  /** The delay in milliseconds before the refresh is executed after pulling. */
  refreshDelay?: number;
  /** Additional classes for positioning the button. */
  className?: string;
}

const PULL_DISTANCE = 150;

export const PullToRefreshButton: React.FC<PullToRefreshButtonProps> = ({
  onRefresh,
  refreshThreshold = -40,
  refreshDelay = 500, // New prop for delay
  className
}) => {
  const [isFetching, setIsFetching] = React.useState(false);
  const [isHolding, setIsHolding] = React.useState(false); // New state for the delay period
  const y = useMotionValue(0);
  const delayTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Map the drag distance (0 to -threshold) to a progress value (0 to 1)
  const progress = useTransform(y, [0, refreshThreshold], [0, 1]);

  const handleRefresh = async () => {
    if (isFetching) return;

    // Transition from holding to fetching
    setIsHolding(false);
    setIsFetching(true);
    try {
      // Await the onRefresh function, works for both sync and async
      await Promise.resolve(onRefresh());
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsFetching(false);
      // Animate the button back to its original position AFTER the fetch is complete
      animate(y, 0, { type: 'spring', stiffness: 400, damping: 25 });
    }
  };

  const handleDragEnd = () => {
    // Prevent re-triggering if a refresh is already in progress or pending
    if (isFetching || isHolding) return;

    // If dragged past the threshold, trigger the hold-and-refresh sequence
    if (y.get() <= refreshThreshold) {
      setIsHolding(true);
      // Snap the button to the threshold position for a clean "holding" animation
      animate(y, refreshThreshold, {
        type: 'spring',
        stiffness: 400,
        damping: 25
      });

      // Start a timer to execute the refresh after the specified delay
      delayTimeoutRef.current = setTimeout(() => {
        handleRefresh();
      }, refreshDelay);
    } else {
      // If not dragged far enough, just animate back to the start
      animate(y, 0, { type: 'spring', stiffness: 400, damping: 25 });
    }
  };

  // Cleanup timeout on component unmount
  React.useEffect(() => {
    return () => {
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current);
      }
    };
  }, []);

  const getTooltipText = () => {
    if (isFetching) return 'Refreshing...';
    if (isHolding) return 'Hold on...';
    return 'Pull up to refresh';
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            drag={isFetching || isHolding ? false : 'y'} // Disable dragging when busy
            dragConstraints={{ top: -PULL_DISTANCE, bottom: 0 }}
            style={{ y }}
            onDragEnd={handleDragEnd}
            className={cn(
              'fixed bottom-6 right-6 z-50',
              'flex h-14 w-14 items-center justify-center rounded-full border bg-background shadow-lg',
              // Dynamically set cursor based on state
              !isFetching && !isHolding && 'cursor-grab active:cursor-grabbing',
              isHolding && 'cursor-wait',
              isFetching && 'cursor-not-allowed',
              className
            )}>
            {/* Background progress indicator */}
            <motion.div
              style={{ scale: progress, opacity: progress }}
              className="absolute inset-0 rounded-full bg-primary/20"
            />

            {/* Icon switches based on fetching state */}
            {isFetching ? (
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            ) : (
              <RefreshCw className="h-7 w-7 text-primary" />
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
