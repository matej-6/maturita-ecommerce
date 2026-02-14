"use server";

import "server-only";
import {
  AUTH_TOKEN_HEADER_NAME,
  AUTHENTICATION_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
} from "@/app/lib/auth.constants";
import { fetchBackend } from "../fetch-backend";
import { ErrorResponse, newErrorResponse } from "@/lib/error-response";
import { getLocale, getTranslations } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { setAuthCookies } from "./utils";
import { cache } from "react";
import { getCurrentSession, MeFragment, meQueryDocument } from "./queries";
import { redirect } from "@/i18n/navigation";
import { execute } from "@/graphql/execute";
import { getFragmentData } from "@/graphql";

export type AuthResponse = {
  accessToken: string;
  accessTokenExpirationSeconds: number;
  refreshToken: string;
  refreshTokenExpirationSeconds: number;
};

export type LogoutAllActionResult =
  | {
      success: true;
    }
  | ({
      success: false;
    } & ErrorResponse);

export async function authLogoutAllAction(): Promise<LogoutAllActionResult> {
  const cookieStore = await cookies();
  const refreshTokenCookie = cookieStore.get(REFRESH_COOKIE_NAME);
  const locale = await getLocale();
  const t = await getTranslations("error");

  const defaultErrorResponse: ErrorResponse = {
    message: t("INTERNAL_SERVER_ERROR"),
    statusCode: 500,
  };

  if (refreshTokenCookie) {
    const refreshToken = refreshTokenCookie.value;
    try {
      if (refreshToken) {
        const res = await fetchBackend("/auth/logout-all", {
          method: "POST",
          headers: {
            "x-refresh-token": refreshToken,
            "x-custom-lang": locale,
          },
        });
        if (!res.ok) {
          const e = await res.json();
          return {
            success: false,
            ...(newErrorResponse(e) || defaultErrorResponse),
          };
        } else {
          setAuthCookies(cookieStore, null);
          return redirect({ href: "/auth/login", locale: locale });
        }
      }
    } catch (e) {
      console.error(e);
      return {
        success: false,
        ...defaultErrorResponse,
      };
    }
  }
  setAuthCookies(cookieStore, null);
  return redirect({ href: "/auth/login", locale: locale });
}

export async function authLogoutAction() {
  const cookieStore = await cookies();
  const refreshTokenCookie = cookieStore.get(REFRESH_COOKIE_NAME);

  const locale = await getLocale();

  if (refreshTokenCookie) {
    const refreshToken = refreshTokenCookie.value;
    if (refreshToken) {
      try {
        await fetchBackend("/auth/logout", {
          method: "POST",
          headers: {
            "x-refresh-token": refreshToken,
            "x-custom-lang": locale,
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
  formData: unknown,
): Promise<LoginActionResult> {
  const cookieStore = await cookies();
  const t = await getTranslations("error");

  const defaultErrorResponse: ErrorResponse = {
    message: t("INTERNAL_SERVER_ERROR"),
    statusCode: 500,
  };

  const locale = await getLocale();

  try {
    const res = await fetchBackend(`/auth/login`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "x-custom-lang": locale,
      },
    });
    if (!res.ok) {
      const e = await res.json();
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
  data: unknown,
): Promise<RegisterActionResult> {
  const cookieStore = await cookies();
  const t = await getTranslations("error");
  const locale = await getLocale();

  const defaultErrorResponse: ErrorResponse = {
    message: t("INTERNAL_SERVER_ERROR"),
    statusCode: 500,
  };

  try {
    const res = await fetchBackend(`/auth/register`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "x-custom-lang": locale,
      },
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

type RefreshAccessTokenActionResult =
  | {
      success: false;
    }
  | {
      success: true;
      accessToken: string;
    };

export async function refreshAccessTokenAction(): Promise<RefreshAccessTokenActionResult> {
  const cookieStore = await cookies();
  const refreshTokenCookie = cookieStore.get(REFRESH_COOKIE_NAME);
  if (!refreshTokenCookie) {
    return { success: false };
  }
  const refreshToken = refreshTokenCookie.value;
  const locale = await getLocale();

  const res = await fetchBackend(`/auth/access-token`, {
    method: "POST",
    headers: {
      "x-refresh-token": refreshToken,
      "x-custom-lang": locale,
    },
  });
  if (res.ok) {
    const data: AuthResponse = await res.json();
    setAuthCookies(cookieStore, data);
    return {
      success: true,
      accessToken: data.accessToken,
    };
  }
  setAuthCookies(cookieStore, null);
  return {
    success: false,
  };
}

export const getCurrentSessionAction = cache(async () => {
  const authToken = await getAuthToken();
  if (!authToken) {
    return null;
  }

  const res = await execute(meQueryDocument);
  if (res.data) {
    return getFragmentData(MeFragment, res.data.me);
  }

  return null;
});

export async function getAuthToken(): Promise<string | null> {
  const reqHeaders = await headers();
  const accessTokenFromHeader = reqHeaders.get(AUTH_TOKEN_HEADER_NAME);

  return accessTokenFromHeader || null;
}

export async function getCurrentSessionOrRedirect() {
  const session = await getCurrentSessionAction();
  if (!session) {
    const locale = await getLocale();
    return redirect({ href: "/auth/login", locale });
  }
  return session;
}
