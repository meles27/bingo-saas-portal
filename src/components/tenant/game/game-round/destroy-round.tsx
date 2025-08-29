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
import type { RoundListEntity } from '@/types/api/game/round.type';

type DestroyRoundProps = {
  round: RoundListEntity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callback?: (success: boolean) => void;
};

export const DestroyRound: React.FC<DestroyRoundProps> = withAnimation(
  ({ round, open, onOpenChange, callback }) => {
    const destroyRoundMutation = useMutation<unknown, void>(
      urls.getRoundUrl(round?.id as string),
      'DELETE'
    );

    useApiResponseToast(
      {
        error: destroyRoundMutation.error,
        isError: destroyRoundMutation.isError,
        isSuccess: destroyRoundMutation.isSuccess
      },
      {
        successMessage: 'Round deleted successfully!',
        successCallback: () => {
          onOpenChange(false);
          callback?.(true);
        },
        errorCallback: () => callback?.(false)
      }
    );

    const handleConfirmDelete = () => {
      if (round) {
        destroyRoundMutation.execute();
      }
    };

    if (!round) {
      return null;
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Round Confirmation</DialogTitle>
            <DialogDescription>
              This action cannot be undone and is permanent.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              You are about to permanently delete{' '}
              <strong className="text-foreground">
                Round {round.roundNumber}: {round.name}
              </strong>
              .
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
              disabled={destroyRoundMutation.isLoading}
              onClick={handleConfirmDelete}>
              {destroyRoundMutation.isLoading && (
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
