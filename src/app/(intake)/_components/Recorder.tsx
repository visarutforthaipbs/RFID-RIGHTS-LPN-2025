"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Microphone } from "@phosphor-icons/react/dist/ssr/Microphone";
import { Stop } from "@phosphor-icons/react/dist/ssr/Stop";
import { EyeSlash } from "@phosphor-icons/react/dist/ssr/EyeSlash";
import { Translate } from "@phosphor-icons/react/dist/ssr/Translate";
import { UploadSimple } from "@phosphor-icons/react/dist/ssr/UploadSimple";
import { ArrowCounterClockwise } from "@phosphor-icons/react/dist/ssr/ArrowCounterClockwise";
import { Phone } from "@phosphor-icons/react/dist/ssr/Phone";
import { MessengerLogo } from "@phosphor-icons/react/dist/ssr/MessengerLogo";
import { Warning } from "@phosphor-icons/react/dist/ssr/Warning";
import { registerQuickExitCleanup } from "@/app/components/QuickExitButton";
import { uploadVoice, type UploadHandle } from "../_lib/api";
import { mountTurnstile, type TurnstileHandle } from "../_lib/turnstile";
import {
  CONSENT_VERSION,
  HOTLINE_DISPLAY,
  HOTLINE_TEL,
  LANGS,
  MESSENGER_URL,
  t,
  type IntakeLang,
} from "../_lib/strings";

/** PRD §7.1: hard stop at 180 s. */
export const MAX_SECONDS = 180;
const MIN_SECONDS = 1;
const METER_BARS = 12;

type Phase =
  | "idle"
  | "requesting"
  | "recording"
  | "stopped"
  | "uploading"
  | "fallback" // timeout / network / 5xx → hotline + Messenger
  | "rate_limited"
  | "rejected"
  | "denied"
  | "unsupported";

function pickMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/mp4;codecs=mp4a.40.2"];
  for (const c of candidates) {
    try {
      if (MediaRecorder.isTypeSupported(c)) return c;
    } catch {
      /* ignore */
    }
  }
  return ""; // let the browser choose
}

