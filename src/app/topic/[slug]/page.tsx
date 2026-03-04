"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { TopicRow } from "../../../../lib/types";
import { Header } from "../../components/Header";
import { SOSBar } from "../../components/SOSBar";
import { FormattedContent } from "../../components/FormattedContent";
import { useLanguage } from "../../contexts/LanguageContext";
import { messages } from "../../../../lib/i18n";
import { getTopicIcon } from "../../../../lib/topic-icons";

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

  // Helper function to get badge color based on category
  const getBadgeStyle = (category: string) => {
    const styles = [
      "bg-[#117c8e] text-white", // Teal
      "bg-[#ff5122] text-white", // Orange
      "bg-[#fec700] text-black", // Yellow
    ];

    let hash = 0;
    for (let i = 0; i < category.length; i++) {
      hash = category.charCodeAt(i) + ((hash << 5) - hash);
    }

    return styles[Math.abs(hash) % styles.length];
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
      <div className="min-h-screen bg-gray-50 pb-24">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 w-1/4 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || t.topicNotFound}
            </h1>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors"
            >
              {t.returnHome}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8" id="main-content">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <Link href="/" className="text-gray-900 hover:text-yellow-600">
              {t.home}
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">
              {getContent(topic.topic, topic.topicEn)}
            </span>
          </nav>

          {/* Topic Header */}
          <header className="mb-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-3">
                  <span
                    className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getBadgeStyle(
                      topic.categoryEn || topic.category || ""
                    )}`}
                  >
                    {getContent(
                      topic.category,
                      topic.categoryEn,
                      topic.categoryMm
                    )}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {getContent(topic.topic, topic.topicEn, topic.topicMm)}
                </h1>
              </div>
              <div className="hidden sm:block w-24 h-24 relative flex-shrink-0">
                <Image
                  src={getTopicIcon(topic.topic)}
                  alt={getContent(topic.topic, topic.topicEn, topic.topicMm)}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </header>

          <div className="space-y-8">
            {/* Video Section */}
            {topic.videoUrl && (
              <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="relative w-full aspect-video">
                  <iframe
                    src={getYoutubeEmbedUrl(topic.videoUrl) || ""}
                    title={`${getContent(topic.topic, topic.topicEn, topic.topicMm)} - Video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  ></iframe>
                </div>
              </section>
            )}

            {/* Law Section */}
            {(topic.law || topic.lawEn || topic.lawMm) && (
              <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="h-6 w-6 text-yellow-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  {t.relatedLaws}
                </h2>
                <FormattedContent
                  content={getContent(topic.law, topic.lawEn, topic.lawMm)}
                />
                {topic.lawUrls && topic.lawUrls.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {topic.lawUrls.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors font-medium"
                      >
                        <svg
                          className="h-5 w-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        {topic.lawUrls && topic.lawUrls.length === 1
                          ? t.readFullLaw
                          : `${t.readFullLaw} ${index + 1}`}
                      </a>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Know Your Rights Section */}
            {(topic.knowYourRights ||
              topic.knowYourRightsEn ||
              topic.knowYourRightsMm) && (
              <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="h-6 w-6 text-green-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {t.knowYourRights}
                </h2>
                <FormattedContent
                  content={getContent(
                    topic.knowYourRights,
                    topic.knowYourRightsEn,
                    topic.knowYourRightsMm
                  )}
                />
              </section>
            )}

            {/* How to Identify Section */}
            {(topic.howToIdentify ||
              topic.howToIdentifyEn ||
              topic.howToIdentifyMm) && (
              <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="h-6 w-6 text-red-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  {t.howToIdentify}
                </h2>
                <FormattedContent
                  content={getContent(
                    topic.howToIdentify,
                    topic.howToIdentifyEn,
                    topic.howToIdentifyMm
                  )}
                />
              </section>
            )}

            {/* Self Help Section */}
            {(topic.selfHelp || topic.selfHelpEn || topic.selfHelpMm) && (
              <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="h-6 w-6 text-yellow-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  {t.selfHelp}
                </h2>
                <FormattedContent
                  content={getContent(
                    topic.selfHelp,
                    topic.selfHelpEn,
                    topic.selfHelpMm
                  )}
                />
              </section>
            )}

            {/* Remarks Section */}
            {topic.remark && (
              <section className="bg-yellow-50 rounded-2xl border border-yellow-200 p-6">
                <h2 className="text-xl font-semibold text-yellow-900 mb-4 flex items-center">
                  <svg
                    className="h-6 w-6 text-yellow-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  {t.remarks}
                </h2>
                <p className="text-yellow-800 leading-relaxed">
                  {topic.remark}
                </p>
              </section>
            )}
          </div>

          {/* Navigation */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              {t.backToHome}
            </Link>
          </div>
        </div>
      </main>
      <SOSBar />
    </div>
  );
}
