import { Badge } from '@/components/ui/badge';
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
import { useQuery } from '@/hooks/api/useQuery';
import { cn } from '@/lib/utils';
import type { PaginatedResponse } from '@/types/api';
import type { RoleEntity } from '@/types/api/role.type';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Spinner } from '../spinner';

// --- PROPS ARE UPDATED FOR MULTI-SELECT ---
type SelectRoleProps = {
  value?: string[]; // The selected role IDs (now an array)
  onChange: (roleIds: string[]) => void; // Callback with the full array
  className?: string;
  label?: string;
};

export default function SelectRole({
  value = [], // Default to an empty array to prevent errors
  onChange,
  className,
  label
}: SelectRoleProps) {
  const [open, setOpen] = useState(false);

  const {
    data: listRolesResponse,
    isLoading,
    isError
  } = useQuery<PaginatedResponse<RoleEntity>>(urls.ROLES_URL, {
    params: { limit: 1000 }
  });

  // Find all role objects that are currently selected
  const selectedRoles = useMemo(
    () =>
      listRolesResponse?.results.filter((role) => value.includes(role.id)) ??
      [],
    [listRolesResponse, value]
  );

  // --- LOGIC TO HANDLE SELECTION/DESELECTION ---
  const handleSelect = (roleId: string) => {
    const isSelected = value.includes(roleId);
    if (isSelected) {
      // If already selected, filter it out (deselect)
      onChange(value.filter((id) => id !== roleId));
    } else {
      // If not selected, add it to the array (select)
      onChange([...value, roleId]);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <div className="text-destructive">Failed to load roles.</div>;
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {/* The trigger area now displays badges */}
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full max-w-lg justify-between h-auto min-h-10">
            <div className="flex gap-1 flex-wrap">
              {selectedRoles.length > 0 ? (
                selectedRoles.map((role) => (
                  <Badge
                    variant="secondary"
                    key={role.id}
                    className="flex items-center gap-1">
                    {role.name}
                    <button
                      className="rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevent popover from closing
                        e.stopPropagation(); // Stop event bubbling
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // Stop the popover from opening/closing
                        handleSelect(role.id);
                      }}>
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))
              ) : (
                <span className="uppercase text-muted-foreground">
                  Select roles...
                </span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Search for a role..." />
            <CommandList>
              <CommandEmpty>No role found.</CommandEmpty>
              <CommandGroup>
                {listRolesResponse?.results.map((role) => (
                  <CommandItem
                    key={role.id}
                    value={role.name}
                    onSelect={() => {
                      handleSelect(role.id);
                      // Popover stays open for multi-selection
                    }}>
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        // Show checkmark if the role's ID is in the value array
                        value.includes(role.id) ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {role.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
