import type { ExecutionResult } from "graphql";
import type { TypedDocumentString } from "./graphql";

export async function executeWithHeaders<TResult, TVariables>(
  additionalHeaders: HeadersInit,
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL!, {
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
  return executeWithHeaders({}, query, ...variables);
}
