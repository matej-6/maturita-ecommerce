"use server";

import { headers } from "next/headers";

export async function internalFetch(url: string, options: RequestInit) {
  const incomingHeaders = await headers();
  const incomingHeadersObj: Record<string, string> = {};
  for (const [key, value] of incomingHeaders.entries()) {
    incomingHeadersObj[key] = value;
  }

  return fetch(url, {
    ...options,
    headers: {
      ...incomingHeadersObj,
      ...options.headers,
    },
  });
}
