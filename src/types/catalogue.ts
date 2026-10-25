import type { Locale } from "@/i18n/config";

export type MediaKind = "VIDEO" | "IMAGE" | "SEQUENCE" | "TRACK";

export type SourceKind =
  | "FILM"
  | "SERIES"
  | "CARTOON"
  | "BOOK"
  | "SONG"
  | "SPEECH"
  | "PROVERB"
  | "PERSONAL";

export type LanguageCode = Locale;

export type CatalogueSource = {
  slug: string;
  kind: SourceKind;
  title: string;
  poster?: string;
  year?: number;
  author?: string;
  character?: string;
  locator?: string;
};

export type CatalogueMedia = {
  slug: string;
  kind: MediaKind;
  title: string;
  quote: Partial<Record<LanguageCode, string>> & { fr: string };
  source: CatalogueSource;
  topics: string[];
  mood: string;
  durationSec: number;
  views: number;
  likes: number;
  comments: number;
  publishedAt: string;
  poster: string;
  gradient: string;
  items?: number;
  language?: string;
  featured?: boolean;
  community?: boolean;
};
