import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/base/use-debounce';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import * as React from 'react';

export interface SearchInputProps
  extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange'> {
  initialValue?: string;
  onDebouncedChange: (value: string) => void;
  debounceDelay?: number;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      initialValue = '',
      onDebouncedChange,
      debounceDelay = 500,
      className,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState(initialValue);
    const debouncedValue = useDebounce(inputValue, debounceDelay);

    // --- The Core Solution: Callback Ref Pattern ---
    // 1. Store the onDebouncedChange function in a ref.
    const onDebouncedChangeRef = React.useRef(onDebouncedChange);

    // 2. On every render, update the ref to hold the latest version of the callback.
    // This happens without triggering the main effect below.
    React.useEffect(() => {
      onDebouncedChangeRef.current = onDebouncedChange;
    });

    // 3. The main effect now ONLY depends on the debounced value.
    const isInitialMount = React.useRef(true);
    React.useEffect(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }
      // Call the LATEST callback function via the ref.
      onDebouncedChangeRef.current(debouncedValue);
    }, [debouncedValue]); // The dependency array is now stable!

    // Memoize internal handlers for minor optimization and best practice.
    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
      },
      []
    );

    return (
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-5 w-5 text-subtle-light dark:text-subtle-dark" />
        </div>
        <Input
          type="search"
          className={cn(
            'w-full rounded-full border-0 bg-primary/10 py-3 pl-11 pr-11 text-base font-medium text-content-light placeholder:text-subtle-light focus:ring-2 focus:ring-primary dark:bg-primary/20 dark:text-content-dark dark:placeholder:text-subtle-dark',
            className
          )}
          value={inputValue}
          onChange={handleChange}
          ref={ref}
          placeholder="search ..."
          {...props}
        />
      </div>
    );
  }
);
