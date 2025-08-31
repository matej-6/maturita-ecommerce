import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { MiddlewareConfig, NextRequest } from "next/server";

const protectedRoutes = ["/admin"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (
    protectedRoutes.some(
      (route) =>
        path.startsWith(route) ||
        (path.length > 3 && path.slice(3).startsWith(route)),
    )
  ) {
    console.log("Protected route accessed");
  }

  const handleI18nRouting = createMiddleware(routing);
  const response = handleI18nRouting(req);
  return response;
}

export const config: MiddlewareConfig = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
