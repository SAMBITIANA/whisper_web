import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";

export const instant = false;
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FakePlayer } from "@/components/fake-player";
import { MediaCard } from "@/components/media-card";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { mediaKindLabels, sourceLabels } from "@/lib/catalogue";
import { fetchMediaBySlug, fetchRelated } from "@/lib/api";
import { formatDate, formatViews, typography } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connection();

  try {
    const item = await fetchMediaBySlug(slug);
    return {
      title: `${item.quote.fr} — Whispers`,
      description: `${item.source.title} · ${sourceLabels[item.source.kind]}`,
    };
  } catch {
    return { title: "Citation introuvable — Whispers" };
  }
}

export default async function CitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connection();

  let item;
  try {
    item = await fetchMediaBySlug(slug);
  } catch {
    notFound();
  }

  const related = await fetchRelated(slug, 3).catch(() => []);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[1180px] flex-1 px-5 py-6 sm:px-8 sm:py-8">
        <Link
          href="/catalogue"
          className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-foreground/60 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Retour au catalogue
        </Link>

        <header className="mt-4 border-b border-[var(--rule)] pb-4">
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <p className="eyebrow">
              {mediaKindLabels[item.kind]} · {item.mood}
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
              <p className="eyebrow">Source</p>
              <Link
                href={`/source/${item.source.slug}`}
                className="display link-underline mt-3 inline-block text-[24px] leading-tight"
              >
                {typography(item.source.title)}
              </Link>
              <p className="mt-2.5 text-[12.5px] leading-relaxed text-foreground/65">
                {sourceLabels[item.source.kind]}
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
                    src={item.poster || item.source.poster || "/media/carnet-riviere.jpg"}
                    alt={`Visuel d’illustration pour ${item.source.title}`}
                    fill
                    sizes="(min-width: 1024px) 30vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
                <span className="eyebrow">Image d’illustration</span>
                <span className="eyebrow">Aucun extrait de l’œuvre</span>
              </figcaption>
            </figure>

            <dl className="flex flex-wrap gap-x-8 gap-y-4 border-t border-[var(--rule)] pt-5">
              {[
                [`${formatViews(item.views)}`, "vues"],
                [`${formatViews(item.likes)}`, "réactions"],
                [`${item.comments}`, "commentaires"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="display text-[19px] leading-none">{value}</dt>
                  <dd className="eyebrow mt-1.5">{label}</dd>
                </div>
              ))}
            </dl>

            <div className="border-t border-[var(--rule)] pt-5">
              <p className="eyebrow">Publiée le</p>
              <p className="display mt-2 text-[17px]">
                {formatDate(item.publishedAt)}
              </p>
            </div>

            <div className="border-t border-[var(--rule)] pt-5">
              <p className="eyebrow">Sujets</p>
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
                <span className="link-underline">Voir la source</span>
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </aside>
        </div>

        <aside className="mt-14 grid gap-8 border-y border-[var(--rule)] py-9 md:grid-cols-[6rem_1fr] md:gap-14">
          <p className="eyebrow md:pt-1.5">Note</p>
          <p className="font-serif text-[clamp(1.05rem,1.8vw,1.3rem)] leading-[1.55] text-pretty text-foreground/70">
            Le texte est une couche superposée au média, jamais incrustée dans
            l’image. Il est traduit, validé par l’équipe éditoriale et
            remplaçable à la volée — c’est ce qui permet de lire la même
            citation dans plusieurs langues sans recharger le média.
          </p>
        </aside>

        {related.length > 0 ? (
          <section className="mt-16">
            <SectionHeading
              title="Citations liées"
              note={related.length < 3 ? "À lire ensuite" : "Dans les mêmes sujets"}
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
