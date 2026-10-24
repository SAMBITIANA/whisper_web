import Link from "next/link";

import { MediaPoster } from "@/components/media-poster";
import { SectionHeading } from "@/components/section-heading";
import type { ApiMedia } from "@/lib/api";
import { formatViews, typography } from "@/lib/format";

export function TrendingSection({ items }: { items: ApiMedia[] }) {
  return (
        <section className="mx-auto w-full max-w-[1180px] px-5 pt-6 sm:px-8">
          <SectionHeading
            index="01"
            title="En ce moment"
            note="Les plus aimées cette semaine"
            href="/catalogue?sort=popular"
          />

          <ol className="border-b border-[var(--rule)]">
            {items.map((item, index) => (
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
                        «&nbsp;{item.quote.fr}&nbsp;»
                      </span>
                    </p>
                    <p className="mt-1.5 text-[10.5px] uppercase tracking-[0.15em] text-foreground/60">
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
  );
}
