import { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { v4 as uuid } from 'uuid';

export interface CaptureImageIFace {
  images: (File | Blob)[];
  webcamRef: React.RefObject<Webcam | null>;
  getCameraMode: () => CaptureMode;
  selectImageFromDevice: (event: React.ChangeEvent<HTMLInputElement>) => void;
  captureImageFromWebcam: () => void;
  removeCaputuredImage: (image: File | Blob) => void;
  removeAllCapturedImages: () => void;
  reset: (images?: (File | Blob)[]) => void;
}

type CaptureMode = 'single' | 'multiple';

interface ImageCaptureOptions {
  mode: CaptureMode;
}

/**
 * useImageCapture is a hook that provides the following methods:
 * - captureImageFromWebcam: captures an image from the webcam and adds it to the images array
 * - selectImageFromDevice: selects an image from the device and adds it to the images array
 * - removeCaputuredImage: removes an image from the images array by its index
 * - removeAllCapturedImages: removes all images from the images array
 * - getCameraMode: returns the current camera mode (single or multiple)
 *
 * The hook takes an options object with the following properties:
 * - mode: the camera mode (single or multiple)
 * - defaultImages: an optional array of default images to be added to the images array
 *
 * The hook returns an object with the methods above, as well as the current images array, and a ref to the webcam component.
 *
 * The hook is useful when you need to capture an image from the webcam, or select an image from the device, and display it in a list.
 * The hook takes care of adding the captured image to the list, and also provides methods to remove images from the list.
 * The hook also provides a method to get the current camera mode, and to set the camera mode to single or multiple.
 */
export const useImageCapture = (options: ImageCaptureOptions): CaptureImageIFace => {
  const [images, setImages] = useState<(File | Blob)[]>([]);

  const webcamRef = useRef<Webcam | null>(null);
  // Handle file selection from device (binary format)
  const selectImageFromDevice = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target?.files;
      if (files) {
        const fileArray = Array.from(files);
        if (options.mode === 'single') {
          setImages(fileArray.slice(0, 1));
        } else {
          setImages((prev) => (Array.isArray(prev) ? [...prev, ...fileArray] : fileArray));
        }
      }
    },
    [options.mode]
  );

  const captureImageFromWebcam = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          // Create a new File object
          const file = new File([blob], uuid() + '.png', {
            type: blob.type
          });
          console.log(file.name);
          if (options.mode === 'single') {
            setImages([file]);
          } else {
            setImages((prev) => [...prev, file]);
          }
        })
        .catch((error) => console.error('Error converting image to file:', error));
    }
  }, [options.mode, webcamRef]);

  const removeCaputuredImage = useCallback(
    (image: File | Blob) => {
      if (options.mode === 'single') {
        setImages([]);
      } else {
        const newImages = [...images.filter((imageFile) => imageFile != image)];
        setImages(newImages);
      }
    },
    [options.mode, images]
  );
  const getCameraMode = useCallback(() => options.mode, [options.mode]);

  const removeAllCapturedImages = useCallback(() => {
    setImages([]);
  }, []);

  const reset = useCallback((images: (File | Blob)[] = []) => {
    setImages(images);
  }, []);

  useEffect(() => {
    setImages([]);
  }, [options.mode]);

  return {
    images,
    webcamRef,
    getCameraMode,
    removeAllCapturedImages,
    removeCaputuredImage,
    selectImageFromDevice,
    captureImageFromWebcam,
    reset
  };
};
