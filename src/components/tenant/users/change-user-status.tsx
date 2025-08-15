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
import { useApiResponseToast } from '@/hooks/api/use-api-response-toast';
import { useMutation } from '@/hooks/api/useMutation';
import type { UserEntity } from '@/types/api/user.type';
import { Loader2 } from 'lucide-react';

type ChangeUserStatusProps = {
  user: UserEntity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callback?: (success: boolean) => void;
};

type ChangeUserStatusData = { userId: string; active: boolean };

export const ChangeUserStatus: React.FC<ChangeUserStatusProps> = withAnimation(
  (props) => {
    const changeStatusMutation = useMutation<unknown, ChangeUserStatusData>(
      urls.CHANGE_USER_STATUS_URL.replace(':userId', props.user?.id),
      'POST'
    );

    useApiResponseToast(
      {
        error: changeStatusMutation.error,
        isError: changeStatusMutation.isError,
        isSuccess: changeStatusMutation.isSuccess
      },
      {
        successMessage: 'User status changed successfully',
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
        changeStatusMutation.execute({
          userId: props.user.id,
          active: !props.user.active
        });
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
            <DialogTitle>
              {props.user.active
                ? 'Deactivate Account Confirmation'
                : 'Activate Account Confirmation'}
            </DialogTitle>
            <DialogDescription>
              {props.user.active
                ? 'Are you sure you want to deactivate this account?'
                : 'Are you sure you want to activate this account?'}
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
              {props.user.active
                ? 'This action will disable the account. The user will no longer have access until it is re-activated.'
                : 'This action will enable the account and allow the user to access its features.'}
            </p>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant={props.user.active ? 'destructive' : 'default'}
              disabled={changeStatusMutation.isLoading}
              onClick={handleChangeStatus}>
              {changeStatusMutation.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {props.user.active ? 'Deactivate' : 'Activate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
