"use client";

import { useCallback, useState } from "react";
import { IntakeShell } from "../_components/IntakeShell";
import { LanguagePicker } from "../_components/LanguagePicker";
import { ConsentScreen } from "../_components/ConsentScreen";
import { Recorder } from "../_components/Recorder";
import { CodeScreen } from "../_components/CodeScreen";
import { useIntakeLang } from "../_lib/IntakeLangContext";
import { t, type IntakeLang } from "../_lib/strings";

type Step = "language" | "consent" | "record" | "code";

export function VoiceReportFlow() {
  const { lang, setLang, clearLang } = useIntakeLang();
  const [step, setStep] = useState<Step>("language");
  const [code, setCode] = useState<string | null>(null);

  const pickLanguage = useCallback(
    (l: IntakeLang) => {
      setLang(l);
      setStep("consent");
    },
    [setLang],
  );

  const onDone = useCallback(() => {
    // "Done" clears everything: code, step and the session language.
    setCode(null);
    setStep("language");
    clearLang();
  }, [clearLang]);

  const s = t(lang ?? "th");

  return (
    <IntakeShell lang={lang} title={s.appName} center={step !== "code" && step !== "consent"}>
      {step === "language" && <LanguagePicker current={lang} onPick={pickLanguage} />}
      {step === "consent" && lang && (
        <ConsentScreen lang={lang} onAgree={() => setStep("record")} onBack={() => setStep("language")} />
      )}
      {step === "record" && lang && (
        <Recorder
          lang={lang}
          onChangeLanguage={() => setStep("language")}
          onSuccess={(c) => {
            setCode(c);
            setStep("code");
          }}
        />
      )}
      {step === "code" && lang && code && <CodeScreen lang={lang} code={code} onDone={onDone} />}
    </IntakeShell>
  );
}
