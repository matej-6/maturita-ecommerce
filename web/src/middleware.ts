import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import {
  AUTHENTICATION_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
} from "./app/lib/auth.constants";
import { AuthResponse } from "./app/data-access-layer/auth/actions";
import { setAuthCookies } from "./app/data-access-layer/auth/utils";
import { fetchBackend } from "./app/data-access-layer/fetch-backend";

// const protectedRoutes = ["/admin"];

export default async function middleware(req: NextRequest) {
  console.log("RUNNING MIDDLEWARE");

  const handleI18nRouting = createMiddleware(routing);
  const response = handleI18nRouting(req);

  // if (req.cookies.has(REFRESH_COOKIE_NAME)) {
  //   const redirect = NextResponse.redirect(
  //     new URL(process.env.NEXT_PUBLIC_SITE_URL + "/auth/failed")
  //   );
  //   setAuthCookies(redirect.cookies, null);
  //   return redirect;
  // }

  if (
    req.cookies.has(REFRESH_COOKIE_NAME) &&
    !req.cookies.has(AUTHENTICATION_COOKIE_NAME)
  ) {
    const refreshToken = req.cookies.get(REFRESH_COOKIE_NAME)?.value;
    const res = await fetchBackend(`/auth/refresh-token`, {
      method: "POST",
      headers: {
        "x-refresh-token": refreshToken ?? "",
      },
    });

    if (res.ok) {
      const data: AuthResponse = await res.json();
      console.log(data);
      //setAuthCookies(req.cookies, data); // lebo mozno volame isAdmin, ktory potom vola getCurrentSession, ktory pozera na request cookies, nie na response cookies
      setAuthCookies(response.cookies, data);
    } else {
      const redirect = NextResponse.redirect(
        new URL(process.env.NEXT_PUBLIC_SITE_URL + "/auth/failed")
      );
      setAuthCookies(redirect.cookies, null);
      return redirect;
    }
  }

  // const path = req.nextUrl.pathname;

  // if (
  //   protectedRoutes.some(
  //     (route) =>
  //       path.startsWith(route) ||
  //       (path.length > 3 && path.slice(3).startsWith(route))
  //   )
  // ) {
  //   if (!(await isAdmin())) {
  //     return NextResponse.rewrite(new URL("/not-found", req.url));
  //   }
  // }

  return response;
}

export const config: MiddlewareConfig = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
