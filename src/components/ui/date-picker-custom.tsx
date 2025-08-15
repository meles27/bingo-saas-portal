import * as React from 'react';
import ReactDatePicker, { type DatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Default styling

import { Input } from '@/components/ui/input';
import { CalendarIcon } from 'lucide-react';

// You will need to add custom CSS to style react-datepicker like shadcn/ui
// See Step 3 below for the CSS content.
// import './date-picker-custom.css';

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (props, ref) => {
    return (
      <ReactDatePicker
        {...props}
        // Use a custom input component that looks like shadcn's Input
        customInput={
          <div className="relative w-full">
            <Input ref={ref} />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        }
      />
    );
  }
);

DatePicker.displayName = 'DatePicker';

export { DatePicker };
