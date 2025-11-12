import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes that require authentication
const protectedRoutes = [
  "/dealer-dashboard",
  "/dealer-portal",
  "/consumer-portal",
  "/conversation-interface",
  "/document-management",
  "/user-management",
];

// Public routes that don't require authentication
const publicRoutes = ["/login", "/"];

// This middleware runs before each request
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect root to login
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // For protected routes, we rely on client-side auth checks
  // The AuthProvider and useAuth hook will handle redirects to /login
  // if the user is not authenticated

  // If user is on login page and already authenticated,
  // this will be handled by the login page component itself

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
