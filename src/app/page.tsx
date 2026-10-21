import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MediaCard } from "@/components/media-card";
import { MediaPoster } from "@/components/media-poster";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getQuote,
  languages,
  media,
  mediaKindLabels,
  moods,
  topics,
} from "@/lib/fake-data";
import {
  formatDate,
  formatDuration,
  formatViews,
  typography,
} from "@/lib/format";

const formats = [
  ["Vidéo", "Diffusion HLS, qualité adaptative, sous-titres traduisibles."],
  ["Image", "Dérivés responsives WebP et AVIF, texte en surimpression."],
  ["Galerie", "Succession d’images, format story, rythme réglable."],
  ["Chanson", "Paroles synchronisées, traduction ligne à ligne."],
] as const;

function delay(ms: number): CSSProperties {
  return { "--rise-delay": `${ms}ms` } as CSSProperties;
}

export default function HomePage() {
  const featured = media.find((item) => item.featured) ?? media[0];
  const trending = [...media].sort((a, b) => b.likes - a.likes).slice(0, 3);
  const fresh = [...media]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 4);
  const songs = media.filter((item) => item.kind === "TRACK").slice(0, 2);
  const formatCount = new Set(media.map((item) => item.kind)).size;
  const community = media.filter((item) => item.community);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section>
          <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8">
            <div className="flex items-center justify-between border-b border-[var(--rule)] py-4">
              <p className="eyebrow rise">Nº 07 — La citation du jour</p>
              <p className="eyebrow rise hidden sm:block" style={delay(60)}>
                {formatDate(featured.publishedAt)}
              </p>
            </div>

            <div className="grid gap-14 py-14 lg:grid-cols-12 lg:gap-16 lg:py-24">
              <div className="lg:col-span-7">
                <p className="eyebrow rise">Le mot du jour</p>

                <blockquote
                  className="display hanging rise mt-7 text-[clamp(2.1rem,4.7vw,4rem)] leading-[1.03] text-balance"
                  style={delay(80)}
                >
                  <span className="text-sage-500">«</span>
                  {"\u00a0"}
                  {getQuote(featured, "fr")}
                  {"\u00a0"}
                  <span className="text-sage-500">»</span>
                </blockquote>

                <div
                  className="rise mt-9 flex items-start gap-4"
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
                    <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-foreground/45">
                      {typography(featured.source.title)}
                      {featured.source.year ? ` · ${featured.source.year}` : ""}
                      {featured.source.locator
                        ? ` · ${featured.source.locator}`
                        : ""}
                    </p>
                  </div>
                </div>

                <div
                  className="rise mt-10 flex flex-wrap items-center gap-x-8 gap-y-3"
                  style={delay(240)}
                >
                  <Link
                    href={`/citation/${featured.slug}`}
                    className="group inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-sage-700 dark:text-sage-100"
                  >
                    <span className="link-underline">Lire la citation</span>
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/catalogue"
                    className="group inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-foreground/55 transition-colors hover:text-foreground"
                  >
                    <span className="link-underline">Explorer le catalogue</span>
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </div>

                <dl
                  className="rise mt-14 flex flex-wrap items-baseline gap-x-10 gap-y-4 border-t border-[var(--rule)] pt-6"
                  style={delay(320)}
                >
                  {[
                    { value: media.length, label: "pièces" },
                    { value: formatCount, label: "formats" },
                    { value: languages.length, label: "langues" },
                    { value: formatViews(featured.views), label: "vues" },
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
                    {mediaKindLabels[featured.kind]} ·{" "}
                    {formatDuration(featured.durationSec)}
                  </span>
                  <span className="eyebrow">{featured.mood}</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1180px] px-5 pt-6 sm:px-8">
          <SectionHeading
            index="01"
            title="En ce moment"
            note="Les plus aimées cette semaine"
            href="/catalogue?sort=popular"
          />

          <ol className="border-b border-[var(--rule)]">
            {trending.map((item, index) => (
              <li key={item.slug}>
                <Link
                  href={`/citation/${item.slug}`}
                  className="group grid grid-cols-[1.5rem_5.5rem_1fr] items-center gap-x-5 gap-y-4 border-t border-[var(--rule)] py-5 md:grid-cols-[2rem_7rem_1fr_auto] md:gap-x-7"
                >
                  <span className="font-mono text-[10px] text-foreground/35">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <MediaPoster
                    kind={item.kind}
                    gradient={item.gradient}
                    durationSec={item.durationSec}
                    poster={item.poster}
                    showDuration={false}
                    showIcon={false}
                    className="aspect-[3/2] w-full"
                  />

                  <div>
                    <p className="display text-[19px] leading-[1.28] text-balance">
                      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
                        «&nbsp;{getQuote(item, "fr")}&nbsp;»
                      </span>
                    </p>
                    <p className="mt-1.5 text-[10.5px] uppercase tracking-[0.15em] text-foreground/45">
                      {typography(item.source.title)}
                      {item.source.character
                        ? ` · ${typography(item.source.character)}`
                        : ""}
                    </p>
                  </div>

                  <span className="hidden font-mono text-[10.5px] text-foreground/35 md:block">
                    {formatViews(item.likes)} ♥
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto w-full max-w-[1180px] px-5 pt-20 sm:px-8">
          <SectionHeading
            index="02"
            title="Par humeur"
            note="Trouver la citation qui correspond au moment"
          />

          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-4">
            {moods.map((mood) => (
              <Link
                key={mood}
                href={`/catalogue?mood=${encodeURIComponent(mood)}`}
                className="display link-underline text-[clamp(1.5rem,3vw,2.25rem)] leading-none text-foreground/70 transition-colors hover:text-foreground"
              >
                {mood}
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[var(--rule)] pt-6">
            <span className="eyebrow">Sujets</span>
            {topics.map((topic) => (
              <Link
                key={topic}
                href={`/catalogue?topic=${encodeURIComponent(topic)}`}
                className="link-underline text-[12.5px] text-foreground/60 transition-colors hover:text-foreground"
              >
                {topic}
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1180px] px-5 pt-20 sm:px-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--rule)] pb-3">
            <p className="eyebrow">Carnet de repérages</p>
            <p className="eyebrow">Images d’illustration</p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-12 sm:items-start sm:gap-6">
            <figure className="col-span-2 sm:col-span-5">
              <div className="paper-frame">
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src="/media/carnet-riviere.jpg"
                    alt="Rivière brumeuse traversée par un pêcheur"
                    fill
                    sizes="(min-width: 640px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between">
                <span className="whitespace-nowrap text-[9px] uppercase tracking-[0.12em] text-foreground/45 sm:text-[11px] sm:tracking-[0.19em]">La rivière, 6 h 40</span>
                <span className="hidden font-mono text-[9.5px] text-foreground/30 sm:block">01</span>
              </figcaption>
            </figure>

            <figure className="sm:col-span-4 sm:mt-20">
              <div className="paper-frame">
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src="/media/carnet-atelier.jpg"
                    alt="Intérieur d’un atelier, vestes et cadres aux murs"
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between">
                <span className="whitespace-nowrap text-[9px] uppercase tracking-[0.12em] text-foreground/45 sm:text-[11px] sm:tracking-[0.19em]">L’atelier, après-midi</span>
                <span className="hidden font-mono text-[9.5px] text-foreground/30 sm:block">02</span>
              </figcaption>
            </figure>

            <figure className="sm:col-span-3 sm:mt-6">
              <div className="paper-frame">
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src="/media/carnet-vallee.jpg"
                    alt="Vallée de Yosemite vue depuis la rivière"
                    fill
                    sizes="(min-width: 640px) 25vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between">
                <span className="whitespace-nowrap text-[9px] uppercase tracking-[0.12em] text-foreground/45 sm:text-[11px] sm:tracking-[0.19em]">La vallée, fin d’été</span>
                <span className="hidden font-mono text-[9.5px] text-foreground/30 sm:block">03</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1180px] px-5 pt-20 sm:px-8">
          <SectionHeading
            index="03"
            title="Dernières parutions"
            note="Publiées par l’équipe éditoriale"
            href="/catalogue"
          />

          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {fresh.map((item) => (
              <MediaCard
                key={item.slug}
                item={item}
                href={`/citation/${item.slug}`}
              />
            ))}
          </div>
        </section>

        <aside className="mx-auto mt-20 w-full max-w-[1180px] px-5 sm:px-8">
          <div className="grid gap-10 border-y border-[var(--rule)] py-10 md:grid-cols-[6rem_1fr] md:gap-14">
            <p className="eyebrow md:pt-2">Note</p>
            <p className="font-serif text-[clamp(1.15rem,2vw,1.5rem)] leading-[1.5] text-pretty text-foreground/75">
              Le texte n’est jamais gravé dans l’image&nbsp;: il reste une couche
              séparée, posée par-dessus la vidéo, l’image ou la chanson. C’est ce
              qui permet de le lire dans sa langue, de le changer en cours de
              lecture et de le partager tel quel — sans retoucher le média.
            </p>
          </div>
        </aside>

        <section className="mt-20 border-y border-gold/60 bg-paper-deep dark:border-gold/40 dark:bg-card">
          <div className="mx-auto grid w-full max-w-[1180px] gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.25fr_1fr] md:items-center">
            <div>
              <p className="eyebrow">Proposition</p>
              <h2 className="display mt-5 text-[clamp(1.8rem,3.4vw,2.75rem)] leading-[1.06] text-balance">
                Une phrase qui vous marque&nbsp;? Confiez-la à l’équipe.
              </h2>
              <p className="mt-5 max-w-xl text-[14.5px] leading-relaxed text-foreground/60">
                Chaque proposition est analysée automatiquement — doublons, ton,
                attribution — puis relue par un administrateur avant publication.
                La citation courte, le crédit et le lien vers la source restent
                obligatoires.
              </p>
              <Link
                href="/catalogue"
                className="group mt-8 inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-[11px] uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-primary/85"
              >
                Proposer une citation
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="flex items-start justify-center gap-5">
              {songs.map((song, index) => (
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
                  <p className="mt-4 text-center font-serif text-[12.5px] italic text-foreground/55">
                    {typography(song.title)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1180px] px-5 pt-20 sm:px-8">
          <SectionHeading index="04" title="Quatre matières" note="Un même texte, quatre façons de le porter" />

          <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {formats.map(([title, description], index) => (
              <div key={title} className="border-t border-[var(--rule)] pt-4">
                <span className="font-mono text-[10px] text-foreground/35">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <dt className="display mt-3 text-[20px] leading-none">
                  {title}
                </dt>
                <dd className="mt-2.5 text-[12.5px] leading-relaxed text-foreground/55">
                  {description}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {community.length > 0 ? (
          <section className="mx-auto w-full max-w-[1180px] px-5 pt-20 sm:px-8">
            <SectionHeading
              index="05"
              title="De la communauté"
              note="En attente de relecture"
            />
            <ul className="border-b border-[var(--rule)]">
              {community.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/citation/${item.slug}`}
                    className="group grid grid-cols-[6rem_1fr] items-center gap-x-6 border-t border-[var(--rule)] py-5 sm:grid-cols-[9rem_1fr_9rem]"
                  >
                    <MediaPoster
                      kind={item.kind}
                      gradient={item.gradient}
                      durationSec={item.durationSec}
                      poster={item.poster}
                      showDuration={false}
                      showIcon={false}
                      className="aspect-[4/3] w-full"
                    />
                    <div>
                      <p className="display text-[18px] leading-[1.3] text-balance">
                        <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
                          «&nbsp;{getQuote(item, "fr")}&nbsp;»
                        </span>
                      </p>
                      <p className="mt-2 text-[10.5px] uppercase tracking-[0.15em] text-foreground/45">
                        {typography(item.source.title)} ·{" "}
                        {mediaKindLabels[item.kind]}
                      </p>
                    </div>
                    <p className="hidden text-right font-serif text-[13px] italic text-foreground/40 sm:block">
                      En relecture
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
