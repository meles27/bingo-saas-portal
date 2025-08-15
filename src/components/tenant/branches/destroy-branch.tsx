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
import { urls } from '@/config/urls'; // Ensure you have a BRANCHS_URL
import { useApiResponseToast } from '@/hooks/api/use-api-response-toast';
import { useMutation } from '@/hooks/api/useMutation';
import type { BranchEntity } from '@/types/api/branch.type'; // Adjust path as needed
import { Loader2 } from 'lucide-react';

type DestroyBranchProps = {
  branch: BranchEntity; // The branch to delete. Can be null when dialog is inactive.
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callback?: (success: boolean) => void;
};

export const DestroyBranch: React.FC<DestroyBranchProps> = withAnimation(
  ({ branch, open, onOpenChange, callback }) => {
    // 1. Set up the mutation for a DELETE request to the branchs endpoint
    const destroyBranchMutation = useMutation<unknown, void>(
      // Construct the URL dynamically with the branch's ID
      urls.BRANCH_URL.replace(':branchId', branch?.id),
      'DELETE'
    );

    // 2. Use the toast hook for API response feedback
    useApiResponseToast(
      {
        error: destroyBranchMutation.error,
        isError: destroyBranchMutation.isError,
        isSuccess: destroyBranchMutation.isSuccess
      },
      {
        successMessage: 'Branch deleted successfully!',
        successCallback: () => {
          onOpenChange(false);
          callback?.(true);
        },
        errorCallback: () => {
          callback?.(false);
        }
      }
    );

    // 3. Define the handler to execute the deletion
    const handleConfirmDelete = () => {
      // Guard clause to ensure a branch is selected before executing
      if (branch) {
        destroyBranchMutation.execute();
      }
    };

    // The Dialog can't render without a branch, so we return null to prevent errors.
    if (!branch) {
      return null;
    }

    // 4. Render the confirmation dialog
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Branch Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the branch:{' '}
              <strong>{branch.name}</strong>?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <p className="text-sm font-semibold text-destructive">
              This action cannot be undone.
            </p>
            <p className="text-sm text-muted-foreground">
              This will permanently delete the branch and all of its associated
              data, including its locations.
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
              disabled={destroyBranchMutation.isLoading}
              onClick={handleConfirmDelete}>
              {destroyBranchMutation.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Yes, Delete Branch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
