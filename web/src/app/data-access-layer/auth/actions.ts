"use server";
import { cookies } from "next/headers";
import {
  AUTHENTICATION_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
} from "@/app/lib/auth.constants";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { fetchBackend } from "../fetch-backend";
import { ErrorResponse, newErrorResponse } from "@/lib/error-response";
import { getTranslations } from "next-intl/server";
import { StatusCodes } from "http-status-codes";

type AuthResponse = {
  accessToken: string;
  accessTokenExpirationSeconds: number;
  refreshToken: string;
  refreshTokenExpirationSeconds: number;
};

/**
 * Sets authentication cookies
 * @param data - if data is null, cookies are deleted
 */
async function setAuthCookies(
  cookieStore: ReadonlyRequestCookies,
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

export async function authRefreshToken() {
  const cookieStore = await cookies();
  const refreshTokenCookie = cookieStore.get(REFRESH_COOKIE_NAME);
  if (!refreshTokenCookie) {
    await setAuthCookies(cookieStore, null);
    throw new Error("Unauthenticated: please sign in.");
  }

  const refreshToken = refreshTokenCookie.value;

  const res = await fetchBackend(`/auth/refresh-token`, {
    method: "POST",
    headers: {
      "x-refresh-token": refreshToken,
    },
  });

  if (!res.ok) {
    throw new Error("Authentication failed. Please try again.");
  }

  const data: AuthResponse = await res.json();
  await setAuthCookies(cookieStore, data);
}

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
  const res = await fetchBackend(`/auth/login`, {
    method: "POST",
    body: JSON.stringify(formData),
  });

  const t = await getTranslations("error");

  if (!res.ok) {
    let jsonError = {};
    try {
      jsonError = await res.json();
      console.log("jsonError", jsonError);
    } catch (e) {
      console.error(e);
    }
    const errorResponse = newErrorResponse(jsonError) ?? {
      message: t("INTERNAL_SERVER_ERROR"),
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    };
    return {
      success: false,
      ...errorResponse,
    };
  }

  const cookieStore = await cookies();

  const authData: AuthResponse = await res.json();
  setAuthCookies(cookieStore, authData);

  return {
    success: true,
  };
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
  const t = await getTranslations("error");
  try {
  } catch (e) {}
  const res = await fetchBackend(`/auth/register`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    let body: unknown | undefined;
    try {
      body = await res.json();
    } catch (e) {
      console.error(e);
    }
    return {
      success: false,
      ...newErrorResponse(
        body,
        t("INTERNAL_SERVER_ERROR"),
        StatusCodes.INTERNAL_SERVER_ERROR
      ),
    };
  }

  const cookieStore = await cookies();

  try {
    const authData: AuthResponse = await res.json();
    setAuthCookies(cookieStore, authData);

    return { success: true };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: t("INTERNAL_SERVER_ERROR"),
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
}
