"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { parseDuration } from "@/lib/fake-content";
import { mediaKindKeys, type MediaKind } from "@/lib/catalogue";
import { type MessageKey } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import {
  createAdminMedia,
  fetchAdminSources,
  fetchTaxonomy,
  type ApiSource,
} from "@/lib/api";

const kindDescriptionKeys: Record<MediaKind, MessageKey> = {
  VIDEO: "content.kindVideoDescription",
  IMAGE: "content.kindImageDescription",
  SEQUENCE: "content.kindSequenceDescription",
  TRACK: "content.kindTrackDescription",
};

const fieldClass =
  "h-10 w-full rounded-none border-0 border-b border-[var(--rule)] bg-transparent px-0 text-[13.5px] shadow-none placeholder:text-foreground/30 focus-visible:border-sage-300 focus-visible:ring-0 dark:bg-transparent";

const textareaClass =
  "w-full resize-none border border-[var(--rule-strong)] bg-transparent p-3 text-[13.5px] leading-relaxed placeholder:text-foreground/30 focus:border-sage-300 focus:outline-none";

export default function NouveauContenuPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [sources, setSources] = useState<ApiSource[]>([]);
  const [moods, setMoods] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [kind, setKind] = useState<MediaKind>("VIDEO");
  const [title, setTitle] = useState("");
  const [sourceSlug, setSourceSlug] = useState("");
  const [character, setCharacter] = useState("");
  const [quoteFr, setQuoteFr] = useState("");
  const [quoteEn, setQuoteEn] = useState("");
  const [topics, setTopics] = useState("");
  const [mood, setMood] = useState("");
  const [duration, setDuration] = useState("0:42");
  const [mediaUrl, setMediaUrl] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [itemsCount, setItemsCount] = useState("6");
  const [lyrics, setLyrics] = useState(true);
  const [status, setStatus] = useState<"BROUILLON" | "PUBLIE">("BROUILLON");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([fetchAdminSources(), fetchTaxonomy()]).then(
      ([sourceList, taxonomy]) => {
        setSources(sourceList);
        setMoods(taxonomy.moods.map((item) => item.name));
        setSourceSlug((current) => current || (sourceList[0]?.slug ?? ""));
        setMood((current) => current || (taxonomy.moods[0]?.name ?? ""));
      },
    );
  }, []);

  const source = sources.find((item) => item.slug === sourceSlug);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!title.trim() || !quoteFr.trim()) {
      setError(t("content.required"));
      return;
    }

    setSaving(true);
    try {
      await createAdminMedia({
        kind,
        title: title.trim(),
        sourceSlug,
        character: character.trim(),
        quoteFr: quoteFr.trim(),
        quoteEn: quoteEn.trim(),
        topics,
        mood,
        durationSec: kind === "IMAGE" ? 0 : parseDuration(duration),
        posterUrl: posterUrl.trim(),
        mediaUrl: mediaUrl.trim(),
        status: status === "PUBLIE" ? "PUBLISHED" : "DRAFT",
      });
      toast(
        status === "PUBLIE"
          ? t("content.published")
          : t("content.draftSaved"),
        { description: `${t(mediaKindKeys[kind])} · ${title.trim()}` },
      );
      router.push("/admin/contenus");
    } catch {
      setError(t("common.saveFailed"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/contenus"
        className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-foreground/60 transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
        {t("admin.backToContents")}
      </Link>

      <header className="border-b border-[var(--rule)] pb-4">
        <p className="eyebrow">{t("common.admin")}</p>
        <h1 className="display mt-1.5 text-[clamp(1.5rem,2.4vw,1.95rem)] leading-[1.1]">
          {t("admin.newContent")}
        </h1>
        <p className="mt-1.5 max-w-2xl font-serif text-[13.5px] italic leading-snug text-foreground/65">
          {t("content.newIntro")}
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="panel grid gap-8 lg:grid-cols-[1.35fr_1fr]"
      >
        <div className="space-y-6">
          <fieldset>
            <legend className="eyebrow">{t("admin.format")}</legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(Object.keys(mediaKindKeys) as MediaKind[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setKind(value)}
                  aria-pressed={kind === value}
                  className={
                    kind === value
                      ? "border border-sage-600 bg-sage-600/10 p-3 text-left ring-1 ring-sage-600 ring-inset dark:border-sage-300 dark:bg-sage-300/15 dark:ring-sage-300"
                      : "border border-[var(--rule-strong)] p-3 text-left transition-colors hover:border-sage-600 hover:bg-sage-100/50 dark:hover:border-sage-300 dark:hover:bg-sage-300/10"
                  }
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="display text-[16px]">
                      {t(mediaKindKeys[value])}
                    </span>
                    {kind === value ? (
                      <Check className="size-3.5 text-sage-600 dark:text-sage-100" />
                    ) : null}
                  </span>
                  <span className="mt-1 block text-[11px] leading-relaxed text-foreground/60">
                    {t(kindDescriptionKeys[value])}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title" className="eyebrow">
                {t("content.mediaTitle")}
              </Label>
              <input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={t("content.titlePlaceholder")}
                className={fieldClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source" className="eyebrow">
                {t("content.source")}
              </Label>
              <select
                id="source"
                value={sourceSlug}
                onChange={(event) => setSourceSlug(event.target.value)}
                className="h-10 w-full border-0 border-b border-[var(--rule)] bg-transparent text-[13.5px] focus:border-sage-300 focus:outline-none"
              >
                {sources.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="character" className="eyebrow">
                {t("content.character")}{" "}
                <span className="normal-case">{t("common.optional")}</span>
              </Label>
              <input
                id="character"
                value={character}
                onChange={(event) => setCharacter(event.target.value)}
                className={fieldClass}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="quote-fr" className="eyebrow">
                {t("content.quoteFr")}
              </Label>
              <textarea
                id="quote-fr"
                value={quoteFr}
                onChange={(event) => setQuoteFr(event.target.value)}
                rows={3}
                className={textareaClass}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="quote-en" className="eyebrow">
                {t("content.quoteEn")}
              </Label>
              <textarea
                id="quote-en"
                value={quoteEn}
                onChange={(event) => setQuoteEn(event.target.value)}
                rows={3}
                className={textareaClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="topics" className="eyebrow">
                {t("content.topics")}
              </Label>
              <input
                id="topics"
                value={topics}
                onChange={(event) => setTopics(event.target.value)}
                placeholder={t("content.topicsPlaceholder")}
                className={fieldClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mood" className="eyebrow">
                {t("content.mood")}
              </Label>
              <select
                id="mood"
                value={mood}
                onChange={(event) => setMood(event.target.value)}
                className="h-10 w-full border-0 border-b border-[var(--rule)] bg-transparent text-[13.5px] focus:border-sage-300 focus:outline-none"
              >
                {moods.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <fieldset className="space-y-6">
            <legend className="eyebrow">{t("content.mediaAndText")}</legend>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="poster" className="eyebrow">
                  {t("content.posterUrl")}
                </Label>
                <input
                  id="poster"
                  value={posterUrl}
                  onChange={(event) => setPosterUrl(event.target.value)}
                  placeholder={t("content.posterPlaceholder")}
                  className={fieldClass}
                />
              </div>

              {kind === "VIDEO" ? (
                <div className="space-y-2">
                  <Label htmlFor="hls" className="eyebrow">
                    {t("content.hlsPlaylist")}
                  </Label>
                  <input
                    id="hls"
                    value={mediaUrl}
                    onChange={(event) => setMediaUrl(event.target.value)}
                    placeholder="https://…/master.m3u8"
                    className={fieldClass}
                  />
                </div>
              ) : null}

              {kind === "SEQUENCE" ? (
                <div className="space-y-2">
                  <Label htmlFor="items" className="eyebrow">
                    {t("content.itemCount")}
                  </Label>
                  <input
                    id="items"
                    value={itemsCount}
                    onChange={(event) => setItemsCount(event.target.value)}
                    inputMode="numeric"
                    className={fieldClass}
                  />
                </div>
              ) : null}

              {kind !== "IMAGE" ? (
                <div className="space-y-2">
                  <Label htmlFor="duration" className="eyebrow">
                    {t("content.duration")}
                  </Label>
                  <input
                    id="duration"
                    value={duration}
                    onChange={(event) => setDuration(event.target.value)}
                    placeholder="0:42"
                    className={fieldClass}
                  />
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-6 border-t border-[var(--rule)] pt-5">
              <div>
                <p className="text-[12.5px] text-foreground/70">
                  {kind === "TRACK"
                    ? t("content.syncedLyrics")
                    : t("content.translatableTrack")}
                </p>
                <p className="mt-1 text-[11px] text-foreground/60">
                  {t("content.separateLayer")}
                </p>
              </div>
              <Switch
                checked={lyrics}
                onCheckedChange={setLyrics}
                aria-label={t("content.toggleTrack")}
              />
            </div>
          </fieldset>

          {error ? (
            <p
              role="alert"
              className="border-l-2 border-destructive pl-3 text-[12.5px] text-destructive"
            >
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-6 border-t border-[var(--rule)] pt-6">
            <Button
              type="submit"
              disabled={saving}
              className="h-10 rounded-none px-5 text-[11px] uppercase tracking-[0.16em]"
            >
              {saving
                ? t("content.saving")
                : status === "PUBLIE"
                  ? t("content.publish")
                  : t("content.saveDraft")}
            </Button>

            <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-foreground/65">
              <input
                type="checkbox"
                checked={status === "PUBLIE"}
                onChange={(event) =>
                  setStatus(event.target.checked ? "PUBLIE" : "BROUILLON")
                }
                className="size-3.5 accent-[var(--color-sage-600)]"
              />
              {t("content.publishNow")}
            </label>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow">{t("content.preview")}</p>
          <div className="mt-4 border border-[var(--rule)] p-3">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-deep dark:bg-card">
              <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_20%_10%,oklch(0.729_0.07_126.4_/_0.55),transparent_60%)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/5" />

              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <p className="text-[9.5px] uppercase tracking-[0.18em] text-paper/60">
                  {mood}
                </p>
                <p className="display mt-2 text-[20px] leading-[1.2] text-paper">
                  «&nbsp;
                  {quoteFr.trim() || t("content.previewPlaceholder")}
                  &nbsp;»
                </p>
                <p className="mt-3 text-[9.5px] uppercase tracking-[0.15em] text-paper/60">
                  {source?.title ?? t("content.source")}
                  {character ? ` · ${character}` : ""}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[9.5px] uppercase tracking-[0.15em] text-foreground/60">
                {t(mediaKindKeys[kind])}
                {kind !== "IMAGE" && duration ? ` · ${duration}` : ""}
              </span>
              <span className="text-[9.5px] uppercase tracking-[0.14em] text-foreground/30">
                {posterUrl ? t("content.visualProvided") : t("content.visualPending")}
              </span>
            </div>
          </div>

          <ul className="mt-6 space-y-2.5 border-t border-[var(--rule)] pt-5 text-[11.5px] leading-relaxed text-foreground/60">
            <li>{t("content.ruleCredit")}</li>
            <li>{t("content.ruleNoProtectedImage")}</li>
            <li>{t("content.ruleEnglishOptional")}</li>
          </ul>
        </aside>
      </form>
    </div>
  );
}
