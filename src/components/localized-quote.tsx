"use client";

import { useI18n } from "@/i18n/provider";
import type { ApiMedia } from "@/lib/api";
import { getQuote } from "@/lib/catalogue";

export function LocalizedQuote({ item }: { item: ApiMedia }) {
  const { locale } = useI18n();

  return <>{getQuote(item, locale)}</>;
}
