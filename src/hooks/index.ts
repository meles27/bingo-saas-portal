import { useEffect, useRef, useState } from 'react';

export const useUrlsToBlobs = (baseUrl: string, urls: string[]) => {
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const [isChanged, setIsChanged] = useState(false);
  useEffect(() => {
    console.log(
      'the current default images inside the useEffect',
      baseUrl,
      urls
    );

    const fetchBlobs = async () => {
      try {
        // Filter out empty strings
        const validUrls = urls.filter((url) => url && url.trim() != '');
        // If no valid URLs, reset blobs and return
        if (validUrls.length === 0) {
          setBlobs([]);
          return;
        }

        // Fetch all valid URLs in parallel
        const blobPromises = validUrls.map(async (url) => {
          const fullUrl = baseUrl.replace('${path}', url);
          const response = await fetch(fullUrl);
          if (!response.ok) throw new Error(`Failed to fetch ${fullUrl}`);
          return await response.blob();
        });

        const fetchedBlobs = await Promise.all(blobPromises);
        setBlobs(fetchedBlobs);
        setIsChanged((state) => !state);
      } catch (error) {
        console.error('Error fetching blobs:', error);
      }
    };

    fetchBlobs();
  }, [baseUrl, urls]);

  return { blobs, isChanged };
};

type EventMap = HTMLElementEventMap & DocumentEventMap & WindowEventMap;

export function useEventListener<
  K extends keyof EventMap,
  T extends HTMLElement | Document | Window = Window
>(
  eventName: K,
  handler: (event: EventMap[K]) => void,
  element?: React.RefObject<T> | T | null,
  options?: boolean | AddEventListenerOptions
) {
  const savedHandler = useRef<(event: EventMap[K]) => void>(() => null);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // If no element is passed, use window as default
    const target: T | Window | null =
      element instanceof EventTarget
        ? element
        : element && 'current' in element
        ? element.current
        : window;

    if (!target?.addEventListener) return;

    const eventListener = (event: Event) => {
      savedHandler.current?.(event as EventMap[K]);
    };

    // Type assertion to safely cast the target to the correct type (HTMLElement, Document, or Window)
    target.addEventListener(eventName, eventListener, options);

    return () => {
      target.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options]);
}
