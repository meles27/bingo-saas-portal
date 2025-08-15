import Camera from '@/components/base/camera/camera';
import withAnimation from '@/components/base/route-animation/with-animation';
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
import { urls } from '@/config/urls';
import { useApiResponseToast } from '@/hooks/base/api/use-api-response-toast';
import { useMutation } from '@/hooks/base/api/useMutation';
import type { UserProfileEntity } from '@/types/api/base/user.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Define props for the component
interface UpdateProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserProfileEntity;
  callback?: (success: boolean) => void;
}

// 1. Define the validation schema with Zod for our fields
const UpdateProfileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long.'),
  first_name: z.string().min(1, 'First name is required.'),
  last_name: z.string().min(1, 'Last name is required.'),
  email: z
    .string()
    .min(1, 'Email is required.')
    .email('Please enter a valid email address.'),
  image: z
    .array(
      z.union([
        z.custom<File>((v) => v instanceof File, {
          message: 'Invalid file type'
        }),
        z.object({
          public_id: z.string(),
          url: z.string().url()
        })
      ])
    )
    .max(1, { message: 'You can only upload one avatar.' })
    .optional() // Make image optional
});

// Infer the TypeScript type from the Zod schema
type TUpdateProfileSchema = z.infer<typeof UpdateProfileSchema>;

export const UpdateProfile: React.FC<UpdateProfileProps> = withAnimation(
  ({ open, onOpenChange, user, callback }) => {
    const formId = 'update-user-form';

    // 2. Initialize react-hook-form
    const form = useForm<TUpdateProfileSchema>({
      resolver: zodResolver(UpdateProfileSchema),
      defaultValues: {
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        image: user.image
          ? [{ url: user.image, public_id: user.image_public_id || '' }]
          : []
      }
    });

    // Reset form when user data changes
    useEffect(() => {
      form.reset({
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        image: user.image
          ? [{ url: user.image, public_id: user.image_public_id || '' }]
          : []
      });
    }, [user, form]);

    // 3. Set up the API mutation for updating the user
    const updateProfileMutation = useMutation<object, FormData>(
      `${urls.USERS_URL}/${user.id}`,
      'PUT'
    );

    // 4. Use your custom hook to handle toast notifications and callbacks
    useApiResponseToast(
      {
        error: updateProfileMutation.error,
        isError: updateProfileMutation.isError,
        isSuccess: updateProfileMutation.isSuccess
      },
      {
        successMessage: 'User updated successfully!',
        successCallback: () => {
          onOpenChange(false);
          callback?.(true);
        },
        errorCallback: () => {
          callback?.(false);
        }
      }
    );

    // 5. Define the submit handler
    async function onSubmit(values: TUpdateProfileSchema) {
      const { image, ...validatedData } = values;
      const formData = new FormData();

      Object.entries(validatedData).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });

      if (image?.length) {
        const file = image[0];
        // Only append image if it's a new file upload
        if (file instanceof File) {
          formData.append('image', file);
        }
      }
      await updateProfileMutation.execute(formData);
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[95dvh] w-full !max-w-screen-md overflow-auto pb-0">
          <DialogHeader>
            <DialogTitle>Update User Profile</DialogTitle>
            <DialogDescription>
              Update the form below to modify your details. Click save when
              you're done.
            </DialogDescription>
          </DialogHeader>

          {/* 6. Form structure */}
          <Form {...form}>
            <form
              id={formId}
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start w-full">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="john.doe@example.com"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Image</FormLabel>
                        <FormControl>
                          <Camera
                            mode="single"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription>
                          Upload a new image to replace the current one.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
          <DialogFooter className="sticky bottom-0 left-0 bg-white py-6 z-10 mt-8">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              form={formId}
              type="submit"
              disabled={updateProfileMutation.isLoading}>
              {updateProfileMutation.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
