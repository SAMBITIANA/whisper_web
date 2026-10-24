import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function AuthShell({
  children,
  quote,
  attribution,
  source,
  image,
  imageAlt,
}: {
  children: React.ReactNode;
  quote: string;
  attribution: string;
  source: string;
  image: string;
  imageAlt: string;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <aside className="relative hidden flex-col border-r border-[var(--rule)] bg-paper-deep px-10 pt-10 pb-6 dark:bg-card lg:flex">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-foreground/65 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Retour au site
        </Link>

        <figure className="relative mt-10 flex min-h-0 flex-1 overflow-hidden border border-[var(--rule-strong)]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="object-cover"
            priority
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/55 to-ink/20"
          />
          <figcaption className="absolute inset-x-0 top-0 flex flex-wrap items-baseline justify-between gap-2 p-4">
            <span className="text-[9.5px] uppercase tracking-[0.15em] text-paper/75">
              Visuel d’illustration
            </span>
            <span className="text-[9.5px] uppercase tracking-[0.15em] text-paper/45">
              Aucun extrait de l’œuvre
            </span>
          </figcaption>
          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="text-[11px] uppercase tracking-[0.19em] text-paper/65">
              Whispers
            </p>
            <blockquote className="display hanging mt-4 text-[clamp(1.6rem,2.7vw,2.4rem)] leading-[1.08] text-paper text-balance">
              «&nbsp;{quote}&nbsp;»
            </blockquote>
            <p className="mt-5 font-serif text-[14px] italic text-paper/80">
              {attribution}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-paper/55">
              {source}
            </p>
          </div>
        </figure>
      </aside>

      <main className="flex flex-col px-5 py-7 sm:px-10">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
          {children}
        </div>
      </main>
    </div>
  );
}
