"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/provider";

export function SectionHeading({
  index,
  title,
  note,
  href,
  linkLabel,
}: {
  index?: string;
  title: string;
  note?: string;
  href?: string;
  linkLabel?: string;
}) {
  const { t } = useI18n();

  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-[var(--rule)] pb-3">
      <div className="flex items-baseline gap-4">
        {index ? (
          <span className="font-mono text-[11px] text-foreground/35">
            {index}
          </span>
        ) : null}
        <div>
          <h2 className="display text-[22px] leading-none">{title}</h2>
          {note ? (
            <p className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-foreground/65">
              {note}
            </p>
          ) : null}
        </div>
      </div>

      {href ? (
        <Link
          href={href}
          className="link-underline text-[11px] uppercase tracking-[0.16em] text-foreground/65 transition-colors hover:text-foreground"
        >
          {linkLabel ?? t("common.seeAll")}
        </Link>
      ) : null}
    </div>
  );
}
