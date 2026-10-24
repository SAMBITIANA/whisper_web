"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Bookmark,
  Copy,
  Heart,
  Pause,
  Play,
  Share2,
  Volume2,
} from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MediaPoster } from "@/components/media-poster";
import { getQuote, type LanguageCode } from "@/lib/fake-data";
import { formatDuration, formatViews, typography } from "@/lib/format";
import {
  recordView,
  removeReaction,
  setReaction,
  toggleFavorite,
  type ApiMedia,
} from "@/lib/api";
import { useOptionalSession } from "@/components/session-provider";

export function FakePlayer({
  item,
  language: initialLanguage = "fr",
  autoPlay = false,
}: {
  item: ApiMedia;
  language?: LanguageCode;
  autoPlay?: boolean;
}) {
  const session = useOptionalSession();
  const user = session?.user ?? null;
  const [language, setLanguage] = useState<LanguageCode>(initialLanguage);
  const [playing, setPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const [saved, setSaved] = useState(Boolean(item.userState?.saved));
  const [reaction, setReactionState] = useState(item.userState?.reaction ?? null);

  useEffect(() => {
    void recordView(item.slug).catch(() => undefined);
  }, [item.slug]);

  async function requireAccount() {
    if (user) return true;
    toast("Connectez-vous pour utiliser cette action.");
    return false;
  }

  async function toggleSaved() {
    if (!(await requireAccount())) return;
    try {
      const result = await toggleFavorite(item.slug, saved);
      setSaved(result.saved);
    } catch {
      toast("Action impossible.");
    }
  }

  async function toggleReaction() {
    if (!(await requireAccount())) return;
    try {
      if (reaction) {
        await removeReaction(item.slug);
        setReactionState(null);
      } else {
        const result = await setReaction(item.slug, "LIKE");
        setReactionState(result.reaction);
      }
    } catch {
      toast("Action impossible.");
    }
  }

  useEffect(() => {
    if (!playing || item.durationSec === 0) return;
    const timer = setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          setPlaying(false);
          return 0;
        }
        return current + 100 / (item.durationSec * 10);
      });
    }, 100);
    return () => clearInterval(timer);
  }, [playing, item.durationSec]);

  const isImage = item.kind === "IMAGE";
  const elapsed = Math.round((progress / 100) * item.durationSec);

  return (
    <div className="overflow-hidden border border-[var(--rule)] bg-card">
      <div className="group relative">
        <MediaPoster
          kind={item.kind}
          gradient={item.gradient}
          durationSec={item.durationSec}
          poster={item.poster}
          showIcon={false}
          showDuration={false}
          priority
          className={cn("w-full", isImage ? "aspect-[4/3]" : "aspect-video")}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/5" />

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
          <p className="text-[10px] uppercase tracking-[0.18em] text-paper/60">
            {item.mood}
          </p>
          <p className="display mt-3 max-w-3xl text-[clamp(1.35rem,2.5vw,2.15rem)] leading-[1.16] text-balance text-paper">
            <span className="text-sage-100">«</span>
            {getQuote(item, language)}
            <span className="text-sage-100">»</span>
          </p>
          <p className="mt-4 text-[10.5px] uppercase tracking-[0.15em] text-paper/60">
            {typography(item.source.title)}
            {item.source.character ? ` · ${typography(item.source.character)}` : ""}
            {item.source.locator ? ` · ${item.source.locator}` : ""}
          </p>
        </div>

        {isImage ? null : (
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-ink transition-transform duration-300 hover:scale-105"
            aria-label={playing ? "Mettre en pause" : "Lire"}
          >
            {playing ? (
              <Pause className="size-5 fill-current" />
            ) : (
              <Play className="size-5 translate-x-px fill-current" />
            )}
          </button>
        )}
      </div>

      {isImage ? null : (
        <div className="space-y-2.5 border-t border-[var(--rule)] px-5 py-4 sm:px-7">
          <div className="h-px w-full bg-foreground/15">
            <div
              className="h-px bg-sage-300 transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between font-mono text-[10.5px] text-foreground/60">
            <span>
              {formatDuration(elapsed)} / {formatDuration(item.durationSec)}
            </span>
            <span>{formatViews(item.views)} vues</span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-[var(--rule)] px-4 py-2.5 sm:px-5">
        <LanguageSwitcher
          value={language}
          onChange={setLanguage}
          className="h-8 rounded-none border-[var(--rule)] bg-transparent text-[11px] uppercase tracking-[0.12em] shadow-none"
        />

        <div className="ml-auto flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Réagir"
            aria-pressed={Boolean(reaction)}
            onClick={() => void toggleReaction()}
            className="rounded-full text-foreground/75 hover:bg-muted hover:text-foreground"
          >
            <Heart className={cn("size-4", reaction && "fill-current text-sage-600 dark:text-sage-300")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Enregistrer"
            aria-pressed={saved}
            onClick={() => void toggleSaved()}
            className="rounded-full text-foreground/75 hover:bg-muted hover:text-foreground"
          >
            <Bookmark className={cn("size-4", saved && "fill-current text-sage-600 dark:text-sage-300")} />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Copier la citation" className="rounded-full text-foreground/75 hover:bg-muted hover:text-foreground">
            <Copy className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Partager" className="rounded-full text-foreground/75 hover:bg-muted hover:text-foreground">
            <Share2 className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Volume" className="rounded-full text-foreground/75 hover:bg-muted hover:text-foreground">
            <Volume2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
