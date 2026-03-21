import {
  ReadonlyRequestCookies,
  ResponseCookies,
} from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { AuthResponse } from "./actions";
import { SESSION_COOKIE_NAME } from "@/app/lib/auth.constants";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

export function setAuthCookies(
  cookieStore: ReadonlyRequestCookies | ResponseCookies | RequestCookies,
  data: AuthResponse | null,
) {
  cookieStore.set(SESSION_COOKIE_NAME, data?.sessionId ?? "", {
    httpOnly: true,
    secure: false, //process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(data?.expiresAt ?? 0),
  });
}
