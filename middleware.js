import { NextResponse } from "next/server";

const protectedRoutes = ["/home"];

// Middleware to handle protected routes
export function middleware(request) {
  // Extract token from Authorization header
  const authHeader = request.headers.get("Authorization");
  const token = authHeader ? authHeader.split(" ")[1] : null;


  // Check if the request is to a protected route
  if (protectedRoutes.some((route) => request.url.startsWith(route))) {
    // If token is not found, redirect to the login page (or home page)
    if (!token) {
      console.log("No token found, redirecting to the login page");
      return NextResponse.redirect(new URL("/", request.url));
    }

    // If token exists, allow the request to continue
    console.log("Token found, proceeding to protected route");
    return NextResponse.next();
  }

  // Log for non-protected routes
  console.log("Request is to a non-protected route, proceeding");

  return NextResponse.next(); // allow non-protected routes
}

export const config = {
  matcher: ["/home/:path*"], // Apply middleware to these routes
};
