export function getImageSrc(mimeType: string, base64: string) {
  return `data:${mimeType};base64,${base64}`;
}
