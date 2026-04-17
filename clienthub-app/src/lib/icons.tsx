import type { ComponentType } from 'react';

/* ── PNG-based service icon components ── */

function makeIconComponent(src: string, extraClass?: string): ComponentType<{ className?: string }> {
  return function IconComponent({ className }: { className?: string }) {
    return <img src={src} alt="" className={`${className ?? ''} ${extraClass ?? ''}`} draggable={false} />;
  };
}

const AdverityIcon = makeIconComponent('/icons/adverity.png');
const AirFlowIcon = makeIconComponent('/icons/airflow.png');
const GA4Icon = makeIconComponent('/icons/ga4.png');
const GitHubIcon = makeIconComponent('/icons/github.png', 'dark:invert');
const GoogleCloudIcon = makeIconComponent('/icons/google-cloud.png');
const RecruitsIcon = makeIconComponent('/icons/recruits.png');

/* ── Options (alphabetical) ── */

export const ICON_OPTIONS = [
  { value: 'adverity', label: 'Adverity' },
  { value: 'airflow', label: 'AirFlow' },
  { value: 'ga4', label: 'GA4' },
  { value: 'github', label: 'GitHub' },
  { value: 'google-cloud', label: 'Google Cloud' },
  { value: 'recruits', label: 'Recruits' },
] as const;

export const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  'adverity': AdverityIcon,
  'airflow': AirFlowIcon,
  'ga4': GA4Icon,
  'github': GitHubIcon,
  'google-cloud': GoogleCloudIcon,
  'recruits': RecruitsIcon,
};

export function getIcon(name: string): ComponentType<{ className?: string }> {
  return ICON_MAP[name] || GitHubIcon;
}

/* ── Per-icon brand colors ── */

export const ICON_BORDER_MAP: Record<string, string> = {
  'adverity': 'border-indigo-400 dark:border-indigo-500',
  'airflow': 'border-emerald-400 dark:border-emerald-500',
  'ga4': 'border-amber-400 dark:border-amber-500',
  'github': 'border-slate-400 dark:border-slate-500',
  'google-cloud': 'border-blue-400 dark:border-blue-500',
  'recruits': 'border-cyan-400 dark:border-cyan-500',
};

export const ICON_GLOW_MAP: Record<string, string> = {
  'adverity': 'shadow-[inset_0_0_28px_rgba(165,180,252,0.25)] dark:shadow-[inset_0_0_28px_rgba(129,140,248,0.3)]',
  'airflow': 'shadow-[inset_0_0_28px_rgba(110,231,183,0.25)] dark:shadow-[inset_0_0_28px_rgba(52,211,153,0.3)]',
  'ga4': 'shadow-[inset_0_0_28px_rgba(252,211,77,0.25)] dark:shadow-[inset_0_0_28px_rgba(245,158,11,0.3)]',
  'github': 'shadow-[inset_0_0_28px_rgba(148,163,184,0.25)] dark:shadow-[inset_0_0_28px_rgba(100,116,139,0.3)]',
  'google-cloud': 'shadow-[inset_0_0_28px_rgba(96,165,250,0.25)] dark:shadow-[inset_0_0_28px_rgba(59,130,246,0.3)]',
  'recruits': 'shadow-[inset_0_0_28px_rgba(103,232,249,0.25)] dark:shadow-[inset_0_0_28px_rgba(34,211,238,0.3)]',
};
