/**
 * Navigation utilities for Next.js compatibility
 * This file provides helpers to use Next.js navigation in client components
 */

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export { useRouter, usePathname, useSearchParams } from "next/navigation";

interface NavigateOptions {
  state?: Record<string, unknown>;
}

/**
 * Navigate to a URL with optional state (passed as query params in Next.js)
 */
export function navigateWithState(
  router: AppRouterInstance,
  path: string,
  options: NavigateOptions = {}
) {
  if (options.state) {
    const params = new URLSearchParams();
    Object.entries(options.state).forEach(([key, value]) => {
      if (typeof value === "object") {
        params.set(key, JSON.stringify(value));
      } else {
        params.set(key, String(value));
      }
    });
    router.push(`${path}?${params.toString()}`);
  } else {
    router.push(path);
  }
}
