import type { MediaKind } from "@/lib/fake-data";

export type DraftContent = {
  id: string;
  kind: MediaKind;
  title: string;
  sourceSlug: string;
  sourceTitle: string;
  character: string;
  quoteFr: string;
  quoteEn: string;
  topics: string[];
  mood: string;
  durationSec: number;
  poster: string;
  status: "BROUILLON" | "PUBLIE";
  createdAt: string;
};

export const CONTENTS_STORAGE_KEY = "whispers_contents";

export function parseDuration(value: string): number {
  const match = value.trim().match(/^(\d+):([0-5]\d)$/);
  if (!match) return 0;
  return Number(match[1]) * 60 + Number(match[2]);
}
