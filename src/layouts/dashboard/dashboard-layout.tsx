import withAnimation from '@/components/base/route-animation/with-animation';
import { useAuthStore } from '@/store/auth-store';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export const DashboardLayout: React.FC = withAnimation(() => {
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="flex flex-col w-full h-full">
      {/* main section */}
      <main className="flex-1 bg-background overflow-auto">
        <AnimatePresence>
          <Outlet />
        </AnimatePresence>
      </main>
    </div>
  );
});
