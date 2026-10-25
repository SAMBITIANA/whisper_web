"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Eye,
  Heart,
  Inbox,
} from "lucide-react";
import { cn } from "cn";
import { mediaKindKeys } from "@/lib/catalogue";
import { type MessageKey } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { formatDate } from "@/lib/format";
import {
  fetchAdminDashboard,
  fetchAdminProposals,
  type ApiAdminDashboard,
  type ApiProposal,
} from "@/lib/api";

const kindOrder = ["VIDEO", "IMAGE", "SEQUENCE", "TRACK"] as const;

const activityActionKeys: Record<string, MessageKey> = {
  "media.publish": "admin.activity.mediaPublish",
  "media.update": "admin.activity.mediaUpdate",
  "media.delete": "admin.activity.mediaDelete",
  "proposal.approve": "admin.activity.proposalApprove",
  "proposal.reject": "admin.activity.proposalReject",
  "proposal.update": "admin.activity.proposalUpdate",
  "translation.create": "admin.activity.translationCreate",
  "source.create": "admin.activity.sourceCreate",
  "source.update": "admin.activity.sourceUpdate",
  "user.update": "admin.activity.userUpdate",
  "settings.update": "admin.activity.settingsUpdate",
  "auth.login": "admin.activity.authLogin",
};

type Translate = (
  key: MessageKey,
  variables?: Record<string, string | number>,
) => string;

type DashboardActivity = ApiAdminDashboard["activity"][number];
type Tone = "sage" | "amber";

