import ar from "./messages/ar.json";
import de from "./messages/de.json";
import en from "./messages/en.json";
import es from "./messages/es.json";
import fr from "./messages/fr.json";
import hi from "./messages/hi.json";
import it from "./messages/it.json";
import ja from "./messages/ja.json";
import mg from "./messages/mg.json";
import pt from "./messages/pt.json";
import ru from "./messages/ru.json";
import tr from "./messages/tr.json";
import zh from "./messages/zh.json";

export const messages = {
  fr,
  en,
  mg,
  es,
  de,
  it,
  pt,
  ar,
  zh,
  ja,
  hi,
  ru,
  tr,
};

export type Locale = keyof typeof messages;
export type MessageKey = keyof typeof messages.fr;

export const locales = Object.keys(messages) as Locale[];
export const defaultLocale: Locale = "fr";
export const rtlLocales: Locale[] = ["ar"];

export const localeLabels: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  mg: "Malagasy",
  es: "Español",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
  ar: "العربية",
  zh: "中文",
  ja: "日本語",
  hi: "हिन्दी",
  ru: "Русский",
  tr: "Türkçe",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return Boolean(value && value in messages);
}

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}
