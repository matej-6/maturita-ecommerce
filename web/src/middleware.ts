import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import {
  AUTH_TOKEN_HEADER_NAME,
  AUTHENTICATION_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
} from "./app/lib/auth.constants";
import { AuthResponse } from "./app/data-access-layer/auth/actions";
import { setAuthCookies } from "./app/data-access-layer/auth/utils";
import { fetchBackend } from "./app/data-access-layer/fetch-backend";

export default async function middleware(req: NextRequest) {
  const handleI18nRouting = createMiddleware(routing);

  if (req.cookies.has(AUTHENTICATION_COOKIE_NAME)) {
    const newHeaders = new Headers(req.headers);
    const authToken =
      req.cookies.get(AUTHENTICATION_COOKIE_NAME)?.value ?? null;
    if (authToken) {
      newHeaders.set(AUTH_TOKEN_HEADER_NAME, authToken);
    }
    const newRequest = new NextRequest(req.url, { headers: newHeaders });
    return handleI18nRouting(newRequest);
  } else if (req.cookies.has(REFRESH_COOKIE_NAME)) {
    const newHeaders = new Headers(req.headers);
    const refreshToken = req.cookies.get(REFRESH_COOKIE_NAME)?.value;
    const res = await fetchBackend(`/auth/refresh-token`, {
      method: "POST",
      headers: {
        "x-refresh-token": refreshToken ?? "",
      },
    });

    if (res.ok) {
      const data: AuthResponse = await res.json();
      newHeaders.set(AUTH_TOKEN_HEADER_NAME, data.accessToken);
      const newRequest = new NextRequest(req.url, { headers: newHeaders });
      const response = handleI18nRouting(newRequest);
      setAuthCookies(response.cookies, data);
      return response;
    } else {
      const redirect = NextResponse.redirect(
        new URL(process.env.NEXT_PUBLIC_SITE_URL + "/auth/login"),
      );
      setAuthCookies(redirect.cookies, null);
      return redirect;
    }
  }

  return handleI18nRouting(req);
}

export const config: MiddlewareConfig = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
