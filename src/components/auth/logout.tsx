'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { LogOut } from 'lucide-react';
import React from 'react';

// --- Component Props Interface ---
interface LogoutProps {
  /**
   * Controls the open/closed state of the dialog.
   */
  open: boolean;
  /**
   * A callback function that is invoked when the open state of the dialog changes.
   */
  onOpenChange: (open: boolean) => void;
  /**
   * An optional trigger component. If provided, clicking it will open the dialog.
   * If not provided, you must control the `open` state manually.
   */
  trigger?: React.ReactNode;
}

/**
 * A reusable confirmation dialog for logging out.
 * It uses an `AlertDialog` for accessibility and to emphasize the importance of the action.
 */
export function Logout({ open, onOpenChange, trigger }: LogoutProps) {
  const logout = useAuthStore((state) => state.logout);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {/* Conditionally render the trigger if it's provided */}
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
          <AlertDialogDescription>
            You will be returned to the login screen and any unsaved changes
            might be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* The default, non-destructive action */}
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>

          {/* The action that performs the logout */}
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
