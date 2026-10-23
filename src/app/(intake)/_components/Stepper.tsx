"use client";

import { Check } from "@phosphor-icons/react/dist/ssr/Check";
import { STAGES, t, type IntakeLang, type Stage } from "../_lib/strings";

/** 4-step public stepper: received → reviewing → in_progress → closed. */
export function Stepper({ lang, stage, serverLabel }: { lang: IntakeLang; stage: Stage; serverLabel?: string }) {
  const s = t(lang);
  const idx = STAGES.indexOf(stage);
  return (
    <ol className="steps" aria-label={s.stepLabel} data-testid="stepper">
      {STAGES.map((st, i) => {
        const done = i < idx || (st === "closed" && stage === "closed");
        const now = i === idx;
        // Prefer the server's label for the current stage if it sent one in this language.
        const label = now && serverLabel ? serverLabel : s.stages[st];
        return (
          <li
            key={st}
            className={`step${done ? " done" : ""}${now ? " now" : ""}`}
            aria-current={now ? "step" : undefined}
            data-stage={st}
          >
            <i aria-hidden="true">{done ? <Check size={16} weight="bold" /> : i + 1}</i>
            <span>{label}</span>
            {now && <span className="step-state">{s.stepCurrent}</span>}
            {done && !now && <span className="step-state">{s.stepDone}</span>}
          </li>
        );
      })}
    </ol>
  );
}
