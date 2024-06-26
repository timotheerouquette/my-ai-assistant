import { verifyAuthCookie } from "@/app/auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * Returns true if the pathname is public and should not be exposed to
 * authentication requirements.
 */
const isPathnameAllowedForAuthCheck = (pathname: string) => {
  return (
    // Authorize all the api revalidation endpoints
    pathname.startsWith("/api/revalidate") ||
    // Authroize site webmanifest
    pathname.startsWith("/site.webmanifest") ||
    // Autorize the redirect endpoints
    pathname.startsWith("/api/redirect") ||
    // Authorize the auth login pathname
    pathname === "/api/auth/login"
  );
};

const checkUserAuthenticated = async (req: NextRequest): Promise<boolean> => {
  if (isPathnameAllowedForAuthCheck(req.nextUrl.pathname)) {
    return true;
  }

  return verifyAuthCookie(req);
};

export async function middleware(req: NextRequest) {
  try {
    const shouldProtectRoutes = process.env.PROTECTED === "true";
    console.log("shouldProtectRoutes:", shouldProtectRoutes);

    const isUserAuthenticated = await checkUserAuthenticated(req);

    if (shouldProtectRoutes && !isUserAuthenticated) {
      return NextResponse.redirect(`${req.nextUrl.origin}/api/auth/login`);
    }

    return NextResponse.next();
  } catch (error) {
    console.error(error);
  }
}
