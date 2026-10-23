# Intake pages — `/voice-report` and `/track` (Module 4)

Worker-facing pages that talk to the LPN intake API (`intake/docs/API.md`). They live in
their own root layout so the guide's Google Analytics, Tailwind, Noto fonts and
`LanguageContext` are never loaded here (BRAND.md rule 9, PRD v1.1 §6).

## Env (never rename — shared with website and intake)
| Var | Dev default | Prod |
|---|---|---|
| `NEXT_PUBLIC_INTAKE_URL` | `http://localhost:3100` | `https://intake.lpnfoundation.org` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `1x00000000000000000000AA` (always-pass test key) | real site key |

Set them in Vercel for production. Locally: `NEXT_PUBLIC_INTAKE_URL=http://localhost:3100 npx next dev -p 3001`.

## Local testing without the real API
```
node scripts/mock-intake.mjs                 # :3100 — 201 {tracking_code:"K7Q2M9XD"}, GET /api/track (K7Q2M9XD → 200, RATE4290 → 429, else 404)
/usr/local/bin/python3 scripts/preview-intake.py   # drives both flows headless at 390 px light+dark, screenshots → .previews/ (gitignored)
```
If the Turnstile script cannot load in a **dev** build, the client sends the literal
token `dev` (accepted only when the API runs with `TURNSTILE_SECRET=dev`). Production never does this.

## Behaviour
- Language picker TH/MY (Khmer in code behind `SHOW_KHMER=false` until LPN reviews the consent text) → consent (`consent_version` `2026-01`) → recorder → upload → full-screen code.
- MediaRecorder `audio/webm;codecs=opus`, fallback `audio/mp4` (iOS Safari). Live level meter (AnalyserNode). Hard stop at 180 s with countdown. Re-record.
- Upload is an XHR multipart POST with a progress bar; a **10 s stall timeout** (no progress and no response for 10 s) or any network/5xx error shows the hotline + Messenger panel. No retry queue on the device.
- `/track`: normalises the code (uppercase, spaces/hyphens stripped), `GET /api/track?code=&lang=`, 4-step stepper; 404 → friendly not-found; 429 → try later.
- Quick Exit (`src/app/components/QuickExitButton.tsx`): click or Escape stops the recorder and tracks, drops blobs, aborts uploads, `sessionStorage.clear()`, removes `lpn-intake*` keys from localStorage (the guide's `locale` key is kept) and `location.replace('https://www.google.com')`.
- Nothing is persisted on the device: the only storage write is the chosen language in `sessionStorage` (`lpn-intake-lang`), cleared by Done/Quick Exit. The tracking code lives in React state only.
- Service worker: `/voice-report`, `/track`, `NEXT_PUBLIC_INTAKE_URL/*` and Turnstile are `NetworkOnly` and excluded from the precache (`next.config.ts`). Both pages are `noindex`, listed in `robots.txt` Disallow and filtered out of `sitemap.ts`.

## Placeholders LPN must replace before launch
- `MESSENGER_URL` in `_lib/strings.ts` is `https://m.me/` — needs the Facebook Page username.
- All **MY** and **KM** strings in `_lib/strings.ts` are machine-assisted drafts; the consent copy (TH too) is marked “รอ LPN ตรวจทาน” on screen until `consentReviewNote` is removed.
- Hotline is `084-121-1609` (guideline §10).
