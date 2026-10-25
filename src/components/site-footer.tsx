"use client";

import Link from "next/link";
import { type MessageKey } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";

const explore: { href: string; labelKey: MessageKey }[] = [
  { href: "/catalogue", labelKey: "nav.catalogue" },
  { href: "/catalogue?type=VIDEO", labelKey: "nav.videos" },
  { href: "/catalogue?type=IMAGE", labelKey: "nav.images" },
  { href: "/catalogue?type=TRACK", labelKey: "nav.songs" },
];

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="mt-16 border-t border-[var(--rule)]">
      <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8">
        <div className="grid gap-10 py-14 md:grid-cols-[1.6fr_1fr_1.2fr]">
          <div>
            <p className="display text-[32px] leading-none">{t("brand.name")}</p>
            <p className="mt-4 max-w-[34ch] font-serif text-[15px] italic leading-relaxed text-foreground/60">
              {t("footer.description")}
            </p>
          </div>

          <nav className="space-y-2.5">
            <p className="eyebrow">{t("footer.explore")}</p>
            {explore.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="link-underline block w-fit text-[13px] text-foreground/65 transition-colors hover:text-foreground"
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          <div className="space-y-2.5">
            <p className="eyebrow">{t("footer.behind")}</p>
            <p className="text-[13px] leading-relaxed text-foreground/60">
              {t("footer.demo")}
            </p>
            <p className="font-serif text-[13px] italic leading-relaxed text-foreground/65">
              {t("footer.tech")}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--rule)] py-6">
          <p className="eyebrow">{t("footer.copyright")}</p>
          <p className="eyebrow">{t("footer.layer")}</p>
        </div>
      </div>
    </footer>
  );
}
