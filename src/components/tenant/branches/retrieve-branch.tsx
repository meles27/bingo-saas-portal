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
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/utils';
import type { BranchEntity } from '@/types/api/branch.type';
import { Check, Copy, MapPin } from 'lucide-react';
import { useState } from 'react';

type RetrieveBranchProps = {
  branch: BranchEntity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Reusable component for consistent key-value display
const DetailItem: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children
}) => (
  <div className="grid grid-cols-3 items-start gap-4">
    <p className="text-sm font-medium text-muted-foreground col-span-1">
      {label}
    </p>
    <div className="text-sm col-span-2">{children}</div>
  </div>
);

// Copy button component to avoid repetition
const CopyButton: React.FC<{ idToCopy: string; copiedId: string | null }> = ({
  idToCopy,
  copiedId
}) => {
  return (
    <Button variant="ghost" size="icon" className="h-7 w-7">
      {copiedId === idToCopy ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
};

export const RetrieveBranch: React.FC<RetrieveBranchProps> = withAnimation(
  ({ branch, open, onOpenChange }) => {
    // State to track which ID is currently copied
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // The Dialog can't render without a branch, so we return null to prevent errors.
    if (!branch) {
      return null;
    }

    const handleCopy = (id: string) => {
      navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    };

    return (
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            onOpenChange(false);
            setCopiedId(null); // Reset copy state on close
          }
        }}>
        <DialogContent className="sm:max-w-lg max-h-[98dvh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Branch Details</DialogTitle>
            <DialogDescription>
              Viewing details for the branch: <strong>{branch.name}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <DetailItem label="Name">{branch.name}</DetailItem>

            <DetailItem label="Branch ID">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => handleCopy(branch.id)}>
                <span className="truncate font-mono text-xs">{branch.id}</span>
                <CopyButton idToCopy={branch.id} copiedId={copiedId} />
              </div>
            </DetailItem>

            <DetailItem label="Created At">
              {formatDate(branch.created_at, {
                variant: 'long'
              })}
            </DetailItem>
            <DetailItem label="Last Updated">
              {formatDate(branch.updated_at, {
                variant: 'long'
              })}
            </DetailItem>

            <Separator className="my-2" />

            {/* Locations Section */}
            <div>
              <h4 className="text-sm font-medium mb-3">
                Locations ({branch.locations.length})
              </h4>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {branch.locations.length > 0 ? (
                  branch.locations.map((location) => (
                    <div
                      key={location.id}
                      className="flex flex-col rounded-md border p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <span className="text-sm">{location.address}</span>
                        </div>
                      </div>
                      <div
                        className="flex items-center justify-between mt-2 pl-6 cursor-pointer"
                        onClick={() => handleCopy(location.id)}>
                        <span className="truncate font-mono text-xs text-muted-foreground">
                          ID: {location.id}
                        </span>
                        <CopyButton
                          idToCopy={location.id}
                          copiedId={copiedId}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    This branch has no locations.
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
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
