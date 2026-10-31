"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Archive, ArrowRight, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { mediaKindKeys, type MediaKind } from "@/lib/catalogue";
import { useI18n } from "@/i18n/provider";
import { formatDate } from "@/lib/format";
import {
  archiveAdminMedia,
  errorMessage,
  fetchAdminMedia,
  fetchAdminMediaItem,
  type ApiAdminMedia,
  type ApiAdminMediaDetail,
} from "@/lib/api";
import { NewContentForm } from "@/features/admin/new-content-form";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const kinds = Object.keys(mediaKindKeys) as MediaKind[];

export default function AdminContenusPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<ApiAdminMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [kind, setKind] = useState<MediaKind | null>(null);
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<ApiAdminMediaDetail | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  function reload() {
    void fetchAdminMedia().then(setItems);
  }

  function openCreate() {
    setEditing(null);
    setCreating(true);
  }

  async function openEdit(id: string) {
    setBusy(id);

    try {
      const item = await fetchAdminMediaItem(id);
      setEditing(item);
      setCreating(true);
    } catch (error) {
      toast(errorMessage(error, t("common.updateFailed")));
    } finally {
      setBusy(null);
    }
  }

  async function archiveRow(row: ApiAdminMedia) {
    if (!window.confirm(t("admin.confirmArchive", { title: row.title }))) {
      return;
    }

    setBusy(row.id);

    try {
      await archiveAdminMedia(row.id);
      toast(t("admin.contentArchived"));
      reload();
    } catch (error) {
      toast(errorMessage(error, t("common.updateFailed")));
    } finally {
      setBusy(null);
    }
  }

  useEffect(() => {
    void fetchAdminMedia()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const rows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items.filter((row) => {
      if (kind && row.kind !== kind) return false;
      if (!normalized) return true;
      return `${row.title} ${row.source}`.toLowerCase().includes(normalized);
    });
  }, [items, kind, query]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--rule)] pb-4">
        <div>
          <p className="eyebrow">{t("common.admin")}</p>
          <h1 className="display mt-1.5 text-[clamp(1.5rem,2.4vw,1.95rem)] leading-[1.1]">
            {t("admin.contents")}
          </h1>
          <p className="mt-1.5 font-serif text-[13.5px] italic text-foreground/65">
            {t(
              items.length === 1
                ? "admin.contentsDescriptionOne"
                : "admin.contentsDescription",
              { count: items.length },
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="group inline-flex h-10 items-center gap-2 bg-primary px-4 text-[11px] uppercase tracking-[0.16em] text-primary-foreground"
        >
          <Plus className="size-3.5" />
          {t("admin.newContent")}
        </button>
      </header>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("admin.searchContentPlaceholder")}
          aria-label={t("admin.searchContentLabel")}
          className="w-full max-w-sm border-0 border-b border-[var(--rule)] bg-transparent pb-2 text-[13.5px] placeholder:text-foreground/30 focus:border-sage-300 focus:outline-none"
        />

        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <span className="eyebrow">{t("admin.format")}</span>
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
              {t(mediaKindKeys[value])}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <thead>
            <tr className="border-y border-[var(--rule)]">
              <th className="w-14 py-2.5 pr-4">
                <span className="sr-only">{t("admin.visual")}</span>
              </th>
              <th className="py-2.5 pr-4 text-[9.5px] font-normal uppercase tracking-[0.16em] text-foreground/40">
                {t("admin.titleColumn")}
              </th>
              <th className="px-4 py-2.5 text-[9.5px] font-normal uppercase tracking-[0.16em] text-foreground/40">
                {t("admin.format")}
              </th>
              <th className="px-4 py-2.5 text-[9.5px] font-normal uppercase tracking-[0.16em] text-foreground/40">
                {t("admin.sourceColumn")}
              </th>
              <th className="px-4 py-2.5 text-[9.5px] font-normal uppercase tracking-[0.16em] text-foreground/40">
                {t("admin.dateColumn")}
              </th>
              <th className="px-4 py-2.5 text-right text-[9.5px] font-normal uppercase tracking-[0.16em] text-foreground/40">
                {t("admin.viewsColumn")}
              </th>
              <th className="py-2.5 pl-4 text-right text-[9.5px] font-normal uppercase tracking-[0.16em] text-foreground/40">
                {t("admin.statusColumn")}
              </th>
              <th className="py-2.5 pl-4">
                <span className="sr-only">{t("common.edit")}</span>
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
                  <Link
                    href={row.href}
                    className="display link-underline text-[15px] leading-snug"
                  >
                    {row.title}
                  </Link>
                </td>
                <td className="px-4 py-3.5 text-[11px] uppercase tracking-[0.12em] text-foreground/60">
                  {t(mediaKindKeys[row.kind])}
                </td>
                <td className="px-4 py-3.5 text-[12.5px] text-foreground/65">
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
                      row.status === "PUBLISHED"
                        ? "text-[10px] uppercase tracking-[0.12em] text-sage-600 dark:text-sage-100"
                        : "text-[10px] uppercase tracking-[0.12em] text-foreground/35"
                    }
                  >
                    {row.status === "PUBLISHED"
                      ? t("admin.statusPublished")
                      : row.status === "DRAFT"
                        ? t("admin.statusDraft")
                        : row.status === "ARCHIVED"
                          ? t("admin.statusArchived")
                          : row.status}
                  </span>
                </td>
                <td className="py-3.5 pl-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => void openEdit(row.id)}
                      disabled={busy === row.id}
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--rule-strong)] px-2.5 text-[11px] text-foreground/75 transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                    >
                      <Pencil aria-hidden className="size-3" />
                      {t("common.edit")}
                    </button>
                    <button
                      type="button"
                      onClick={() => void archiveRow(row)}
                      disabled={busy === row.id || row.status === "ARCHIVED"}
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--rule-strong)] px-2.5 text-[11px] text-foreground/60 transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
                    >
                      <Archive aria-hidden className="size-3" />
                      {t("admin.archive")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading ? (
        <div className="h-64 animate-pulse bg-foreground/5" />
      ) : rows.length === 0 ? (
        <p className="border-y border-[var(--rule)] py-12 text-center font-serif text-[15px] italic text-foreground/60">
          {t("admin.noContentMatch")}
        </p>
      ) : null}

      <p className="flex items-center gap-2 text-[11.5px] text-foreground/40">
        <ArrowRight className="size-3.5" />
        {t("admin.draftsLocalNote")}
      </p>

      <Sheet
        open={creating}
        onOpenChange={(open) => {
          setCreating(open);

          if (!open) {
            setEditing(null);
          }
        }}
      >
        <SheetContent
          side="right"
          aria-describedby={undefined}
          className="gap-0 data-[side=right]:w-full! sm:max-w-5xl!"
        >
          <NewContentForm
            inDrawer
            media={editing}
            onCreated={() => {
              setCreating(false);
              reload();
            }}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
