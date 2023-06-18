import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/((?!_next/static|favicon.ico).*)"]
};

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("ba_session");

  if (
    cookie &&
    (request.nextUrl.pathname === "/" ||
      request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/signup")
  ) {
    return NextResponse.redirect(
      new URL(
        "/projects",
        process.env.NODE_ENV === "development"
          ? process.env.DEV_URL
          : process.env.PROD_URL
      )
    );
  }

  if (
    !cookie &&
    !(
      request.nextUrl.pathname === "/" ||
      request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/signup"
    )
  ) {
    return NextResponse.redirect(
      new URL(
        "/",
        process.env.NODE_ENV === "development"
          ? process.env.DEV_URL
          : process.env.PROD_URL
      )
    );
  }
}
