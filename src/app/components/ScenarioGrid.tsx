"use client";

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
    <section className="mb-12">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-black mb-2">
          {t.commonSituations}
        </h2>
        <p className="text-gray-600">{t.chooseClosest}</p>
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

      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 text-yellow-400"
        >
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>
        {t.tip}
      </div>
    </section>
  );
}
