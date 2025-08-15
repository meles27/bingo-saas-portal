import { useMemo } from 'react';
import { parse } from 'tldts';

interface UseSubdomainOptions {
  /** Add any custom TLDs your app uses, e.g. 'localhost', 'test' */
  customTLDs?: string[];
}

/**
 * React hook to get the subdomain from current window.location.hostname,
 * supports custom TLDs for local/dev environments.
 */
export function useSubdomain(options?: UseSubdomainOptions): string | null {
  const { customTLDs = [] } = options || {};

  return useMemo(() => {
    if (typeof window === 'undefined') {
      // SSR or non-browser environment fallback
      return null;
    }

    const hostname = window.location.hostname;

    const parsed = parse(hostname, { validHosts: customTLDs });

    // Return subdomain or null if none
    return parsed.subdomain || null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customTLDs.join(',')]);
}
