import Link from "next/link";

import { MediaPoster } from "@/components/media-poster";
import { SectionHeading } from "@/components/section-heading";
import { mediaKindLabels } from "@/lib/catalogue";
import type { ApiMedia } from "@/lib/api";
import { typography } from "@/lib/format";

export function CommunitySection({ items }: { items: ApiMedia[] }) {
  if (items.length === 0) return null;

  return (
          <section className="mx-auto w-full max-w-[1180px] px-5 pt-10 sm:px-8">
            <SectionHeading
              index="05"
              title="De la communauté"
              note="En attente de relecture"
            />
            <ul className="border-b border-[var(--rule)]">
              {items.map((item) => (
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
                          «&nbsp;{item.quote.fr}&nbsp;»
                        </span>
                      </p>
                      <p className="mt-2 text-[10.5px] uppercase tracking-[0.15em] text-foreground/60">
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
  );
}
