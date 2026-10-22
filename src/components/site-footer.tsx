import Link from "next/link";

const explore = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/catalogue?type=VIDEO", label: "Vidéos" },
  { href: "/catalogue?type=IMAGE", label: "Images" },
  { href: "/catalogue?type=TRACK", label: "Chansons" },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[var(--rule)]">
      <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8">
        <div className="grid gap-10 py-14 md:grid-cols-[1.6fr_1fr_1.2fr]">
          <div>
            <p className="display text-[32px] leading-none">Whispers</p>
            <p className="mt-4 max-w-[34ch] font-serif text-[15px] italic leading-relaxed text-foreground/60">
              Des citations en vidéo, en image et en musique — avec un texte
              superposé, traduisible, dans la langue de chacun.
            </p>
          </div>

          <nav className="space-y-2.5">
            <p className="eyebrow">Explorer</p>
            {explore.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="link-underline block w-fit text-[13px] text-foreground/65 transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="space-y-2.5">
            <p className="eyebrow">Coulisses</p>
            <p className="text-[13px] leading-relaxed text-foreground/60">
              Démonstration éditoriale — données fictives, visuels de banque
              d&apos;images.
            </p>
            <p className="font-serif text-[13px] italic leading-relaxed text-foreground/65">
              Stockage Backblaze B2, diffusion Cloudflare, API NestJS + Fastify.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--rule)] py-6">
          <p className="eyebrow">© Whispers — démonstration</p>
          <p className="eyebrow">Le texte reste une couche — jamais incrusté</p>
        </div>
      </div>
    </footer>
  );
}
