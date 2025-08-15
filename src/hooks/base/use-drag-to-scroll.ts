import React, { type RefObject, useCallback, useEffect, useState } from 'react';

// ============================================================================
// 1. Custom Hook for Drag-to-Scroll Logic
// ============================================================================
/**
 * A custom hook to add horizontal drag-to-scroll behavior to an element.
 * It works with both mouse and touch events.
 * @param {RefObject<HTMLDivElement>} ref - A React ref attached to the scrollable container.
 */
const useDragToScroll = (ref: RefObject<HTMLDivElement | null>) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      setIsDragging(true);
      setStartX(e.pageX - ref.current.offsetLeft);
      setScrollLeft(ref.current.scrollLeft);
    },
    [ref]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!ref.current) return;
      setIsDragging(true);
      // Use the first touch point
      setStartX(e.touches[0].pageX - ref.current.offsetLeft);
      setScrollLeft(ref.current.scrollLeft);
    },
    [ref]
  );

  const stopDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onDrag = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !ref.current) return;
      // Prevent default touch behavior like page scrolling
      if (e.cancelable) {
        e.preventDefault();
      }

      // Get correct pageX from either mouse or touch event
      const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;

      const x = pageX - ref.current.offsetLeft;
      const walk = (x - startX) * 1.5; // Multiplier adjusts drag sensitivity
      ref.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft, ref]
  );

  // Add global event listeners for move and up/end events
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', stopDragging);
      document.addEventListener('touchmove', onDrag, { passive: false });
      document.addEventListener('touchend', stopDragging);
    }

    return () => {
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', stopDragging);
      document.removeEventListener('touchmove', onDrag);
      document.removeEventListener('touchend', stopDragging);
    };
  }, [isDragging, onDrag, stopDragging]);

  return {
    onMouseDown: handleMouseDown,
    onTouchStart: handleTouchStart,
    isDragging
  };
};

export default useDragToScroll;
