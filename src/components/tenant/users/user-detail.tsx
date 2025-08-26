import { ApiError } from '@/components/base/api-error';
import withAnimation from '@/components/base/route-animation/with-animation';
import { Spinner } from '@/components/base/spinner';
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
import { urls } from '@/config/urls';
import { useQuery } from '@/hooks/base/api/useQuery';
import React from 'react';

// --- TYPE DEFINITION is still needed for type safety ---
type Role = {
  id: string;
  name: string;
};

type User = {
  id: string;
  username: string;
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'suspended' | 'pending';
  image: string | null;
  imageId: string | null;
  fullName: string;
  dateJoined: string;
  lastLogin: string;
  roles: Role[];
};

// --- PROPS INTERFACE ---
type UserDetailProps = {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const UserDetail: React.FC<UserDetailProps> = withAnimation(
  ({ userId, open, onOpenChange }) => {
    // We type the query to ensure userQuery.data is a User object
    const userQuery = useQuery<User>(urls.getUserUrl(userId), {
      skip: !open || !userId
    });

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[98dvh] overflow-auto">
          {userQuery.isLoading && <Spinner variant="page" />}
          {userQuery.isError && (
            <ApiError
              error={userQuery.error}
              customAction={{
                label: 'Refresh',
                handler: userQuery.refetch
              }}
            />
          )}
          {userQuery.isSuccess && userQuery.data && (
            <>
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription>
                  Raw data for user @{userQuery.data.username}.
                </DialogDescription>
              </DialogHeader>

              {/* highlight-start */}
              {/* This div directly replaces the JsonViewer */}
              <div className="space-y-3 rounded-md border p-4 font-mono">
                {Object.entries(userQuery.data)
                  .filter(([key]) => key !== 'id') // Filter out the 'id' field
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-start justify-between gap-4">
                      <p className="text-sm font-medium text-muted-foreground">
                        {key}:
                      </p>
                      <div className="text-right break-all text-sm">
                        {/* 
                          Inline logic without a helper function.
                          1. Check if the value is null.
                          2. Check if the key is 'roles' and it's an array.
                          3. Otherwise, treat it as a string.
                        */}
                        {value === null ? (
                          <span className="italic text-muted-foreground">
                            null
                          </span>
                        ) : key === 'roles' && Array.isArray(value) ? (
                          value.length > 0 ? (
                            <span>
                              {value.map((role) => role.name).join(', ')}
                            </span>
                          ) : (
                            <span className="italic text-muted-foreground">
                              Empty list
                            </span>
                          )
                        ) : (
                          <span>{String(value)}</span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
              {/* highlight-end */}
            </>
          )}

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
