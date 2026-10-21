import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MediaCard } from "@/components/media-card";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { typography } from "@/lib/format";
import {
  getMediaBySource,
  getSource,
  getSourcePoster,
  sourceLabels,
  sources,
} from "@/lib/fake-data";

export function generateStaticParams() {
  return sources.map((source) => ({ slug: source.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const source = getSource(slug);

  return {
    title: source
      ? `${source.title} — Whispers`
      : "Source introuvable — Whispers",
  };
}

export default async function SourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const source = getSource(slug);

  if (!source) {
    notFound();
  }

  const quotes = getMediaBySource(slug);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[1180px] flex-1 px-5 py-10 sm:px-8">
        <Link
          href="/catalogue"
          className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-foreground/45 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Retour au catalogue
        </Link>

        <header className="mt-8 border-b border-[var(--rule)] pb-9">
          <div className="grid gap-10 md:grid-cols-[1.35fr_1fr] md:items-start">
            <div>
              <p className="eyebrow">Source · {sourceLabels[source.kind]}</p>
              <h1 className="display mt-4 text-[clamp(2.2rem,4.6vw,3.5rem)] leading-[1.02] text-balance">
                {typography(source.title)}
              </h1>

              <dl className="mt-9 grid gap-x-10 gap-y-3 text-[13px] text-foreground/55 sm:grid-cols-2">
                <div className="flex justify-between gap-4 border-t border-[var(--rule)] pt-2">
                  <dt className="eyebrow">Auteur</dt>
                  <dd className="font-serif italic">
                    {source.author ?? "Non renseigné"}
                  </dd>
                </div>
                {source.year ? (
                  <div className="flex justify-between gap-4 border-t border-[var(--rule)] pt-2">
                    <dt className="eyebrow">Année</dt>
                    <dd className="font-mono text-[12px]">{source.year}</dd>
                  </div>
                ) : null}
                {source.character ? (
                  <div className="flex justify-between gap-4 border-t border-[var(--rule)] pt-2">
                    <dt className="eyebrow">Personnage</dt>
                    <dd className="font-serif italic">{source.character}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-4 border-t border-[var(--rule)] pt-2">
                  <dt className="eyebrow">Citations</dt>
                  <dd className="font-mono text-[12px]">{quotes.length}</dd>
                </div>
              </dl>
            </div>

            <figure>
              <div className="paper-frame">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={getSourcePoster(source.slug) ?? "/media/carnet-riviere.jpg"}
                    alt={`Visuel d’illustration pour ${source.title}`}
                    fill
                    sizes="(min-width: 768px) 38vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
                <span className="eyebrow">Visuel d’illustration</span>
                <span className="eyebrow">Aucun extrait de l’œuvre</span>
              </figcaption>
            </figure>
          </div>
        </header>

        <aside className="mt-10 grid gap-8 border-b border-[var(--rule)] pb-9 md:grid-cols-[6rem_1fr] md:gap-14">
          <p className="eyebrow md:pt-1.5">Crédit</p>
          <p className="max-w-2xl font-serif text-[clamp(1.02rem,1.7vw,1.22rem)] leading-[1.55] text-pretty text-foreground/65">
            Les citations sont courtes et créditées. Par défaut, aucun extrait
            de l’œuvre n’est reproduit : seule la citation est affichée, avec le
            lien vers la source et l’emplacement exact.
          </p>
        </aside>

        <section className="mt-16">
          <SectionHeading
            title="Citations de cette source"
            note={`${quotes.length} pièce${quotes.length > 1 ? "s" : ""}`}
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
