// src/components/base/user-avatar.tsx

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { User as UserIcon } from 'lucide-react'; // Generic user icon for the ultimate fallback
import React from 'react';

/**
 * Defines the shape of the user data the avatar component expects.
 */
export interface UserProfile {
  firstName?: string | null;
  lastName?: 'LNU' | string | null; // LNU is Last Name Unknown
  imageUrl?: string | null;
  email?: string | null;
  username?: string | null;
}

export interface UserAvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * The user data object. If null or undefined, a generic fallback will be shown.
   */
  user?: UserProfile | null;
}

/**
 * A reusable UserAvatar component that displays a user's image
 * or a fallback with their initials. Includes a tooltip with the full name.
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  className,
  ...props
}) => {
  /**
   * Generates initials from the user's first and last names.
   * Handles cases where names might be missing.
   */
  const getInitials = (): string => {
    const first = user?.firstName?.[0] ?? '';
    const last = user?.lastName?.[0] ?? '';
    // If both initials exist, return them. Otherwise, return the first letter
    // of the first name, or the first letter of the email/username as a last resort.
    const initials = `${first}${last}`.toUpperCase();
    if (initials) return initials;
    return (user?.email?.[0] ?? user?.username?.[0] ?? '').toUpperCase();
  };

  /**
   * Constructs the full name for the tooltip display.
   */
  const getFullName = (): string => {
    if (!user?.firstName && !user?.lastName) {
      return user?.username || user?.email || 'Unknown User';
    }
    return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  };

  // If no user object is provided at all, show a generic icon.
  if (!user) {
    return (
      <Avatar className={cn('bg-muted', className)} {...props}>
        <AvatarFallback>
          <span className="sr-only">Unknown User</span>
          <UserIcon className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar
        className={cn('border h-10 w-10 aspect-square', className)}
        {...props}>
        <AvatarImage src={user.imageUrl ?? undefined} alt={getFullName()} />
        <AvatarFallback>
          <span className="sr-only">{getFullName()}</span>
          {getInitials()}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-sm font-bold">{user.username}</p>
      </div>
    </div>
  );
};
