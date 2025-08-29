import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import ReactDatePicker, { type DatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { Input } from '@/components/ui/input';

const CustomInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<'input'>
>(({ value, onClick }, ref) => (
  <div className="relative w-full">
    <Input value={value} onClick={onClick} ref={ref} readOnly />
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
    </div>
  </div>
));

const DateTimePicker = React.forwardRef<ReactDatePicker, DatePickerProps>(
  (props, ref) => {
    return (
      <ReactDatePicker
        ref={ref}
        {...props}
        showTimeSelect
        showMonthDropdown
        dateFormat="yyyy-MM-dd HH:mm"
        timeIntervals={15}
        customInput={<CustomInput />}
      />
    );
  }
);

DateTimePicker.displayName = 'DateTimePicker';

export { DateTimePicker };
