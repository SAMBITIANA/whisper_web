import {
  getQuote,
  mediaKindLabels,
  type FakeMedia,
  type LanguageCode,
} from "@/lib/fake-data";
import { formatViews, typography } from "@/lib/format";
import { MediaPoster } from "@/components/media-poster";

export function MediaCard({
  item,
  language = "fr",
  href,
}: {
  item: FakeMedia;
  language?: LanguageCode;
  href: string;
}) {
  return (
    <article className="group">
      <a href={href} className="block">
        <MediaPoster
          kind={item.kind}
          gradient={item.gradient}
          durationSec={item.durationSec}
          poster={item.poster}
          showIcon={false}
          showDuration={false}
          className="aspect-[4/3] w-full"
        />

        <div className="mt-4 flex items-center gap-2.5 text-[10px] uppercase tracking-[0.16em] text-foreground/60">
          <span>{mediaKindLabels[item.kind]}</span>
          <span aria-hidden className="h-px w-3.5 bg-[var(--rule-strong)]" />
          <span>{item.mood}</span>
        </div>

        <p className="display mt-2.5 text-[19px] leading-[1.28] text-balance">
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
            «&nbsp;{getQuote(item, language)}&nbsp;»
          </span>
        </p>

        <p className="mt-2 font-serif text-[13px] italic text-foreground/65">
          {typography(item.source.title)}
          {item.source.character ? `, ${typography(item.source.character)}` : ""}
        </p>

        <p className="mt-1.5 font-mono text-[10.5px] tracking-wide text-foreground/65">
          {formatViews(item.views)} vues · {formatViews(item.likes)} réactions
        </p>
      </a>
    </article>
  );
}
