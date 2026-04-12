"use server";

import "server-only";
import { fetchBackend } from "../fetch-backend";
import { ErrorResponse, newErrorResponse } from "@/lib/error-response";
import { getLocale, getTranslations } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { setAuthCookies } from "./utils";
import { MeFragment, meQueryDocument } from "./queries";
import { redirect } from "@/i18n/navigation";
import { execute } from "@/graphql/execute";
import { getFragmentData } from "@/graphql";
import { SESSION_COOKIE_NAME } from "@/app/lib/auth.constants";
import { revalidatePath } from "next/cache";

export type AuthResponse = {
  sessionId: string;
  expiresAt: string;
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
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  const locale = await getLocale();
  const t = await getTranslations("error");

  const defaultErrorResponse: ErrorResponse = {
    message: t("INTERNAL_SERVER_ERROR"),
    statusCode: 500,
  };

  const sessionId = sessionCookie?.value;
  try {
    if (sessionId) {
      const res = await fetchBackend("/auth/logout-all", {
        method: "POST",
        headers: {
          "x-custom-lang": locale,
          Authorization: `Bearer ${sessionId}`,
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
        return { success: true };
      }
    }
  } catch (e) {
    console.error(e);
    return {
      success: false,
      ...defaultErrorResponse,
    };
  }
  setAuthCookies(cookieStore, null);
  return { success: true };
}

export async function authLogoutAction() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  const locale = await getLocale();

  if (sessionCookie) {
    const sessionId = sessionCookie.value;
    try {
      await fetchBackend("/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionId}`,
          "x-custom-lang": locale,
        },
      });
    } catch (e) {
      console.error(e);
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

    revalidatePath(`/${locale}`);
    return {
      success: true,
    };
  } catch (e) {
    console.error(e);
    revalidatePath(`/${locale}`);
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

    revalidatePath(`/${locale}`);
    return { success: true };
  } catch (e) {
    console.error(e);
    revalidatePath(`/${locale}`);
    return {
      success: false,
      ...defaultErrorResponse,
    };
  }
}

export const getCurrentSessionAction = async () => {
  const authToken = await getAuthToken();
  if (!authToken) {
    return null;
  }

  const res = await execute(meQueryDocument);
  if (res.data) {
    return getFragmentData(MeFragment, res.data.me);
  }

  return null;
};

export async function getAuthToken(): Promise<string | null> {
  const reqHeaders = await headers();
  const accessTokenFromHeader = reqHeaders.get(SESSION_COOKIE_NAME);

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
