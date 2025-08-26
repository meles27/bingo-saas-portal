import withAnimation from '@/components/base/route-animation/with-animation';
import { Badge } from '@/components/ui/badge';
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
import type { RoleEntity } from '@/types/api/base/role.type';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

type RetrieveRoleProps = {
  role: RoleEntity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// A small helper component to keep the layout consistent
const DetailItem: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children
}) => (
  <div className="flex flex-col space-y-1">
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <div className="text-sm">{children}</div>
  </div>
);

export const RetrieveRole: React.FC<RetrieveRoleProps> = withAnimation(
  ({ role, open, onOpenChange }) => {
    const [isCopied, setIsCopied] = useState(false);

    // The Dialog can't render without a role, so we return null to prevent errors.
    if (!role) {
      return null;
    }

    // Helper to format date strings for better readability
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const handleCopyId = () => {
      navigator.clipboard.writeText(role.id);
      setIsCopied(true);
      // Reset the "Copied" state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    };

    return (
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          // Only trigger onOpenChange when closing the dialog
          if (!isOpen) {
            onOpenChange(false);
            // Reset copy state when dialog closes
            setIsCopied(false);
          }
        }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Role Details</DialogTitle>
            <DialogDescription>
              Viewing details for the role: <strong>{role.name}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <DetailItem label="Name">{role.name}</DetailItem>

            <DetailItem label="Description">
              {role.description || (
                <span className="italic text-muted-foreground">
                  No description provided.
                </span>
              )}
            </DetailItem>

            <DetailItem label="Default Role">
              {role.isDefault ? (
                <Badge variant="secondary">Yes</Badge>
              ) : (
                <Badge variant="outline">No</Badge>
              )}
            </DetailItem>

            <DetailItem label="Role ID">
              <div className="flex items-center justify-between">
                <span className="truncate font-mono text-xs">{role.id}</span>
                <Button variant="ghost" size="icon" onClick={handleCopyId}>
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </DetailItem>

            <DetailItem label="Created At">
              {formatDate(role.createdAt)}
            </DetailItem>
            <DetailItem label="Last Updated">
              {formatDate(role.updatedAt)}
            </DetailItem>
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
