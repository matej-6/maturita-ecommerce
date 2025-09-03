import { cookies } from "next/headers";


type AuthResponse

export async function authRefreshToken(): Promise<boolean> {
  "use server";
  const cookieStore = await cookies();
  const refreshTokenCookie = cookieStore.get("Refresh");
  if (!refreshTokenCookie) {
    cookieStore.set("Refresh", "", {
      httpOnly: true,
      expires: 0,
    });
    cookieStore.set("Authentication", "", {
      httpOnly: true,
      expires: 0,
    });
    return false;
  }

  const refreshToken = refreshTokenCookie.value;

  const res = await fetch(`${process.env.BACKEND_API}/refresh-token`, {
    headers: {
      "x-refresh-token": refreshToken,
    },
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    return false;
  }

  const data:

  return true;
}
