import classNames from 'classnames';
import { motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import useDragToScroll from '../../hooks/use-drag-to-scroll';

// ============================================================================
// 2. The Refactored Component
// ============================================================================
interface HorizontalDragScrollProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  resetScroll?: boolean;
}

const HorizontalDragScroll: React.FC<HorizontalDragScrollProps> = ({
  children,
  className,
  animate,
  resetScroll
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { onMouseDown, onTouchStart, isDragging } =
    useDragToScroll(containerRef);

  useEffect(() => {
    if (containerRef.current && resetScroll) {
      containerRef.current.scrollLeft = 0;
    }
  }, [resetScroll]);

  const motionProps = {
    // Each child is now a flex item that takes up the full width of the container.
    // `flex-none` prevents the item from shrinking.
    className: 'flex-none w-full h-full',
    ...(animate && {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.4, ease: 'easeOut' as const }
    })
  };

  return (
    <div
      ref={containerRef}
      className={classNames(
        'w-full overflow-x-auto scrollbar-hide cursor-grab',
        className
      )}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none'
      }}>
      <div className="flex">
        {React.Children.map(children, (child, index) =>
          React.isValidElement(child) ? (
            <motion.div key={index} {...motionProps}>
              {child}
            </motion.div>
          ) : (
            child
          )
        )}
      </div>
    </div>
  );
};

export default HorizontalDragScroll;
