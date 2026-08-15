export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined' || typeof navigator === 'undefined' || !navigator.clipboard || !window.isSecureContext) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
