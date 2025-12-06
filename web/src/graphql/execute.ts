import "server-only";

import type { TypedDocumentString } from "./graphql";
import { executeWithHeaders } from "./executeWithHeaders";
import { getLocale } from "next-intl/server";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE_NAME } from "@/app/lib/auth.constants";

export async function execute<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...variables: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  const locale = await getLocale();
  const authToken = (await cookies()).get(AUTHENTICATION_COOKIE_NAME)?.value;

  const headers: HeadersInit = {
    "x-custom-lang": locale,
  };
  if (authToken) {
    headers["Authorization"] = "Bearer " + authToken;
  }

  return executeWithHeaders(headers, query, ...variables);
}
