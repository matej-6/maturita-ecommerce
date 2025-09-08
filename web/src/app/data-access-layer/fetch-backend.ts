import "server-only";
import { fetchInternal } from "./fetch-internal";

export async function fetchBackend(
  endpoint: string,
  init?: RequestInit,
): Promise<Response> {
  const backendUrl = process.env.BACKEND_API;
  if (!backendUrl) throw new Error("No backend url found.");
  const { headers, ...rest } = init || {};
  return fetchInternal(`${backendUrl}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...rest,
  });
}
