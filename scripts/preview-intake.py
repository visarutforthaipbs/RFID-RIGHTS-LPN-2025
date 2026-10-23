"""Drive the /voice-report and /track flows headless and measure a11y floors.
Run: /usr/local/bin/python3 scripts/preview-intake.py   (dev on :3001, mock on :3100)
"""
import json, os, re, sys, time
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3001"
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".previews")
os.makedirs(OUT, exist_ok=True)
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

MEASURE_JS = """
() => {
  const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const small = [];
  for (const el of document.querySelectorAll('button, a[href], input, select, textarea, [role=button]')) {
    if (!vis(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 44 || r.height < 44) small.push({tag: el.tagName, cls: el.className, text: (el.textContent||'').trim().slice(0,30), w: Math.round(r.width), h: Math.round(r.height)});
  }
  const tiny = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n; const seen = new Set();
  while ((n = walker.nextNode())) {
    if (!n.textContent.trim()) continue;
    const el = n.parentElement; if (!el || seen.has(el) || !vis(el)) continue;
    if (el.closest('script, style, [aria-hidden="true"].visually-hidden, .visually-hidden')) continue;
    seen.add(el);
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 13) tiny.push({tag: el.tagName, cls: el.className, text: n.textContent.trim().slice(0,30), fs});
  }
  return { small, tiny, scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth,
           lang: document.documentElement.lang, gtm: !!document.querySelector('script[src*="googletagmanager"]') };
}
"""

report = {"screens": [], "violations": [], "ga": {}, "notes": []}

def measure(page, name):
    m = page.evaluate(MEASURE_JS)
    entry = {"screen": name, "lang": m["lang"], "scrollWidth": m["scrollWidth"], "innerWidth": m["innerWidth"],
             "small_controls": m["small"], "tiny_text": m["tiny"], "gtm_script": m["gtm"]}
    report["screens"].append(entry)
    if m["small"]: report["violations"].append(f"{name}: controls <44px: {m['small']}")
    if m["tiny"]: report["violations"].append(f"{name}: text <13px: {m['tiny']}")
    if m["scrollWidth"] > m["innerWidth"]: report["violations"].append(f"{name}: horizontal overflow {m['scrollWidth']}>{m['innerWidth']}")
    if m["gtm"]: report["violations"].append(f"{name}: googletagmanager script present")
    return m

def shot(page, name):
    path = os.path.join(OUT, name + ".png")
    page.screenshot(path=path, full_page=True)
    return path

