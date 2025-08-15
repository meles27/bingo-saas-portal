import { Button } from '@/components/ui/button'; // Assuming you use shadcn/ui
import { useMemo, useState } from 'react';

interface TruncatedTextProps {
  /** The full text string you want to display */
  text: string;
  /** The number of characters to show before truncating */
  maxLength: number;
  /** Optional CSS classes to apply to the container div */
  className?: string;
}

/**
 * A component that truncates text and provides a "Show More" / "Show Less"
 * button to expand or collapse the content.
 */
export function TruncatedText({
  text,
  maxLength,
  className
}: TruncatedTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const needsTruncation = useMemo(
    () => text.length > maxLength,
    [text, maxLength]
  );

  // If the text is short enough, just render it without any buttons.
  if (!needsTruncation) {
    return <p className={className}>{text}</p>;
  }

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={className}>
      <p className="inline">
        {isExpanded ? text : `${text.slice(0, maxLength)}...`}
      </p>
      {/* 
        The button is styled as a link to be less obtrusive.
        "h-auto" and "p-1" make it small and compact.
        The left margin adds a little space between the text and the button.
      */}
      <Button
        variant="link"
        className="inline h-auto p-1 pl-0 text-xs font-semibold"
        onClick={toggleText}>
        {isExpanded ? 'Show Less' : 'Show More'}
      </Button>
    </div>
  );
}
