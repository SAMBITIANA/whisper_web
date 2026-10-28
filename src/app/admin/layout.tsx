"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Library,
  Settings,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { useSession } from "@/components/session-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { type MessageKey } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { fetchAdminDashboard } from "@/lib/api";
import { canManageUsers, initialsOf } from "@/lib/session";
import { useRequiredSession } from "@/lib/use-required-session";

const items: {
  href: string;
  labelKey: MessageKey;
  icon: LucideIcon;
  exact?: boolean;
  admin?: boolean;
}[] = [
  {
    href: "/admin",
    labelKey: "admin.dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  { href: "/admin/moderation", labelKey: "admin.moderation", icon: ShieldCheck },
  { href: "/admin/contenus", labelKey: "admin.contents", icon: Library },
  { href: "/admin/sources", labelKey: "admin.sources", icon: FileText },
  {
    href: "/admin/utilisateurs",
    labelKey: "admin.users",
    icon: Users,
    admin: true,
  },
  {
    href: "/admin/parametres",
    labelKey: "admin.settings",
    icon: Settings,
    admin: true,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  const pathname = usePathname();
  const { user, ready } = useRequiredSession();
  const { signOut } = useSession();
  const [pending, setPending] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState<boolean | null>(null);
  const settingsExpanded = settingsOpen ?? pathname.startsWith("/admin/parametres");

  useEffect(() => {
    if (!user || user.role === "USER") return;
    void fetchAdminDashboard()
      .then((dashboard) => setPending(dashboard.stats.pending))
      .catch(() => setPending(0));
  }, [user]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <AdminTopBar />
        <div className="mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-8">
          <div className="h-6 w-32 animate-pulse bg-foreground/10" />
          <div className="mt-6 h-14 w-1/2 animate-pulse bg-foreground/5" />
        </div>
      </div>
    );
  }

  if (user.role === "USER") {
    return (
      <div className="flex min-h-screen flex-col">
        <AdminTopBar />
        <div className="mx-auto flex w-full max-w-[1320px] flex-1 items-center px-5 py-8 sm:px-8">
          <div className="max-w-xl border-y border-[var(--rule)] py-12">
            <p className="eyebrow">{t("admin.restricted")}</p>
            <h1 className="display mt-4 text-[clamp(1.8rem,3vw,2.4rem)] leading-[1.06]">
              {t("admin.restrictedTitle")}
            </h1>
            <p className="mt-4 text-[13.5px] leading-relaxed text-foreground/65">
              {t("admin.restrictedBody")}
            </p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.15em]">
              <Link href="/compte" className="link-underline text-foreground/70">
                {t("common.account")}
              </Link>
              <Link href="/" className="link-underline text-foreground/65">
                {t("common.site")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const visibleItems = items.filter(
    (item) => !item.admin || canManageUsers(user.role),
  );

  return (
    <div className="flex min-h-screen flex-col">
      <AdminTopBar role={t(`roles.${user.role.toLowerCase()}` as MessageKey)} />

      <div className="mx-auto flex w-full max-w-[1320px] flex-1 flex-col lg:flex-row">
        <aside className="border-b border-[var(--rule)] px-5 py-6 sm:px-8 lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:px-6 lg:py-10">
          <p className="eyebrow hidden lg:block">{t("admin.navigation")}</p>

          <nav className="flex flex-wrap gap-x-5 gap-y-1 lg:mt-3 lg:flex-col lg:flex-nowrap lg:gap-0">
            {visibleItems.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const isSettings = item.href === "/admin/parametres";

              return (
                <Fragment key={item.href}>
                  {isSettings ? (
                    <button
                      type="button"
                      onClick={() => setSettingsOpen(!settingsExpanded)}
                      aria-expanded={settingsExpanded}
                      className={cn(
                        "flex shrink-0 items-center gap-2.5 whitespace-nowrap py-2 text-left text-[12px] transition-colors lg:-mx-2 lg:w-full lg:border-t lg:border-[var(--rule)] lg:px-2 lg:py-3",
                        active
                          ? "bg-sage-600/10 font-medium text-foreground shadow-[inset_2px_0_0_var(--color-sage-600)] dark:bg-sage-300/15 dark:shadow-[inset_2px_0_0_var(--color-sage-300)]"
                          : "text-foreground/65 hover:bg-sage-100/50 hover:text-foreground dark:hover:bg-sage-300/10",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "size-3.5",
                          active
                            ? "text-sage-600 dark:text-sage-300"
                            : "text-foreground/65",
                        )}
                      />
                      {t(item.labelKey)}
                      {settingsExpanded ? (
                        <ChevronDown className="ml-auto size-3.5" />
                      ) : (
                        <ChevronRight className="ml-auto size-3.5" />
                      )}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex shrink-0 items-center gap-2.5 whitespace-nowrap py-2 text-[12px] transition-colors lg:-mx-2 lg:w-full lg:border-t lg:border-[var(--rule)] lg:px-2 lg:py-3",
                        active
                          ? "bg-sage-600/10 font-medium text-foreground shadow-[inset_2px_0_0_var(--color-sage-600)] dark:bg-sage-300/15 dark:shadow-[inset_2px_0_0_var(--color-sage-300)]"
                          : "text-foreground/65 hover:bg-sage-100/50 hover:text-foreground dark:hover:bg-sage-300/10",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "size-3.5",
                          active
                            ? "text-sage-600 dark:text-sage-300"
                            : "text-foreground/65",
                        )}
                      />
                      {t(item.labelKey)}
                      {item.href === "/admin/moderation" && pending > 0 ? (
                        <span className="ml-auto hidden font-mono text-[10px] text-foreground/65 lg:inline">
                          {String(pending).padStart(2, "0")}
                        </span>
                      ) : null}
                    </Link>
                  )}
                  {isSettings && settingsExpanded ? (
                    <div className="flex w-full flex-col border-l border-[var(--rule)] pl-4 lg:ml-4">
                      <Link
                        href="/admin/parametres/langues"
                        className={cn(
                          "py-1.5 text-[11px] transition-colors",
                          pathname === "/admin/parametres/langues"
                            ? "font-medium text-foreground"
                            : "text-foreground/60 hover:text-foreground",
                        )}
                      >
                        {t("admin.languages")}
                      </Link>
                      <Link
                        href="/admin/parametres/formats"
                        className={cn(
                          "py-1.5 text-[11px] transition-colors",
                          pathname === "/admin/parametres/formats"
                            ? "font-medium text-foreground"
                            : "text-foreground/60 hover:text-foreground",
                        )}
                      >
                        {t("admin.formats")}
                      </Link>
                    </div>
                  ) : null}
                </Fragment>
              );
            })}
          </nav>

          <div className="mt-8 hidden border-t border-[var(--rule)] pt-5 lg:block">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full border border-[var(--rule-strong)] font-mono text-[10px] text-foreground/60">
                {initialsOf(user.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[12px] text-foreground/80">
                  {user.name}
                </p>
                <p className="text-[10px] uppercase tracking-[0.12em] text-foreground/65">
                  {t(`roles.${user.role.toLowerCase()}` as MessageKey)}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 text-[11px] uppercase tracking-[0.13em]">
              <Link
                href="/compte"
                className="text-foreground/65 transition-colors hover:text-foreground"
              >
                {t("common.account")}
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="text-left text-foreground/65 transition-colors hover:text-foreground"
              >
                {t("common.logout")}
              </button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminTopBar({ role }: { role?: string }) {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--rule)] bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-[64px] w-full max-w-[1320px] items-center gap-3 px-5 sm:px-8">
        <Link href="/admin" className="display text-[21px] leading-none">
          {t("brand.name")}
        </Link>
        <span aria-hidden className="h-4 w-px bg-[var(--rule-strong)]" />
        <span className="eyebrow">{t("common.admin")}</span>
        <span className="hidden border border-[var(--rule-strong)] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-foreground/65 sm:inline-block">
          {t("admin.mockup")}
        </span>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/"
            className="hidden items-center gap-1.5 text-[10.5px] uppercase tracking-[0.13em] text-foreground/65 transition-colors hover:text-foreground sm:inline-flex"
          >
            {t("admin.viewSite")}
            <ArrowUpRight className="size-3" />
          </Link>
          {role ? (
            <span className="hidden text-[10px] uppercase tracking-[0.12em] text-foreground/65 md:block">
              {role}
            </span>
          ) : null}
          <LocaleSwitcher className="h-8 rounded-full border border-[var(--rule-strong)] px-2.5 text-[11px] text-foreground/80 hover:border-sage-300 hover:bg-muted hover:text-foreground" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
