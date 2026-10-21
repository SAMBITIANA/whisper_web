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
      <aside className="relative hidden flex-col border-r border-[var(--rule)] bg-paper-deep px-10 py-10 dark:bg-card lg:flex">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-foreground/50 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Retour au site
        </Link>

        <div className="mt-10 max-w-lg">
          <p className="eyebrow">Whispers</p>
          <blockquote className="display hanging mt-6 text-[clamp(1.9rem,3.2vw,2.9rem)] leading-[1.08] text-balance">
            «&nbsp;{quote}&nbsp;»
          </blockquote>
          <p className="mt-6 font-serif text-[15px] italic text-foreground/65">
            {attribution}
          </p>
          <p className="mt-1 text-[10.5px] uppercase tracking-[0.15em] text-foreground/40">
            {source}
          </p>
        </div>

        <figure className="relative mt-10 aspect-[16/9] w-full flex-none overflow-hidden border border-[var(--rule-strong)]">
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
            className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-ink/5"
          />
          <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap items-baseline justify-between gap-2 p-4">
            <span className="text-[9.5px] uppercase tracking-[0.15em] text-paper/75">
              Visuel d’illustration
            </span>
            <span className="text-[9.5px] uppercase tracking-[0.15em] text-paper/45">
              Aucun extrait de l’œuvre
            </span>
          </figcaption>
        </figure>

        <p className="mt-6 max-w-sm font-serif text-[12.5px] italic leading-relaxed text-foreground/45">
          Les citations se lisent, s’écoutent et se traduisent. Le texte reste
          une couche — jamais incrusté dans l’image.
        </p>
      </aside>

      <main className="flex flex-col px-5 py-10 sm:px-10">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
          {children}
        </div>
      </main>
    </div>
  );
}
