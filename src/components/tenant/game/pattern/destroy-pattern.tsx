import { Loader2 } from 'lucide-react';

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
import { useApiResponseToast } from '@/hooks/base/api/use-api-response-toast';
import { useMutation } from '@/hooks/base/api/useMutation';
import type { PatternEntity } from '@/types/api/game/pattern.type';

type DestroyPatternProps = {
  pattern: PatternEntity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callback?: (success: boolean) => void;
};

export const DestroyPattern: React.FC<DestroyPatternProps> = withAnimation(
  ({ pattern, open, onOpenChange, callback }) => {
    /**
     * Delete mutation
     */
    const destroyPatternMutation = useMutation<unknown>(
      urls.getPatternUrl(pattern?.id), // Use the specific pattern URL
      'DELETE'
    );

    useApiResponseToast(
      {
        error: destroyPatternMutation.error,
        isError: destroyPatternMutation.isError,
        isSuccess: destroyPatternMutation.isSuccess
      },
      {
        successMessage: 'Pattern deleted successfully!',
        successCallback: () => {
          onOpenChange(false);
          callback?.(true);
        },
        errorCallback: () => callback?.(false)
      }
    );

    const handleConfirmDelete = () => {
      if (pattern) {
        destroyPatternMutation.execute();
      }
    };

    if (!pattern) {
      return null;
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Pattern Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this pattern? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              You are about to permanently delete the pattern:
              <strong className="text-foreground ml-1">{pattern.name}</strong>
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
              disabled={destroyPatternMutation.isLoading}
              onClick={handleConfirmDelete}>
              {destroyPatternMutation.isLoading && (
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
