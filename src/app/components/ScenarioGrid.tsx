"use client";

import { Lightbulb } from "@phosphor-icons/react/dist/ssr/Lightbulb";
import { ScenarioCard } from "./ScenarioCard";
import { scenarios } from "../../../lib/scenarios";
import { useLanguage } from "../contexts/LanguageContext";
import { messages } from "../../../lib/i18n";

interface ScenarioGridProps {
  onScenarioSelect: (id: string) => void;
}

export function ScenarioGrid({ onScenarioSelect }: ScenarioGridProps) {
  const { locale } = useLanguage();
  const t = messages[locale];

  return (
    <section className="mb-12" aria-labelledby="scenario-grid-heading">
      <div className="mb-8 text-center">
        <h2 id="scenario-grid-heading" className="text-2xl font-bold text-label mb-2">
          {t.commonSituations}
        </h2>
        <p className="text-label-secondary">{t.chooseClosest}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {scenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            onClick={() => onScenarioSelect(scenario.id)}
          />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-label-secondary">
        <Lightbulb size={20} aria-hidden="true" />
        {t.tip}
      </div>
    </section>
  );
}
