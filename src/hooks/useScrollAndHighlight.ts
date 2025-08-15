import { useEffect, useRef, type RefObject } from 'react';

type ElementTarget = string | RefObject<HTMLElement | null>;

const useScrollAndHighlight = () => {
  const timeoutRef = useRef<NodeJS.Timeout>(undefined);
  const animationRef = useRef<NodeJS.Timeout>(undefined);

  const scrollToAndHighlight = (
    target: ElementTarget,
    options: {
      scrollBehavior?: ScrollBehavior;
      scrollBlock?: ScrollLogicalPosition;
      highlightClasses?: string[];
      highlightDuration?: number;
      delay?: number;
    } = {}
  ) => {
    // Clear any pending operations
    clearTimeout(timeoutRef.current);
    clearTimeout(animationRef.current);

    const {
      scrollBehavior = 'smooth',
      scrollBlock = 'center',
      highlightClasses = ['bg-indigo-100', 'ring-2', 'ring-indigo-400'],
      highlightDuration = 1000,
      delay = 100
    } = options;

    timeoutRef.current = setTimeout(() => {
      let element: HTMLElement | null = null;

      if (typeof target === 'string') {
        // ID-based targeting
        element = document.getElementById(target);
      } else {
        // Ref-based targeting
        element = target.current;
      }

      if (element) {
        // Scroll to element
        element.scrollIntoView({
          behavior: scrollBehavior,
          block: scrollBlock
        });

        // Add highlight classes
        element.classList.add(...highlightClasses);

        // Remove highlight after duration
        animationRef.current = setTimeout(() => {
          element?.classList.remove(...highlightClasses);
        }, highlightDuration);
      }
    }, delay);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
      clearTimeout(animationRef.current);
    };
  }, []);

  return scrollToAndHighlight;
};

export default useScrollAndHighlight;
