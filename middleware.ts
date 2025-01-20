import { NextRequest, NextResponse } from "next/server";
import getAccount from "./lib/queries/account";
import { cookies } from "next/headers";

const USER_ENTRY_POINTS: Record<string, string> = {
  patient: "/dashboard/patient",
  admin: "/dashboard/admin",
};
const PROTECTED_PAGES = ["/dashboard"];
function getUserEntryRole(role: string) {
  return USER_ENTRY_POINTS[role] ?? "/dashboard/patient";
}

export async function middleware(request: NextRequest) {
  const user = await getAccount();
  const pathname = request.nextUrl.pathname;

  const isLoginRoute = pathname === "/login";
  if (!user) {
    (await cookies()).delete("session");
    if (isLoginRoute) {
      return NextResponse.next();
    } else {
      const isProtectedRoute = PROTECTED_PAGES.some((route) => {
        console.log({
          route: route,
          pathname: pathname,
          isEqual: route === pathname,
        });
        const isEqual = pathname.split("/").includes(route.slice(1));

        return isEqual;
      });
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
      } else {
        return NextResponse.next();
      }
    }
  } else {
    if (isLoginRoute || pathname.startsWith("/patient") || pathname === "/") {
      const userRole = user.labels?.[0];
      return NextResponse.redirect(
        new URL(getUserEntryRole(userRole), request.url)
      );
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - All files in /assets/icons (static SVGs or other assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets/icons).*)",
  ],
};
