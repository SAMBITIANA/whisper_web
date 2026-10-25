"use client";

import { SectionHeading } from "@/components/section-heading";
import { type MessageKey } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";

const formats: {
  titleKey: MessageKey;
  descriptionKey: MessageKey;
}[] = [
  {
    titleKey: "home.formats.videoTitle",
    descriptionKey: "home.formats.videoDescription",
  },
  {
    titleKey: "home.formats.imageTitle",
    descriptionKey: "home.formats.imageDescription",
  },
  {
    titleKey: "home.formats.galleryTitle",
    descriptionKey: "home.formats.galleryDescription",
  },
  {
    titleKey: "home.formats.songTitle",
    descriptionKey: "home.formats.songDescription",
  },
];

export function FormatsSection() {
  const { t } = useI18n();

  return (
        <section className="mx-auto w-full max-w-[1180px] px-5 pt-10 sm:px-8">
          <SectionHeading
            index="04"
            title={t("home.formats.title")}
            note={t("home.formats.note")}
          />

          <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {formats.map((format, index) => (
              <div
                key={format.titleKey}
                className="border-t border-[var(--rule)] pt-4"
              >
                <span className="font-mono text-[10px] text-foreground/35">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <dt className="display mt-3 text-[20px] leading-none">
                  {t(format.titleKey)}
                </dt>
                <dd className="mt-2.5 text-[12.5px] leading-relaxed text-foreground/65">
                  {t(format.descriptionKey)}
                </dd>
              </div>
            ))}
          </dl>
        </section>
  );
}
