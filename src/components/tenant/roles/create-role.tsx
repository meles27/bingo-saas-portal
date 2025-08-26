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
import { Textarea } from '@/components/ui/textarea';
import { urls } from '@/config/urls';
import { useApiResponseToast } from '@/hooks/base/api/use-api-response-toast';
import { useMutation } from '@/hooks/base/api/useMutation';

interface CreateRoleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callback?: (success: boolean) => void;
}
// 1. Define the validation schema with Zod
const createRoleSchema = z.object({
  name: z.string().min(3, {
    message: 'Role name must be at least 3 characters.'
  }),
  description: z.string().optional()
});

// Infer the TypeScript type from the schema
type CreateRoleFormValues = z.infer<typeof createRoleSchema>;

export const CreateRole: React.FC<CreateRoleProps> = withAnimation(
  ({ open, onOpenChange, callback }) => {
    // 3. Initialize react-hook-form
    const form = useForm<CreateRoleFormValues>({
      resolver: zodResolver(createRoleSchema),
      defaultValues: {
        name: '',
        description: ''
      }
    });

    const createRoleMutation = useMutation<unknown, CreateRoleFormValues>(
      urls.getRolesUrl(),
      'POST'
    );

    useApiResponseToast(
      {
        error: createRoleMutation.error,
        isError: createRoleMutation.isError,
        isSuccess: createRoleMutation.isSuccess
      },
      {
        successMessage: 'Role added successfully!',
        successCallback: () => {
          onOpenChange(false);
          if (callback) {
            callback(true);
          }
          form.reset();
        },
        errorCallback: () => (callback ? callback(false) : undefined)
      }
    );

    function onSubmit(values: CreateRoleFormValues) {
      createRoleMutation.execute(values);
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[475px]">
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>
              Create a new role and define its purpose. You can assign
              permissions later.
            </DialogDescription>
          </DialogHeader>

          {/* 5. Use the <Form> component from shadcn/ui */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Content Editor" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the public display name of the role.
                    </FormDescription>
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
                        placeholder="Describe what this role is responsible for."
                        className="resize-none"
                        {...field}
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
                <Button type="submit" disabled={createRoleMutation.isLoading}>
                  {createRoleMutation.isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Role
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
);
