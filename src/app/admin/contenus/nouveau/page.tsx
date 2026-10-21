"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  CONTENTS_STORAGE_KEY,
  parseDuration,
  type DraftContent,
} from "@/lib/fake-content";
import {
  mediaKindLabels,
  moods,
  sources,
  type MediaKind,
} from "@/lib/fake-data";
import { useStoredList } from "@/lib/use-stored-list";

const kindDescriptions: Record<MediaKind, string> = {
  VIDEO: "Vidéo HLS avec piste de texte superposée.",
  IMAGE: "Image fixe avec texte en surimpression.",
  SEQUENCE: "Galerie d’images, format story.",
  TRACK: "Chanson avec paroles synchronisées.",
};

const fieldClass =
  "h-10 w-full rounded-none border-0 border-b border-[var(--rule)] bg-transparent px-0 text-[13.5px] shadow-none placeholder:text-foreground/30 focus-visible:border-sage-300 focus-visible:ring-0 dark:bg-transparent";

const textareaClass =
  "w-full resize-none border border-[var(--rule-strong)] bg-transparent p-3 text-[13.5px] leading-relaxed placeholder:text-foreground/30 focus:border-sage-300 focus:outline-none";

export default function NouveauContenuPage() {
  const router = useRouter();
  const { update } = useStoredList<DraftContent>(CONTENTS_STORAGE_KEY, []);
  const [kind, setKind] = useState<MediaKind>("VIDEO");
  const [title, setTitle] = useState("");
  const [sourceSlug, setSourceSlug] = useState(sources[0]?.slug ?? "");
  const [character, setCharacter] = useState("");
  const [quoteFr, setQuoteFr] = useState("");
  const [quoteEn, setQuoteEn] = useState("");
  const [topics, setTopics] = useState("");
  const [mood, setMood] = useState(moods[0] ?? "Calme");
  const [duration, setDuration] = useState("0:42");
  const [mediaUrl, setMediaUrl] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [itemsCount, setItemsCount] = useState("6");
  const [lyrics, setLyrics] = useState(true);
  const [status, setStatus] = useState<"BROUILLON" | "PUBLIE">("BROUILLON");
  const [error, setError] = useState<string | null>(null);

  const source = sources.find((item) => item.slug === sourceSlug);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!title.trim() || !quoteFr.trim()) {
      setError("Le titre et la citation française sont obligatoires.");
      return;
    }

    const draft: DraftContent = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `draft-${Date.now()}`,
      kind,
      title: title.trim(),
      sourceSlug,
      sourceTitle: source?.title ?? "Source non renseignée",
      character: character.trim(),
      quoteFr: quoteFr.trim(),
      quoteEn: quoteEn.trim(),
      topics: topics
        .split(",")
        .map((topic) => topic.trim())
        .filter(Boolean),
      mood,
      durationSec: kind === "IMAGE" ? 0 : parseDuration(duration),
      poster: posterUrl.trim(),
      status,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    update((current) => [draft, ...current]);
    toast(
      status === "PUBLIE"
        ? "Contenu publié (maquette)"
        : "Brouillon enregistré (maquette)",
      {
        description: `${mediaKindLabels[kind]} · ${draft.title}`,
      },
    );
    router.push("/admin/contenus");
  }

  return (
    <div className="space-y-10">
      <Link
        href="/admin/contenus"
        className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-foreground/45 transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
        Retour aux contenus
      </Link>

      <header className="border-b border-[var(--rule)] pb-7">
        <p className="eyebrow">Administration</p>
        <h1 className="display mt-4 text-[clamp(2rem,4vw,2.9rem)] leading-[1.04]">
          Nouveau contenu
        </h1>
        <p className="mt-3 max-w-2xl font-serif text-[14.5px] italic leading-relaxed text-foreground/55">
          Le texte reste une couche séparée : il sera saisi ici en français et
          en anglais, puis posé sur le média.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid gap-12 lg:grid-cols-[1.35fr_1fr]"
      >
        <div className="space-y-10">
          <fieldset>
            <legend className="eyebrow">Format</legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(Object.keys(mediaKindLabels) as MediaKind[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setKind(value)}
                  aria-pressed={kind === value}
                  className={
                    kind === value
                      ? "border border-sage-300 p-3 text-left"
                      : "border border-[var(--rule)] p-3 text-left transition-colors hover:border-[var(--rule-strong)]"
                  }
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="display text-[16px]">
                      {mediaKindLabels[value]}
                    </span>
                    {kind === value ? (
                      <Check className="size-3.5 text-sage-600 dark:text-sage-100" />
                    ) : null}
                  </span>
                  <span className="mt-1 block text-[11px] leading-relaxed text-foreground/45">
                    {kindDescriptions[value]}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title" className="eyebrow">
                Titre du média
              </Label>
              <input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Le dernier train de minuit"
                className={fieldClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source" className="eyebrow">
                Source
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
                Personnage <span className="normal-case">(facultatif)</span>
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
                Citation — français
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
                Citation — anglais
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
                Thèmes
              </Label>
              <input
                id="topics"
                value={topics}
                onChange={(event) => setTopics(event.target.value)}
                placeholder="Voyage, Persévérance"
                className={fieldClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mood" className="eyebrow">
                Humeur
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
            <legend className="eyebrow">Média et piste de texte</legend>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="poster" className="eyebrow">
                  Visuel (URL)
                </Label>
                <input
                  id="poster"
                  value={posterUrl}
                  onChange={(event) => setPosterUrl(event.target.value)}
                  placeholder="/media/… ou https://cdn…"
                  className={fieldClass}
                />
              </div>

              {kind === "VIDEO" ? (
                <div className="space-y-2">
                  <Label htmlFor="hls" className="eyebrow">
                    Playlist HLS
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
                    Nombre d’images
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
                    Durée (m:ss)
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
                    ? "Paroles synchronisées"
                    : "Piste de texte traduisible"}
                </p>
                <p className="mt-1 text-[11px] text-foreground/40">
                  Couche séparée, jamais incrustée dans le média.
                </p>
              </div>
              <Switch
                checked={lyrics}
                onCheckedChange={setLyrics}
                aria-label="Activer la piste de texte"
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
              className="h-10 rounded-none px-5 text-[11px] uppercase tracking-[0.16em]"
            >
              {status === "PUBLIE" ? "Publier" : "Enregistrer le brouillon"}
            </Button>

            <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-foreground/50">
              <input
                type="checkbox"
                checked={status === "PUBLIE"}
                onChange={(event) =>
                  setStatus(event.target.checked ? "PUBLIE" : "BROUILLON")
                }
                className="size-3.5 accent-[var(--color-sage-600)]"
              />
              Publier immédiatement
            </label>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow">Aperçu</p>
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
                  {quoteFr.trim() || "La citation apparaîtra ici."}
                  &nbsp;»
                </p>
                <p className="mt-3 text-[9.5px] uppercase tracking-[0.15em] text-paper/60">
                  {source?.title ?? "Source"}
                  {character ? ` · ${character}` : ""}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[9.5px] uppercase tracking-[0.15em] text-foreground/40">
                {mediaKindLabels[kind]}
                {kind !== "IMAGE" && duration ? ` · ${duration}` : ""}
              </span>
              <span className="text-[9.5px] uppercase tracking-[0.14em] text-foreground/30">
                {posterUrl ? "Visuel fourni" : "Visuel à venir"}
              </span>
            </div>
          </div>

          <ul className="mt-6 space-y-2.5 border-t border-[var(--rule)] pt-5 text-[11.5px] leading-relaxed text-foreground/45">
            <li>Citation courte, crédit et lien vers la source obligatoires.</li>
            <li>Aucune image d’œuvre protégée par défaut (§5.4).</li>
            <li>La traduction anglaise peut rester vide à la création.</li>
          </ul>
        </aside>
      </form>
    </div>
  );
}
