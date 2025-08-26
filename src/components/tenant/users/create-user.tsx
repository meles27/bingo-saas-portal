import Camera from '@/components/base/camera/camera';
import PasswordInput from '@/components/base/password-input';
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
import { urls } from '@/config/urls'; // Make sure to add USERS_URL here
import { useApiResponseToast } from '@/hooks/base/api/use-api-response-toast';
import { useMutation } from '@/hooks/base/api/useMutation'; // Assuming this is your custom hook
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Define props for the component
interface CreateUserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callback?: (success: boolean) => void;
}

// 1. Define the validation schema with Zod for our 4 fields
const CreateUserSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters long.'),
    firstName: z.string().min(1, 'First name is required.'),
    lastName: z.string().min(1, 'Last name is required.'),
    email: z.email('Please enter a valid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters long.'),
    password1: z.string().min(6, 'Please confirm your password.'),
    phone: z.string().min(1, 'Phone number is required.'),
    image: z
      .array(
        z
          .union([
            z.custom<File>((v) => v instanceof File, {
              message: 'Invalid file type'
            }),
            z.object({
              public_id: z.string(),
              url: z.url()
            })
          ])
          .optional()
      )
      .max(1, { message: 'You can only upload one avatar.' })
  })
  .refine((data) => data.password === data.password1, {
    path: ['password1'],
    message: 'Passwords do not match.'
  });

// Infer the TypeScript type from the Zod schema
type TCreateUserSchema = z.infer<typeof CreateUserSchema>;

export const CreateUser: React.FC<CreateUserProps> = withAnimation(
  ({ open, onOpenChange, callback }) => {
    // A unique ID to link the submit button to the form
    const formId = 'create-user-form';

    // 2. Initialize react-hook-form
    const form = useForm<TCreateUserSchema>({
      resolver: zodResolver(CreateUserSchema),
      defaultValues: {}
    });

    // 3. Set up the API mutation using your custom hook
    const createUserMutation = useMutation<object, FormData>(
      urls.getUsersUrl(),
      'POST'
    );

    // 4. Use your custom hook to handle toast notifications and callbacks
    useApiResponseToast(
      {
        error: createUserMutation.error,
        isError: createUserMutation.isError,
        isSuccess: createUserMutation.isSuccess
      },
      {
        successMessage: 'User created successfully!',
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

    // 5. Define the submit handler
    async function onSubmit(values: TCreateUserSchema) {
      console.log('values', values);
      const { image, ...validatedData } = values;
      const formData = new FormData();
      console.log('values', values);
      Object.entries(validatedData).map(([key, value]) => {
        formData.append(key, value);
      });
      if (image.length) {
        const file = image[0];
        if (file instanceof File) {
          formData.append('image', file);
        }
      }
      await createUserMutation.execute(formData);
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[95dvh] !max-w-3xl overflow-auto pb-0">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Fill out the form below to create a new user. Click save when
              you're done.
            </DialogDescription>
          </DialogHeader>

          {/* 6. Form structure using shadcn/ui components */}
          <Form {...form}>
            <form
              id={formId}
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start w-full">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* First Name Field */}
                    <FormField
                      control={form.control}
                      name="firstName"
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
                    {/* Last Name Field */}
                    <FormField
                      control={form.control}
                      name="lastName"
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
                  {/* Username Field */}
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
                  {/* Email Field */}
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
                  <div className="grid grid-cols-1 gap-4">
                    {/* Password Field */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <PasswordInput placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Confirm Password Field */}
                    <FormField
                      control={form.control}
                      name="password1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <PasswordInput placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Role Field */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="+251 ..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Profile Image Field */}
                  <div>
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
                            Upload an image for the profile.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </form>
          </Form>
          <DialogFooter className="sticky bottom-0 left-0 flex flex-row w-full justify-end bg-white py-6 z-10 mt-8">
            <DialogClose asChild>
              <Button type="button" className="flex-1" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="flex-2"
              form={formId}
              type="submit"
              disabled={createUserMutation.isLoading}>
              {createUserMutation.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
