export async function refreshToken(): Promise<boolean> {
  let retryCount = 0;
  while (retryCount < 3) {
    const res = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + "auth/refresh-token",
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (res.ok) {
      return true;
    }

    if (res.status === 401) {
      return false;
    }

    retryCount++;
  }

  throw new Error("Failed to refresh token");
}
