export { default } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const userRole = token?.role;

  const pathname = req.nextUrl.pathname;

  // Redirect non-admin users from admin routes
  if (pathname.startsWith("/admin") && userRole !== "admin") {
    const url = req.nextUrl.clone();
    url.pathname = "/user";
    return NextResponse.redirect(url);
  }

  // Redirect non-users from users routes
  if (pathname.startsWith("/user") && userRole !== "user") {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next(); // Proceed normally
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