function fmt(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function Recorder({
  lang,
  onSuccess,
  onChangeLanguage,
}: {
  lang: IntakeLang;
  onSuccess: (trackingCode: string) => void;
  onChangeLanguage: () => void;
}) {
  const s = t(lang);
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [level, setLevel] = useState(0);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>(""); // aria-live text
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [maxReached, setMaxReached] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const blobRef = useRef<Blob | null>(null);
  const mimeRef = useRef<string>("");
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef(0);
  const uploadRef = useRef<UploadHandle | null>(null);
  const turnstileRef = useRef<TurnstileHandle | null>(null);
  const turnstileElRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const sendRef = useRef<HTMLButtonElement>(null);
  const fallbackRef = useRef<HTMLHeadingElement>(null);
  const announcedRef = useRef<Set<number>>(new Set());

  // ---- teardown helpers -------------------------------------------------
  const stopMeter = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (ctxRef.current) {
      ctxRef.current.close().catch(() => undefined);
      ctxRef.current = null;
    }
    setLevel(0);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const releaseMedia = useCallback(() => {
    stopTimer();
    stopMeter();
    const rec = recRef.current;
    if (rec && rec.state !== "inactive") {
      try {
        rec.stop();
      } catch {
        /* already stopped */
      }
    }
    recRef.current = null;
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
  }, [stopMeter, stopTimer]);

  const dropBlob = useCallback(() => {
    chunksRef.current = [];
    blobRef.current = null;
    setPreviewUrl((u) => {
      if (u) URL.revokeObjectURL(u);
      return null;
    });
  }, []);

  // Quick Exit: stop recorder + tracks, drop blobs, abort upload.
  useEffect(() => {
    return registerQuickExitCleanup(() => {
      uploadRef.current?.abort();
      releaseMedia();
      dropBlob();
    });
  }, [releaseMedia, dropBlob]);

  // Unmount: same cleanup + Turnstile widget.
  useEffect(() => {
    return () => {
      uploadRef.current?.abort();
      releaseMedia();
      dropBlob();
      turnstileRef.current?.destroy();
      turnstileRef.current = null;
    };
  }, [releaseMedia, dropBlob]);

  // Lazy-load Turnstile only here, once.
  useEffect(() => {
    if (turnstileElRef.current && !turnstileRef.current) {
      turnstileRef.current = mountTurnstile(turnstileElRef.current, lang);
    }
  }, [lang]);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setPhase("unsupported");
      setStatus(t(lang).recUnsupported);
    }
  }, [lang]);

  // Focus management between sub-steps.
  useEffect(() => {
    if (phase === "idle") headingRef.current?.focus();
    else if (phase === "stopped") sendRef.current?.focus();
    else if (phase === "fallback" || phase === "rate_limited" || phase === "rejected" || phase === "denied")
      fallbackRef.current?.focus();
  }, [phase]);

  // ---- level meter -------------------------------------------------------
  const startMeter = useCallback((stream: MediaStream) => {
    try {
      const Ctx: typeof AudioContext | undefined =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      ctxRef.current = ctx;
      if (ctx.state === "suspended") ctx.resume().catch(() => undefined); // iOS Safari / headless
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);
      const data = new Uint8Array(analyser.fftSize);
      const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
      const minInterval = reduced ? 250 : 80; // ms between visual updates
      let last = 0;
      const tick = (now: number) => {
        rafRef.current = requestAnimationFrame(tick);
        if (now - last < minInterval) return;
        last = now;
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length); // 0..1
        setLevel(Math.min(1, rms * 3.2));
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      /* meter is optional */
    }
  }, []);

  // ---- recording ----------------------------------------------------------
  const stopRecording = useCallback(
    (reason: "user" | "max") => {
      stopTimer();
      stopMeter();
      const rec = recRef.current;
      if (!rec || rec.state === "inactive") return;
      setMaxReached(reason === "max");
      rec.stop(); // onstop builds the blob
    },
    [stopMeter, stopTimer],
  );

  const startRecording = useCallback(async () => {
    setPhase("requesting");
    setStatus("");
    setMaxReached(false);
    announcedRef.current = new Set();
    dropBlob();
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setPhase("denied");
      setStatus(s.recMicDenied);
      return;
    }
    streamRef.current = stream;
    const mime = pickMimeType();
    mimeRef.current = mime;
    let rec: MediaRecorder;
    try {
      rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
    } catch {
      stream.getTracks().forEach((tr) => tr.stop());
      setPhase("unsupported");
      setStatus(s.recUnsupported);
      return;
    }
    mimeRef.current = rec.mimeType || mime || "audio/webm";
    recRef.current = rec;
    chunksRef.current = [];
    rec.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };
    rec.onstop = () => {
      const type = mimeRef.current.split(";")[0] || "audio/webm";
      const blob = new Blob(chunksRef.current, { type });
      chunksRef.current = [];
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
      recRef.current = null;
      const seconds = (performance.now() - startedAtRef.current) / 1000;
      if (seconds < MIN_SECONDS || blob.size === 0) {
        blobRef.current = null;
        setPhase("idle");
        setStatus(s.recTooShort);
        return;
      }
      blobRef.current = blob;
      setPreviewUrl(URL.createObjectURL(blob));
      setPhase("stopped");
    };
    startedAtRef.current = performance.now();
    setElapsed(0);
    rec.start(1000);
    startMeter(stream);
    setPhase("recording");
    setStatus(s.recRecording);
    timerRef.current = setInterval(() => {
      const sec = (performance.now() - startedAtRef.current) / 1000;
      setElapsed(sec);
      const remaining = MAX_SECONDS - sec;
      for (const mark of [30, 10]) {
        if (remaining <= mark && !announcedRef.current.has(mark)) {
          announcedRef.current.add(mark);
          setStatus(`${s.recRemaining} ${fmt(mark)}`);
        }
      }
      if (sec >= MAX_SECONDS) stopRecording("max");
    }, 200);
  }, [dropBlob, s, startMeter, stopRecording]);

  // Announce stop once the blob is ready.
  useEffect(() => {
    if (phase === "stopped") setStatus(maxReached ? `${s.recMaxReached} ${s.recStopped}` : s.recStopped);
  }, [phase, maxReached, s]);

  const reRecord = useCallback(() => {
    uploadRef.current?.abort();
    uploadRef.current = null;
    dropBlob();
    setProgress(0);
    setPhase("idle");
    setStatus("");
  }, [dropBlob]);

  // ---- upload -------------------------------------------------------------
  const send = useCallback(async () => {
    const blob = blobRef.current;
    if (!blob) return;
    setPhase("uploading");
    setProgress(0);
    setStatus(s.securityCheck);
    const token = await turnstileRef.current?.getToken();
    if (!token) {
      setPhase("fallback");
      setStatus(s.failTitle);
      return;
    }
    setStatus(s.uploading);
    uploadRef.current = uploadVoice(
      {
        blob,
        mimeType: mimeRef.current,
        languageHint: lang,
        consentVersion: CONSENT_VERSION,
        turnstileToken: token,
      },
      (f) => setProgress(f),
      (r) => {
        uploadRef.current = null;
        if (r.ok) {
          dropBlob();
          releaseMedia();
          onSuccess(r.trackingCode);
          return;
        }
        turnstileRef.current?.reset();
        if (r.kind === "rate_limited") {
          setPhase("rate_limited");
          setStatus(s.rateLimited);
        } else if (r.kind === "rejected") {
          setPhase("rejected");
          // Tell the worker the real reason (no server detail leaks: these are the API's public error codes).
          setStatus(r.error === "turnstile" ? s.rejectedVerify : r.error === "too_long" ? s.rejectedTooLong : s.rejected);
        } else {
          setPhase("fallback");
          setStatus(s.failTitle);
        }
      },
    );
  }, [dropBlob, lang, onSuccess, releaseMedia, s]);

  // ---- render -------------------------------------------------------------
  const remaining = MAX_SECONDS - elapsed;
  const litBars = Math.round(level * METER_BARS);
  const langLabel = LANGS.find((l) => l.code === lang)?.label ?? lang;

  const isRecording = phase === "recording";
  const showRecordButton = phase === "idle" || phase === "requesting" || phase === "recording";

  return (
    <>
      <button type="button" className="btn btn-plain inline-ic t-small" onClick={onChangeLanguage} style={{ minHeight: 44 }}>
        <Translate size={18} aria-hidden="true" />
        {langLabel} · {s.changeLanguage}
      </button>

      <h1 ref={headingRef} tabIndex={-1} className="t-title">
        {s.recTitle}
      </h1>
      <p className="t-small">{s.recSubtitle}</p>

      {/* Live region: visible status doubles as the announcement */}
      <p role="status" aria-live="polite" aria-atomic="true" className="status-line t-body t-strong" data-testid="status">
        {status}
      </p>

      {showRecordButton && (
        <>
          <button
            type="button"
            className={`rec${isRecording ? " recording" : ""}`}
            aria-label={isRecording ? s.recStop : s.recStart}
            aria-pressed={isRecording}
            disabled={phase === "requesting"}
            onClick={() => (isRecording ? stopRecording("user") : startRecording())}
            data-testid="record"
          >
            {isRecording ? <Stop size={44} weight="fill" aria-hidden="true" /> : <Microphone size={44} weight="fill" aria-hidden="true" />}
          </button>

          {isRecording ? (
            <>
              <div className="timer" aria-hidden="true">
                {fmt(remaining)}
              </div>
              <span className="visually-hidden">
                {s.recRemaining} {fmt(remaining)}
              </span>
              <div className="meter" role="img" aria-label={s.recLevel} data-testid="meter">
                {Array.from({ length: METER_BARS }, (_, i) => (
                  <span
                    key={i}
                    className={i < litBars ? (i >= METER_BARS - 2 ? "hot" : "on") : ""}
                    style={{ height: `${30 + (i / METER_BARS) * 70}%` }}
                  />
                ))}
              </div>
              <p className="t-strong">{s.recStop}</p>
            </>
          ) : (
            <>
              <p className="t-strong">{s.recTapToStart}</p>
              <span className="inline-ic t-cap">
                <EyeSlash size={16} aria-hidden="true" />
                {s.recPrivacyNote}
              </span>
            </>
          )}
        </>
      )}

      {phase === "stopped" && previewUrl && (
        <>
          <div className="card">
            <p className="t-small t-strong">
              {s.recListen} · {fmt(Math.min(elapsed, MAX_SECONDS))}
            </p>
            <audio className="preview" controls src={previewUrl} aria-label={s.recListen} />
          </div>
          <div className="btn-row">
            <button ref={sendRef} type="button" className="btn btn-primary btn-lg" onClick={send} data-testid="send">
              <UploadSimple size={22} aria-hidden="true" />
              {s.recSend}
            </button>
            <button type="button" className="btn btn-secondary btn-lg" onClick={reRecord} data-testid="rerecord">
              <ArrowCounterClockwise size={22} aria-hidden="true" />
              {s.recRedo}
            </button>
          </div>
        </>
      )}

      {phase === "uploading" && (
        <div className="card" aria-busy="true">
          <p className="t-strong">{s.uploading}</p>
          <div
            className="progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            aria-label={s.uploading}
            style={{ marginTop: 12 }}
          >
            <span style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
          <p className="t-small" style={{ marginTop: 8 }}>
            {s.uploadProgress} {Math.round(progress * 100)}%
          </p>
        </div>
      )}

      {(phase === "fallback" || phase === "rate_limited" || phase === "rejected" || phase === "denied" || phase === "unsupported") && (
        <section className="card fallback" aria-labelledby="fallback-h" data-testid="fallback">
          <h2 id="fallback-h" ref={fallbackRef} tabIndex={-1} className="t-headline inline-ic">
            <Warning size={24} aria-hidden="true" />
            {s.failTitle}
          </h2>
          <p className="t-body" style={{ marginTop: 8 }}>
            {phase === "fallback"
              ? s.failBody
              : phase === "rate_limited"
                ? s.rateLimited
                : phase === "rejected"
                  ? s.rejected
                  : phase === "denied"
                    ? s.recMicDenied
                    : s.recUnsupported}
          </p>
          <div className="btn-row" style={{ marginTop: 16 }}>
            <a className="btn btn-primary btn-lg" href={HOTLINE_TEL}>
              <Phone size={22} aria-hidden="true" />
              {s.callHotline} {HOTLINE_DISPLAY}
            </a>
            <a className="btn btn-secondary btn-lg" href={MESSENGER_URL} target="_blank" rel="noopener noreferrer">
              <MessengerLogo size={22} aria-hidden="true" />
              {s.messenger}
            </a>
            {(phase === "fallback" || phase === "rate_limited") && blobRef.current && (
              <button type="button" className="btn btn-plain" onClick={send}>
                {s.tryAgain}
              </button>
            )}
            {(phase === "rejected" || phase === "denied" || phase === "fallback") && (
              <button type="button" className="btn btn-plain" onClick={reRecord}>
                <ArrowCounterClockwise size={20} aria-hidden="true" />
                {s.recRedo}
              </button>
            )}
          </div>
        </section>
      )}

      <div ref={turnstileElRef} className="turnstile" />
    </>
  );
}
