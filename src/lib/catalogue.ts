import { localeLabels, locales } from "@/i18n/config";
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

export const sourceLabels: Record<SourceKind, string> = {
  FILM: "Film",
  SERIES: "Série",
  CARTOON: "Dessin animé",
  BOOK: "Livre",
  SONG: "Chanson",
  SPEECH: "Discours",
  PROVERB: "Proverbe",
  PERSONAL: "Citation personnelle",
};

export const mediaKindLabels: Record<MediaKind, string> = {
  VIDEO: "Vidéo",
  IMAGE: "Image",
  SEQUENCE: "Galerie",
  TRACK: "Chanson",
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
