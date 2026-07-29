import { NextResponse } from "next/server";

export function proxy() {
  // Let Next.js client-side AppLayout handle authentication state and session checks
  return NextResponse.next();
}

export function middleware(request) {
  return proxy(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js).*)"],
};
