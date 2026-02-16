export function getImageSrc(url?: string) {
  if (!url) return undefined;
  return process.env.NEXT_PUBLIC_BACKEND_URL + url;
}
