// components/SignupForm.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { urls } from '@/config/urls';
import { useApiResponseToast } from '@/hooks/api/use-api-response-toast';
import { useMutation } from '@/hooks/api/useMutation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type SignupFormValues = {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  password1: string;
};

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<SignupFormValues>();
  const signupMutation = useMutation<object, FormData>(urls.USERS_URL, 'POST');

  const onSubmit = async (data: SignupFormValues) => {
    if (data.password !== data.password1) {
      toast.error('Passwords do not match');
      return;
    }

    const formData = new FormData();

    Object.entries(data).map(([key, value]) => {
      formData.append(key, value);
    });

    signupMutation.execute(formData);
  };

  useApiResponseToast(
    {
      error: signupMutation.error,
      isError: signupMutation.isError,
      isSuccess: signupMutation.isSuccess
    },
    {
      successMessage: 'user is created successfully'
    }
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto space-y-4 p-6 border rounded-xl shadow-md">
      <div className="space-y-2">
        <Label htmlFor="first_name">First Name</Label>
        <Input
          id="first_name"
          {...register('first_name', { required: 'First name is required' })}
        />
        {errors.first_name && (
          <p className="text-red-500 text-sm">{errors.first_name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="last_name">Last Name</Label>
        <Input
          id="last_name"
          {...register('last_name', { required: 'Last name is required' })}
        />
        {errors.last_name && (
          <p className="text-red-500 text-sm">{errors.last_name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email format'
            }
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          {...register('username', { required: 'Username is required' })}
        />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password1">Confirm Password</Label>
        <Input
          id="password1"
          type="password"
          {...register('password1', {
            required: 'Please confirm your password',
            validate: (value) =>
              value === watch('password') || 'Passwords do not match'
          })}
        />
        {errors.password1 && (
          <p className="text-red-500 text-sm">{errors.password1.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full hover:cursor-pointer">
        {signupMutation.isLoading ? 'Creating account ...' : 'Sign Up'}
      </Button>
    </form>
  );
}
