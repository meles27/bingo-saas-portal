import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Camera as CameraIcon, Expand, X } from 'lucide-react';
import { forwardRef, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import UploadFile from './upload-file'; // Assuming this component exists

// --- INTERFACES ---
export interface ExistingImage {
  public_id: string;
  url: string;
}

export type ImageFile = File | ExistingImage | undefined;

export interface CameraProps {
  mode: 'single' | 'multiple';
  replace?: boolean;
  // These are passed by react-hook-form's <FormField>
  value?: ImageFile[];
  onChange?: (files: ImageFile[]) => void;
}

// --- UTILITY FUNCTION (to convert webcam's base64 to File) ---
const base64toFile = (base64: string, filename: string): File => {
  const arr = base64.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

// --- COMPONENT ---
const Camera = forwardRef<HTMLDivElement, CameraProps>(
  ({ value = [], onChange, mode, replace = false }, ref) => {
    // --- STATE & REFS ---
    const [openViewer, setOpenViewer] = useState(false);
    const [openCamera, setOpenCamera] = useState(false);
    const [activeImageOrUrl, setActiveImageOrUrl] = useState<ImageFile | null>(
      null
    );
    const webcamRef = useRef<Webcam>(null);
    const allImages = value || [];

    // --- HANDLERS (Updated for controlled component) ---
    const handleRemoveImage = (imageToRemove: ImageFile) => {
      const newImageList = allImages.filter((image) => image !== imageToRemove);
      onChange?.(newImageList);
    };

    const handleOpenViewer = (image: ImageFile) => {
      setActiveImageOrUrl(image);
      setOpenViewer(true);
    };

    const handleCaptureFromWebcam = () => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        const newFile = base64toFile(imageSrc, `webcam-${Date.now()}.jpeg`);
        const newImageList =
          replace || mode === 'single' ? [newFile] : [...allImages, newFile];
        onChange?.(newImageList);
        if (mode === 'single') {
          setOpenCamera(false);
        }
      }
    };

    const handleSelectFromDevice = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      if (files.length > 0) {
        const newImageList =
          replace || mode === 'single' ? files : [...allImages, ...files];
        onChange?.(newImageList);
      }
      e.target.value = '';
    };

    // --- Helper to get a displayable URL from ImageFile ---
    const getImageUrl = (image: ImageFile): string => {
      if (image instanceof File) {
        return URL.createObjectURL(image);
      }
      return image?.url || '';
    };

    // --- RENDER ---
    return (
      <>
        {/* Main Upload Area */}
        <Card
          ref={ref}
          className="flex w-full flex-col gap-4 border-dashed bg-card p-4">
          <div className="relative flex items-center justify-center gap-4 rounded-xl border border-dashed p-6">
            {/* Camera Button */}
            <div className="flex flex-col items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-20 w-20 rounded-full"
                onClick={() => setOpenCamera(true)}>
                <CameraIcon className="h-10 w-10" />
              </Button>
              <span className="text-sm font-medium text-muted-foreground">
                Camera
              </span>
            </div>

            <Expand className="h-8 w-8 text-border" />

            {/* File Upload Button */}
            <div className="flex flex-col items-center justify-center gap-2">
              <UploadFile
                multiple={mode === 'multiple'}
                accept="image/*"
                onChange={handleSelectFromDevice}
                className="h-20 w-20"
                tooltipContent="Upload from device"
              />
              <span className="text-sm font-medium text-muted-foreground">
                File
              </span>
            </div>

            {/* Total Files Badge */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="secondary"
                    className="absolute bottom-2 left-1/2 -translate-x-1/2">
                    {allImages.length} files
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total files selected</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Image Preview List */}
          {allImages.length > 0 && (
            <div className="w-full rounded-xl border border-dashed p-2">
              <div className="flex h-full w-full gap-3 overflow-x-auto p-2">
                {allImages.map((image, index) => (
                  <div key={index} className="relative flex-shrink-0">
                    <Card
                      className="h-24 w-24 cursor-pointer overflow-hidden transition-opacity hover:opacity-80"
                      onClick={() => handleOpenViewer(image)}>
                      <img
                        alt={`preview ${index}`}
                        className="h-full w-full object-cover"
                        src={getImageUrl(image)}
                      />
                    </Card>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(image)}
                      className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-red-500 text-white transition-transform hover:scale-110">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Webcam Dialog */}
        <Dialog open={openCamera} onOpenChange={setOpenCamera}>
          <DialogContent className="max-w-2xl p-4">
            <div className="relative aspect-video w-full">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="h-full w-full rounded-lg object-cover"
              />
              <Button
                type="button"
                size="icon"
                className="absolute bottom-4 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full border-4 border-white bg-primary/80 shadow-lg hover:bg-primary"
                onClick={handleCaptureFromWebcam}>
                <CameraIcon className="h-8 w-8 text-white" />
              </Button>
              <div className="absolute left-4 top-4">
                <UploadFile
                  multiple={mode === 'multiple'}
                  accept="image/*"
                  onChange={handleSelectFromDevice}
                  className="h-12 w-12"
                />
              </div>
            </div>
            {/* Image previews inside webcam dialog */}
            {allImages.length > 0 && (
              <div className="mt-4 flex w-full gap-3 overflow-x-auto p-1">
                {allImages.map((image, index) => (
                  <div key={index} className="relative flex-shrink-0">
                    <Avatar
                      className="h-16 w-16 cursor-pointer border-2 hover:border-primary"
                      onClick={() => handleOpenViewer(image)}>
                      <AvatarImage src={getImageUrl(image)} />
                      <AvatarFallback>IMG</AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(image)}
                      className="absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full border bg-red-500 text-white">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Image Viewer Dialog */}
        <Dialog open={openViewer} onOpenChange={setOpenViewer}>
          <DialogContent className="h-[90vh] w-full !max-w-3xl p-2 sm:p-4 overflow-auto">
            <DialogHeader className="absolute left-4 top-4 z-10 w-auto p-0">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => setOpenViewer(false)}>
                <X className="h-6 w-6" />
              </Button>
            </DialogHeader>
            <div className=" flex h-full w-full flex-col gap-4">
              <div className="flex-1 overflow-hidden rounded-lg">
                {activeImageOrUrl && (
                  <img
                    alt="Active preview"
                    className="h-full w-full object-fill aspect-auto"
                    src={getImageUrl(activeImageOrUrl)}
                  />
                )}
              </div>
              <div className="sticky bottom-0 left-0 z-10 flex w-full gap-2 overflow-x-auto p-1">
                {allImages.map((image, index) => (
                  <Card
                    key={index}
                    className="h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden"
                    onClick={() => setActiveImageOrUrl(image)}>
                    <img
                      alt={`Thumbnail ${index}`}
                      className="h-full w-full object-cover"
                      src={getImageUrl(image)}
                    />
                  </Card>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

Camera.displayName = 'Camera';

export default Camera;
