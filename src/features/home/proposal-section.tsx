"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MediaPoster } from "@/components/media-poster";
import { useI18n } from "@/i18n/provider";
import type { ApiMedia } from "@/lib/api";
import { typography } from "@/lib/format";

export function ProposalSection({ items }: { items: ApiMedia[] }) {
  const { t } = useI18n();

  return (
        <section className="mt-12 border-y border-[var(--rule)] bg-paper-deep dark:bg-card">
          <div className="mx-auto grid w-full max-w-[1180px] gap-10 px-5 py-10 sm:px-8 md:grid-cols-[1.25fr_1fr] md:items-center">
            <div>
              <p className="eyebrow">{t("home.proposal.kicker")}</p>
              <h2 className="display mt-5 text-[clamp(1.8rem,3.4vw,2.75rem)] leading-[1.06] text-balance">
                {t("home.proposal.title")}
              </h2>
              <p className="mt-5 max-w-xl text-[14.5px] leading-relaxed text-foreground/60">
                {t("home.proposal.body")}
              </p>
              <Link
                href="/catalogue"
                className="group mt-8 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-sage-600 dark:text-sage-100"
              >
                <span className="link-underline">{t("home.proposal.action")}</span>
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="flex items-start justify-center gap-5">
              {items.map((song, index) => (
                <Link
                  key={song.slug}
                  href={`/citation/${song.slug}`}
                  className="group block w-[46%] max-w-[200px]"
                >
                  <div
                    className="paper-frame"
                    style={{
                      transform: `rotate(${index === 0 ? "-2.4deg" : "1.8deg"})`,
                    }}
                  >
                    <MediaPoster
                      kind={song.kind}
                      gradient={song.gradient}
                      durationSec={song.durationSec}
                      poster={song.poster}
                      showDuration={false}
                      showIcon={false}
                      className="aspect-square w-full"
                    />
                  </div>
                  <p className="mt-4 text-center font-serif text-[12.5px] italic text-foreground/65">
                    {typography(song.title)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
  );
}
