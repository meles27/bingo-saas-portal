import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type TimelineFilterState =
  | { timeLine: 'all' }
  | { timeLine: 'daily' | 'weekly'; date: Date }
  | { timeLine: 'monthly'; month: Month; year: number }
  | { timeLine: 'annual'; year: number };

interface Props {
  value: TimelineFilterState;
  onChange: (value: TimelineFilterState) => void;
}

export const TimelineFilter: React.FC<Props> = ({ value, onChange }) => {
  const now = new Date();

  const MONTH_OPTIONS = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: format(new Date(2000, i, 1), 'MMMM')
      })),
    []
  );

  const [yearOptions, setYearOptions] = useState<number[]>([]);

  const generateBaseYears = (center: number, range = 5) => {
    return Array.from({ length: range * 2 + 1 }, (_, i) => center - range + i);
  };

  useEffect(() => {
    const year =
      value.timeLine === 'monthly' || value.timeLine === 'annual'
        ? value.year
        : new Date().getFullYear();

    setYearOptions(generateBaseYears(year));
  }, [value]);

  const handleTimelineChange = (newTimeline: string) => {
    switch (newTimeline) {
      case 'daily':
      case 'weekly':
        onChange({ timeLine: newTimeline, date: now });
        break;
      case 'monthly':
        onChange({
          timeLine: 'monthly',
          month: (now.getMonth() + 1) as Month,
          year: now.getFullYear()
        });
        break;
      case 'annual':
        onChange({ timeLine: 'annual', year: now.getFullYear() });
        break;
      default:
        onChange({ timeLine: 'all' });
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date && (value.timeLine === 'daily' || value.timeLine === 'weekly')) {
      onChange({ timeLine: value.timeLine, date });
    }
  };

  const handleMonthChange = (month: string) => {
    if (value.timeLine === 'monthly') {
      onChange({
        timeLine: 'monthly',
        year: value.year,
        month: Number(month) as Month
      });
    }
  };

  const handleYearChange = (yearStr: string) => {
    const year = Number(yearStr);
    if (value.timeLine === 'monthly') {
      onChange({
        timeLine: 'monthly',
        month: value.month,
        year
      });
    } else if (value.timeLine === 'annual') {
      onChange({ timeLine: 'annual', year });
    }
  };

  const selectedDate =
    value.timeLine === 'daily' || value.timeLine === 'weekly'
      ? value.date
      : undefined;

  const selectedMonth =
    value.timeLine === 'monthly' ? String(value.month) : undefined;

  const selectedYear =
    value.timeLine === 'monthly' || value.timeLine === 'annual'
      ? String(value.year)
      : undefined;

  return (
    <div className="flex items-center gap-2">
      {/* Timeline Type */}
      <Select value={value.timeLine} onValueChange={handleTimelineChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
          <SelectItem value="annual">Annual</SelectItem>
        </SelectContent>
      </Select>

      {/* Date Picker */}
      {(value.timeLine === 'daily' || value.timeLine === 'weekly') && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-[240px] justify-start text-left font-normal ${
                !selectedDate ? 'text-muted-foreground' : ''
              }`}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
            />
          </PopoverContent>
        </Popover>
      )}

      {/* Month Selector */}
      {value.timeLine === 'monthly' && (
        <Select value={selectedMonth} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {MONTH_OPTIONS.map((month) => (
              <SelectItem key={month.value} value={String(month.value)}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Year Selector */}
      {(value.timeLine === 'monthly' || value.timeLine === 'annual') && (
        <Select value={selectedYear} onValueChange={handleYearChange}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
