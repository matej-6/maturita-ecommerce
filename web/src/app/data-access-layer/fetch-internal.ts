import "server-only";

export async function fetchInternal(
  input: string | URL | globalThis.Request,
  init?: RequestInit,
): Promise<Response> {
  return fetch(process.env.BACKEND_URL! + input, {
    cache: "no-store",
    ...init,
  });
}
