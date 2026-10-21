import Link from "next/link";

export function SectionHeading({
  index,
  title,
  note,
  href,
  linkLabel = "Tout voir",
}: {
  index?: string;
  title: string;
  note?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-[var(--rule)] pb-4">
      <div className="flex items-baseline gap-4">
        {index ? (
          <span className="font-mono text-[11px] text-foreground/35">
            {index}
          </span>
        ) : null}
        <div>
          <h2 className="display text-[26px] leading-none">{title}</h2>
          {note ? (
            <p className="mt-2.5 text-[11px] uppercase tracking-[0.14em] text-foreground/45">
              {note}
            </p>
          ) : null}
        </div>
      </div>

      {href ? (
        <Link
          href={href}
          className="link-underline text-[11px] uppercase tracking-[0.16em] text-foreground/55 transition-colors hover:text-foreground"
        >
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}
