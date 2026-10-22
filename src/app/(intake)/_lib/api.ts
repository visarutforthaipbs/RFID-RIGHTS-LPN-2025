import type { IntakeLang, Stage } from "./strings";

/** Base URL of the intake API (M2). Dev default = the mock on :3100. */
export const INTAKE_URL = (
  process.env.NEXT_PUBLIC_INTAKE_URL || "http://localhost:3100"
).replace(/\/$/, "");

/** PRD §1.2: detect a dead office tunnel within 10 s and show the fallback. */
export const TIMEOUT_MS = 10_000;

export type UploadResult =
  | { ok: true; trackingCode: string }
  | { ok: false; kind: "rate_limited" }
  | { ok: false; kind: "rejected"; error?: string }
  | { ok: false; kind: "unavailable" }; // timeout / network / 5xx → hotline panel

export type UploadHandle = { abort: () => void };

/**
 * POST /api/intake/voice as multipart with XHR so we get upload progress.
 * The 10 s timeout is a *stall* timeout: it fires if no upload progress and
 * no response has arrived for 10 s — a healthy but slow link keeps resetting
 * it, a dead tunnel trips it within 10 s as PRD §1.2 requires.
 */
export function uploadVoice(
  args: {
    blob: Blob;
    mimeType: string;
    languageHint: IntakeLang;
    consentVersion: string;
    turnstileToken: string;
  },
  onProgress: (fraction: number) => void,
  onDone: (r: UploadResult) => void,
): UploadHandle {
  const xhr = new XMLHttpRequest();
  let stall: ReturnType<typeof setTimeout> | undefined;
  let finished = false;

  const finish = (r: UploadResult) => {
    if (finished) return;
    finished = true;
    if (stall) clearTimeout(stall);
    onDone(r);
  };
  const armStall = () => {
    if (stall) clearTimeout(stall);
    stall = setTimeout(() => {
      xhr.abort();
      finish({ ok: false, kind: "unavailable" });
    }, TIMEOUT_MS);
  };

  const ext = args.mimeType.includes("mp4") ? "m4a" : "webm";
  const fd = new FormData();
  fd.append("audio", args.blob, `voice.${ext}`);
  fd.append("language_hint", args.languageHint);
  fd.append("consent_version", args.consentVersion);
  fd.append("cf-turnstile-response", args.turnstileToken);
  // Some API drafts name the field `turnstile`; send both, the server ignores extras.
  fd.append("turnstile", args.turnstileToken);

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) onProgress(Math.min(1, e.loaded / e.total));
    armStall();
  };
  xhr.onerror = () => finish({ ok: false, kind: "unavailable" });
  xhr.onabort = () => finish({ ok: false, kind: "unavailable" });
  xhr.onload = () => {
    let body: { tracking_code?: string; error?: string } = {};
    try {
      body = JSON.parse(xhr.responseText || "{}");
    } catch {
      /* non-JSON body */
    }
    if (xhr.status === 201 && body.tracking_code) {
      onProgress(1);
      finish({ ok: true, trackingCode: body.tracking_code });
    } else if (xhr.status === 429) {
      finish({ ok: false, kind: "rate_limited" });
    } else if (xhr.status === 400 || xhr.status === 403 || xhr.status === 413) {
      finish({ ok: false, kind: "rejected", error: body.error });
    } else {
      finish({ ok: false, kind: "unavailable" });
    }
  };

  xhr.open("POST", `${INTAKE_URL}/api/intake/voice`);
  armStall();
  xhr.send(fd);

  return {
    abort: () => {
      finished = true;
      if (stall) clearTimeout(stall);
      xhr.abort();
    },
  };
}

export type TrackResult =
  | { ok: true; stage: Stage; label?: string; updatedAt?: string }
  | { ok: false; kind: "not_found" | "rate_limited" | "unavailable" };

/** GET /api/track?code=&lang= with a 10 s timeout. Returns only the public stage. */
export async function trackCode(code: string, lang: IntakeLang): Promise<TrackResult> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const url = `${INTAKE_URL}/api/track?code=${encodeURIComponent(code)}&lang=${lang}`;
    const res = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
    if (res.status === 404) return { ok: false, kind: "not_found" };
    if (res.status === 429) return { ok: false, kind: "rate_limited" };
    if (!res.ok) return { ok: false, kind: "unavailable" };
    const body = (await res.json()) as { stage?: Stage; label?: string; updated_at?: string };
    const stages: Stage[] = ["received", "reviewing", "in_progress", "closed"];
    if (!body.stage || !stages.includes(body.stage)) return { ok: false, kind: "unavailable" };
    return { ok: true, stage: body.stage, label: body.label, updatedAt: body.updated_at };
  } catch {
    return { ok: false, kind: "unavailable" };
  } finally {
    clearTimeout(timer);
  }
}
