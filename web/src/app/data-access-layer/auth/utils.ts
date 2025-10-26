import {
  ReadonlyRequestCookies,
  ResponseCookies,
} from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { authRefreshToken, AuthResponse } from "./actions";
import {
  AUTHENTICATION_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
} from "@/app/lib/auth.constants";
import { fetchBackend } from "../fetch-backend";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

/**
 * Sets authentication cookies
 * @param data - if data is null, cookies are deleted
 */
export function setAuthCookies(
  cookieStore: ReadonlyRequestCookies | ResponseCookies | RequestCookies,
  data: AuthResponse | null
) {
  cookieStore.set(REFRESH_COOKIE_NAME, data?.refreshToken ?? "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: data?.refreshTokenExpirationSeconds ?? 0,
  });
  cookieStore.set(AUTHENTICATION_COOKIE_NAME, data?.accessToken ?? "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: data?.accessTokenExpirationSeconds ?? 0,
  });
}

export async function getAuthKey(): Promise<string | null> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTHENTICATION_COOKIE_NAME);

  if (!authCookie?.value) {
    const res = await authRefreshToken();
    return res.success ? res.authToken : null;
  }
  return authCookie.value;
}
