export async function fetchInternal(
  input: string | URL | globalThis.Request,
  init?: RequestInit
): Promise<Response> {
  if (process.env.NODE_ENV === "development") {
    console.debug(
      `running fetch with input: ${input} and body: ${JSON.stringify(
        init?.body
      )}`
    );
  }

  return fetch(input, {
    ...init,
    cache: "no-store",
  });
}
