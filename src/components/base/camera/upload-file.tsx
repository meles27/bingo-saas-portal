import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';
import React, { forwardRef } from 'react';

// Define the props for our component
interface UploadButtonProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * The text content to display within the tooltip.
   * @default "Upload a file"
   */
  tooltipContent?: string;
}

const UploadFile = forwardRef<HTMLInputElement, UploadButtonProps>(
  ({ className, tooltipContent = 'Upload a file', id, ...rest }, ref) => {
    // Use the passed 'id' for the label and input, or create a default one.
    // This is crucial for the label's `htmlFor` to work correctly.
    const inputId = id || 'file-upload';

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {/* The label acts as the clickable trigger, styled like a shadcn button */}
            <label
              htmlFor={inputId}
              className={cn(
                'inline-flex h-14 w-14 cursor-pointer items-center justify-center rounded-full text-sm font-medium transition-colors',
                'bg-primary text-primary-foreground hover:bg-primary/90',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                className
              )}>
              <Upload className="h-6 w-6" />
              <span className="sr-only">Upload File</span>
              <input
                id={inputId}
                type="file"
                ref={ref}
                className="hidden"
                {...rest}
              />
            </label>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

// Assigning a display name is a good practice for debugging with React DevTools.
UploadFile.displayName = 'UploadFile';

export default UploadFile;
