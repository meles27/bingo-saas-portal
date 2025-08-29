import withAnimation from '@/components/base/route-animation/with-animation';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Zod schema
const userSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  age: z
    .string()
    .min(1, 'Age is required')
    .refine((val) => !isNaN(Number(val)), 'Age must be a number')
    .refine((val) => Number(val) >= 0, 'Age must be >= 0'),
  score: z
    .string()
    .min(1, 'Score is required')
    .refine((val) => !isNaN(Number(val)), 'Score must be a number')
    .refine((val) => {
      const n = Number(val);
      return n >= 0 && n <= 100;
    }, 'Score must be 0-100'),
  email: z.email('Invalid email'),
  phone: z.string().optional(),
  birthDate: z
    .string()
    .min(1, 'Birth date is required')
    .refine((val) => !isNaN(new Date(val).getTime()), 'Must be a valid date')
});

// Type inferred from schema
type UserFormRaw = z.infer<typeof userSchema>;

export const UserForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UserFormRaw>({
    resolver: zodResolver(userSchema),
    mode: 'onSubmit'
  });

  const onSubmit = (data: UserFormRaw) => {
    const age = Number(data.age);
    const score = Number(data.score);
    const birthDate = new Date(data.birthDate).toISOString();

    console.log('Submitted data:', { ...data, age, score, birthDate });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 border p-6 rounded-xl">
      <div>
        <label>First Name:</label>
        <Input type="text" {...register('firstName')} />
        {errors.firstName && (
          <p style={{ color: 'red' }}>{errors.firstName.message}</p>
        )}
      </div>

      <div>
        <label>Last Name:</label>
        <Input type="text" {...register('lastName')} />
        {errors.lastName && (
          <p style={{ color: 'red' }}>{errors.lastName.message}</p>
        )}
      </div>

      <div>
        <label>Age:</label>
        <Input type="number" {...register('age')} />
        {errors.age && <p style={{ color: 'red' }}>{errors.age.message}</p>}
      </div>

      <div>
        <label>Score (0-100):</label>
        <Input type="number" {...register('score')} />
        {errors.score && <p style={{ color: 'red' }}>{errors.score.message}</p>}
      </div>

      <div>
        <label>Email:</label>
        <Input type="email" {...register('email')} />
        {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
      </div>

      <div>
        <label>Phone (optional):</label>
        <Input type="text" {...register('phone')} />
      </div>

      <div>
        <label>Birth Date:</label>
        <Input type="datetime-local" {...register('birthDate')} />
        {errors.birthDate && (
          <p style={{ color: 'red' }}>{errors.birthDate.message}</p>
        )}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export const TestPage = withAnimation(() => {
  return (
    <div className="flex items-center justify-center p-6 border border-red-400">
      <UserForm />
    </div>
  );
});
