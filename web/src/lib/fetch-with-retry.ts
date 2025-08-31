export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3,
  baseDelay = 200
): Promise<Response> {
  let finalResponse: Response | null = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(url, options);
    if (response.ok || response.status === 401 || response.status === 403) {
      return response;
    }
    finalResponse = response;
    if (attempt < maxRetries - 1) {
      await new Promise((resolve) =>
        setTimeout(resolve, baseDelay * Math.pow(2, attempt))
      );
    }
  }
  if (!finalResponse) {
    throw new Error("Failed to fetch data after all retries");
  }
  return finalResponse;
}
