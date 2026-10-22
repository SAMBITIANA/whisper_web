"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MediaCard } from "@/components/media-card";
import {
  media,
  mediaKindLabels,
  moods,
  topics,
  type MediaKind,
} from "@/lib/fake-data";

const kinds = Object.keys(mediaKindLabels) as MediaKind[];

type SortKey = "recent" | "popular" | "discussed";

const sortLabels: Record<SortKey, string> = {
  recent: "Plus récentes",
  popular: "Plus aimées",
  discussed: "Plus commentées",
};

const TOPIC_PREVIEW = 8;

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-[var(--rule)] py-2.5">
      <span className="eyebrow w-16 shrink-0">{label}</span>
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
        {children}
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "-mx-2 px-2 py-1 text-[13px] transition-colors",
        active
          ? "bg-sage-600 font-medium text-paper ring-1 ring-sage-600 ring-inset dark:bg-sage-300 dark:text-sage-900 dark:ring-sage-300"
          : "text-foreground/70 hover:bg-sage-100/60 hover:text-foreground dark:hover:bg-sage-300/15",
      )}
    >
      {children}
    </button>
  );
}

export function CatalogueBrowser({
  initialTopic,
  initialMood,
  initialKind,
  initialSort,
}: {
  initialTopic?: string;
  initialMood?: string;
  initialKind?: MediaKind | null;
  initialSort?: SortKey;
} = {}) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<MediaKind | null>(initialKind ?? null);
  const [topic, setTopic] = useState<string | null>(initialTopic ?? null);
  const [mood, setMood] = useState<string | null>(initialMood ?? null);
  const [sort, setSort] = useState<SortKey>(initialSort ?? "recent");
  const [filtersOpen, setFiltersOpen] = useState(
    Boolean(initialTopic || initialMood || initialKind),
  );
  const [allTopics, setAllTopics] = useState(false);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const filtered = media.filter((item) => {
      if (kind && item.kind !== kind) return false;
      if (topic && !item.topics.includes(topic)) return false;
      if (mood && item.mood !== mood) return false;
      if (!normalized) return true;

      return [
        item.title,
        item.quote.fr,
        item.quote.en,
        item.source.title,
        item.source.author ?? "",
        item.source.character ?? "",
        ...item.topics,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });

    return [...filtered].sort((a, b) => {
      if (sort === "popular") return b.likes - a.likes;
      if (sort === "discussed") return b.comments - a.comments;
      return b.publishedAt.localeCompare(a.publishedAt);
    });
  }, [query, kind, topic, mood, sort]);

  const chips = [
    query.trim()
      ? { key: "query", label: `« ${query.trim()} »`, clear: () => setQuery("") }
      : null,
    kind
      ? {
          key: "kind",
          label: mediaKindLabels[kind],
          clear: () => setKind(null),
        }
      : null,
    topic
      ? { key: "topic", label: topic, clear: () => setTopic(null) }
      : null,
    mood ? { key: "mood", label: mood, clear: () => setMood(null) } : null,
  ].filter((chip): chip is { key: string; label: string; clear: () => void } =>
    Boolean(chip),
  );

  const reset = () => {
    setQuery("");
    setKind(null);
    setTopic(null);
    setMood(null);
  };

  const visibleTopics = allTopics ? topics : topics.slice(0, TOPIC_PREVIEW);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 border-b border-[var(--rule)] pb-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-foreground/65" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher une citation, une source, un personnage…"
            className="h-10 rounded-none border-0 border-b border-[var(--rule)] bg-transparent pl-6 text-[14px] shadow-none placeholder:text-foreground/65 focus-visible:border-sage-300 focus-visible:ring-0 dark:bg-transparent"
            aria-label="Rechercher"
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
            aria-controls="catalogue-filtres"
            className={cn(
              "h-9 gap-2 rounded-none border-[var(--rule-strong)] bg-transparent px-3 text-[11px] uppercase tracking-[0.16em] text-foreground/80 hover:border-sage-600 hover:bg-transparent hover:text-foreground dark:hover:border-sage-300",
              filtersOpen
                ? "border-sage-600 bg-sage-600 text-paper hover:border-sage-600 hover:text-paper dark:border-sage-300 dark:bg-sage-300 dark:text-sage-900 dark:hover:border-sage-300 dark:hover:text-sage-900"
                : "",
            )}
          >
            Filtres
            {chips.length > 0 ? (
              <span
                className={cn(
                  "px-1.5 py-0.5 font-mono text-[10px]",
                  filtersOpen
                    ? "bg-paper text-sage-900 dark:bg-sage-900 dark:text-sage-100"
                    : "bg-sage-600 text-paper dark:bg-sage-300 dark:text-sage-900",
                )}
              >
                {String(chips.length).padStart(2, "0")}
              </span>
            ) : null}
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform duration-300",
                filtersOpen ? "rotate-180" : "",
              )}
            />
          </Button>

          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span className="eyebrow">Trier</span>
            {(Object.keys(sortLabels) as SortKey[]).map((key) => (
              <FilterButton
                key={key}
                active={sort === key}
                onClick={() => setSort(key)}
              >
                {sortLabels[key]}
              </FilterButton>
            ))}
          </div>
        </div>
      </div>

      {filtersOpen ? (
        <div id="catalogue-filtres" className="panel">
          <FilterRow label="Format">
            {kinds.map((value) => (
              <FilterButton
                key={value}
                active={kind === value}
                onClick={() =>
                  setKind((current) => (current === value ? null : value))
                }
              >
                {mediaKindLabels[value]}
              </FilterButton>
            ))}
          </FilterRow>

          <FilterRow label="Sujet">
            {visibleTopics.map((value) => (
              <FilterButton
                key={value}
                active={topic === value}
                onClick={() =>
                  setTopic((current) => (current === value ? null : value))
                }
              >
                {value}
              </FilterButton>
            ))}
            {topics.length > TOPIC_PREVIEW ? (
              <button
                type="button"
                onClick={() => setAllTopics((open) => !open)}
                className="link-underline text-[12px] text-foreground/70 transition-colors hover:text-foreground"
              >
                {allTopics
                  ? "Réduire"
                  : `+ ${topics.length - TOPIC_PREVIEW} sujets`}
              </button>
            ) : null}
          </FilterRow>

          <FilterRow label="Humeur">
            {moods.map((value) => (
              <FilterButton
                key={value}
                active={mood === value}
                onClick={() =>
                  setMood((current) => (current === value ? null : value))
                }
              >
                {value}
              </FilterButton>
            ))}
          </FilterRow>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <p className="eyebrow">
          {results.length} citation{results.length > 1 ? "s" : ""}
          {chips.length > 0 ? " après filtrage" : ""}
        </p>

        {chips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={chip.clear}
            className="inline-flex items-center gap-1.5 border border-sage-600 bg-sage-100/60 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-sage-900 transition-colors hover:bg-sage-100 dark:border-sage-300/70 dark:bg-sage-300/20 dark:text-sage-100 dark:hover:bg-sage-300/30"
          >
            {chip.label}
            <X className="size-3" />
          </button>
        ))}

        {chips.length > 0 ? (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-foreground/70 transition-colors hover:text-foreground"
          >
            <X className="size-3" />
            Réinitialiser
          </button>
        ) : null}
      </div>

      {results.length === 0 ? (
        <div className="border-y border-[var(--rule)] py-14 text-center">
          <p className="display text-[22px]">Aucune citation ne correspond.</p>
          <p className="mt-2 text-[13px] text-foreground/65">
            Essayez un autre mot-clé, ou réinitialisez les filtres.
          </p>
        </div>
      ) : (
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((item) => (
            <MediaCard
              key={item.slug}
              item={item}
              href={`/citation/${item.slug}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
