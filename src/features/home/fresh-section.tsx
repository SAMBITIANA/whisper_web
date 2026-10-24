import { MediaCard } from "@/components/media-card";
import { SectionHeading } from "@/components/section-heading";
import type { ApiMedia } from "@/lib/api";

export function FreshSection({ items }: { items: ApiMedia[] }) {
  return (
        <section className="mx-auto w-full max-w-[1180px] px-5 pt-10 sm:px-8">
          <SectionHeading
            index="03"
            title="Dernières parutions"
            note="Publiées par l’équipe éditoriale"
            href="/catalogue"
          />

          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <MediaCard
                key={item.slug}
                item={item}
                href={`/citation/${item.slug}`}
              />
            ))}
          </div>
        </section>
  );
}
