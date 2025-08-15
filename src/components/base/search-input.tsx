import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
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
    // No dependency array means this runs after every render.

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
      <div className={cn('relative w-full', className)}>
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={inputValue}
          onChange={handleChange}
          className="pl-10 pr-10"
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
