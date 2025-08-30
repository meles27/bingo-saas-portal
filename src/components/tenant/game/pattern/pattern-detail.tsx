import { ApiError } from '@/components/base/api-error';
import withAnimation from '@/components/base/route-animation/with-animation';
import { Spinner } from '@/components/base/spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { urls } from '@/config/urls';
import { useQuery } from '@/hooks/base/api/useQuery';
import type { PatternDetailEntity } from '@/types/api/game/pattern.type';
import { Calendar, Shapes, Type } from 'lucide-react';
import React, { useMemo } from 'react';
import { PatternVisualizer } from './pattern-visualizer';

// A helper for consistent layout
const DetailRow = ({
  icon,
  label,
  children
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-start text-sm">
    <div className="flex items-center gap-2 w-1/3 text-muted-foreground">
      {icon}
      <span>{label}</span>
    </div>
    <div className="w-2/3 font-medium">{children}</div>
  </div>
);

type PatternDetailProps = {
  patternId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const PatternDetail: React.FC<PatternDetailProps> = withAnimation(
  ({ patternId, open, onOpenChange }) => {
    const patternQuery = useQuery<PatternDetailEntity>(
      urls.getPatternUrl(patternId!),
      {
        skip: !patternId || !open
      }
    );

    const pattern = useMemo(() => patternQuery.data, [patternQuery.data]);

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[95dvh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Pattern Details</DialogTitle>
            <DialogDescription>
              Viewing detailed information for pattern: {pattern?.name || '...'}
            </DialogDescription>
          </DialogHeader>

          {/* loading state */}
          {patternQuery.isLoading && <Spinner variant="page" />}

          {/* error state */}
          {patternQuery.isError && (
            <ApiError
              error={patternQuery.error}
              customAction={{
                label: 'Retry',
                handler: patternQuery.refetch
              }}
            />
          )}

          {/* success state */}
          {patternQuery.isSuccess && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-4">
                  <DetailRow icon={<Type className="h-4 w-4" />} label="Name">
                    {patternQuery.data.name}
                  </DetailRow>
                  <DetailRow icon={<Shapes className="h-4 w-4" />} label="Type">
                    <Badge variant="outline" className="capitalize">
                      {patternQuery.data.type}
                    </Badge>
                  </DetailRow>
                </div>
                <div className="flex justify-center md:justify-end">
                  <PatternVisualizer
                    coordinates={patternQuery.data.coordinates}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {patternQuery.data.description || 'No description provided.'}
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <DetailRow
                  icon={<Calendar className="h-4 w-4" />}
                  label="Created At">
                  {new Date(patternQuery.data.createdAt).toLocaleString()}
                </DetailRow>
                <DetailRow
                  icon={<Calendar className="h-4 w-4" />}
                  label="Last Updated">
                  {new Date(patternQuery.data.updatedAt).toLocaleString()}
                </DetailRow>
              </div>
            </div>
          )}
          <DialogFooter className="sticky bottom-0 left-0">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
