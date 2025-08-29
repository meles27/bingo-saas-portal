import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { ApiError } from '@/components/base/api-error';
import withAnimation from '@/components/base/route-animation/with-animation';
import { Spinner } from '@/components/base/spinner';
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
import { Popover } from '@/components/ui/popover';
import { urls } from '@/config/urls';
import { useApiResponseToast } from '@/hooks/base/api/use-api-response-toast';
import { useMutation } from '@/hooks/base/api/useMutation';
import { useQuery } from '@/hooks/base/api/useQuery';
import type { PaginatedResponse } from '@/types/api/base';
import type { RoundDetailEntity } from '@/types/api/game/round.type';

// --- Types and Schema ---
interface UpdateRoundProps {
  roundId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callback?: (success: boolean) => void;
}

const updateRoundSchema = z
  .object({
    /* Same schema as create, but fields are optional */
  })
  .deepPartial();
// For brevity, assuming the full schema from CreateRound is used and made optional.
// In a real app, you would define this more explicitly based on which fields are truly updatable.

type UpdateRoundFormValues = z.infer<typeof updateRoundSchema>;

// --- Main Component ---
export const UpdateRound: React.FC<UpdateRoundProps> = withAnimation(
  ({ roundId, open, onOpenChange, callback }) => {
    const form = useForm({
      resolver: zodResolver(updateRoundSchema)
    });

    const roundQuery = useQuery<RoundDetailEntity>(urls.getRoundUrl(roundId!), {
      enabled: !!roundId && open
    });

    const patternsQuery = useQuery<PaginatedResponse<PatternEntity>>(
      urls.getPatternsUrl(),
      { params: { limit: 1000 } }
    );
    const patternOptions = useMemo(
      () =>
        patternsQuery.data?.results.map((p) => ({
          label: p.name,
          value: p.id
        })) || [],
      [patternsQuery.data]
    );

    useEffect(() => {
      if (roundQuery.data) {
        form.reset({
          name: roundQuery.data.name,
          prize: roundQuery.data.prize,
          rows: roundQuery.data.rows,
          cols: roundQuery.data.cols,
          minRange: roundQuery.data.minRange,
          maxRange: roundQuery.data.maxRange,
          freespaceEnabled: roundQuery.data.freespaceEnabled,
          freeRowPos: roundQuery.data.freeRowPos || undefined,
          freeColPos: roundQuery.data.freeColPos || undefined,
          patternIds: roundQuery.data.patterns.map((p) => p.id),
          startedAt: new Date(roundQuery.data.startedAt),
          endedAt: roundQuery.data.endedAt
            ? new Date(roundQuery.data.endedAt)
            : undefined
        });
      }
    }, [roundQuery.data, form.reset]);

    const updateRoundMutation = useMutation(
      urls.getRoundUrl(roundId!),
      'PATCH'
    );

    useApiResponseToast(
      {
        error: updateRoundMutation.error,
        isError: updateRoundMutation.isError,
        isSuccess: updateRoundMutation.isSuccess
      },
      {
        successMessage: 'Round updated successfully!',
        successCallback: () => {
          onOpenChange(false);
          callback?.(true);
        },
        errorCallback: () => callback?.(false)
      }
    );

    function onSubmit(values: UpdateRoundFormValues) {
      const apiPayload = {
        ...values,
        startedAt: values.startedAt?.toISOString(),
        endedAt: values.endedAt?.toISOString()
      };
      updateRoundMutation.execute(apiPayload);
    }

    const watchFreespaceEnabled = form.watch('freespaceEnabled');

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Round</DialogTitle>
            <DialogDescription>
              Make changes to this round's configuration.
            </DialogDescription>
          </DialogHeader>
          {roundQuery.isLoading && <Spinner variant="dialog" />}
          {roundQuery.isError && (
            <ApiError
              error={roundQuery.error}
              customAction={{ label: 'Retry', handler: roundQuery.refetch }}
            />
          )}
          {roundQuery.isSuccess && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 max-h-[70vh] overflow-y-auto p-4">
                {/* Form fields would be here, identical in structure to the CreateRound component */}
                {/* For example: */}
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Round Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="patternIds"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Winning Patterns</FormLabel>
                      <Popover>
                        {/* ... Popover and Command for multi-select from CreateRound ... */}
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* ... other fields for rows, cols, dates, etc. ... */}
                <DialogFooter className="pt-4 sticky bottom-0 bg-background">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateRoundMutation.isLoading}>
                    {updateRoundMutation.isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}{' '}
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
