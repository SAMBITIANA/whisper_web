"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LocalizedQuote } from "@/components/localized-quote";

import { MediaPoster } from "@/components/media-poster";
import { mediaKindKeys } from "@/lib/catalogue";
import { useI18n } from "@/i18n/provider";
import type { ApiHome, ApiMedia } from "@/lib/api";
import { formatDate, formatDuration, formatViews, typography } from "@/lib/format";

function delay(ms: number): CSSProperties {
  return { "--rise-delay": `${ms}ms` } as CSSProperties;
}

export function FeaturedSection({
  featured,
  stats,
  languages,
}: {
  featured: ApiMedia;
  stats: ApiHome["stats"];
  languages: ApiHome["languages"];
}) {
  const { t } = useI18n();

  return (
        <section>
          <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8">
            <div className="flex items-center justify-between border-b border-[var(--rule)] py-4">
              <p className="eyebrow rise">{t("home.featured.index")}</p>
              <p className="eyebrow rise hidden sm:block" style={delay(60)}>
                {formatDate(featured.publishedAt)}
              </p>
            </div>

            <div className="grid gap-10 py-8 lg:grid-cols-12 lg:gap-14 lg:py-12">
              <div className="lg:col-span-7">
                <p className="eyebrow rise">{t("home.featured.kicker")}</p>

                <blockquote
                  className="display hanging rise mt-4 text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.05] text-balance"
                  style={delay(80)}
                >
                  <span className="text-sage-300">«</span>
                  {"\u00a0"}
                  <LocalizedQuote item={featured} />
                  {"\u00a0"}
                  <span className="text-sage-300">»</span>
                </blockquote>

                <div
                  className="rise mt-5 flex items-start gap-4"
                  style={delay(160)}
                >
                  <span aria-hidden className="mt-3 h-px w-10 bg-ink/30" />
                  <div>
                    <p className="font-serif text-[17px] italic text-foreground/80">
                      {typography(
                        featured.source.character ??
                          featured.source.author ??
                          "",
                      )}
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-foreground/60">
                      {typography(featured.source.title)}
                      {featured.source.year ? ` · ${featured.source.year}` : ""}
                      {featured.source.locator
                        ? ` · ${featured.source.locator}`
                        : ""}
                    </p>
                  </div>
                </div>

                <div
                  className="rise mt-6 flex flex-wrap items-center gap-x-8 gap-y-3"
                  style={delay(240)}
                >
                  <Link
                    href={`/citation/${featured.slug}`}
                    className="group inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-sage-600 dark:text-sage-100"
                  >
                    <span className="link-underline">{t("home.featured.read")}</span>
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/catalogue"
                    className="group inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-foreground/65 transition-colors hover:text-foreground"
                  >
                    <span className="link-underline">{t("home.featured.explore")}</span>
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </div>

                <dl
                  className="rise mt-8 flex flex-wrap items-baseline gap-x-10 gap-y-4 border-t border-[var(--rule)] pt-6"
                  style={delay(320)}
                >
                  {[
                    { value: stats.media, label: t("home.stats.pieces") },
                    { value: stats.formats, label: t("home.stats.formats") },
                    { value: languages.length, label: t("home.stats.languages") },
                    { value: formatViews(featured.views), label: t("home.stats.views") },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-baseline gap-2">
                      <dt className="display text-[22px] leading-none">
                        {stat.value}
                      </dt>
                      <dd className="eyebrow">{stat.label}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <figure
                className="rise lg:col-span-5"
                style={delay(120)}
              >
                <div className="paper-frame rotate-sheet">
                  <MediaPoster
                    kind={featured.kind}
                    gradient={featured.gradient}
                    durationSec={featured.durationSec}
                    poster={featured.poster}
                    showIcon={false}
                    priority
                    className="aspect-[4/5] w-full"
                  />
                </div>
                <figcaption className="mt-5 flex items-center justify-between">
                  <span className="eyebrow">
                    {t(mediaKindKeys[featured.kind])} ·{" "}
                    {formatDuration(featured.durationSec)}
                  </span>
                  <span className="eyebrow">{featured.mood}</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>
  );
}
