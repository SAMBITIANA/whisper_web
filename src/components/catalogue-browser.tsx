"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "cn";
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

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-[var(--rule)] py-4">
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
      className={cn(
        "link-underline text-[13px] transition-colors",
        active
          ? "text-foreground [background-size:100%_1px]"
          : "text-foreground/50 hover:text-foreground",
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

  const hasFilters = Boolean(query || kind || topic || mood);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-foreground/35" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher une citation, une source, un personnage…"
            className="h-10 rounded-none border-0 border-b border-[var(--rule)] bg-transparent pl-6 text-[14px] shadow-none placeholder:text-foreground/35 focus-visible:border-sage-300 focus-visible:ring-0 dark:bg-transparent"
            aria-label="Rechercher"
          />
        </div>

        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
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

      <div>
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
          {topics.map((value) => (
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

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--rule)] pt-4">
        <p className="eyebrow">
          {results.length} citation{results.length > 1 ? "s" : ""}
          {hasFilters ? " après filtrage" : ""}
        </p>
        {hasFilters ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setKind(null);
              setTopic(null);
              setMood(null);
            }}
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-foreground/50 transition-colors hover:text-foreground"
          >
            <X className="size-3" />
            Réinitialiser
          </button>
        ) : null}
      </div>

      {results.length === 0 ? (
        <div className="border-y border-[var(--rule)] py-20 text-center">
          <p className="display text-[22px]">Aucune citation ne correspond.</p>
          <p className="mt-2 text-[13px] text-foreground/50">
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
