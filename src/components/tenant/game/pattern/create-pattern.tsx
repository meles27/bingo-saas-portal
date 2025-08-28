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
  FormDescription,
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
import { PatternEditorGrid } from './pattern-editor-grid';

interface CreatePatternProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callback?: (success: boolean) => void;
}

// 1. Define the validation schema for a Pattern
const createPatternSchema = z.object({
  name: z.string().min(3, {
    message: 'Pattern name must be at least 3 characters.'
  }),
  description: z.string().optional(),
  type: z.enum(['static', 'dynamic'], {
    message: 'You need to select a pattern type.'
  }),
  coordinates: z
    .array(z.tuple([z.number(), z.number()]))
    .min(1, { message: 'Please select at least one cell for the pattern.' })
});

// Infer the TypeScript type from the schema
type CreatePatternFormValues = z.infer<typeof createPatternSchema>;

export const CreatePattern: React.FC<CreatePatternProps> = withAnimation(
  ({ open, onOpenChange, callback }) => {
    // 3. Initialize react-hook-form
    const form = useForm<CreatePatternFormValues>({
      resolver: zodResolver(createPatternSchema),
      defaultValues: {
        name: '',
        description: '',
        type: 'static',
        coordinates: []
      }
    });

    const createPatternMutation = useMutation<unknown, CreatePatternFormValues>(
      urls.getPatternsUrl(),
      'POST'
    );

    useApiResponseToast(
      {
        error: createPatternMutation.error,
        isError: createPatternMutation.isError,
        isSuccess: createPatternMutation.isSuccess
      },
      {
        successMessage: 'Pattern created successfully!',
        successCallback: () => {
          onOpenChange(false);
          callback?.(true);
          form.reset();
        },
        errorCallback: () => callback?.(false)
      }
    );

    function onSubmit(values: CreatePatternFormValues) {
      createPatternMutation.execute(values);
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[475px] max-h-[95dvh] overflow-auto">
          <DialogHeader className="sticky bottom-0 left-0">
            <DialogTitle>Add New Pattern</DialogTitle>
            <DialogDescription>
              Design a new winning pattern for your bingo games.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        defaultValue={field.value}
                        className="flex flex-col space-y-1">
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="static" />
                          </FormControl>
                          <FormLabel className="font-normal">Static</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="dynamic" />
                          </FormControl>
                          <FormLabel className="font-normal">Dynamic</FormLabel>
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
                    <FormDescription>
                      Click the squares to define the winning shape.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="sticky bottom-0 left-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createPatternMutation.isLoading}>
                  {createPatternMutation.isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Pattern
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
);
