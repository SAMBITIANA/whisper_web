import { localeLabels, locales, type MessageKey } from "@/i18n/config";
import { typography } from "@/lib/format";
import type {
  CatalogueMedia,
  LanguageCode,
  MediaKind,
  SourceKind,
} from "@/types/catalogue";

export const languages: { code: LanguageCode; label: string }[] = locales.map(
  (code) => ({ code, label: localeLabels[code] }),
);

export const sourceKindKeys: Record<SourceKind, MessageKey> = {
  FILM: "sourceKind.film",
  SERIES: "sourceKind.series",
  CARTOON: "sourceKind.cartoon",
  BOOK: "sourceKind.book",
  SONG: "sourceKind.song",
  SPEECH: "sourceKind.speech",
  PROVERB: "sourceKind.proverb",
  PERSONAL: "sourceKind.personal",
};

export const mediaKindKeys: Record<MediaKind, MessageKey> = {
  VIDEO: "mediaKind.video",
  IMAGE: "mediaKind.image",
  SEQUENCE: "mediaKind.sequence",
  TRACK: "mediaKind.track",
};

export function getQuote(
  item: CatalogueMedia,
  language: LanguageCode,
): string {
  return typography(item.quote[language] ?? item.quote.fr);
}

export type {
  CatalogueMedia,
  CatalogueSource,
  LanguageCode,
  MediaKind,
  SourceKind,
} from "@/types/catalogue";
