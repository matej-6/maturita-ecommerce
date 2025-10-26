import type { TypedDocumentString } from "./graphql";
import { executeWithHeaders } from "./executeWithHeaders";

export async function executeClient<TResult, TVariables>(
  locale: string,
  authToken: string | null,
  query: TypedDocumentString<TResult, TVariables>,
  ...variables: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  const headers: HeadersInit = {
    "x-custom-lang": locale,
  };
  if (authToken !== null) {
    headers["Authorization"] = "Bearer " + authToken;
  }

  return executeWithHeaders(headers, query, ...variables);
}
