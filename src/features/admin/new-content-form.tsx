"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Images, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SheetTitle } from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { parseDuration } from "@/lib/fake-content";
import { mediaKindKeys, type MediaKind } from "@/lib/catalogue";
import { type MessageKey } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import {
  createAdminMedia,
  errorMessage,
  fetchAdminSources,
  fetchAdminMusic,
  generateAdminQuotes,
  generateAdminSpeech,
  generateAdminScenes,
  fetchTaxonomy,
  updateAdminMedia,
  uploadAdminFile,
  type ApiAdminMediaDetail,
  type ApiAdminMusic,
  type ApiQuoteCandidate,
  type ApiSource,
  type ApiTaxonomy,
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

const generateButtonClass =
  "inline-flex h-9 items-center gap-1.5 rounded-md border border-[var(--rule-strong)] px-3 text-[11px] uppercase tracking-[0.12em] text-foreground/75 transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50";

const fileClass =
  "w-full max-w-full text-[12px] text-transparent file:mr-3 file:cursor-pointer file:border file:border-[var(--rule-strong)] file:bg-transparent file:px-3 file:py-1.5 file:text-[11px] file:uppercase file:tracking-[0.12em] file:text-foreground/75";

function formatDuration(total: number) {
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

export function NewContentForm({
  onCreated,
  inDrawer = false,
  media = null,
}: {
  onCreated?: () => void;
  inDrawer?: boolean;
  media?: ApiAdminMediaDetail | null;
}) {
  const { t } = useI18n();
  const [sources, setSources] = useState<ApiSource[]>([]);
  const [moods, setMoods] = useState<string[]>([]);
  const [formats, setFormats] = useState<ApiTaxonomy["formats"]>([]);
  const [languages, setLanguages] = useState<ApiTaxonomy["languages"]>([]);
  const [saving, setSaving] = useState(false);
  const [kind, setKind] = useState(media?.kind ?? "");
  const [title, setTitle] = useState(media?.title ?? "");
  const [sourceSlug, setSourceSlug] = useState(media?.sourceSlug ?? "");
  const [character, setCharacter] = useState(media?.character ?? "");
  const [language, setLanguage] = useState(media?.language ?? "");
  const [quote, setQuote] = useState(media?.quote ?? "");
  const [topics, setTopics] = useState(media?.topics ?? "");
  const [mood, setMood] = useState(media?.mood ?? "");
  const duration = media ? formatDuration(media.durationSec) : "0:00";
  const mediaUrl = media?.mediaUrl ?? "";
  const posterUrl = media?.posterUrl ?? "";
  const [itemsCount, setItemsCount] = useState("6");
  const [lyrics, setLyrics] = useState(true);
  const [status, setStatus] = useState<"BROUILLON" | "PUBLIE">(
    media?.status === "PUBLISHED" ? "PUBLIE" : "BROUILLON",
  );
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatingImages, setGeneratingImages] = useState(false);
  const [promptQuote, setPromptQuote] = useState("");
  const [promptImages, setPromptImages] = useState(
    "90s retro anime style, lo-fi aesthetic, grainy vintage texture, muted dark color palette, atmospheric, cinematic lighting, vertical format (9:16), masterpiece",
  );
  const [sceneImages, setSceneImages] = useState<
    { sentence: string; url: string }[]
  >([]);
  const [musicTrackUrl, setMusicTrackUrl] = useState<string | null>(
    media?.musicUrl ?? null,
  );
  const [musicTracks, setMusicTracks] = useState<ApiAdminMusic[]>([]);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(
    media?.voiceUrl || null,
  );
  const [voiceLanguage, setVoiceLanguage] = useState(
    media?.voiceLanguage || media?.language || "fr",
  );
  const [generatingVoice, setGeneratingVoice] = useState(false);
  const [candidates, setCandidates] = useState<ApiQuoteCandidate[]>([]);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  useEffect(() => {
    void fetchAdminMusic()
      .then(setMusicTracks)
      .catch(() => setMusicTracks([]));
  }, []);

  useEffect(() => {
    void Promise.all([fetchAdminSources(), fetchTaxonomy()]).then(
      ([sourceList, taxonomy]) => {
        setSources(sourceList);
        setMoods(taxonomy.moods.map((item) => item.name));
        setFormats(taxonomy.formats);
        setLanguages(taxonomy.languages);
        setSourceSlug((current) => current || (sourceList[0]?.slug ?? ""));
        setMood((current) => current || (taxonomy.moods[0]?.name ?? ""));
        setKind((current) => current || (taxonomy.formats[0]?.code ?? ""));
        setLanguage(
          (current) => current || (taxonomy.languages[0]?.code ?? "fr"),
        );
      },
    );
  }, []);

  const formatOptions: ApiTaxonomy["formats"] = formats.length
    ? formats
    : (Object.keys(mediaKindKeys) as MediaKind[]).map((code) => ({
        code,
        labelKey: mediaKindKeys[code],
        icon: null,
      }));

  function labelOf(code: string) {
    const labelKey =
      formatOptions.find((item) => item.code === code)?.labelKey ??
      mediaKindKeys[code as MediaKind];
    const label = t(labelKey as MessageKey);

    return label === labelKey ? code : label;
  }

  const source = sources.find((item) => item.slug === sourceSlug);

  const sentences = useMemo(
    () =>
      quote
        .split(/(?<=[.!?…])\s+/)
        .map((sentence) => sentence.trim())
        .filter(Boolean),
    [quote],
  );

  const posterPreview = useMemo(
    () => (posterFile ? URL.createObjectURL(posterFile) : null),
    [posterFile],
  );
  const videoPreview = useMemo(
    () => (videoFile ? URL.createObjectURL(videoFile) : null),
    [videoFile],
  );

  useEffect(() => {
    return () => {
      if (posterPreview) {
        URL.revokeObjectURL(posterPreview);
      }
    };
  }, [posterPreview]);

  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  async function generateQuotes() {
    setGenerating(true);

    try {
      const result = await generateAdminQuotes({
        theme: title.trim() || undefined,
        mood: mood || undefined,
        count: 5,
        instructions: promptQuote.trim() || undefined,
      });
      setCandidates(result.candidates);
    } catch (error) {
      toast(errorMessage(error, t("content.generateError")));
    } finally {
      setGenerating(false);
    }
  }

  async function generateScenes() {
    setGeneratingImages(true);

    try {
      const result = await generateAdminScenes({
        sentences,
        mood: mood || undefined,
        instructions: promptImages,
      });
      setSceneImages((current) => {
        const merged = [
          ...current,
          ...result.items.map((item) => ({
            sentence: item.sentence,
            url: item.url,
          })),
        ];
        const seen = new Set<string>();

        return merged.filter((image) => {
          if (seen.has(image.url)) {
            return false;
          }
          seen.add(image.url);
          return true;
        });
      });
    } catch (error) {
      toast(errorMessage(error, t("content.generateError")));
    } finally {
      setGeneratingImages(false);
    }
  }

  function applyCandidate(candidate: ApiQuoteCandidate) {
    setQuote(candidate.quote_fr);

    if (candidate.title_fr) {
      setTitle(candidate.title_fr);
    }

    if (candidate.topics.length > 0) {
      setTopics(candidate.topics.join(", "));
    }

    if (candidate.mood && moods.includes(candidate.mood)) {
      setMood(candidate.mood);
    }

    setCandidates([]);
  }

  async function generateVoice() {
    if (!quote.trim()) {
      toast(t("content.generateError"));
      return;
    }

    setGeneratingVoice(true);

    try {
      const result = await generateAdminSpeech({
        text: quote.trim(),
        language: voiceLanguage,
      });
      setVoiceUrl(result.url);
    } catch (error) {
      toast(errorMessage(error, t("content.generateError")));
    } finally {
      setGeneratingVoice(false);
    }
  }

  function selectFile(
    event: React.ChangeEvent<HTMLInputElement>,
    target: "poster" | "video",
  ) {
    const file = event.target.files?.[0] ?? null;

    if (target === "poster") {
      setPosterFile(file);
    } else {
      setVideoFile(file);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!title.trim() || !quote.trim()) {
      setError(t("content.required"));
      return;
    }

    setSaving(true);

    try {
      let nextPosterUrl = posterUrl.trim();
      let nextMediaUrl = mediaUrl.trim();
      let nextDurationSec = kind === "IMAGE" ? 0 : parseDuration(duration);

      if (posterFile) {
        const uploaded = await uploadAdminFile(posterFile);
        nextPosterUrl = uploaded.url;
      }

      if (videoFile) {
        const uploaded = await uploadAdminFile(videoFile);
        nextMediaUrl = uploaded.url;

        if (uploaded.posterUrl) {
          nextPosterUrl = uploaded.posterUrl;
        }

        if (uploaded.durationSec !== undefined) {
          nextDurationSec = uploaded.durationSec;
        }
      }

      const payload = {
        kind: kind as MediaKind,
        title: title.trim(),
        sourceSlug,
        character: character.trim(),
        language,
        quote: quote.trim(),
        topics,
        mood,
        durationSec: nextDurationSec,
        posterUrl: nextPosterUrl,
        mediaUrl: nextMediaUrl,
        status: (status === "PUBLIE" ? "PUBLISHED" : "DRAFT") as
          | "PUBLISHED"
          | "DRAFT",
        images: sceneImages.map((image) => image.url),
        musicUrl: musicTrackUrl ?? "",
        voiceUrl: voiceUrl ?? "",
        voiceLanguage,
      };

      if (media) {
        await updateAdminMedia(media.id, payload);
      } else {
        await createAdminMedia(payload);
      }

      toast(
        media
          ? t("content.updated")
          : status === "PUBLIE"
            ? t("content.published")
            : t("content.draftSaved"),
        { description: `${labelOf(kind)} · ${title.trim()}` },
      );
      onCreated?.();
    } catch {
      setError(t("common.saveFailed"));
    } finally {
      setSaving(false);
    }
  }

  const actions = (
    <>
      <Button
        type="submit"
        form={inDrawer ? "new-content-form" : undefined}
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
    </>
  );

  return (
    <>
      {inDrawer ? (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--rule)] p-4 pr-12">
          <SheetTitle>
            {media ? t("admin.editContent") : t("admin.newContent")}
          </SheetTitle>
          <div className="flex flex-wrap items-center gap-4">{actions}</div>
        </div>
      ) : null}

      <div className={inDrawer ? "min-h-0 flex-1 overflow-y-auto" : undefined}>
        <form
          id="new-content-form"
          onSubmit={handleSubmit}
          className="panel grid gap-8 lg:grid-cols-[1.35fr_1fr]"
        >
          <div className="space-y-6">
            {inDrawer ? null : (
              <div className="flex flex-wrap items-center gap-6 border-b border-[var(--rule)] pb-6">
                {actions}
              </div>
            )}

        {error ? (
          <p
            role="alert"
            className="border-l-2 border-destructive pl-3 text-[12.5px] text-destructive"
          >
            {error}
          </p>
        ) : null}

        <Tabs defaultValue="citation" className="gap-6">
          <TabsList>
            <TabsTrigger value="citation">{t("content.tabQuote")}</TabsTrigger>
            <TabsTrigger value="images">{t("content.tabImages")}</TabsTrigger>
            <TabsTrigger value="vocal">{t("content.tabVoice")}</TabsTrigger>
          </TabsList>

          <TabsContent value="citation" className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="format" className="eyebrow">
              {t("admin.format")}
            </Label>
            <select
              id="format"
              value={kind}
              onChange={(event) => setKind(event.target.value)}
              aria-label={t("admin.format")}
              className="h-10 w-full border-0 border-b border-[var(--rule)] bg-transparent text-[13.5px] focus:border-sage-300 focus:outline-none"
            >
              {formatOptions.map((format) => (
                <option key={format.code} value={format.code}>
                  {labelOf(format.code)}
                </option>
              ))}
            </select>
            {kindDescriptionKeys[kind as MediaKind] ? (
              <p className="text-[11px] leading-relaxed text-foreground/60">
                {t(kindDescriptionKeys[kind as MediaKind])}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="language" className="eyebrow">
              {t("content.sourceLanguage")}
            </Label>
            <select
              id="language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="h-10 w-full border-0 border-b border-[var(--rule)] bg-transparent text-[13.5px] focus:border-sage-300 focus:outline-none"
            >
              {languages.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

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
            <Label htmlFor="quote" className="eyebrow">
              {t("content.quoteSource")}
            </Label>
            <textarea
              id="quote"
              value={quote}
              onChange={(event) => setQuote(event.target.value)}
              rows={3}
              className={textareaClass}
            />
            <p className="text-[11px] leading-relaxed text-foreground/60">
              {t("content.quoteAutomaticNote")}
            </p>

            <div className="space-y-2">
              <Label htmlFor="quote-prompt" className="eyebrow">
                {t("content.prompt")}
              </Label>
              <textarea
                id="quote-prompt"
                value={promptQuote}
                onChange={(event) => setPromptQuote(event.target.value)}
                rows={3}
                placeholder={t("content.promptPlaceholder")}
                className={textareaClass}
              />
            </div>

            <button
              type="button"
              onClick={() => void generateQuotes()}
              disabled={generating}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--rule-strong)] px-2.5 text-[11px] text-foreground/75 transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            >
              <Sparkles aria-hidden className="size-3" />
              {generating
                ? t("content.generating")
                : t("content.generateQuotes")}
            </button>

            {candidates.length > 0 ? (
              <ul className="space-y-2 border border-[var(--rule)] bg-muted/40 p-3">
                {candidates.map((candidate, index) => (
                  <li key={`${index}-${candidate.quote_fr}`}>
                    <button
                      type="button"
                      onClick={() => applyCandidate(candidate)}
                      className="w-full text-left text-[12.5px] leading-relaxed text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {candidate.quote_fr}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
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

          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-prompt" className="eyebrow">
                {t("content.prompt")}
              </Label>
              <textarea
                id="image-prompt"
                value={promptImages}
                onChange={(event) => setPromptImages(event.target.value)}
                rows={4}
                className={textareaClass}
              />
            </div>

            <div className="space-y-2">
              <p className="eyebrow">{t("content.sentences")}</p>
              <ul className="space-y-1 text-[12px] leading-relaxed text-foreground/70">
                {sentences.map((sentence, index) => (
                  <li key={`${index}-${sentence}`}>{sentence}</li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => void generateScenes()}
              disabled={generatingImages || sentences.length === 0}
              className={generateButtonClass}
            >
              <Images aria-hidden className="size-3.5" />
              {generatingImages
                ? t("content.generating")
                : t("content.generateImages")}
            </button>

            {sceneImages.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {sceneImages.map((image, index) => (
                  <figure key={`${index}-${image.url}`} className="space-y-1">
                    <div className="relative">
                      <Image
                        src={image.url}
                        alt=""
                        width={1080}
                        height={1920}
                        unoptimized
                        className="aspect-[9/16] w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setSceneImages((current) =>
                            current.filter((item) => item.url !== image.url),
                          )
                        }
                        aria-label={t("common.remove")}
                        className="absolute top-1 right-1 inline-flex size-6 items-center justify-center rounded-full bg-black/60 text-[11px] text-white transition-colors hover:bg-black/80"
                      >
                        ×
                      </button>
                    </div>
                    <figcaption className="text-[10.5px] leading-snug text-foreground/50">
                      {image.sentence}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : null}
          </TabsContent>

          <TabsContent value="vocal" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="voice-language" className="eyebrow">
                {t("content.sourceLanguage")}
              </Label>
              <select
                id="voice-language"
                value={voiceLanguage}
                onChange={(event) => setVoiceLanguage(event.target.value)}
                className={fieldClass}
              >
                {languages.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-[11px] leading-relaxed text-foreground/60">
              {t("content.voiceNote")}
            </p>

            <button
              type="button"
              onClick={() => void generateVoice()}
              disabled={generatingVoice || !quote.trim()}
              className={generateButtonClass}
            >
              <Sparkles aria-hidden className="size-3.5" />
              {generatingVoice
                ? t("content.generating")
                : t("content.generateVoice")}
            </button>

            {voiceUrl ? (
              <audio controls src={voiceUrl} className="w-full" />
            ) : null}
          </TabsContent>

        </Tabs>

        <fieldset className="space-y-6">
          <legend className="eyebrow">{t("content.mediaAndText")}</legend>

          <div className="grid gap-6 sm:grid-cols-2">
            {kind === "VIDEO" ? null : (
              <div className="space-y-2">
                <Label htmlFor="poster" className="eyebrow">
                  {t("content.posterFile")}{" "}
                  <span className="normal-case">{t("common.optional")}</span>
                </Label>
                <input
                  id="poster"
                  type="file"
                  accept="image/*"
                  onChange={(event) => selectFile(event, "poster")}
                  className={fileClass}
                />
                {posterFile ? (
                  <p className="truncate text-[11px] text-foreground/60">
                    {posterFile.name}
                  </p>
                ) : posterUrl ? (
                  <p className="truncate text-[11px] text-foreground/60">
                    {posterUrl}
                  </p>
                ) : null}
              </div>
            )}

            {kind === "VIDEO" ? (
              <div className="space-y-2">
                <Label htmlFor="video" className="eyebrow">
                  {t("content.videoFile")}{" "}
                  <span className="normal-case">{t("common.optional")}</span>
                </Label>
                <input
                  id="video"
                  type="file"
                  accept="video/*,.m3u8"
                  onChange={(event) => selectFile(event, "video")}
                  className={fileClass}
                />
                {videoFile ? (
                  <p className="truncate text-[11px] text-foreground/60">
                    {videoFile.name}
                  </p>
                ) : mediaUrl ? (
                  <p className="truncate text-[11px] text-foreground/60">
                    {mediaUrl}
                  </p>
                ) : null}
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


          </div>

          <div className="space-y-2">
            <Label htmlFor="music-library" className="eyebrow">
              {t("admin.music")}
            </Label>
            <select
              id="music-library"
              value={musicTrackUrl ?? ""}
              onChange={(event) => setMusicTrackUrl(event.target.value || null)}
              className="h-10 w-full border-0 border-b border-[var(--rule)] bg-transparent text-[13.5px] focus:border-sage-300 focus:outline-none"
            >
              <option value="">{t("admin.noMusic")}</option>
              {musicTracks.map((track) => (
                <option key={track.id} value={track.url}>
                  {track.url.split("/").pop()} ·{" "}
                  {Math.round(track.durationMs / 1000)} s
                </option>
              ))}
            </select>
            {musicTrackUrl ? (
              <audio controls src={musicTrackUrl} className="mt-2 w-full" />
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
      </div>

      <aside className="lg:sticky lg:top-0 lg:self-start">
        <p className="eyebrow">{t("content.preview")}</p>
        <div className="mt-4 border border-[var(--rule)] p-3">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-deep dark:bg-card">
            {videoPreview ? (
              <video
                src={`${videoPreview}#t=1`}
                muted
                playsInline
                preload="metadata"
                className="absolute inset-0 size-full object-cover"
              />
            ) : posterPreview || posterUrl ? (
              <Image
                src={(posterPreview ?? posterUrl) as string}
                alt=""
                fill
                sizes="(min-width: 1024px) 380px, 100vw"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_20%_10%,oklch(0.729_0.07_126.4_/_0.55),transparent_60%)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/5" />

            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <p className="text-[9.5px] uppercase tracking-[0.18em] text-paper/60">
                {mood}
              </p>
              <p className="display mt-2 text-[20px] leading-[1.2] text-paper">
                «&nbsp;
                {quote.trim() || t("content.previewPlaceholder")}
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
              {labelOf(kind)}
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
    </>
  );
}
