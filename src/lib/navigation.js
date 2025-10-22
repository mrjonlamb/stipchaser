/**
 * Navigation utilities for Next.js compatibility
 * This file provides helpers to use Next.js navigation in client components
 */

export { useRouter, usePathname, useSearchParams } from "next/navigation";

/**
 * Navigate to a URL with optional state (passed as query params in Next.js)
 * @param {string} path - The path to navigate to
 * @param {Object} options - Navigation options
 * @param {Object} options.state - State to pass (will be converted to query params)
 */
export function navigateWithState(router, path, options = {}) {
  if (options.state) {
    const params = new URLSearchParams();
    Object.entries(options.state).forEach(([key, value]) => {
      if (typeof value === "object") {
        params.set(key, JSON.stringify(value));
      } else {
        params.set(key, value);
      }
    });
    router.push(`${path}?${params.toString()}`);
  } else {
    router.push(path);
  }
}
