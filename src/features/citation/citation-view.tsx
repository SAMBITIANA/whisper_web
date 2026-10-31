"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FakePlayer } from "@/components/fake-player";
import { MediaCard } from "@/components/media-card";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { mediaKindKeys, sourceKindKeys } from "@/lib/catalogue";
import type { ApiMedia } from "@/lib/api";
import { formatDate, formatViews, typography } from "@/lib/format";
import { useI18n } from "@/i18n/provider";

export function CitationView({
  item,
  related,
}: {
  item: ApiMedia;
  related: ApiMedia[];
}) {
  const [frame, setFrame] = useState(0);
  const frames = item.images ?? [];

  useEffect(() => {
    if (frames.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setFrame((current) => (current + 1) % frames.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [frames.length]);

  const heroImage =
    frames[frame] ??
    item.poster ??
    item.source.poster ??
    "/media/carnet-riviere.jpg";
  const { t } = useI18n();

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

        <header className="mt-4 border-b border-[var(--rule)] pb-4">
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <p className="eyebrow">
              {t(mediaKindKeys[item.kind])} · {item.mood}
            </p>
            <h1 className="display max-w-4xl text-[clamp(1.4rem,2.6vw,2.05rem)] leading-[1.1] text-balance">
              {typography(item.title)}
            </h1>
          </div>
        </header>

        <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-8">
            <FakePlayer item={item} />
          </div>

          <aside className="space-y-8 lg:col-span-4">
            <div>
              <p className="eyebrow">{t("citation.source")}</p>
              <Link
                href={`/source/${item.source.slug}`}
                className="display link-underline mt-3 inline-block text-[24px] leading-tight"
              >
                {typography(item.source.title)}
              </Link>
              <p className="mt-2.5 text-[12.5px] leading-relaxed text-foreground/65">
                {t(sourceKindKeys[item.source.kind])}
                {item.source.author ? ` · ${typography(item.source.author)}` : ""}
                {item.source.character
                  ? ` · ${typography(item.source.character)}`
                  : ""}
                {item.source.locator ? ` · ${item.source.locator}` : ""}
                {item.source.year ? ` · ${item.source.year}` : ""}
              </p>
            </div>

            <figure>
              <div className="paper-frame">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={heroImage}
                    alt={t("citation.illustrationAlt", {
                      title: item.source.title,
                    })}
                    fill
                    sizes="(min-width: 1024px) 30vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
                <span className="eyebrow">{t("citation.illustration")}</span>
                <span className="eyebrow">{t("common.noExcerpt")}</span>
              </figcaption>
            </figure>

            <dl className="flex flex-wrap gap-x-8 gap-y-4 border-t border-[var(--rule)] pt-5">
              {[
                [`${formatViews(item.views)}`, t("common.views")],
                [`${formatViews(item.likes)}`, t("common.reactions")],
                [`${item.comments}`, t("common.comments")],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="display text-[19px] leading-none">{value}</dt>
                  <dd className="eyebrow mt-1.5">{label}</dd>
                </div>
              ))}
            </dl>

            <div className="border-t border-[var(--rule)] pt-5">
              <p className="eyebrow">{t("citation.publishedOn")}</p>
              <p className="display mt-2 text-[17px]">
                {formatDate(item.publishedAt)}
              </p>
            </div>

            <div className="border-t border-[var(--rule)] pt-5">
              <p className="eyebrow">{t("citation.topics")}</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {item.topics.map((topic) => (
                  <Link
                    key={topic}
                    href={`/catalogue?topic=${encodeURIComponent(topic)}`}
                    className="link-underline text-[13px] text-foreground/65 transition-colors hover:text-foreground"
                  >
                    {topic}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-[var(--rule)] pt-5">
              <Link
                href={`/source/${item.source.slug}`}
                className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-sage-600 dark:text-sage-100"
              >
                <span className="link-underline">{t("citation.viewSource")}</span>
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </aside>
        </div>

        <aside className="mt-14 grid gap-8 border-y border-[var(--rule)] py-9 md:grid-cols-[6rem_1fr] md:gap-14">
          <p className="eyebrow md:pt-1.5">{t("citation.noteLabel")}</p>
          <p className="font-serif text-[clamp(1.05rem,1.8vw,1.3rem)] leading-[1.55] text-pretty text-foreground/70">
            {t("citation.noteBody")}
          </p>
        </aside>

        {related.length > 0 ? (
          <section className="mt-16">
            <SectionHeading
              title={t("citation.relatedTitle")}
              note={
                related.length < 3
                  ? t("citation.relatedNext")
                  : t("citation.relatedSameTopics")
              }
            />
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((candidate) => (
                <MediaCard
                  key={candidate.slug}
                  item={candidate}
                  href={`/citation/${candidate.slug}`}
                />
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
