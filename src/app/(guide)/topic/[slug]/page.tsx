"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr/ArrowSquareOut";
import { Scales } from "@phosphor-icons/react/dist/ssr/Scales";
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr/ShieldCheck";
import { Warning } from "@phosphor-icons/react/dist/ssr/Warning";
import { Lifebuoy } from "@phosphor-icons/react/dist/ssr/Lifebuoy";
import { Info } from "@phosphor-icons/react/dist/ssr/Info";
import { TopicRow } from "../../../../../lib/types";
import { Header } from "../../../components/Header";
import { SOSBar } from "../../../components/SOSBar";
import { FormattedContent } from "../../../components/FormattedContent";
import { useLanguage } from "../../../contexts/LanguageContext";
import { messages } from "../../../../../lib/i18n";
import { TopicIcon } from "../../../components/TopicIcon";
import { CategoryBadge } from "../../../components/TopicCard";

interface TopicPageProps {
  params: Promise<{ slug: string }>;
}

export default function TopicPage({ params }: TopicPageProps) {
  const [topic, setTopic] = useState<TopicRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { locale } = useLanguage();
  const t = messages[locale];

  // Helper function to get content in current language
  const getContent = (
    thContent?: string,
    enContent?: string,
    mmContent?: string
  ) => {
    if (locale === "en" && enContent) return enContent;
    if (locale === "mm" && mmContent) return mmContent;
    return thContent || "";
  };

  const getYoutubeEmbedUrl = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };

  useEffect(() => {
    const loadTopic = async () => {
      try {
        // Resolve the params Promise
        const { slug } = await params;

        // Decode the URL-encoded slug
        const decodedSlug = decodeURIComponent(slug);

        const response = await fetch("/api/topics", {
          cache: "no-store", // Always get fresh data
        });
        const data: TopicRow[] = await response.json();

        const foundTopic = data.find((item) => item.slug === decodedSlug);

        if (foundTopic) {
          setTopic(foundTopic);
        } else {
          setError(t.topicNotFound);
        }
      } catch (err) {
        console.error("Failed to load topic:", err);
        setError(t.loadError);
      } finally {
        setLoading(false);
      }
    };

    loadTopic();
  }, [params, locale, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface pb-24">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse" aria-busy="true">
              <div className="h-8 w-3/4 bg-surface-tertiary rounded mb-4"></div>
              <div className="h-6 w-1/4 bg-surface-tertiary rounded mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 w-full bg-surface-tertiary rounded"></div>
                <div className="h-4 w-5/6 bg-surface-tertiary rounded"></div>
                <div className="h-4 w-4/6 bg-surface-tertiary rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen bg-surface pb-24">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-label mb-4">
              {error || t.topicNotFound}
            </h1>
            <Link href="/" className="btn btn-primary">
              {t.returnHome}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const topicTitle = getContent(topic.topic, topic.topicEn, topic.topicMm);

  // Section icon = Phosphor regular, ink colour (status colours are for status only).
  const sections: {
    key: string;
    title: string;
    Icon: typeof Scales;
    content: string;
    extra?: React.ReactNode;
  }[] = [];

  if (topic.law || topic.lawEn || topic.lawMm) {
    sections.push({
      key: "law",
      title: t.relatedLaws,
      Icon: Scales,
      content: getContent(topic.law, topic.lawEn, topic.lawMm),
      extra:
        topic.lawUrls && topic.lawUrls.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-3">
            {topic.lawUrls.map((url, index) => (
              <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary text-base">
                <ArrowSquareOut size={20} aria-hidden="true" />
                {topic.lawUrls && topic.lawUrls.length === 1 ? t.readFullLaw : `${t.readFullLaw} ${index + 1}`}
                <span className="sr-only">
                  {" "}
                  ({locale === "en" ? "opens in new tab" : locale === "mm" ? "tab အသစ်ဖွင့်သည်" : "เปิดในแท็บใหม่"})
                </span>
              </a>
            ))}
          </div>
        ) : undefined,
    });
  }
  if (topic.knowYourRights || topic.knowYourRightsEn || topic.knowYourRightsMm) {
    sections.push({
      key: "rights",
      title: t.knowYourRights,
      Icon: ShieldCheck,
      content: getContent(topic.knowYourRights, topic.knowYourRightsEn, topic.knowYourRightsMm),
    });
  }
  if (topic.howToIdentify || topic.howToIdentifyEn || topic.howToIdentifyMm) {
    sections.push({
      key: "identify",
      title: t.howToIdentify,
      Icon: Warning,
      content: getContent(topic.howToIdentify, topic.howToIdentifyEn, topic.howToIdentifyMm),
    });
  }
  if (topic.selfHelp || topic.selfHelpEn || topic.selfHelpMm) {
    sections.push({
      key: "selfhelp",
      title: t.selfHelp,
      Icon: Lifebuoy,
      content: getContent(topic.selfHelp, topic.selfHelpEn, topic.selfHelpMm),
    });
  }

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="container mx-auto px-4 py-8 pb-28" id="main-content">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="crumb mb-6" aria-label="Breadcrumb">
            <Link href="/">{t.home}</Link>
            <span aria-hidden="true">/</span>
            <Link href="/topics">{t.allTopics}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{getContent(topic.topic, topic.topicEn)}</span>
          </nav>

          {/* Topic Header */}
          <header className="mb-8 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-3">
                <CategoryBadge row={topic} label={getContent(topic.category, topic.categoryEn, topic.categoryMm)} />
              </div>
              <h1 className="text-3xl font-bold text-label">{topicTitle}</h1>
            </div>
            <TopicIcon topic={topic.topic} size={64} className="flex-shrink-0" />
          </header>

          <div className="space-y-6">
            {/* Video Section */}
            {topic.videoUrl && (
              <section className="card overflow-hidden">
                <div className="relative w-full aspect-video">
                  <iframe
                    src={getYoutubeEmbedUrl(topic.videoUrl) || ""}
                    title={`${topicTitle} - Video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  ></iframe>
                </div>
              </section>
            )}

            {sections.map(({ key, title, Icon, content, extra }) => (
              <section key={key} className="card p-5 sm:p-6" aria-labelledby={`section-${key}`}>
                <h2 id={`section-${key}`} className="text-xl font-semibold text-label mb-4 flex items-center gap-2">
                  <Icon size={26} aria-hidden="true" className="flex-shrink-0" />
                  {title}
                </h2>
                <FormattedContent content={content} />
                {extra}
              </section>
            ))}

            {/* Remarks Section — note, not a warning: neutral surface */}
            {topic.remark && (
              <section className="bg-surface-secondary rounded-xl border border-separator p-5 sm:p-6" aria-labelledby="section-remark">
                <h2 id="section-remark" className="text-xl font-semibold text-label mb-3 flex items-center gap-2">
                  <Info size={26} aria-hidden="true" className="flex-shrink-0" />
                  {t.remarks}
                </h2>
                <p className="reading text-label-secondary">{topic.remark}</p>
              </section>
            )}
          </div>

          {/* Navigation */}
          <div className="mt-12 text-center">
            <Link href="/" className="btn btn-secondary">
              <ArrowLeft size={20} weight="bold" aria-hidden="true" />
              {t.backToHome}
            </Link>
          </div>
        </div>
      </main>
      <SOSBar />
    </div>
  );
}
