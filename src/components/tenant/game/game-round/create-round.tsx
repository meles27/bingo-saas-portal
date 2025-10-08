import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import withAnimation from '@/components/base/route-animation/with-animation';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { urls } from '@/config/urls';
import { useApiResponseToast } from '@/hooks/base/api/use-api-response-toast';
import { useMutation } from '@/hooks/base/api/useMutation';
import { useQuery } from '@/hooks/base/api/useQuery';
import { cn } from '@/lib/utils';
import { useGameStore } from '@/store/game-store';
import type { PaginatedResponse } from '@/types/api/base';
import type { PatternListEntity } from '@/types/api/game/pattern.type';
import { useMemo } from 'react';

// --- Types and Schema ---

// The shape the API expects for submission
// interface CreateRoundApiInput {
//   name: string;
//   description?: string;
//   prize: string;
//   rows: number;
//   cols: number;
//   minRange: number;
//   maxRange: number;
//   freespaceEnabled?: boolean;
//   freeRowPos?: number;
//   freeColPos?: number;
//   patternIds: string[];
//   startedAt: string; // ISO String
//   endedAt: string; // ISO String
// }

interface CreateRoundProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callback?: (success: boolean) => void;
}

// Zod schema matching the backend DTO
const createRoundSchema = z
  .object({
    name: z.string().min(1, 'Name is required.'),
    description: z.string().optional(),
    prize: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, 'Must be a valid prize amount.'),
    rows: z.coerce.number().int().min(3, 'Grid must have at least 3 rows.'),
    cols: z.coerce.number().int().min(3, 'Grid must have at least 3 columns.'),
    minRange: z.coerce.number().int().min(1),
    maxRange: z.coerce.number().int().min(1),
    freespaceEnabled: z.boolean().default(false),
    freeRowPos: z.coerce.number().int().optional(),
    freeColPos: z.coerce.number().int().optional(),
    patternIds: z.array(z.uuid()).min(1, 'Select at least one pattern.'),
    startedAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'A valid start date is required.'
    })
  })
  .refine((data) => data.maxRange > data.minRange, {
    message: 'Max range must be greater than min range.',
    path: ['maxRange']
  })
  .superRefine((data, ctx) => {
    if (data.freespaceEnabled) {
      if (
        data.freeRowPos === undefined ||
        data.freeRowPos < 0 ||
        data.freeRowPos >= data.rows
      ) {
        ctx.addIssue({
          code: 'custom',
          message: `Row must be between 0 and ${data.rows - 1}`,
          path: ['freeRowPos']
        });
      }
      if (
        data.freeColPos === undefined ||
        data.freeColPos < 0 ||
        data.freeColPos >= data.cols
      ) {
        ctx.addIssue({
          code: 'custom',
          message: `Column must be between 0 and ${data.cols - 1}`,
          path: ['freeColPos']
        });
      }
    }
  });

type CreateRoundFormValues = z.infer<typeof createRoundSchema>;

// --- Main Component ---

export const CreateRound: React.FC<CreateRoundProps> = withAnimation(
  ({ open, onOpenChange, callback }) => {
    const gameId = useGameStore((state) => state.gameId);

    const patternsQuery = useQuery<PaginatedResponse<PatternListEntity>>(
      urls.getPatternsUrl(),
      { params: { limit: 1000 } } // Fetch all patterns
    );
    const patternOptions = useMemo(
      () =>
        patternsQuery.data?.results.map((p) => ({
          label: p.name,
          value: p.id
        })) || [],
      [patternsQuery.data]
    );

    const form = useForm<CreateRoundFormValues>({
      resolver: zodResolver(createRoundSchema),
      defaultValues: {
        name: '',
        description: 'this is simple description',
        prize: '0.00',
        rows: 5,
        cols: 5,
        minRange: 1,
        maxRange: 75,
        freespaceEnabled: false,
        patternIds: [],
        startedAt: ''
      }
    });

    const createRoundMutation = useMutation<unknown, CreateRoundFormValues>(
      urls.getRoundsUrl(),
      'POST'
    );

    useApiResponseToast(
      {
        error: createRoundMutation.error,
        isError: createRoundMutation.isError,
        isSuccess: createRoundMutation.isSuccess
      },
      {
        successMessage: 'Round created successfully!',
        successCallback: () => {
          onOpenChange(false);
          callback?.(true);
          form.reset();
        },
        errorCallback: () => callback?.(false)
      }
    );

    function onSubmit(values: CreateRoundFormValues) {
      const apiPayload: CreateRoundFormValues & { gameId: string | null } = {
        ...values,
        rows: values.rows,
        cols: values.cols,
        minRange: values.minRange,
        maxRange: values.maxRange,
        freeRowPos: values.freespaceEnabled ? values.freeRowPos : undefined,
        freeColPos: values.freespaceEnabled ? values.freeColPos : undefined,
        startedAt: values.startedAt,
        description: 'this is simple description',
        gameId: gameId
      };
      createRoundMutation.execute(apiPayload);
    }

    const watchFreespaceEnabled = form.watch('freespaceEnabled');

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Round</DialogTitle>
            <DialogDescription>
              Configure a new round for this game session.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 max-h-[70vh] overflow-y-auto p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Round Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Main Prize" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="prize"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prize</FormLabel>
                      <FormControl>
                        <Input placeholder="10000.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                name="patternIds"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Winning Patterns</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-full justify-between',
                              !field.value.length && 'text-muted-foreground'
                            )}>
                            {field.value.length > 0
                              ? `${field.value.length} selected`
                              : 'Select patterns'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Search patterns..." />
                          <CommandEmpty>No patterns found.</CommandEmpty>
                          <CommandGroup>
                            {patternOptions.map((option) => (
                              <CommandItem
                                value={option.label}
                                key={option.value}
                                onSelect={() => {
                                  const current = field.value;
                                  const updated = current.includes(option.value)
                                    ? current.filter(
                                        (id) => id !== option.value
                                      )
                                    : [...current, option.value];
                                  field.onChange(updated);
                                }}>
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    field.value.includes(option.value)
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                                {option.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select one or more winning patterns for this round.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <FormField
                  name="rows"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rows</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="cols"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cols</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="minRange"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min #</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="maxRange"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max #</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                name="freespaceEnabled"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Enable Free Space</FormLabel>
                      <FormDescription>
                        Add a free space to the center of the card.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  name="freeRowPos"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Free Space Row</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={!watchFreespaceEnabled}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="freeColPos"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Free Space Column</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={!watchFreespaceEnabled}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                name="startedAt"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createRoundMutation.isLoading}>
                  {createRoundMutation.isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}{' '}
                  Add Round
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
);
