"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Music2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useI18n } from "@/i18n/provider";
import {
  deleteAdminMusic,
  errorMessage,
  fetchAdminMusic,
  fetchTaxonomy,
  generateAdminMusic,
  type ApiAdminMusic,
} from "@/lib/api";
import { useRequiredSession } from "@/lib/use-required-session";

const fieldClass =
  "h-10 w-full rounded-md border border-[var(--rule)] bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-sage-600 focus:outline-none dark:focus:border-sage-300";

export default function AdminMusicPage() {
  const { t } = useI18n();
  const { user, ready } = useRequiredSession(["EDITOR", "ADMIN"]);

  if (!ready || !user) {
    return <div className="h-32 animate-pulse rounded-lg bg-foreground/5" />;
  }

  if (user.role !== "ADMIN") {
    return (
      <div className="rounded-lg border border-[var(--rule)] bg-card p-8 text-center">
        <p className="text-sm font-medium text-foreground">
          {t("admin.adminsOnly")}
        </p>
        <Link
          href="/admin"
          className="mt-3 inline-block text-xs font-medium text-sage-600 hover:underline dark:text-sage-100"
        >
          {t("admin.backToDashboard")}
        </Link>
      </div>
    );
  }

  return <MusicContent />;
}

function MusicContent() {
  const { t } = useI18n();
  const [tracks, setTracks] = useState<ApiAdminMusic[]>([]);
  const [moods, setMoods] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedMoods, setSelectedMoods] = useState<string[]>(["Calme"]);
  const [duration, setDuration] = useState(30);
  const [prompt, setPrompt] = useState(
    "melancholic lo-fi hip hop instrumental, nostalgic piano chords, soft vinyl crackle, slow tempo, instrumental only, no vocals, loopable",
  );

  function reload() {
    void fetchAdminMusic()
      .then(setTracks)
      .catch(() => toast(t("admin.loadMusicError")))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    void fetchTaxonomy()
      .then((taxonomy) => setMoods(taxonomy.moods.map((item) => item.name)))
      .catch(() => setMoods([]));
    void fetchAdminMusic()
      .then(setTracks)
      .catch(() => toast(t("admin.loadMusicError")))
      .finally(() => setLoading(false));
  }, [t]);

  async function generate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGenerating(true);

    try {
      await generateAdminMusic({
        moods: selectedMoods,
        durationSec: duration,
        instructions: prompt.trim() || undefined,
      });
      setOpen(false);
      reload();
      toast(t("admin.musicAdded"));
    } catch (error) {
      toast(errorMessage(error, t("content.generateError")));
    } finally {
      setGenerating(false);
    }
  }

  async function remove(track: ApiAdminMusic) {
    if (!window.confirm(t("admin.confirmDeleteMusic"))) {
      return;
    }

    setDeleting(track.id);

    try {
      await deleteAdminMusic(track.id);
      reload();
    } catch (error) {
      toast(errorMessage(error, t("common.updateFailed")));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-[var(--rule)] bg-card">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-lg border-b border-[var(--rule)] bg-muted/60 p-4">
          <div className="flex items-baseline gap-3">
            <h2 className="text-sm font-semibold text-foreground">
              {t("admin.music")}
            </h2>
            <span className="text-xs tabular-nums text-muted-foreground">
              {tracks.length}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-sage-600 px-3 text-[11px] font-medium text-white transition-colors hover:bg-sage-900 dark:bg-sage-300 dark:text-sage-900 dark:hover:bg-sage-100"
          >
            <Plus aria-hidden className="size-3" />
            {t("admin.musicGenerate")}
          </button>
        </div>

        {loading ? (
          <div className="p-4">
            <div className="h-24 animate-pulse rounded-md bg-foreground/5" />
          </div>
        ) : tracks.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            {t("admin.noMusic")}
          </p>
        ) : (
          <ul className="divide-y divide-[var(--rule)]">
            {tracks.map((track) => (
              <li
                key={track.id}
                className="flex flex-wrap items-center gap-3 p-4"
              >
                <audio
                  controls
                  src={track.url}
                  className="h-9 min-w-[16rem] flex-1"
                />
                <span className="text-[11px] text-muted-foreground">
                  {track.moodTags ?? track.provider ?? "—"} ·{" "}
                  {Math.round(track.durationMs / 1000)} s
                </span>
                <button
                  type="button"
                  onClick={() => void remove(track)}
                  disabled={deleting === track.id}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--rule-strong)] px-2.5 text-[11px] text-foreground/60 transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
                >
                  <Trash2 aria-hidden className="size-3" />
                  {t("common.remove")}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="gap-0 data-[side=right]:w-full! sm:max-w-lg!"
        >
          <SheetHeader className="border-b border-[var(--rule)]">
            <div className="flex items-center gap-2">
              <Music2
                aria-hidden
                className="size-4 text-sage-600 dark:text-sage-100"
              />
              <SheetTitle>{t("admin.musicGenerate")}</SheetTitle>
            </div>
            <SheetDescription className="text-xs">
              {t("admin.musicGenerateNote")}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={generate} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <div className="space-y-2">
                <span className="eyebrow">{t("content.mood")}</span>
                <div className="flex flex-wrap gap-2">
                  {moods.map((item) => {
                    const active = selectedMoods.includes(item);

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          setSelectedMoods((current) =>
                            current.includes(item)
                              ? current.length > 1
                                ? current.filter((value) => value !== item)
                                : current
                              : [...current, item],
                          )
                        }
                        aria-pressed={active}
                        className={
                          active
                            ? "border border-sage-600 bg-sage-600/10 px-2.5 py-1 text-[11px] text-foreground dark:border-sage-300 dark:bg-sage-300/15"
                            : "border border-[var(--rule-strong)] px-2.5 py-1 text-[11px] text-foreground/60 transition-colors hover:border-sage-600 hover:text-foreground dark:hover:border-sage-300"
                        }
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="music-duration" className="eyebrow">
                  {t("content.durationSec")}
                </Label>
                <input
                  id="music-duration"
                  type="number"
                  min={5}
                  max={180}
                  value={duration}
                  onChange={(event) => setDuration(Number(event.target.value))}
                  className={fieldClass}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="music-prompt" className="eyebrow">
                  {t("content.prompt")}
                </Label>
                <textarea
                  id="music-prompt"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  rows={5}
                  className="w-full resize-none border border-[var(--rule-strong)] bg-transparent p-3 text-[12.5px] leading-relaxed focus:border-sage-300 focus:outline-none"
                />
              </div>
            </div>

            <SheetFooter className="border-t border-[var(--rule)]">
              <button
                type="submit"
                disabled={generating}
                className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-md bg-sage-600 px-4 text-xs font-medium text-white transition-colors hover:bg-sage-900 disabled:opacity-50 dark:bg-sage-300 dark:text-sage-900 dark:hover:bg-sage-100"
              >
                {generating
                  ? t("content.generating")
                  : t("content.generateMusic")}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-10 w-full rounded-md border border-[var(--rule-strong)] px-3 text-xs text-foreground/75 transition-colors hover:bg-muted hover:text-foreground"
              >
                {t("common.cancel")}
              </button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
