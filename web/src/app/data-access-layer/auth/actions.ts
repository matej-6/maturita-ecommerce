"use server";

import "server-only";
import {
  AUTHENTICATION_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
} from "@/app/lib/auth.constants";
import { fetchBackend } from "../fetch-backend";
import { ErrorResponse, newErrorResponse } from "@/lib/error-response";
import { getLocale, getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { setAuthCookies } from "./utils";
import { cache } from "react";
import { getCurrentSession } from "./queries";
import { redirect } from "@/i18n/navigation";

export type AuthResponse = {
  accessToken: string;
  accessTokenExpirationSeconds: number;
  refreshToken: string;
  refreshTokenExpirationSeconds: number;
};

export async function authLogoutAction() {
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
  const locale = await getLocale();
  setAuthCookies(cookieStore, null);
  return redirect({ href: "/auth/login", locale: locale });
}

export type LoginActionResult =
  | {
      success: true;
      authToken: string;
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
    statusCode: 500,
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
      authToken: authData.accessToken,
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
      authToken: string;
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
    statusCode: 500,
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

    return { success: true, authToken: authData.accessToken };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      ...defaultErrorResponse,
    };
  }
}

type RefreshTokenActionResult =
  | {
      success: true;
      authToken: string;
    }
  | {
      success: false;
    };

export async function authRefreshToken(): Promise<RefreshTokenActionResult> {
  const locale = await getLocale();
  const cookieStore = await cookies();
  const refreshTokenCookie = cookieStore.get(REFRESH_COOKIE_NAME);
  if (!refreshTokenCookie) {
    return { success: false };
  }

  const refreshToken = refreshTokenCookie.value;

  const res = await fetchBackend(`/auth/refresh-token`, {
    method: "POST",
    headers: {
      "x-refresh-token": refreshToken,
    },
  });
  if (res.ok) {
    const data: AuthResponse = await res.json();
    setAuthCookies(cookieStore, data);
    return {
      success: true,
      authToken: data.accessToken,
    };
  }
  setAuthCookies(cookieStore, null);
  return redirect({
    href: "/auth/fail",
    locale: locale,
  });
}

export const getCurrentSessionAction = cache(async () => {
  return await getCurrentSession();
});

export async function ensureAuthOrRedirectAction(): Promise<void> {
  const locale = await getLocale();
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTHENTICATION_COOKIE_NAME);

  if (!authCookie?.value) {
    const res = await authRefreshToken();
    if (!res.success) {
      return redirect({
        href: "/auth/fail",
        locale: locale,
      });
    }
  }
}