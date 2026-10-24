import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";

export function MoodsTopicsSection({
  moods,
  topics,
}: {
  moods: string[];
  topics: string[];
}) {
  return (
        <section className="mx-auto w-full max-w-[1180px] px-5 pt-10 sm:px-8">
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

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[var(--rule)] pt-6">
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
  );
}
