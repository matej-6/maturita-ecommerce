import "server-only";
import type { ExecutionResult } from "graphql";
import type { TypedDocumentString } from "./graphql";
import { fetchInternal } from "@/app/data-access-layer/fetch-internal";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE_NAME } from "@/app/lib/auth.constants";

export async function executeWithHeaders<TResult, TVariables>(
  additionalHeaders: HeadersInit,
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  const response = await fetchInternal(process.env.GRAPHQL_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/graphql-response+json",
      ...additionalHeaders,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    credentials: "include",
  });

  return response.json() as ExecutionResult<TResult>;
}

export async function execute<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...variables: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  const headers: {
    Authorization?: string;
  } = {};
  const cookieStore = await cookies();
  if (cookieStore.has(AUTHENTICATION_COOKIE_NAME)) {
    headers["Authorization"] =
      "Bearer " + cookieStore.get(AUTHENTICATION_COOKIE_NAME)?.value;
  }

  return executeWithHeaders(headers, query, ...variables);
}