def run_voice(ctx, scheme, lang="th"):
    page = ctx.new_page()
    ext_requests = []
    page.on("request", lambda r: ext_requests.append(r.url) if "googletagmanager" in r.url or "google-analytics" in r.url else None)
    page.goto(f"{BASE}/voice-report"); page.wait_for_selector("[data-testid=lang-th]")
    shots = [shot(page, f"voice-1-language-{scheme}")]; measure(page, f"voice/language/{scheme}")
    page.click(f"[data-testid=lang-{lang}]"); page.wait_for_selector("[data-testid=consent-agree]")
    shots.append(shot(page, f"voice-2-consent-{lang}-{scheme}")); measure(page, f"voice/consent/{lang}/{scheme}")
    assert page.evaluate("document.documentElement.lang") == lang
    page.click("[data-testid=consent-agree]"); page.wait_for_selector("[data-testid=record]")
    shots.append(shot(page, f"voice-3-recorder-{lang}-{scheme}")); measure(page, f"voice/recorder/{lang}/{scheme}")
    page.click("[data-testid=record]")
    page.wait_for_selector(".rec.recording"); time.sleep(2.5)
    lit = page.evaluate("document.querySelectorAll('.meter span.on, .meter span.hot').length")
    status = page.inner_text("[data-testid=status]")
    report["notes"].append(f"recording({lang},{scheme}): meter bars lit={lit}, aria-live status='{status}', timer='{page.inner_text('.timer')}'")
    shots.append(shot(page, f"voice-4-recording-{lang}-{scheme}")); measure(page, f"voice/recording/{lang}/{scheme}")
    page.click("[data-testid=record]")  # stop
    page.wait_for_selector("[data-testid=send]")
    shots.append(shot(page, f"voice-5-stopped-{lang}-{scheme}")); measure(page, f"voice/stopped/{lang}/{scheme}")
    report["notes"].append(f"stopped({lang},{scheme}): status='{page.inner_text('[data-testid=status]')}', focus={page.evaluate('document.activeElement && document.activeElement.dataset.testid')}")
    t0 = time.time(); page.click("[data-testid=send]")
    page.wait_for_selector("[data-testid=code]", timeout=20000)
    code = page.inner_text("[data-testid=code]")
    report["notes"].append(f"upload({lang},{scheme}): code shown '{code}' after {time.time()-t0:.1f}s")
    assert code == "K7Q2 M9XD", code
    shots.append(shot(page, f"voice-6-code-{lang}-{scheme}")); measure(page, f"voice/code/{lang}/{scheme}")
    stored = page.evaluate("JSON.stringify({ss: Object.entries(sessionStorage), ls: Object.keys(localStorage)})")
    report["notes"].append(f"storage after success: {stored}")
    page.click("[data-testid=done]"); page.wait_for_selector("[data-testid=lang-th]")
    report["notes"].append(f"done -> language picker, sessionStorage={page.evaluate('JSON.stringify(Object.entries(sessionStorage))')}")
    report["ga"][f"voice-report runtime requests ({scheme})"] = ext_requests
    page.close()
    return shots

def run_track(ctx, scheme):
    page = ctx.new_page()
    page.goto(f"{BASE}/track"); page.wait_for_selector("[data-testid=lang-th]")
    page.click("[data-testid=lang-th]"); page.wait_for_selector("[data-testid=code-input]")
    shots = [shot(page, f"track-1-input-{scheme}")]; measure(page, f"track/input/{scheme}")
    page.fill("[data-testid=code-input]", " k7q2-m9xd "); page.click("[data-testid=track-submit]")
    page.wait_for_selector("[data-testid=stepper]")
    now = page.get_attribute("[data-testid=stepper] li[aria-current=step]", "data-stage")
    report["notes"].append(f"track found ({scheme}): current stage={now}, code shown='{page.inner_text('.code')}'")
    shots.append(shot(page, f"track-2-found-{scheme}")); measure(page, f"track/found/{scheme}")
    page.click("[data-testid=track-again]")
    page.fill("[data-testid=code-input]", "ZZZZ ZZZZ"); page.click("[data-testid=track-submit]")
    page.wait_for_selector("[data-testid=track-not_found]")
    shots.append(shot(page, f"track-3-notfound-{scheme}")); measure(page, f"track/notfound/{scheme}")
    page.click("[data-testid=track-again]")
    page.fill("[data-testid=code-input]", "RATE4290"); page.click("[data-testid=track-submit]")
    page.wait_for_selector("[data-testid=track-rate_limited]")
    report["notes"].append(f"track 429 ({scheme}): '{page.inner_text('[data-testid=track-rate_limited] h2')}'")
    page.click("[data-testid=track-again]")
    page.fill("[data-testid=code-input]", "abc"); page.click("[data-testid=track-submit]")
    page.wait_for_selector("[role=alert]")
    report["notes"].append(f"track invalid ({scheme}): '{page.inner_text('[role=alert]')}'")
    page.close()
    return shots

