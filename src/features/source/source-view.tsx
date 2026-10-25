"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MediaCard } from "@/components/media-card";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { sourceKindKeys } from "@/lib/catalogue";
import type { ApiMedia, ApiSource } from "@/lib/api";
import { typography } from "@/lib/format";
import { useI18n } from "@/i18n/provider";

export function SourceView({
  source,
}: {
  source: ApiSource & { media: ApiMedia[] };
}) {
  const { t } = useI18n();
  const quotes = source.media;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[1180px] flex-1 px-5 py-6 sm:px-8 sm:py-8">
        <Link
          href="/catalogue"
          className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-foreground/60 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          {t("common.backToCatalogue")}
        </Link>

        <header className="mt-4 border-b border-[var(--rule)] pb-5">
          <div className="grid gap-6 md:grid-cols-[1.35fr_1fr] md:items-start">
            <div>
              <p className="eyebrow">
                {t("source.label", { kind: t(sourceKindKeys[source.kind]) })}
              </p>
              <h1 className="display mt-1.5 text-[clamp(1.5rem,2.8vw,2.15rem)] leading-[1.08] text-balance">
                {typography(source.title)}
              </h1>

              <dl className="mt-4 grid gap-x-10 gap-y-2 text-[13px] text-foreground/60 sm:grid-cols-2">
                <div className="flex justify-between gap-4 border-t border-[var(--rule)] pt-2">
                  <dt className="eyebrow">{t("source.author")}</dt>
                  <dd className="font-serif italic">
                    {source.author ?? t("common.notProvided")}
                  </dd>
                </div>
                {source.year ? (
                  <div className="flex justify-between gap-4 border-t border-[var(--rule)] pt-2">
                    <dt className="eyebrow">{t("source.year")}</dt>
                    <dd className="font-mono text-[12px]">{source.year}</dd>
                  </div>
                ) : null}
                {source.character ? (
                  <div className="flex justify-between gap-4 border-t border-[var(--rule)] pt-2">
                    <dt className="eyebrow">{t("source.character")}</dt>
                    <dd className="font-serif italic">{source.character}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-4 border-t border-[var(--rule)] pt-2">
                  <dt className="eyebrow">{t("source.quotes")}</dt>
                  <dd className="font-mono text-[12px]">{quotes.length}</dd>
                </div>
              </dl>
            </div>

            <figure>
              <div className="paper-frame">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={source.poster ?? "/media/carnet-riviere.jpg"}
                    alt={t("source.illustrationAlt", { title: source.title })}
                    fill
                    sizes="(min-width: 768px) 38vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
                <span className="eyebrow">{t("common.illustration")}</span>
                <span className="eyebrow">{t("common.noExcerpt")}</span>
              </figcaption>
            </figure>
          </div>
        </header>

        <aside className="mt-10 grid gap-8 border-b border-[var(--rule)] pb-9 md:grid-cols-[6rem_1fr] md:gap-14">
          <p className="eyebrow md:pt-1.5">{t("source.creditLabel")}</p>
          <p className="max-w-2xl font-serif text-[clamp(1.02rem,1.7vw,1.22rem)] leading-[1.55] text-pretty text-foreground/65">
            {t("source.creditBody")}
          </p>
        </aside>

        <section className="mt-16">
          <SectionHeading
            title={t("source.quotesTitle")}
            note={t(
              quotes.length === 1 ? "source.piece" : "source.pieces",
              { count: quotes.length },
            )}
          />
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {quotes.map((item) => (
              <MediaCard
                key={item.slug}
                item={item}
                href={`/citation/${item.slug}`}
              />
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
