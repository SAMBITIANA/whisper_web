"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import {
  adminProposals,
  moderationStats,
  pipelineStatus,
  recentActivity,
} from "@/lib/fake-admin";
import { media, mediaKindLabels } from "@/lib/fake-data";

const kindOrder = ["VIDEO", "IMAGE", "SEQUENCE", "TRACK"] as const;

export default function AdminDashboardPage() {
  const pending = adminProposals.filter((item) => item.status === "PENDING");
  const total = media.length;

  const kpis = [
    { label: "Vues (7 j)", value: moderationStats.views },
    { label: "Réactions", value: moderationStats.reactions },
    { label: "En attente", value: String(moderationStats.pending) },
    { label: "Publiées", value: String(moderationStats.published) },
  ];

  return (
    <div className="space-y-14">
      <header className="border-b border-[var(--rule)] pb-7">
        <p className="eyebrow">Administration</p>
        <h1 className="display mt-4 text-[clamp(2rem,4vw,2.9rem)] leading-[1.04]">
          Tableau de bord
        </h1>
        <p className="mt-3 font-serif text-[14.5px] italic text-foreground/55">
          Semaine du 19 octobre — données de démonstration.
        </p>
      </header>

      <section>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-6 lg:grid-cols-4 lg:gap-x-8">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="border-t border-[var(--rule)] pt-4"
            >
              <dt className="eyebrow">{kpi.label}</dt>
              <dd className="display mt-2 text-[clamp(1.7rem,3vw,2.3rem)] leading-none">
                {kpi.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="grid gap-12 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <SectionHeading
            title="File de modération"
            note={`${pending.length} proposition${pending.length > 1 ? "s" : ""} à relire`}
            href="/admin/moderation"
            linkLabel="Tout relire"
          />
          <ul className="border-b border-[var(--rule)]">
            {pending.slice(0, 3).map((proposal) => (
              <li key={proposal.id} className="border-t border-[var(--rule)] py-4">
                <p className="display text-[17px] leading-snug">
                  «&nbsp;{proposal.quote}&nbsp;»
                </p>
                <p className="mt-2 text-[10.5px] uppercase tracking-[0.15em] text-foreground/40">
                  {proposal.author} · {proposal.source}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <SectionHeading title="Activité récente" note="Dernières actions" />
          <ul className="border-b border-[var(--rule)]">
            {recentActivity.map((activity) => (
              <li
                key={activity.text}
                className="border-t border-[var(--rule)] py-4"
              >
                <p className="text-[13px] leading-relaxed text-foreground/70">
                  {activity.text}
                </p>
                <p className="mt-1 font-mono text-[10px] text-foreground/35">
                  {activity.when}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-12 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <SectionHeading title="Répartition" note="Par format" />
          <ul className="space-y-4">
            {kindOrder.map((kind) => {
              const count = media.filter((item) => item.kind === kind).length;
              const ratio = Math.round((count / total) * 100);

              return (
                <li key={kind}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[12px] text-foreground/65">
                      {mediaKindLabels[kind]}
                    </span>
                    <span className="font-mono text-[10.5px] text-foreground/40">
                      {count} · {ratio}%
                    </span>
                  </div>
                  <div className="mt-2 h-px w-full bg-foreground/10">
                    <div
                      className="h-px bg-sage-300"
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <SectionHeading title="Pipeline" note="État des traitements" />
          <ul className="border-b border-[var(--rule)]">
            {pipelineStatus.map((job) => (
              <li
                key={job.label}
                className="flex items-baseline justify-between gap-4 border-t border-[var(--rule)] py-3.5"
              >
                <div>
                  <p className="text-[12.5px] text-foreground/70">
                    {job.label}
                  </p>
                  <p className="mt-0.5 text-[11px] text-foreground/40">
                    {job.note}
                  </p>
                </div>
                <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-foreground/45">
                  <span
                    aria-hidden
                    className={
                      job.value === "ok"
                        ? "size-1.5 rounded-full bg-sage-300"
                        : "size-1.5 rounded-full bg-foreground/25"
                    }
                  />
                  {job.value === "ok" ? "À jour" : "En attente"}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            <Link
              href="/admin/contenus/nouveau"
              className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-sage-600 dark:text-sage-100"
            >
              <span className="link-underline">Créer un contenu</span>
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/admin/sources"
              className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-foreground/55"
            >
              <span className="link-underline">Ajouter une source</span>
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
