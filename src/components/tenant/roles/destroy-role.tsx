import withAnimation from '@/components/base/route-animation/with-animation';
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
import type { RoleEntity } from '@/types/api/role.type';
import { Loader2 } from 'lucide-react';

type DestroyRoleProps = {
  role: RoleEntity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callback?: (success: boolean) => void;
};

type DestroyRoleData = { roleId: string; active: boolean };

export const DestroyRole: React.FC<DestroyRoleProps> = withAnimation(
  ({ role, open, onOpenChange, callback }) => {
    /**
     * remove
     */
    const destroyRoleMutation = useMutation<unknown, DestroyRoleData>(
      urls.ROLE_URL.replace(':roleId', role?.id),
      'DELETE'
    );

    useApiResponseToast(
      {
        error: destroyRoleMutation.error,
        isError: destroyRoleMutation.isError,
        isSuccess: destroyRoleMutation.isSuccess
      },
      {
        successMessage: 'role deleted successfully',
        successCallback: () => {
          onOpenChange(false);
          if (callback) callback(true);
        },
        errorCallback: () => (callback ? callback(false) : undefined)
      }
    );

    const handleChangeStatus = () => {
      if (role) {
        destroyRoleMutation.execute();
      }
    };

    // The Dialog can't render without a role, so we return null to prevent errors.
    if (!role) {
      return null;
    }

    return (
      <Dialog
        open={open}
        onOpenChange={(isOpen) => !isOpen && onOpenChange(isOpen)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Account Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this role?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              This action will delelete the role.
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
              variant="destructive"
              disabled={destroyRoleMutation.isLoading}
              onClick={handleChangeStatus}>
              {destroyRoleMutation.isLoading && (
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
