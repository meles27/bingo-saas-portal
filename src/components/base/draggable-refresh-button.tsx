import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { motion, type PanInfo, type TapInfo } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';
import * as React from 'react';

interface DraggableRefreshButtonProps {
  onRefresh: () => Promise<unknown> | unknown;
  dragBounds?: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
  className?: string;
}

export const DraggableRefreshButton: React.FC<DraggableRefreshButtonProps> = ({
  onRefresh,
  dragBounds,
  className
}) => {
  const [isFetching, setIsFetching] = React.useState(false);
  const [wasDragged, setWasDragged] = React.useState(false);
  const buttonRef = React.useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = React.useState<
    React.ComponentProps<typeof motion.div>['dragConstraints']
  >({ top: 0, left: 0, right: 20, bottom: 0 });

  // Recalculate constraints when the window is resized or bounds change
  React.useLayoutEffect(() => {
    const calculateConstraints = () => {
      if (!buttonRef.current) return;

      const buttonWidth = buttonRef.current.offsetWidth;
      const buttonHeight = buttonRef.current.offsetHeight;

      const newConstraints = {
        top: dragBounds?.top ?? 0,
        left: dragBounds?.left ?? 0,
        right: window.innerWidth - (dragBounds?.right ?? 0) - buttonWidth,
        bottom: window.innerHeight - (dragBounds?.bottom ?? 0) - buttonHeight
      };
      console.log('new constraint', newConstraints);
      setConstraints(newConstraints);
    };

    calculateConstraints(); // Initial calculation
    window.addEventListener('resize', calculateConstraints);
    return () => window.removeEventListener('resize', calculateConstraints);
  }, [dragBounds]);

  const handleRefresh = () => {
    // Prevent multiple refresh requests
    if (isFetching) return;

    setIsFetching(true);
    Promise.resolve(onRefresh())
      .catch((error) => console.error('Refresh failed:', error))
      .finally(() => setIsFetching(false));
  };

  const handleTap = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: TapInfo
  ) => {
    console.log(info.point.x, info.point.y);
    if (wasDragged) {
      setWasDragged(false);
      return;
    }
    handleRefresh();
  };

  // We set a flag on drag to distinguish a drag from a tap
  const handleDragStart = () => {
    setWasDragged(false); // Reset on new drag
  };

  const handleDrag = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (Math.abs(info.offset.x) > 2 || Math.abs(info.offset.y) > 2) {
      setWasDragged(true);
    }
  };

  const getTooltipText = () => {
    if (isFetching) return 'Refreshing...';
    return 'Click to refresh. Drag to move.';
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            ref={buttonRef}
            drag
            dragConstraints={constraints}
            dragMomentum={false}
            onTap={handleTap}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            className={cn(
              'fixed bottom-6 right-6 z-50', // The component is now fixed directly
              'flex h-14 w-14 items-center justify-center rounded-full border bg-background shadow-lg',
              !isFetching && 'cursor-pointer active:cursor-grabbing',
              isFetching && 'cursor-not-allowed',
              className
            )}>
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
