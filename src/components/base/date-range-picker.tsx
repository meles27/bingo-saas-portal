import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths
} from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import React, { useState } from 'react';
import { type DateRange } from 'react-day-picker';

// --- Helper Functions & Data ---

const presets = [
  {
    label: 'Today',
    range: { from: startOfDay(new Date()), to: endOfDay(new Date()) }
  },
  {
    label: 'Yesterday',
    range: {
      from: startOfDay(subDays(new Date(), 1)),
      to: endOfDay(subDays(new Date(), 1))
    }
  },
  {
    label: 'This Week',
    range: { from: startOfWeek(new Date()), to: endOfWeek(new Date()) }
  },
  {
    label: 'Last Week',
    range: {
      from: startOfWeek(subDays(new Date(), 7)),
      to: endOfWeek(subDays(new Date(), 7))
    }
  },
  {
    label: 'This Month',
    range: { from: startOfMonth(new Date()), to: endOfMonth(new Date()) }
  },
  {
    label: 'Last Month',
    range: {
      from: startOfMonth(subMonths(new Date(), 1)),
      to: endOfMonth(subMonths(new Date(), 1))
    }
  },
  {
    label: 'This Year',
    range: { from: startOfYear(new Date()), to: endOfYear(new Date()) }
  },
  { label: 'All Time', range: { from: new Date('1970-01-01'), to: new Date() } }
];

// --- Prop Interface ---

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

// --- The Component ---

export function DateRangePicker({
  date,
  setDate,
  className
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Handler for applying presets
  const handlePresetClick = (range: DateRange) => {
    setDate(range);
    setIsOpen(false);
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {/* Presets List */}
            <div className="flex flex-col space-y-2 border-r p-3">
              <h4 className="px-2 text-sm font-semibold">Presets</h4>
              <div className="grid">
                {presets.map(({ label, range }) => (
                  <Button
                    key={label}
                    onClick={() => handlePresetClick(range)}
                    variant="ghost"
                    className="justify-start">
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Calendars */}
            <div className="p-2">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
