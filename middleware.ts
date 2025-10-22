import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This middleware runs before each request
export function middleware(request: NextRequest) {
  // You can add authentication checks here
  // For now, we'll just allow all requests

  // Example: Redirect root to login
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
