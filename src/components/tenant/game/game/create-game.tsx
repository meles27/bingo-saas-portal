import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import withAnimation from '@/components/base/route-animation/with-animation';
import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/date-picker-custom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { urls } from '@/config/urls';
import { useApiResponseToast } from '@/hooks/base/api/use-api-response-toast';
import { useMutation } from '@/hooks/base/api/useMutation';
import type { CreateGameApiInput } from '@/types/api/game/game.type';

// --- Types and Schema ---

interface CreateGameProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callback?: (success: boolean) => void;
}

// Zod schema for frontend validation (dates are Date objects)
const createGameSchema = z.object({
  name: z.string().min(3, 'Game name must be at least 3 characters.'),
  description: z.string().optional(),
  entryFee: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Must be a valid decimal number.'),
  startedAt: z.date({ error: 'A valid start date is required.' }),
  currency: z.string().refine((val) => urls.CurrencyOptions.includes(val), {
    message: 'Currency must be a valid 3-letter code.'
  })
});

// Type for the form's internal state
type CreateGameFormValues = z.infer<typeof createGameSchema>;

// --- Main Component ---

export const CreateGame: React.FC<CreateGameProps> = withAnimation(
  ({ open, onOpenChange, callback }) => {
    const form = useForm({
      resolver: zodResolver(createGameSchema),
      defaultValues: {
        name: '',
        description: '',
        entryFee: '0.00'
      }
    });

    const createGameMutation = useMutation<unknown, CreateGameApiInput>(
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
      console.log('values ', values);
      const apiPayload: CreateGameApiInput = {
        ...values,
        startedAt: values.startedAt.toISOString(),
        currency: values.currency as string
      };
      createGameMutation.execute(apiPayload);
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-lg max-h-[95dvh] py-0 overflow-auto">
          <DialogHeader className="sticky top-0 py-6 bg-background z-10">
            <DialogTrigger asChild className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogTitle>Create New Game</DialogTitle>
            <DialogDescription>
              Set up a new bingo game session with all the necessary details.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              id="create-game-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 overflow-y-auto flex-grow">
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
              <div className="flex flex-col w-full gap-4 sm:flex-row">
                <FormField
                  control={form.control}
                  name="entryFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entry Fee</FormLabel>
                      <FormControl>
                        <Input
                          className="sm:flex-2"
                          placeholder="500.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}>
                          <SelectTrigger className="sm:flex-1 min-w-24">
                            <SelectValue placeholder="Select a currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {urls.CurrencyOptions.map((op) => (
                                <SelectItem key={op} value={op}>
                                  {op}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
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
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date and Time</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        className="sm:flex-1"
                        selected={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <DialogFooter className="sticky bottom-0 right-0 py-6 bg-background z-10">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="create-game-form"
              disabled={createGameMutation.isLoading}>
              {createGameMutation.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
