import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
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
import { Separator } from '@/components/ui/separator';
import { urls } from '@/config/urls'; // Make sure to add BRANCHS_URL here
import { useApiResponseToast } from '@/hooks/api/use-api-response-toast';
import { useMutation } from '@/hooks/api/useMutation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

// Define props for the component
interface CreateBranchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional callback to run after the API call is complete. */
  callback?: (success: boolean) => void;
}

// 1. Define the validation schema with Zod
const CreateBranchSchema = z.object({
  name: z.string().min(3, 'Branch name must be at least 3 characters long.'),
  locations: z
    .array(
      z.object({
        address: z
          .string()
          .min(5, 'Address must be at least 5 characters long.')
      })
    )
    .min(1, 'At least one location is required.')
});

// Infer the TypeScript type from the Zod schema
type TCreateBranchSchema = z.infer<typeof CreateBranchSchema>;

export const CreateBranch: React.FC<CreateBranchProps> = ({
  open,
  onOpenChange,
  callback
}) => {
  const formId = 'create-branch-form';

  // 2. Initialize react-hook-form
  const form = useForm<TCreateBranchSchema>({
    resolver: zodResolver(CreateBranchSchema),
    defaultValues: {
      name: '',
      // Start with one empty location field for better UX
      locations: [{ address: '' }]
    }
  });

  // 3. Use `useFieldArray` to manage the dynamic locations list
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'locations'
  });

  // 4. Set up the API mutation
  const createBranchMutation = useMutation<object, TCreateBranchSchema>(
    urls.BRANCHES_URL, // Ensure this URL is configured
    'POST'
  );

  // 5. Set up API response handling
  useApiResponseToast(
    {
      error: createBranchMutation.error,
      isError: createBranchMutation.isError,
      isSuccess: createBranchMutation.isSuccess
    },
    {
      successMessage: 'Branch created successfully!',
      successCallback: () => {
        onOpenChange(false);
        form.reset();
        callback?.(true);
      },
      errorCallback: () => {
        callback?.(false);
      }
    }
  );

  // 6. Define the submit handler
  async function onSubmit(values: TCreateBranchSchema) {
    console.log('Form Submitted:', values);
    await createBranchMutation.execute(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95dvh] w-full !max-w-screen-sm overflow-y-auto pb-0">
        <DialogHeader>
          <DialogTitle>Create New Branch</DialogTitle>
          <DialogDescription>
            Provide a name for the branch and add its locations. Click save when
            you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id={formId}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 pt-2">
            {/* Branch Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Downtown Branch" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* Dynamic Locations Section */}
            <div>
              <FormLabel>Branch Locations</FormLabel>
              <FormDescription className="mb-4">
                Add one or more physical addresses for this branch.
              </FormDescription>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`locations.${index}.address`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input
                              placeholder={`Location ${index + 1} Address`}
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => remove(index)}
                            disabled={fields.length <= 1}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => append({ address: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Another Location
              </Button>
            </div>
          </form>
        </Form>
        <DialogFooter className="sticky bottom-0 left-0 bg-background py-4 z-10 border-t">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            form={formId}
            type="submit"
            disabled={createBranchMutation.isLoading}>
            {createBranchMutation.isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Branch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
