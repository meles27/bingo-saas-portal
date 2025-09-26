import SelectRole from '@/components/base/auth/select-roles';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Label } from '@/components/ui/label';
import { urls } from '@/config/urls';
import { useMutation } from '@/hooks/base/api/useMutation';
import type { UserEntity } from '@/types/api/base/user.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// --- 1. Define the Zod validation schema for the form ---
const assignRolesSchema = z.object({
  roleIds: z
    .array(z.string())
    .min(1, { message: 'You must assign at least one role.' })
});

// Infer the TypeScript type from the Zod schema
type AssignRolesFormValues = z.infer<typeof assignRolesSchema>;

// --- 2. Define the props for our controlled dialog component ---
type AssignUserRolesProps = {
  open: boolean;
  user: UserEntity;
  onOpenChange: (isOpen: boolean) => void;
  callback?: (success: boolean) => void; // A callback function to run on successful submission
};

/**
 * A controlled dialog component for assigning roles to a user.
 * It encapsulates the form, validation, and submission logic.
 */
export function AssignUserRoles({
  open,
  user,
  onOpenChange,
  callback
}: AssignUserRolesProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 3. Initialize react-hook-form ---
  const form = useForm<AssignRolesFormValues>({
    resolver: zodResolver(assignRolesSchema),
    defaultValues: {
      roleIds: []
    }
  });

  const assignRoleMutation = useMutation(urls.getUsersUrl(), 'POST');

  // --- 4. Define the form submission handler ---
  async function onSubmit(values: AssignRolesFormValues) {
    setIsSubmitting(true);
    console.log('Submitting to API with values:', values);

    try {
      // --- Simulate an API call ---
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log(values);
      toast.success(`Roles have been assigned to the selected user.`);

      // Call the success callback if it was provided
      callback?.(true);
      // Close the dialog
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to assign roles:', error);
      callback?.(false);
      toast.error('Could not assign roles. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const fullName = useMemo(
    () => `${user.firstName} ${user.lastName}`,
    [user.firstName, user.lastName]
  );

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        form.reset();
      }, 150);
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Assign Roles to User</DialogTitle>
          <DialogDescription>
            Select a user and choose the roles you want to assign. Click "Assign
            Roles" when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="flex items-center p-2 border rounded-xl max-w-64 gap-2">
            <Avatar className="rounded-full border">
              <AvatarImage src={user.image || ''} />
            </Avatar>
            <div>
              <Label className="text-sm">{user.username}</Label>
              <Label className="text-sm font-bold">{fullName}</Label>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="roleIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roles</FormLabel>
                    <FormControl>
                      <SelectRole
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Select one or more roles to assign to the user.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Assigning...' : 'Assign Roles'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
