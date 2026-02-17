import "server-only";

export async function fetchBackend(
  endpoint: string,
  init?: RequestInit,
): Promise<Response> {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) throw new Error("No backend url found.");
  const { headers, ...rest } = init || {};
  return fetch(`${backendUrl}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    cache: "no-store",
    ...rest,
  });
}
