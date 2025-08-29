import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { ApiError } from '@/components/base/api-error';
import withAnimation from '@/components/base/route-animation/with-animation';
import { Spinner } from '@/components/base/spinner';
import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/date-picker-custom';
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
import { useQuery } from '@/hooks/base/api/useQuery';
import type {
  GameDetailEntity,
  UpdateGameInput
} from '@/types/api/game/game.type';

// --- Types and Schema ---

interface UpdateGameProps {
  gameId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callback?: (success: boolean) => void;
}

// Zod schema for frontend validation (dates are Date objects)
const updateGameSchema = z.object({
  name: z
    .string()
    .min(3, 'Game name must be at least 3 characters.')
    .optional(),
  description: z.string().optional(),
  entryFee: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Must be a valid decimal number.')
    .optional(),
  startedAt: z.date({ error: 'A valid start date is required.' }).optional()
});

// Type for the form's internal state (holds a Date object)
type UpdateGameFormValues = z.infer<typeof updateGameSchema>;

export const UpdateGame: React.FC<UpdateGameProps> = withAnimation(
  ({ gameId, open, onOpenChange, callback }) => {
    const form = useForm<UpdateGameFormValues>({
      resolver: zodResolver(updateGameSchema),
      defaultValues: {
        name: '',
        description: '',
        entryFee: '',
        startedAt: undefined // Default to undefined for the Date object
      }
    });

    const gameQuery = useQuery<GameDetailEntity>(
      urls.getGameUrl(gameId!),
      { skip: !gameId || !open } // Using `skip` parameter as requested
    );

    useEffect(() => {
      if (gameQuery.data) {
        // Populate the form: convert incoming ISO string to a Date object
        form.reset({
          name: gameQuery.data.name,
          description: gameQuery.data.description || '',
          entryFee: gameQuery.data.entryFee,
          startedAt: gameQuery.data.startedAt
            ? new Date(gameQuery.data.startedAt)
            : undefined
        });
      }
    }, [gameQuery.data, form.reset, form]);

    const updateGameMutation = useMutation<unknown, UpdateGameInput>(
      urls.getGameUrl(gameId!),
      'PATCH'
    );

    useApiResponseToast(
      {
        error: updateGameMutation.error,
        isError: updateGameMutation.isError,
        isSuccess: updateGameMutation.isSuccess
      },
      {
        successMessage: 'Game updated successfully!',
        successCallback: () => {
          onOpenChange(false);
          callback?.(true);
        },
        errorCallback: () => callback?.(false)
      }
    );

    function onSubmit(values: UpdateGameFormValues) {
      const apiPayload: UpdateGameInput = {
        ...values,
        startedAt: values.startedAt ? values.startedAt.toISOString() : undefined
      };
      updateGameMutation.execute(apiPayload);
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[95dvh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Edit Game</DialogTitle>
            <DialogDescription>
              Make changes to the game details.
            </DialogDescription>
          </DialogHeader>

          {gameQuery.isLoading && <Spinner variant="page" />}
          {gameQuery.isError && (
            <ApiError
              error={gameQuery.error}
              customAction={{ label: 'Retry', handler: gameQuery.refetch }}
            />
          )}
          {gameQuery.isSuccess && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 p-1">
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
                          placeholder="Describe the game."
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
                  <FormField
                    control={form.control}
                    name="startedAt"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date and Time</FormLabel>
                        <FormControl>
                          <DateTimePicker
                            selected={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter className="pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateGameMutation.isLoading}>
                    {updateGameMutation.isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    );
  }
);
