import Camera from '@/components/base/camera/camera';
import PasswordInput from '@/components/base/password-input';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { urls } from '@/config/urls'; // Make sure to add USERS_URL here
import { useApiResponseToast } from '@/hooks/base/api/use-api-response-toast';
import { useMutation } from '@/hooks/base/api/useMutation'; // Assuming this is your custom hook
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const defaultImages = [
  {
    public_id: 'sample1',
    url: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=300'
  },
  {
    public_id: 'sample2',
    url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=300'
  }
];

// Define props for the component
interface CreateUserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional callback to run after the API call is complete. */
  callback?: (success: boolean) => void;
}

// 1. Define the validation schema with Zod for our 4 fields
const CreateUserSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters long.'),
    first_name: z.string().min(1, 'First name is required.'),
    last_name: z.string().min(1, 'Last name is required.'),
    email: z
      .string()
      .min(1, 'Email is required.')
      .email('Please enter a valid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters long.'),
    password1: z.string().min(6, 'Please confirm your password.'),
    roleId: z.string().min(1, 'Role is required.'),
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
      .min(1, { message: 'An avatar image is required.' }) // Enforce at least one image
      .max(1, { message: 'You can only upload one avatar.' }) // Enforce at most one image
  })
  .refine((data) => data.password === data.password1, {
    path: ['password1'],
    message: 'Passwords do not match.'
  });

// Infer the TypeScript type from the Zod schema
type TCreateUserSchema = z.infer<typeof CreateUserSchema>;

export const CreateUser: React.FC<CreateUserProps> = ({
  open,
  onOpenChange,
  callback
}) => {
  // A unique ID to link the submit button to the form
  const formId = 'create-user-form';

  // 2. Initialize react-hook-form
  const form = useForm<TCreateUserSchema>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      first_name: 'meles',
      last_name: 'haileselassie',
      username: 'meles',
      password: 'meles05',
      password1: 'meles05',
      email: 'meleshaileselassie05@gmail.com',
      image: defaultImages
    }
  });

  // 3. Set up the API mutation using your custom hook
  const createUserMutation = useMutation<object, TCreateUserSchema>(
    urls.USERS_URL,
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
    console.log(values);
    // await createUserMutation.execute(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95dvh] w-full !max-w-screen-sm overflow-auto pb-0">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new user user. Click save when
            you're done.
          </DialogDescription>
        </DialogHeader>

        {/* 6. Form structure using shadcn/ui components */}
        <Form {...form}>
          <form
            id={formId}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4">
            <div className="grid grid-cols-2 gap-4 items-start w-full">
              {/* First Name Field */}
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
              {/* Last Name Field */}
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

            <div className="grid grid-cols-2 gap-4 items-start w-full">
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
              {/* role Field */}
              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Role</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Roles</SelectLabel>
                            <SelectItem value="8a8f1d2e-3b8a-4e3e-9f1f-5c9c1f3b3b2d">
                              Admin
                            </SelectItem>
                            <SelectItem value="c6a70a9e-dc13-4d62-9d12-4d1e1bb3a728">
                              Editor
                            </SelectItem>
                            <SelectItem value="1e2c38bc-42fb-46c4-b390-9175470fc093">
                              Viewer
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
            <div className="grid grid-cols-2 gap-4 items-start w-full">
              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="john.doe@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* confirm password Field */}
              <FormField
                control={form.control}
                name="password1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password1</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="john.doe@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                      Upload images for your profile. You can use your camera or
                      select from your device.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter className="sticky bottom-0 left-0 bg-white py-6 z-10">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
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
};