export default function AdminDashboardPage() {
  const { t } = useI18n();
  const [dashboard, setDashboard] = useState<ApiAdminDashboard | null>(null);
  const [pending, setPending] = useState<ApiProposal[]>([]);

  useEffect(() => {
    void Promise.all([
      fetchAdminDashboard(),
      fetchAdminProposals(),
    ]).then(([data, proposals]) => {
      setDashboard(data);
      setPending(proposals.filter((proposal) => proposal.status === "PENDING"));
    });
  }, []);

  if (!dashboard) {
    return (
      <div className="space-y-3">
        <div className="h-20 animate-pulse rounded-lg bg-foreground/5" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-lg bg-foreground/5"
            />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-72 animate-pulse rounded-lg bg-foreground/5" />
          <div className="h-72 animate-pulse rounded-lg bg-foreground/5" />
        </div>
      </div>
    );
  }

  const total = dashboard.stats.media;

  const kpis: {
    label: string;
    value: string;
    icon: typeof Eye;
    tone: Tone;
  }[] = [
    {
      label: t("admin.views"),
      value: dashboard.stats.views.toLocaleString("fr-FR"),
      icon: Eye,
      tone: "sage",
    },
    {
      label: t("admin.reactions"),
      value: dashboard.stats.reactions.toLocaleString("fr-FR"),
      icon: Heart,
      tone: "sage",
    },
    {
      label: t("admin.pending"),
      value: String(dashboard.stats.pending),
      icon: Clock3,
      tone: dashboard.stats.pending > 0 ? "amber" : "sage",
    },
    {
      label: t("admin.published"),
      value: String(dashboard.stats.published),
      icon: CheckCircle2,
      tone: "sage",
    },
  ];

  return (
    <div className="space-y-3">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-[26px]">
            {t("admin.dashboard")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("admin.overview")}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--rule)] bg-card px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
          <span
            aria-hidden
            className="size-2 rounded-full bg-sage-600 dark:bg-sage-300"
          />
          {t("admin.data")}
        </span>
      </header>

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;

          return (
            <div
              key={kpi.label}
              className="rounded-lg border border-[var(--rule)] bg-card p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <dt className="text-xs font-medium text-muted-foreground">
                    {kpi.label}
                  </dt>
                  <dd className="mt-1.5 text-[24px] font-semibold leading-none tracking-tight tabular-nums text-foreground">
                    {kpi.value}
                  </dd>
                </div>
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-md",
                    kpi.tone === "amber"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "bg-sage-600/10 text-sage-600 dark:bg-sage-300/10 dark:text-sage-300",
                  )}
                >
                  <Icon aria-hidden className="size-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </dl>

      <section className="grid gap-3 lg:grid-cols-2">
        <Card>
          <PanelHeading
            title={t("admin.moderationQueue")}
            description={t(
              pending.length === 1
                ? "admin.toReview"
                : "admin.toReviewPlural",
              { count: pending.length },
            )}
            href="/admin/moderation"
            linkLabel={t("admin.reviewAll")}
          />
          {pending.length === 0 ? (
            <div className="mt-4 flex flex-col items-center justify-center rounded-md border border-dashed border-[var(--rule-strong)] px-4 py-8 text-center">
              <Inbox aria-hidden className="size-5 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium text-foreground">
                {t("admin.noPending")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("admin.queueEmpty")}
              </p>
            </div>
          ) : (
            <ul className="mt-3 divide-y divide-[var(--rule)]">
              {pending.slice(0, 3).map((proposal) => (
                <li key={proposal.id} className="py-2.5 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-2.5">
                    <span
                      aria-hidden
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500"
                    />
                    <div className="min-w-0">
                      <p className="text-[13.5px] leading-6 text-foreground">
                        «&nbsp;{proposal.quote}&nbsp;»
                      </p>
                      <p className="mt-1 text-[11.5px] leading-5 text-muted-foreground">
                        {proposal.author} · {proposal.source}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <PanelHeading
            title={t("admin.recentActivity")}
            description={t("admin.recentActivityNote")}
          />
          {dashboard.activity.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              {t("admin.noRecentActivity")}
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-[var(--rule)]">
              {dashboard.activity.slice(0, 3).map((activity) => {
                const { actor, description } = activitySentence(activity, t);

                return (
                  <li
                    key={activity.id}
                    className="flex gap-3 py-2.5 first:pt-0 last:pb-0"
                  >
                    <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                      {initialsOf(actor)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] leading-5 text-foreground">
                        <span className="font-medium">{actor}</span>{" "}
                        <span className="text-muted-foreground">
                          {description}
                        </span>
                      </p>
                      <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                        {formatRelativeTime(activity.when, t)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </section>

      <section className="grid gap-3 lg:grid-cols-2">
        <Card className="flex flex-col">
          <PanelHeading
            title={t("admin.distribution")}
            description={t("admin.distributionNote")}
          />
          <ul className="mt-3 space-y-2.5">
            {kindOrder.map((kind) => {
              const count =
                dashboard.distribution.find((item) => item.kind === kind)
                  ?.count ?? 0;
              const ratio = total > 0 ? Math.round((count / total) * 100) : 0;

              return (
                <li key={kind}>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[13px] text-foreground">
                      {t(mediaKindKeys[kind])}
                    </span>
                    <span className="text-[11px] tabular-nums text-muted-foreground">
                      {count} · {ratio}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-sage-600 dark:bg-sage-300"
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-auto flex items-center justify-between border-t border-[var(--rule)] pt-3">
            <span className="text-xs text-muted-foreground">{t("admin.total")}</span>
            <span className="text-xs font-medium tabular-nums text-foreground">
              {t(total === 1 ? "admin.totalContent" : "admin.totalContents", {
                count: total,
              })}
            </span>
          </div>
        </Card>

        <Card className="flex flex-col">
          <PanelHeading
            title={t("admin.pipeline")}
            description={t("admin.pipelineNote")}
          />
          <ul className="mt-3 divide-y divide-[var(--rule)]">
            {dashboard.pipeline.map((job) => (
              <li
                key={job.label}
                className="flex items-start justify-between gap-4 py-1.5 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-foreground">
                    {job.label}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {job.note}
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium",
                    job.value === "ok"
                      ? "bg-sage-600/10 text-sage-600 dark:bg-sage-300/10 dark:text-sage-300"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "size-1.5 rounded-full",
                      job.value === "ok"
                        ? "bg-sage-600 dark:bg-sage-300"
                        : "bg-amber-500",
                    )}
                  />
                  {job.value === "ok" ? t("admin.upToDate") : t("admin.pending")}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap gap-2 border-t border-[var(--rule)] pt-2.5">
            <Link
              href="/admin/contenus/nouveau"
              className="inline-flex items-center gap-1.5 rounded-md bg-sage-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-sage-900 dark:bg-sage-300 dark:text-sage-900 dark:hover:bg-sage-100"
            >
              {t("admin.createContent")}
              <ArrowRight aria-hidden className="size-3.5" />
            </Link>
            <Link
              href="/admin/sources"
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--rule-strong)] px-3 py-2 text-xs font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
            >
              {t("admin.addSource")}
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}

function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[var(--rule)] bg-card p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

function PanelHeading({
  title,
  description,
  href,
  linkLabel,
}: {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-sage-600 transition-colors hover:text-sage-900 dark:text-sage-100 dark:hover:text-sage-300"
        >
          {linkLabel ?? t("common.seeAll")}
          <ArrowRight
            aria-hidden
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      ) : null}
    </div>
  );
}

function activitySentence(entry: DashboardActivity, t: Translate) {
  const [actor, ...rest] = entry.text.split(" · ");
  const key = entry.action ? activityActionKeys[entry.action] : undefined;

  return {
    actor: actor || t("admin.system"),
    description: key
      ? t(key)
      : rest.join(" · ") || t("admin.defaultAction"),
  };
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatRelativeTime(isoDate: string, t: Translate): string {
  const timestamp = new Date(isoDate).getTime();

  if (Number.isNaN(timestamp)) return isoDate;

  const minutes = Math.round((Date.now() - timestamp) / 60_000);

  if (minutes < 1) return t("admin.time.justNow");
  if (minutes < 60) return t("admin.time.minutes", { count: minutes });

  const hours = Math.round(minutes / 60);

  if (hours < 24) return t("admin.time.hours", { count: hours });

  const days = Math.round(hours / 24);

  if (days === 1) return t("admin.time.yesterday");
  if (days < 7) return t("admin.time.days", { count: days });

  return formatDate(isoDate);
}
