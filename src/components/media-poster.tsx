import Image from "next/image";
import { Images, Music2, Play, ImageIcon } from "lucide-react";
import { cn } from "cn";
import type { MediaKind } from "@/lib/fake-data";
import { formatDuration } from "@/lib/format";

const kindIcons: Record<MediaKind, typeof Play> = {
  VIDEO: Play,
  IMAGE: ImageIcon,
  SEQUENCE: Images,
  TRACK: Music2,
};

export function MediaPoster({
  kind,
  gradient,
  durationSec,
  poster,
  className,
  showIcon = true,
  showDuration = true,
  priority = false,
}: {
  kind: MediaKind;
  gradient: string;
  durationSec: number;
  poster?: string;
  className?: string;
  showIcon?: boolean;
  showDuration?: boolean;
  priority?: boolean;
}) {
  const Icon = kindIcons[kind];

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-gradient-to-br",
        gradient,
        className,
      )}
    >
      {poster ? (
        <Image
          src={poster}
          alt=""
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.03]"
        />
      ) : null}

      <div className="absolute inset-0 bg-sage-900/20 mix-blend-multiply" />
      <div className="absolute inset-0 bg-[radial-gradient(110%_110%_at_15%_10%,rgba(255,255,255,0.2),transparent_60%)]" />
      <div className="absolute inset-0 ring-1 ring-inset ring-foreground/10" />

      {showIcon ? (
        <span className="absolute left-2.5 top-2.5 inline-flex size-7 items-center justify-center rounded-full bg-paper/85 text-ink backdrop-blur-sm">
          <Icon className="size-3.5" />
        </span>
      ) : null}

      {kind === "VIDEO" ? (
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid size-11 place-items-center rounded-full bg-paper/90 text-ink shadow-sm transition-transform duration-300 group-hover:scale-105">
            <Play className="size-4 translate-x-px fill-current" />
          </span>
        </span>
      ) : null}

      {showDuration ? (
        <span className="absolute bottom-2.5 right-2.5 bg-ink/70 px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-paper/95 backdrop-blur-sm">
          {durationSec > 0 ? formatDuration(durationSec) : "Image"}
        </span>
      ) : null}
    </div>
  );
}
