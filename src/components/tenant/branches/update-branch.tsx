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
import { urls } from '@/config/urls'; // Ensure BRANCHS_URL is configured
import { useApiResponseToast } from '@/hooks/base/api/use-api-response-toast';
import { useMutation } from '@/hooks/base/api/useMutation';
import type { BranchEntity } from '@/types/api/base/branch.type'; // Adjust path
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

// Define props for the component
interface UpdateBranchProps {
  branch: BranchEntity; // The branch to edit. Null when not active.
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional callback to run after the API call is complete. */
  callback?: (success: boolean) => void;
}

// 1. Define the validation schema. It can be the same as the create schema.
// The `id` is handled by the form, not validation.
const UpdateBranchSchema = z.object({
  name: z.string().min(3, 'Branch name must be at least 3 characters long.'),
  locations: z
    .array(
      z.object({
        id: z.string().optional(), // `id` is present for existing locations
        address: z
          .string()
          .min(5, 'Address must be at least 5 characters long.')
      })
    )
    .min(1, 'At least one location is required.')
});

// Infer the TypeScript type from the Zod schema
type TUpdateBranchSchema = z.infer<typeof UpdateBranchSchema>;

export const UpdateBranchForm: React.FC<UpdateBranchProps> = ({
  branch,
  open,
  onOpenChange,
  callback
}) => {
  const formId = 'update-branch-form';

  // 2. Initialize react-hook-form
  const form = useForm<TUpdateBranchSchema>({
    resolver: zodResolver(UpdateBranchSchema),
    // Default values will be populated by the useEffect hook
    defaultValues: {
      name: '',
      locations: []
    }
  });

  // 3. Populate the form with branch data when the dialog opens or branch changes
  useEffect(() => {
    if (branch && open) {
      form.reset({
        name: branch.name,
        locations: branch.locations
      });
    } else if (!open) {
      // Reset form on close to avoid stale data
      form.reset({ name: '', locations: [] });
    }
  }, [branch, open, form.reset, form]);

  // 4. Use `useFieldArray` to manage the dynamic locations list
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'locations'
  });

  // 5. Set up the API mutation for a PUT request
  const updateBranchMutation = useMutation<object, TUpdateBranchSchema>(
    urls.BRANCH_URL.replace(':branchId', branch?.id),
    'PATCH'
  );

  // 6. Set up API response handling
  useApiResponseToast(
    {
      error: updateBranchMutation.error,
      isError: updateBranchMutation.isError,
      isSuccess: updateBranchMutation.isSuccess
    },
    {
      successMessage: 'Branch updated successfully!',
      successCallback: () => {
        onOpenChange(false);
        callback?.(true);
      },
      errorCallback: () => {
        callback?.(false);
      }
    }
  );

  // 7. Define the submit handler
  async function onSubmit(values: TUpdateBranchSchema) {
    if (!branch) return toast.error('branch is not specified');

    console.log('Form Submitted for Update:', values);
    await updateBranchMutation.execute(values);
  }

  // Render nothing if there's no branch data to edit
  if (!branch) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95dvh] w-full !max-w-screen-sm overflow-y-auto pb-0">
        <DialogHeader>
          <DialogTitle>Update Branch</DialogTitle>
          <DialogDescription>
            Edit the details for <strong>{branch.name}</strong>. Click save when
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
                Edit, add, or remove physical addresses for this branch.
              </FormDescription>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`locations.${index}.address`}
                    render={({ field: inputField }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input
                              placeholder={`Location Address`}
                              {...inputField}
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
                onClick={() => append({ address: '' })} // New locations won't have an ID yet
              >
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
            disabled={updateBranchMutation.isLoading}>
            {updateBranchMutation.isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
