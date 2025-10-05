import "server-only";
import { getLocale } from "next-intl/server";

export async function fetchInternal(
  input: string | URL | globalThis.Request,
  init?: RequestInit
): Promise<Response> {
  const locale = await getLocale();

  const { headers, ...rest } = init || {};

  if (process.env.NODE_ENV === "development") {
    console.debug(
      `running fetch with input: ${input} and body: ${JSON.stringify(
        init?.body
      )}`
    );
  }

  return fetch(input, {
    headers: {
      "x-custom-lang": locale,
      ...headers,
    },
    ...rest,
    cache: "no-store",
  });
}
