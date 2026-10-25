"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  defaultLocale,
  isRtl,
  messages,
  type Locale,
  type MessageKey,
} from "./config";

type Variables = Record<string, string | number>;

type I18nValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey, variables?: Variables) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = nextLocale;
    document.documentElement.dir = isRtl(nextLocale) ? "rtl" : "ltr";
    router.refresh();
  }, [router]);

  const t = useCallback(
    (key: MessageKey, variables?: Variables) => {
      const catalog = messages[locale] as Record<string, string>;
      const fallback = messages[defaultLocale] as Record<string, string>;
      const template = catalog[key] ?? fallback[key] ?? key;

      if (!variables) return template;

      return template.replace(/\{(\w+)\}/g, (match, name: string) =>
        name in variables ? String(variables[name]) : match,
      );
    },
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return <I18nContext value={value}>{children}</I18nContext>;
}

export function useI18n(): I18nValue {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return context;
}
