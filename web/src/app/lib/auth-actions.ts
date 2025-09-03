import { cookies } from "next/headers";
import {
  AUTHENTICATION_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
} from "./auth.constants";

type AuthResponse = {
  accessToken: string;
  accessTokenExpirationDate: Date;
  refreshToken: string;
  refreshTokenExpirationDate: Date;
};

export async function authRefreshToken() {
  "use server";
  const cookieStore = await cookies();
  const refreshTokenCookie = cookieStore.get(REFRESH_COOKIE_NAME);
  if (!refreshTokenCookie) {
    cookieStore.set(REFRESH_COOKIE_NAME, "", {
      httpOnly: true,
      expires: 0,
    });
    cookieStore.set(AUTHENTICATION_COOKIE_NAME, "", {
      httpOnly: true,
      expires: 0,
    });
    throw new Error("Unauthenticated: please sign in.");
  }

  const refreshToken = refreshTokenCookie.value;

  const res = await fetch(`${process.env.BACKEND_API}/refresh-token`, {
    headers: {
      "x-refresh-token": refreshToken,
    },
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Authentication failed. Please try again.");
  }

  const data: AuthResponse = await res.json();
  cookieStore.set(REFRESH_COOKIE_NAME, data.refreshToken, {
    expires: data.accessTokenExpirationDate,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  cookieStore.set(AUTHENTICATION_COOKIE_NAME, data.accessToken, {
    expires: data.accessTokenExpirationDate,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

export async function authLogout() {
  "use server";
  const cookieStore = await cookies();
  const refreshTokenCookie = cookieStore.get(REFRESH_COOKIE_NAME);
  if (refreshTokenCookie) {
    const refreshToken = refreshTokenCookie.value;
    if (refreshToken) {
      try {
        await fetch(process.env.BACKEND_API + "/logout", {
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
