import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { urls } from '@/config/urls';
import { useQuery } from '@/hooks/base/api/useQuery';
import { cn } from '@/lib/utils';
import type { PaginatedResponse } from '@/types/api/base';
import type { UserEntity } from '@/types/api/base/user.type';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import withAnimation from '../route-animation/with-animation';
import { Spinner } from '../spinner';

// --- A simple Debounce Hook ---
// This hook prevents API calls on every keystroke.
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// --- Component Props ---
type SelectUserProps = {
  value?: string; // The selected user ID
  onChange: (userId: string) => void;
  className?: string;
  label?: string;
};

export const SelectUser = withAnimation(
  ({ value, onChange, className, label }: SelectUserProps) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300); // 300ms delay

    // --- QUERY 1: For the Search Results ---
    // This query re-fetches whenever `debouncedSearch` changes.
    const {
      data: userListResponse,
      isLoading: isSearchLoading,
      isError
    } = useQuery<PaginatedResponse<UserEntity>>(urls.getUsersUrl(), {
      params: {
        limit: 10, // Fetch a smaller list for the dropdown
        search: debouncedSearch
      }
    });

    // --- QUERY 2: For the Currently Selected User ---
    // This query only runs if a `value` is present and fetches that specific user.
    // This ensures the button shows the correct name even if that user isn't in the search results.
    const { data: selectedUser } = useQuery<UserEntity>(
      urls.getUserUrl(value || ''),
      {
        skip: !value
      }
    );

    const users = userListResponse?.results ?? [];

    if (isError) {
      return <div className="text-destructive">Failed to load users.</div>;
    }

    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        {label && <label className="text-sm font-medium">{label}</label>}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full max-w-sm justify-between">
              {selectedUser ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={selectedUser.image ?? undefined} />
                    <AvatarFallback>
                      {selectedUser.firstName?.[0]}
                      {selectedUser.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-bold">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground">Select user...</span>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput
                placeholder="Search by name or email..."
                value={search}
                onValueChange={setSearch}
              />
              <CommandList>
                {/* Show a spinner inside the popover while a search is happening */}
                {isSearchLoading && <Spinner className="p-4" />}

                <CommandEmpty>
                  {!isSearchLoading && 'No user found.'}
                </CommandEmpty>

                {!isSearchLoading && (
                  <CommandGroup>
                    {users.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={`${user.firstName} ${user.lastName} ${user.email}`}
                        onSelect={() => {
                          onChange(user.id);
                          setOpen(false);
                        }}>
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === user.id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.image ?? undefined} />
                            <AvatarFallback>
                              {user.firstName?.[0]}
                              {user.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm">
                              {user.firstName} {user.lastName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);
