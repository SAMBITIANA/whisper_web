"use client";

import { useI18n } from "@/i18n/provider";

export function NoteSection() {
  const { t } = useI18n();

  return (
        <aside className="mx-auto mt-12 w-full max-w-[1180px] px-5 sm:px-8">
          <div className="grid gap-8 border-y border-[var(--rule)] py-8 md:grid-cols-[6rem_1fr] md:gap-14">
            <p className="eyebrow md:pt-2">{t("home.note.label")}</p>
            <p className="font-serif text-[clamp(1.15rem,2vw,1.5rem)] leading-[1.5] text-pretty text-foreground/75">
              {t("home.note.body")}
            </p>
          </div>
        </aside>
  );
}
