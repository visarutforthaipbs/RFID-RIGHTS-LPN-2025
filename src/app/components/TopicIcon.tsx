"use client";

import type { ComponentType } from "react";
import type { IconProps } from "@phosphor-icons/react";
import { IdentificationCard } from "@phosphor-icons/react/dist/ssr/IdentificationCard";
import { FileText } from "@phosphor-icons/react/dist/ssr/FileText";
import { Handshake } from "@phosphor-icons/react/dist/ssr/Handshake";
import { HandCoins } from "@phosphor-icons/react/dist/ssr/HandCoins";
import { FirstAid } from "@phosphor-icons/react/dist/ssr/FirstAid";
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr/ShieldCheck";
import { LinkBreak } from "@phosphor-icons/react/dist/ssr/LinkBreak";
import { GraduationCap } from "@phosphor-icons/react/dist/ssr/GraduationCap";
import { Baby } from "@phosphor-icons/react/dist/ssr/Baby";
import { HandPalm } from "@phosphor-icons/react/dist/ssr/HandPalm";
import { NotePencil } from "@phosphor-icons/react/dist/ssr/NotePencil";
import { Heartbeat } from "@phosphor-icons/react/dist/ssr/Heartbeat";
import { Scales } from "@phosphor-icons/react/dist/ssr/Scales";
import { UsersFour } from "@phosphor-icons/react/dist/ssr/UsersFour";
import { getTopicIconName, getCategoryIconName, type TopicIconName } from "../../../lib/topic-icons";

const ICONS: Record<TopicIconName, ComponentType<IconProps>> = {
  "identification-card": IdentificationCard,
  "file-text": FileText,
  handshake: Handshake,
  "hand-coins": HandCoins,
  "first-aid": FirstAid,
  "shield-check": ShieldCheck,
  "link-break": LinkBreak,
  "graduation-cap": GraduationCap,
  baby: Baby,
  "hand-palm": HandPalm,
  "note-pencil": NotePencil,
  heartbeat: Heartbeat,
  scales: Scales,
  "users-four": UsersFour,
};

/**
 * Topic pictogram: Phosphor duotone, second layer painted #FFC314 (see
 * `.duo-accent` in globals.css). ≥ 32 px, always next to the topic word.
 */
export function TopicIcon({ topic, size = 48, className = "" }: { topic: string; size?: number; className?: string }) {
  const Icon = ICONS[getTopicIconName(topic)];
  return (
    <span className={`duo-accent inline-flex text-label ${className}`.trim()} aria-hidden="true">
      <Icon size={size} weight="duotone" />
    </span>
  );
}

/** Small regular-weight icon for the neutral category badge (never duotone inside a badge). */
export function CategoryIcon({ category, size = 16 }: { category: string; size?: number }) {
  const Icon = ICONS[getCategoryIconName(category)];
  return <Icon size={size} weight="regular" aria-hidden="true" />;
}