def run_quick_exit(ctx):
    page = ctx.new_page()
    page.route("https://www.google.com/**", lambda route: route.fulfill(status=200, body="<title>google stub</title>"))
    page.goto(f"{BASE}/voice-report"); page.click("[data-testid=lang-th]"); page.click("[data-testid=consent-agree]")
    page.wait_for_selector("[data-testid=record]")
    qe = page.evaluate("(() => { const r = document.querySelector('[data-testid=quick-exit]').getBoundingClientRect(); return {w: Math.round(r.width), h: Math.round(r.height), right: Math.round(window.innerWidth - r.right), top: Math.round(r.top)}; })()")
    page.click("[data-testid=record]"); page.wait_for_selector(".rec.recording")
    page.keyboard.press("Escape")
    page.wait_for_url("https://www.google.com/**", timeout=10000)
    report["notes"].append(f"quick exit: button {qe}; Escape while recording -> {page.url}")
    page.goto(f"{BASE}/voice-report"); page.wait_for_selector("[data-testid=lang-th]")
    report["notes"].append(f"after quick exit sessionStorage={page.evaluate('JSON.stringify(Object.entries(sessionStorage))')} localStorage intake keys={page.evaluate('Object.keys(localStorage).filter(k=>k.startsWith(\"lpn-intake\"))')}")
    page.close()

def run_fallback(ctx):
    """Dead intake API: route the voice POST to a hang → 10 s stall timeout → hotline panel."""
    page = ctx.new_page()
    page.route("http://localhost:3100/api/intake/voice", lambda route: None)  # never fulfilled
    page.goto(f"{BASE}/voice-report"); page.click("[data-testid=lang-th]"); page.click("[data-testid=consent-agree]")
    page.click("[data-testid=record]"); page.wait_for_selector(".rec.recording"); time.sleep(1.5); page.click("[data-testid=record]")
    page.wait_for_selector("[data-testid=send]"); t0 = time.time(); page.click("[data-testid=send]")
    page.wait_for_selector("[data-testid=fallback]", timeout=30000)
    dt = time.time() - t0
    tel = page.get_attribute("[data-testid=fallback] a.btn-primary", "href")
    msg = page.get_attribute("[data-testid=fallback] a.btn-secondary", "href")
    report["notes"].append(f"fallback: panel after {dt:.1f}s (expected ~10 s stall timeout); tel={tel} messenger={msg}; focus={page.evaluate('document.activeElement && document.activeElement.id')}")
    p = shot(page, "voice-7-fallback-light"); measure(page, "voice/fallback/light")
    page.close()
    return [p]

def check_ga(ctx):
    page = ctx.new_page()
    for path in ["/", "/topics", "/help", "/voice-report", "/track"]:
        html = page.request.get(BASE + path).text()
        report["ga"][path] = {"googletagmanager_in_html": "googletagmanager" in html,
                              "noindex": bool(re.search(r'name="robots"[^>]*noindex', html))}
    page.goto(BASE + "/nonexistent-xyz-404"); page.wait_for_selector("text=ไม่พบหน้าที่คุณต้องการ", timeout=15000)
    report["notes"].append("custom guide 404 renders for unmatched URL (ไม่พบหน้าที่คุณต้องการ visible); GA script present: %s" % page.evaluate("!!document.querySelector('script[src*=googletagmanager]')"))
    page.goto(BASE + "/"); page.wait_for_load_state("networkidle")
    report["notes"].append("'/' runtime: gtag loaded = %s" % page.evaluate("typeof window.gtag === 'function' || Array.isArray(window.dataLayer)"))
    page.close()

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=CHROME, headless=True,
                                args=["--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream", "--autoplay-policy=no-user-gesture-required"])
    shots = []
    for scheme in ["light", "dark"]:
        ctx = browser.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, color_scheme=scheme,
                                  permissions=["microphone"], locale="th-TH", reduced_motion="reduce" if scheme == "dark" else "no-preference")
        shots += run_voice(ctx, scheme)
        if scheme == "light":
            shots += run_voice(ctx, scheme, lang="my")
        shots += run_track(ctx, scheme)
        if scheme == "light":
            run_quick_exit(ctx); shots += run_fallback(ctx); check_ga(ctx)
        ctx.close()
    browser.close()

report["screenshots"] = shots
print(json.dumps(report, ensure_ascii=False, indent=1))
with open(os.path.join(OUT, "report.json"), "w") as f: json.dump(report, f, ensure_ascii=False, indent=1)
sys.exit(1 if report["violations"] else 0)
