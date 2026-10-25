"use client";

import { useI18n } from "@/i18n/provider";

export function CatalogueHeader() {
  const { t } = useI18n();

  return (
    <header className="mb-5 border-b border-[var(--rule)] pb-4">
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
        <p className="eyebrow">{t("catalogue.title")}</p>
        <h1 className="display text-[clamp(1.55rem,2.6vw,2.1rem)] leading-[1.08]">
          {t("catalogue.heading")}
        </h1>
      </div>
      <p className="mt-1.5 max-w-2xl text-[13.5px] leading-snug text-foreground/60">
        {t("catalogue.description")}
      </p>
    </header>
  );
}
