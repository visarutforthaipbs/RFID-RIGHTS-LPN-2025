/**
 * Privacy-first RFID UID hashing for anonymous analytics
 * Never stores raw UID - only SHA-256 hash for analytics enrichment
 */
export async function hashUid(uid: string): Promise<string> {
  if (!uid || typeof uid !== "string") {
    return "";
  }

  const data = new TextEncoder().encode(uid);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
