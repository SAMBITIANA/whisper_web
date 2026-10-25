import { cookies } from "next/headers";

import {
  defaultLocale,
  isLocale,
  messages,
  type Locale,
  type MessageKey,
} from "./config";

type Variables = Record<string, string | number>;

export async function getServerI18n(): Promise<{
  locale: Locale;
  t: (key: MessageKey, variables?: Variables) => string;
}> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("locale")?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;
  const catalog = messages[locale] as Record<string, string>;
  const fallback = messages[defaultLocale] as Record<string, string>;

  const t = (key: MessageKey, variables?: Variables) => {
    const template = catalog[key] ?? fallback[key] ?? key;

    if (!variables) return template;

    return template.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in variables ? String(variables[name]) : match,
    );
  };

  return { locale, t };
}
