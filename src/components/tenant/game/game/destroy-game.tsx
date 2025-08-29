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
import type { GameListEntity } from '@/types/api/game/game.type';

type DestroyGameProps = {
  game: GameListEntity | null; // Allow null to handle initial render
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callback?: (success: boolean) => void;
};

export const DestroyGame: React.FC<DestroyGameProps> = withAnimation(
  ({ game, open, onOpenChange, callback }) => {
    /**
     * Delete mutation for the game
     */
    const destroyGameMutation = useMutation<unknown, void>(
      urls.getGameUrl(game?.id || ''),
      'DELETE'
    );

    useApiResponseToast(
      {
        error: destroyGameMutation.error,
        isError: destroyGameMutation.isError,
        isSuccess: destroyGameMutation.isSuccess
      },
      {
        successMessage: 'Game deleted successfully!',
        successCallback: () => {
          onOpenChange(false);
          callback?.(true);
        },
        errorCallback: () => callback?.(false)
      }
    );

    const handleConfirmDelete = () => {
      // Ensure we have a game before executing
      if (game) {
        destroyGameMutation.execute();
      }
    };

    // Render nothing if there's no game object provided
    if (!game) {
      return null;
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Game Confirmation</DialogTitle>
            <DialogDescription>
              This action cannot be undone and is permanent.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              You are about to permanently delete the game:
              <strong className="text-foreground ml-1">{game.name}</strong>.
            </p>
            <p className="text-sm font-semibold text-destructive">
              All associated rounds and data for this game will also be deleted.
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
              disabled={destroyGameMutation.isLoading}
              onClick={handleConfirmDelete}>
              {destroyGameMutation.isLoading && (
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
