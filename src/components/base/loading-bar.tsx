import { cn } from '@/lib/utils';
import React from 'react';

// --- Prop Interface ---
interface LoadingBarProps {
  /**
   * When true, the loading bar is visible and animating.
   */
  isLoading: boolean;
  /**
   * Optional custom class names for the container.
   */
  className?: string;
}

export const LoadingBar: React.FC<LoadingBarProps> = ({ isLoading, className }) => {
  // Define the keyframes animation directly in a <style> tag.
  // This is the most reliable way to create a custom, looping animation
  // without modifying the global tailwind.config.js file.
  const animationStyle = `
    @keyframes indeterminate-progress-bar {
      0% { transform: translateX(-100%) scaleX(0.1); }
      20% { transform: translateX(-100%) scaleX(0.4); }
      50% { transform: translateX(0%) scaleX(0.6); }
      80% { transform: translateX(100%) scaleX(0.4); }
      100% { transform: translateX(100%) scaleX(0.1); }
    }
  `;

  return (
    <>
      {/* Inject the keyframes into the document head */}
      <style>{animationStyle}</style>

      <div
        role="progressbar"
        aria-busy={isLoading}
        aria-valuetext="Loading"
        // Use data-state for clear state management, similar to shadcn/ui components
        data-state={isLoading ? 'loading' : 'idle'}
        className={cn(
          'fixed left-0 top-0 z-[100] h-1 w-full overflow-hidden bg-primary/20',
          'transition-opacity duration-300',
          // Fade out when idle, fully visible when loading
          'data-[state=idle]:opacity-0',
          'data-[state=loading]:opacity-100',
          className
        )}>
        <div
          className={cn(
            'h-full w-full origin-left bg-primary',
            // Add a subtle glow effect for better visibility
            '[box-shadow:0_0_10px_theme(colors.primary),_0_0_5px_theme(colors.primary)]'
          )}
          style={{
            // Apply the animation directly via the style prop
            animation: isLoading
              ? 'indeterminate-progress-bar 1.5s infinite ease-in-out'
              : 'none'
          }}
        />
      </div>
    </>
  );
};
