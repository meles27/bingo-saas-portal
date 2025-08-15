import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Github, Loader } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { z } from 'zod';
import PasswordInput from './base/password-input';

// --- 1. Define the form schema with Zod ---
const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters long.'
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long.'
  })
});

// Infer the type from the schema
type LoginFormValues = z.infer<typeof formSchema>;

type LoginFormProps = React.ComponentProps<'div'>;

export function LoginForm({ className, ...props }: LoginFormProps) {
  const navigate = useNavigate();

  // --- 2. Set up the form with react-hook-form and the zodResolver ---
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const loginState = useAuthStore((state) => state.loginState);

  // --- 3. Define the submit handler ---
  const onSubmit = async (data: LoginFormValues) => {
    console.log(data);
    const [response, error] = await login(data.username, data.password);

    if (error) {
      console.log(error);
      // Provide a more user-friendly error message
      const errorMessage =
        error.data?.detail || 'An unexpected error occurred. Please try again.';
      toast.error(errorMessage);
      return;
    }

    if (response) {
      toast.success('Login successful!');
      // e.g., save token to localStorage, update user state
      console.log('Login Response:', response);
      navigate('/dashboard'); // Redirect on success
    }
  };

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Username Field */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="your.username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>Password</FormLabel>
                  <Link
                    to="/forgot-password"
                    className="ml-auto inline-block text-sm underline underline-offset-4 hover:text-primary">
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loginState.isLoading}>
            {loginState.isLoading && <Loader />}
            Sign In
          </Button>
        </form>
      </Form>

      {/* "Or continue with" Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Login Button */}
      <Button variant="outline" type="button" disabled={loginState.isLoading}>
        <Github className="mr-2 h-4 w-4" />
        GitHub
      </Button>
    </div>
  );
}
