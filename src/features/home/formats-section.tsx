import { SectionHeading } from "@/components/section-heading";

const formats = [
  ["Vidéo", "Diffusion HLS, qualité adaptative, sous-titres traduisibles."],
  ["Image", "Dérivés responsives WebP et AVIF, texte en surimpression."],
  ["Galerie", "Succession d’images, format story, rythme réglable."],
  ["Chanson", "Paroles synchronisées, traduction ligne à ligne."],
] as const;

export function FormatsSection() {
  return (
        <section className="mx-auto w-full max-w-[1180px] px-5 pt-10 sm:px-8">
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
                <dd className="mt-2.5 text-[12.5px] leading-relaxed text-foreground/65">
                  {description}
                </dd>
              </div>
            ))}
          </dl>
        </section>
  );
}
