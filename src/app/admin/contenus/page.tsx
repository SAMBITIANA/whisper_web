"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Plus } from "lucide-react";
import { CONTENTS_STORAGE_KEY, type DraftContent } from "@/lib/fake-content";
import { media, mediaKindLabels, type MediaKind } from "@/lib/fake-data";
import { formatDate } from "@/lib/format";
import { useStoredList } from "@/lib/use-stored-list";

const kinds = Object.keys(mediaKindLabels) as MediaKind[];

export default function AdminContenusPage() {
  const { items: drafts } = useStoredList<DraftContent>(
    CONTENTS_STORAGE_KEY,
    [],
  );
  const [kind, setKind] = useState<MediaKind | null>(null);
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const published = media.map((item) => ({
      id: item.slug,
      kind: item.kind,
      title: item.title,
      source: item.source.title,
      date: item.publishedAt,
      views: item.views,
      status: "Publié" as const,
      poster: item.poster as string | undefined,
      href: `/citation/${item.slug}`,
    }));

    const local = drafts.map((item) => ({
      id: item.id,
      kind: item.kind,
      title: item.title,
      source: item.sourceTitle,
      date: item.createdAt,
      views: 0,
      status: item.status === "PUBLIE" ? ("Publié" as const) : ("Brouillon" as const),
      poster: item.poster || undefined,
      href: null,
    }));

    return [...local, ...published].filter((row) => {
      if (kind && row.kind !== kind) return false;
      if (!normalized) return true;
      return `${row.title} ${row.source}`.toLowerCase().includes(normalized);
    });
  }, [drafts, kind, query]);

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--rule)] pb-7">
        <div>
          <p className="eyebrow">Administration</p>
          <h1 className="display mt-4 text-[clamp(2rem,4vw,2.9rem)] leading-[1.04]">
            Contenus
          </h1>
          <p className="mt-3 font-serif text-[14.5px] italic text-foreground/55">
            Vidéos, images, galeries et chansons — {media.length + drafts.length}{" "}
            pièces.
          </p>
        </div>

        <Link
          href="/admin/contenus/nouveau"
          className="group inline-flex h-10 items-center gap-2 bg-primary px-4 text-[11px] uppercase tracking-[0.16em] text-primary-foreground"
        >
          <Plus className="size-3.5" />
          Nouveau contenu
        </Link>
      </header>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher un contenu ou une source"
          aria-label="Rechercher un contenu"
          className="w-full max-w-sm border-0 border-b border-[var(--rule)] bg-transparent pb-2 text-[13.5px] placeholder:text-foreground/30 focus:border-sage-300 focus:outline-none"
        />

        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <span className="eyebrow">Format</span>
          {kinds.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setKind((current) => (current === value ? null : value))}
              className={
                kind === value
                  ? "text-[12px] uppercase tracking-[0.13em] text-foreground"
                  : "text-[12px] uppercase tracking-[0.13em] text-foreground/40 transition-colors hover:text-foreground/70"
              }
            >
              {mediaKindLabels[value]}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <thead>
            <tr className="border-y border-[var(--rule)]">
              <th className="w-14 py-2.5 pr-4">
                <span className="sr-only">Visuel</span>
              </th>
              <th className="py-2.5 pr-4 text-[9.5px] font-normal uppercase tracking-[0.16em] text-foreground/40">
                Titre
              </th>
              <th className="px-4 py-2.5 text-[9.5px] font-normal uppercase tracking-[0.16em] text-foreground/40">
                Format
              </th>
              <th className="px-4 py-2.5 text-[9.5px] font-normal uppercase tracking-[0.16em] text-foreground/40">
                Source
              </th>
              <th className="px-4 py-2.5 text-[9.5px] font-normal uppercase tracking-[0.16em] text-foreground/40">
                Date
              </th>
              <th className="px-4 py-2.5 text-right text-[9.5px] font-normal uppercase tracking-[0.16em] text-foreground/40">
                Vues
              </th>
              <th className="py-2.5 pl-4 text-right text-[9.5px] font-normal uppercase tracking-[0.16em] text-foreground/40">
                État
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[var(--rule)]">
                <td className="w-14 py-3 pr-4">
                  {row.poster ? (
                    <span className="relative block aspect-[4/3] w-14 overflow-hidden bg-foreground/5">
                      <Image
                        src={row.poster}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </span>
                  ) : (
                    <span className="block aspect-[4/3] w-14 bg-[linear-gradient(135deg,#2B5748,#9CB080)]" />
                  )}
                </td>
                <td className="max-w-[22rem] py-3 pr-4">
                  {row.href ? (
                    <Link
                      href={row.href}
                      className="display link-underline text-[15px] leading-snug"
                    >
                      {row.title}
                    </Link>
                  ) : (
                    <span className="display text-[15px] leading-snug">
                      {row.title}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-[11px] uppercase tracking-[0.12em] text-foreground/45">
                  {mediaKindLabels[row.kind]}
                </td>
                <td className="px-4 py-3.5 text-[12.5px] text-foreground/55">
                  {row.source}
                </td>
                <td className="px-4 py-3.5 font-mono text-[10.5px] text-foreground/40">
                  {formatDate(row.date)}
                </td>
                <td className="px-4 py-3.5 text-right font-mono text-[10.5px] text-foreground/40">
                  {row.views > 0 ? row.views.toLocaleString("fr-FR") : "—"}
                </td>
                <td className="py-3.5 pl-4 text-right">
                  <span
                    className={
                      row.status === "Publié"
                        ? "text-[10px] uppercase tracking-[0.12em] text-sage-700 dark:text-sage-100"
                        : "text-[10px] uppercase tracking-[0.12em] text-foreground/35"
                    }
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 ? (
        <p className="border-y border-[var(--rule)] py-12 text-center font-serif text-[15px] italic text-foreground/45">
          Aucun contenu ne correspond à cette recherche.
        </p>
      ) : null}

      <p className="flex items-center gap-2 text-[11.5px] text-foreground/40">
        <ArrowRight className="size-3.5" />
        Les brouillons créés ici restent dans ce navigateur (localStorage) —
        l’API les remplacera.
      </p>
    </div>
  );
}
