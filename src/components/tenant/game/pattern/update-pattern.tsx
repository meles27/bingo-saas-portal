import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { urls } from '@/config/urls';
import { useApiResponseToast } from '@/hooks/base/api/use-api-response-toast';
import { useMutation } from '@/hooks/base/api/useMutation';
import { useQuery } from '@/hooks/base/api/useQuery';
import type { PatternDetailEntity } from '@/types/api/game/pattern.type';
import { PatternEditorGrid } from './pattern-editor-grid';

interface UpdatePatternProps {
  patternId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callback?: (success: boolean) => void;
}

const updatePatternSchema = z.object({
  name: z.string().min(3, {
    message: 'Pattern name must be at least 3 characters.'
  }),
  description: z.string().optional(),
  type: z.enum(['static', 'dynamic'], {
    error: 'You need to select a pattern type.'
  }),
  coordinates: z
    .array(z.tuple([z.number(), z.number()]))
    .min(1, { message: 'Please select at least one cell for the pattern.' })
});

type UpdatePatternFormValues = z.infer<typeof updatePatternSchema>;

export const UpdatePattern: React.FC<UpdatePatternProps> = withAnimation(
  ({ patternId, open, onOpenChange, callback }) => {
    const patternQuery = useQuery<PatternDetailEntity>(
      urls.getPatternUrl(patternId!),
      { skip: !patternId || !open }
    );

    const form = useForm<UpdatePatternFormValues>({
      resolver: zodResolver(updatePatternSchema)
    });

    useEffect(() => {
      if (patternQuery.data) {
        form.reset({
          name: patternQuery.data.name,
          description: patternQuery.data.description || '',
          type: patternQuery.data.type,
          coordinates: patternQuery.data.coordinates
        });
      }
    }, [patternQuery.data, form.reset]);

    const updatePatternMutation = useMutation<unknown, UpdatePatternFormValues>(
      urls.getPatternUrl(patternId!),
      'PATCH'
    );

    useApiResponseToast(
      {
        error: updatePatternMutation.error,
        isError: updatePatternMutation.isError,
        isSuccess: updatePatternMutation.isSuccess
      },
      {
        successMessage: 'Pattern updated successfully!',
        successCallback: () => {
          onOpenChange(false);
          callback?.(true);
        },
        errorCallback: () => callback?.(false)
      }
    );

    function onSubmit(values: UpdatePatternFormValues) {
      updatePatternMutation.execute(values);
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[475px] max-h-[95dvh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Edit Pattern</DialogTitle>
            <DialogDescription>
              Make changes to the pattern details and shape.
            </DialogDescription>
          </DialogHeader>

          {/* loading state */}
          {patternQuery.isLoading && <Spinner variant="page" />}

          {/* error state */}
          {patternQuery.isError && (
            <ApiError
              error={patternQuery.error}
              customAction={{ label: 'Retry', handler: patternQuery.refetch }}
            />
          )}

          {/* success state */}
          {patternQuery.isSuccess && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pattern Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Four Corners" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Pattern Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col space-y-1">
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="static" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Static
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="dynamic" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Dynamic
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe this winning pattern."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="coordinates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pattern Shape</FormLabel>
                      <FormControl>
                        <PatternEditorGrid
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updatePatternMutation.isLoading}>
                    {updatePatternMutation.isLoading && (
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
