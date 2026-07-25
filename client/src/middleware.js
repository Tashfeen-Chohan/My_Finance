import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isAuthenticated = Boolean(accessToken || refreshToken);

  const isAuthRoute = pathname.startsWith("/login");
  const isPublicStatic =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/public") ||
    pathname.includes(".") ||
    pathname === "/sw.js" ||
    pathname === "/manifest.json";

  if (isPublicStatic) {
    return NextResponse.next();
  }

  // Redirect unauthenticated user to /login
  if (!isAuthenticated && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated user away from /login to home
  if (isAuthenticated && isAuthRoute) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js).*)"],
};
