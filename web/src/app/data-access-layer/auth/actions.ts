"use server";

import "server-only";
import { REFRESH_COOKIE_NAME } from "@/app/lib/auth.constants";
import { fetchBackend } from "../fetch-backend";
import { ErrorResponse, newErrorResponse } from "@/lib/error-response";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { setAuthCookies } from "./utils";
import { cache } from "react";
import { getCurrentSession } from "./queries";

export type AuthResponse = {
  accessToken: string;
  accessTokenExpirationSeconds: number;
  refreshToken: string;
  refreshTokenExpirationSeconds: number;
};

export async function authLogout() {
  const cookieStore = await cookies();
  const refreshTokenCookie = cookieStore.get(REFRESH_COOKIE_NAME);
  if (refreshTokenCookie) {
    const refreshToken = refreshTokenCookie.value;
    if (refreshToken) {
      try {
        await fetchBackend("/auth/logout", {
          method: "POST",
          headers: {
            "x-refresh-token": refreshToken,
          },
        });
      } catch (e) {
        console.error(e);
      }
    }
  }
  setAuthCookies(cookieStore, null);
}

export type LoginActionResult =
  | {
      success: true;
    }
  | ({
      success: false;
    } & ErrorResponse);

export async function authLoginAction(
  formData: unknown
): Promise<LoginActionResult> {
  const cookieStore = await cookies();
  const t = await getTranslations("error");

  const defaultErrorResponse: ErrorResponse = {
    message: t("INTERNAL_SERVER_ERROR"),
    status: 500,
  };

  try {
    const res = await fetchBackend(`/auth/login`, {
      method: "POST",
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const e = await res.json();
      console.log(newErrorResponse(e));
      return {
        success: false,
        ...(newErrorResponse(e) || defaultErrorResponse),
      };
    }

    const authData: AuthResponse = await res.json();
    setAuthCookies(cookieStore, authData);

    return {
      success: true,
    };
  } catch (e) {
    console.error(e);

    return {
      success: false,
      ...defaultErrorResponse,
    };
  }
}

export type RegisterActionResult =
  | {
      success: true;
    }
  | ({
      success: false;
    } & ErrorResponse);

export async function authRegisterAction(
  data: unknown
): Promise<RegisterActionResult> {
  const cookieStore = await cookies();
  const t = await getTranslations("error");

  const defaultErrorResponse: ErrorResponse = {
    message: t("INTERNAL_SERVER_ERROR"),
    status: 500,
  };

  try {
    const res = await fetchBackend(`/auth/register`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json();
      return {
        success: false,
        ...(newErrorResponse(body) || defaultErrorResponse),
      };
    }
    const authData: AuthResponse = await res.json();
    setAuthCookies(cookieStore, authData);

    return { success: true };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      ...defaultErrorResponse,
    };
  }
}

export async function authRefreshToken() {
  const cookieStore = await cookies();
  const refreshTokenCookie = cookieStore.get(REFRESH_COOKIE_NAME);
  if (!refreshTokenCookie) {
    return false;
  }

  const refreshToken = refreshTokenCookie.value;

  let tries = 0;

  while (tries < 3) {
    const res = await fetchBackend(`/auth/refresh-token`, {
      method: "POST",
      headers: {
        "x-refresh-token": refreshToken,
      },
    });
    if (res.status === 401) break;

    if (res.ok) {
      const data: AuthResponse = await res.json();
      setAuthCookies(cookieStore, data);
      return true;
    }
    tries++;
  }

  setAuthCookies(cookieStore, null);
  return false;
}

export const getCurrentSessionAction = cache(async () => {
  return await getCurrentSession();
});
