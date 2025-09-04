import "server-only";

import { cookies } from "next/headers";
import {
  AUTHENTICATION_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
} from "@/app/lib/auth.constants";
import z from "zod";
import { loginSchema } from "@/app/[locale]/(app)/auth/login/login-schema";
import { JsonErrorResponse } from "@/lib/json-error-response";
import { registerSchema } from "@/app/[locale]/(app)/auth/register/register-schema";

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
async function setAuthCookies(data: AuthResponse | null) {
  const cookieStore = await cookies();
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
  "use server";
  const cookieStore = await cookies();
  const refreshTokenCookie = cookieStore.get(REFRESH_COOKIE_NAME);
  if (!refreshTokenCookie) {
    await setAuthCookies(null);
    throw new Error("Unauthenticated: please sign in.");
  }

  const refreshToken = refreshTokenCookie.value;

  const res = await fetch(`${process.env.BACKEND_API}/auth/refresh-token`, {
    headers: {
      "x-refresh-token": refreshToken,
    },
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Authentication failed. Please try again.");
  }

  const data: AuthResponse = await res.json();
  await setAuthCookies(data);
}

export async function authLogout() {
  "use server";
  const cookieStore = await cookies();
  const refreshTokenCookie = cookieStore.get(REFRESH_COOKIE_NAME);
  if (refreshTokenCookie) {
    const refreshToken = refreshTokenCookie.value;
    if (refreshToken) {
      try {
        await fetch(process.env.BACKEND_API + "/auth/logout", {
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
  cookieStore.set(REFRESH_COOKIE_NAME, "", {
    httpOnly: true,
    expires: 0,
  });
  cookieStore.set(AUTHENTICATION_COOKIE_NAME, "", {
    httpOnly: true,
    expires: 0,
  });
}

export async function authLogin(formData: FormData) {
  "use server";

  const parsedData = loginSchema.parse(Object.fromEntries(formData.entries()));
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify(parsedData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return JsonErrorResponse.fromError(await res.json());
  }

  const authData: AuthResponse = await res.json();
  const cookieStore = await cookies();
  cookieStore.set(REFRESH_COOKIE_NAME, authData.refreshToken, {
    expires: authData.refreshTokenExpirationDate,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  cookieStore.set(AUTHENTICATION_COOKIE_NAME, authData.accessToken, {
    expires: authData.accessTokenExpirationDate,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return "Login Successful";
}

export async function authRegister(formData: FormData) {
  "use server";

  const parsedData = registerSchema.parse(
    Object.fromEntries(formData.entries()),
  );

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
    {
      method: "POST",
      body: JSON.stringify(parsedData),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );
  if (!res.ok) {
    return JsonErrorResponse.fromError(await res.json());
  }

  return "";
}
