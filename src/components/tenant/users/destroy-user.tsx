import withAnimation from '@/components/base/route-animation/with-animation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useApiResponseToast } from '@/hooks/base/api/use-api-response-toast';
import { useMutation } from '@/hooks/base/api/useMutation';
import type { UserEntity } from '@/types/api/base/user.type';
import { Loader2 } from 'lucide-react';

type DestroyUserProps = {
  user: UserEntity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callback?: (success: boolean) => void;
};

type DestroyUserData = { userId: string; active: boolean };

export const DestroyUser: React.FC<DestroyUserProps> = withAnimation(
  (props) => {
    const destroyUserMutation = useMutation<unknown, DestroyUserData>(
      urls.USER_URL.replace(':userId', props.user?.id),
      'DELETE'
    );

    useApiResponseToast(
      {
        error: destroyUserMutation.error,
        isError: destroyUserMutation.isError,
        isSuccess: destroyUserMutation.isSuccess
      },
      {
        successMessage: 'User deleted successfully',
        successCallback: () => {
          props.onOpenChange(false);
          if (props.callback) props.callback(true);
        },
        errorCallback: () =>
          props.callback ? props.callback(false) : undefined
      }
    );

    const handleChangeStatus = () => {
      if (props.user) {
        destroyUserMutation.execute();
      }
    };

    // The Dialog can't render without a user, so we return null to prevent errors.
    if (!props.user) {
      return null;
    }

    return (
      <Dialog
        open={props.open}
        onOpenChange={(isOpen) => !isOpen && props.onOpenChange(isOpen)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Account Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this account?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex items-center gap-4 rounded-md border p-4">
              <Avatar>
                <AvatarImage
                  src={props.user.image ?? undefined}
                  alt={`@${props.user.username}`}
                />
                <AvatarFallback>
                  {props.user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="font-semibold text-sm">{props.user.username}</p>
                <p className="text-sm text-muted-foreground">
                  {props.user.first_name} {props.user.last_name}
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              This action will delelete the account.
            </p>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                No, Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant={props.user.active ? 'destructive' : 'default'}
              disabled={destroyUserMutation.isLoading}
              onClick={handleChangeStatus}>
              {destroyUserMutation.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
