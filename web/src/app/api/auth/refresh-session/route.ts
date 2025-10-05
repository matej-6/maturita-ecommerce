import { AuthResponse } from "@/app/data-access-layer/auth/actions";
import { setAuthCookies } from "@/app/data-access-layer/auth/utils";
import { fetchBackend } from "@/app/data-access-layer/fetch-backend";
import { REFRESH_COOKIE_NAME } from "@/app/lib/auth.constants";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const refreshTokenCookie = req.cookies.get(REFRESH_COOKIE_NAME);
  if (!refreshTokenCookie) {
    const response = NextResponse.json("success", { status: 401 });
    setAuthCookies(response.cookies, null);
    return response;
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
    console.log(res);
    if (res.status === 401) break;

    if (res.ok) {
      const data: AuthResponse = await res.json();
      const response = NextResponse.json("success", { status: 200 });
      setAuthCookies(response.cookies, data);
      return response;
    }
    tries++;
  }

  const res = NextResponse.json("unauthorized", { status: 401 });
  setAuthCookies(res.cookies, null);
  return res;
}
