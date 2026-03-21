import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { MiddlewareConfig, NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "./app/lib/auth.constants";

export default async function middleware(req: NextRequest) {
  const handleI18nRouting = createMiddleware(routing);

  if (req.cookies.has(SESSION_COOKIE_NAME)) {
    const newHeaders = new Headers(req.headers);
    const sessionToken = req.cookies.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (sessionToken) {
      newHeaders.set(SESSION_COOKIE_NAME, sessionToken);
    }
    const newRequest = new NextRequest(req.url, { headers: newHeaders });
    return handleI18nRouting(newRequest);
  }

  return handleI18nRouting(req);
}

export const config: MiddlewareConfig = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
