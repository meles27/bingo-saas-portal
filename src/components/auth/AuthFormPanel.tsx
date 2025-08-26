import { GalleryVerticalEnd } from 'lucide-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

interface AuthFormPanelProps {
  children: React.ReactNode;
}

export function AuthFormPanel({ children }: AuthFormPanelProps) {
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col justify-between gap-2 p-6 lg:p-10">
      <Button
        onClick={() => navigate('/')}
        className="self-start w-fit -translate-x-4"
        variant="link">
        Back home
      </Button>

      {/* Header with Logo */}
      <div className="flex justify-center lg:justify-start">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-5" />
          </div>
          <span className="text-xl">Acme Inc.</span>
        </Link>
      </div>

      {/* Main Form Area */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm py-8">
          {children} {/* This is where <LoginForm /> will be rendered */}
        </div>
      </div>
    </div>
  );
}
