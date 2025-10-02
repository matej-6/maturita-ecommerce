import { getLocale } from "next-intl/server";

export async function fetchInternal(
  input: string | URL | globalThis.Request,
  init?: RequestInit
): Promise<Response> {
  const locale = await getLocale();

  const { headers, ...rest } = init || {};

  return fetch(input, {
    headers: {
      "x-custom-lang": locale,
      ...headers,
    },
    ...rest,
  });
}
