"use client";

import Link from "next/link";
import { Siren } from "@phosphor-icons/react/dist/ssr/Siren";
import { Phone } from "@phosphor-icons/react/dist/ssr/Phone";
import { FirstAid } from "@phosphor-icons/react/dist/ssr/FirstAid";
import { Microphone } from "@phosphor-icons/react/dist/ssr/Microphone";
import { ListChecks } from "@phosphor-icons/react/dist/ssr/ListChecks";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr/ArrowSquareOut";
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight";
import { Info } from "@phosphor-icons/react/dist/ssr/Info";
import { Header } from "../../components/Header";
import { SOSBar } from "../../components/SOSBar";
import { useLanguage } from "../../contexts/LanguageContext";
import { messages } from "../../../../lib/i18n";

/**
 * ขอความช่วยเหลือ — colour jobs on this page (LPN One CI):
 *  - red (emergency) = external emergency numbers 191 / 1669 only;
 *  - yellow = the ONE primary action: call the LPN hotline 084-121-1609
 *    (number pending LPN confirmation — do not change);
 *  - everything else is neutral/outline.
 * Brand vocabulary (§10): ส่งเสียงเล่าเรื่อง → /voice-report, ติดตามเรื่อง → /track.
 */
export default function HelpPage() {
  const { locale } = useLanguage();
  const t = messages[locale];
  const callWord = locale === "en" ? "Call" : locale === "mm" ? "ဖုန်းခေါ်ရန်" : "โทร";
  const newTab = locale === "en" ? "opens in new tab" : locale === "mm" ? "tab အသစ်ဖွင့်သည်" : "เปิดในแท็บใหม่";

  const emergencyContacts = [
    {
      name: t.helpContactPoliceName,
      number: "191",
      description: t.helpContactPoliceDesc,
      available: t.hours24,
    },
    {
      name: t.helpContactEmploymentName,
      number: "1694",
      description: t.helpContactEmploymentDesc,
      available: t.weekdayHours,
    },
    {
      name: t.helpContactImmigrationName,
      number: "1178",
      description: t.helpContactImmigrationDesc,
      available: t.hours24,
    },
    {
      name: t.helpContactMentalName,
      number: "1323",
      description: t.helpContactMentalDesc,
      available: t.hours24,
    },
  ];

  const helpfulResources = [
    {
      title: t.helpOrgCenterTitle,
      organization: t.helpOrgCenterOrg,
      phone: "02-354-9999",
      website: "www.mol.go.th",
      description: t.helpOrgCenterDesc,
      primary: false,
    },
    {
      title: t.helpOrgLpnTitle,
      organization: "Labor Protection Network",
      phone: "084-121-1609",
      website: "https://www.lpnfoundation.org/th",
      description: t.helpOrgLpnDesc,
      primary: true,
    },
  ];

  const tips = [t.helpTipSaveNumbers, t.helpTipRememberAddress, t.helpTipKeepCopies, t.helpTipAskTranslator];

  return (
    <div className="min-h-screen bg-surface pb-24">
      <Header />

      <main className="container mx-auto px-4 py-8" id="main-content">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="crumb mb-6" aria-label="Breadcrumb">
            <Link href="/">{t.home}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{t.helpPageTitle}</span>
          </nav>

          {/* Page Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-label mb-3">{t.helpPageTitle}</h1>
            <p className="text-label-secondary">{t.helpPageDescription}</p>
          </header>

          {/* Emergency — external numbers, status red */}
          <section className="bg-critical-tint border border-critical rounded-xl p-5 sm:p-6 mb-8" aria-labelledby="emergency-heading">
            <div className="flex items-center gap-2 mb-3">
              <Siren size={28} weight="fill" className="text-critical flex-shrink-0" aria-hidden="true" />
              <h2 id="emergency-heading" className="text-xl font-semibold text-critical-ink">
                {t.emergency}
              </h2>
            </div>
            <p className="text-label mb-4">{t.emergencyDescription}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="tel:191" className="btn btn-emergency btn-lg w-full sm:w-auto">
                <Phone size={22} weight="fill" aria-hidden="true" />
                {t.callPolice}
              </a>
              <a href="tel:1669" className="btn btn-emergency btn-lg w-full sm:w-auto">
                <FirstAid size={22} weight="fill" aria-hidden="true" />
                {t.callAmbulance}
              </a>
            </div>
          </section>

          {/* Brand vocabulary: ส่งเสียงเล่าเรื่อง · ติดตามเรื่อง */}
          <section className="mb-8" aria-label={`${t.voiceReportTitle} / ${t.trackTitle}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { href: "/voice-report", Icon: Microphone, title: t.voiceReportTitle, desc: t.voiceReportDesc },
                { href: "/track", Icon: ListChecks, title: t.trackTitle, desc: t.trackDesc },
              ].map(({ href, Icon, title, desc }) => (
                <Link key={href} href={href} className="card p-5 flex items-center gap-4 transition-colors hover:border-separator-strong">
                  <span className="duo-accent text-label flex-shrink-0" aria-hidden="true">
                    <Icon size={44} weight="duotone" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-bold text-label text-lg">{title}</span>
                    <span className="block text-sm text-label-secondary">{desc}</span>
                  </span>
                  <CaretRight size={20} weight="bold" className="text-label-secondary flex-shrink-0" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>

          {/* Emergency Contacts */}
          <section className="mb-8" aria-labelledby="hotlines-heading">
            <h2 id="hotlines-heading" className="text-2xl font-semibold text-label mb-5">
              {t.importantHotlines}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="card p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-label">{contact.name}</h3>
                    <a
                      href={`tel:${contact.number}`}
                      aria-label={`${callWord} ${contact.name} ${contact.number}`}
                      className="btn btn-secondary text-base flex-shrink-0"
                    >
                      <Phone size={20} aria-hidden="true" />
                      {contact.number}
                    </a>
                  </div>
                  <p className="text-label-secondary text-sm mb-2">{contact.description}</p>
                  <p className="text-sm font-medium text-label">
                    <span className="status status-success">{t.availableHours}</span> {contact.available}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Helpful Organizations — LPN hotline is the page's one yellow action */}
          <section className="mb-8" aria-labelledby="orgs-heading">
            <h2 id="orgs-heading" className="text-2xl font-semibold text-label mb-5">
              {t.helpfulOrganizations}
            </h2>
            <div className="space-y-4">
              {helpfulResources.map((resource, index) => (
                <div key={index} className="card p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-label">{resource.title}</h3>
                      <p className="text-sm text-label-secondary">{resource.organization}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:flex-shrink-0">
                      <a
                        href={`tel:${resource.phone}`}
                        aria-label={`${callWord} ${resource.title} ${resource.phone}`}
                        className={`btn ${resource.primary ? "btn-primary" : "btn-secondary"} text-base`}
                      >
                        <Phone size={20} weight={resource.primary ? "fill" : "regular"} aria-hidden="true" />
                        {resource.phone}
                      </a>
                      <a
                        href={resource.website.startsWith("http") ? resource.website : `https://${resource.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-plain text-base"
                      >
                        <ArrowSquareOut size={20} aria-hidden="true" />
                        {t.website}
                        <span className="sr-only"> ({newTab})</span>
                      </a>
                    </div>
                  </div>
                  <p className="text-label-secondary">{resource.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Additional Tips — a note, neutral surface */}
          <section className="bg-surface-secondary rounded-xl border border-separator p-5 sm:p-6" aria-labelledby="tips-heading">
            <h2 id="tips-heading" className="text-xl font-semibold text-label mb-4 flex items-center gap-2">
              <Info size={26} aria-hidden="true" className="flex-shrink-0" />
              {t.additionalTips}
            </h2>
            <ul className="text-label space-y-2 list-disc pl-6 marker:text-label-secondary">
              {tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <SOSBar />
    </div>
  );
}
