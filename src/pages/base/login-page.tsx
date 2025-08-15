import withAnimation from '@/components/base/route-animation/with-animation';
import { LoginForm } from '@/components/login-form';
import { GalleryVerticalEnd } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LoginPage = withAnimation(() => {
  return (
    <div className="grid w-full min-h-svh">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
});
