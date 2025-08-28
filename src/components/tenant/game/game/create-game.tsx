import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import withAnimation from '@/components/base/route-animation/with-animation';
import { Button } from '@/components/ui/button';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { urls } from '@/config/urls';
import { useApiResponseToast } from '@/hooks/base/api/use-api-response-toast';
import { useMutation } from '@/hooks/base/api/useMutation';

// This is the shape the API expects, as you defined.
export interface CreateGameInput {
  name: string;
  description?: string;
  totalRounds: number;
  entryFee: string;
  startedAt: string; // ISO String
  endedAt: string; // ISO String
  currency?: string;
}

interface CreateGameProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callback?: (success: boolean) => void;
}

// 1. Define the validation schema using z.date()
const createGameSchema = z
  .object({
    name: z.string().min(3, 'Game name must be at least 3 characters.'),
    description: z.string().optional(),
    totalRounds: z
      .number({ error: 'Total rounds must be a number.' })
      .int()
      .min(1, 'A game must have at least one round.'),
    entryFee: z
      .string()
      .min(1, 'Entry fee is required.')
      .regex(
        /^\d+(\.\d{1,2})?$/,
        'Must be a valid decimal number (e.g., 500 or 500.00).'
      ),
    startedAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'A valid start date is required.'
    }),
    endedAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'A valid end date is required.'
    }),
    currency: z
      .string()
      .length(3, 'Currency must be a 3-letter code.')
      .optional()
  })
  .refine((data) => new Date(data.endedAt) > new Date(data.startedAt), {
    message: 'End date must be after the start date.',
    path: ['endedAt']
  });

// This type is for the form's internal state, where dates are Date objects.
type CreateGameFormValues = z.infer<typeof createGameSchema>;

export const CreateGame: React.FC<CreateGameProps> = withAnimation(
  ({ open, onOpenChange, callback }) => {
    // 2. Initialize react-hook-form
    const form = useForm<CreateGameFormValues>({
      resolver: zodResolver(createGameSchema),
      defaultValues: {
        name: '',
        description: '',
        totalRounds: 1,
        entryFee: '0.00',
        currency: 'ETB'
      }
    });

    const createGameMutation = useMutation<unknown, CreateGameFormValues>(
      urls.getGamesUrl(),
      'POST'
    );
    useApiResponseToast(
      {
        error: createGameMutation.error,
        isError: createGameMutation.isError,
        isSuccess: createGameMutation.isSuccess
      },
      {
        successMessage: 'Game created successfully!',
        successCallback: () => {
          onOpenChange(false);
          callback?.(true);
          form.reset();
        },
        errorCallback: () => callback?.(false)
      }
    );

    function onSubmit(values: CreateGameFormValues) {
      // 3. Transform the data to match the API's expectations
      createGameMutation.execute(values);
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Game</DialogTitle>
            <DialogDescription>
              Set up a new bingo game session with all the necessary details.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 max-h-[70vh] overflow-y-auto p-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Game Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Friday Night Bingo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a brief description of the game."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="totalRounds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Rounds</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="entryFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entry Fee</FormLabel>
                      <FormControl>
                        <Input placeholder="500.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="startedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date and Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        // value={
                        //   field.value instanceof Date
                        //     ? field.value.toISOString().slice(0, 16)
                        //     : field.value
                        // }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date and Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        // value={
                        //   field.value instanceof Date
                        //     ? field.value.toISOString().slice(0, 16)
                        //     : field.value
                        // }
                      />
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
                <Button type="submit" disabled={createGameMutation.isLoading}>
                  {createGameMutation.isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Game
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
);
