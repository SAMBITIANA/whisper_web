"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  FileText,
  LayoutDashboard,
  Library,
  ShieldCheck,
  Users,
} from "lucide-react";
import { cn } from "cn";
import { useSession } from "@/components/session-provider";
import { adminProposals } from "@/lib/fake-admin";
import { canManageUsers, initialsOf, roleLabels } from "@/lib/session";
import { useRequiredSession } from "@/lib/use-required-session";

const items = [
  {
    href: "/admin",
    label: "Tableau de bord",
    icon: LayoutDashboard,
    exact: true,
  },
  { href: "/admin/moderation", label: "Modération", icon: ShieldCheck },
  { href: "/admin/contenus", label: "Contenus", icon: Library },
  { href: "/admin/sources", label: "Sources", icon: FileText },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users, admin: true },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, ready } = useRequiredSession();
  const { signOut } = useSession();

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <AdminTopBar />
        <div className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-8">
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
        <div className="mx-auto flex w-full max-w-[1320px] flex-1 items-center px-5 py-16 sm:px-8">
          <div className="max-w-xl border-y border-[var(--rule)] py-12">
            <p className="eyebrow">Accès réservé</p>
            <h1 className="display mt-4 text-[clamp(1.8rem,3vw,2.4rem)] leading-[1.06]">
              Cet espace est réservé à l’équipe éditoriale.
            </h1>
            <p className="mt-4 text-[13.5px] leading-relaxed text-foreground/55">
              Votre compte est un compte membre : vous pouvez proposer des
              citations et garder vos favoris.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.15em]">
              <Link href="/compte" className="link-underline text-foreground/70">
                Mon compte
              </Link>
              <Link href="/" className="link-underline text-foreground/40">
                Retour au site
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pending = adminProposals.filter(
    (proposal) => proposal.status === "PENDING",
  ).length;

  const visibleItems = items.filter(
    (item) => !item.admin || canManageUsers(user.role),
  );

  return (
    <div className="flex min-h-screen flex-col">
      <AdminTopBar role={roleLabels[user.role]} />

      <div className="mx-auto flex w-full max-w-[1320px] flex-1 flex-col lg:flex-row">
        <aside className="border-b border-[var(--rule)] px-5 py-6 sm:px-8 lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:px-6 lg:py-10">
          <p className="eyebrow hidden lg:block">Navigation</p>

          <nav className="flex flex-wrap gap-x-5 gap-y-1 lg:mt-3 lg:flex-col lg:flex-nowrap lg:gap-0">
            {visibleItems.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 whitespace-nowrap py-2 text-[12px] transition-colors lg:border-t lg:border-[var(--rule)] lg:py-3",
                    active
                      ? "bg-gold/15 text-foreground"
                      : "text-foreground/45 hover:text-foreground",
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-3.5",
                      active ? "text-gold" : "text-foreground/40",
                    )}
                  />
                  {item.label}
                  {item.href === "/admin/moderation" && pending > 0 ? (
                    <span className="ml-auto hidden font-mono text-[10px] text-foreground/35 lg:inline">
                      {String(pending).padStart(2, "0")}
                    </span>
                  ) : null}
                </Link>
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
                <p className="text-[10px] uppercase tracking-[0.12em] text-foreground/35">
                  {roleLabels[user.role]}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 text-[11px] uppercase tracking-[0.13em]">
              <Link
                href="/compte"
                className="text-foreground/45 transition-colors hover:text-foreground"
              >
                Mon compte
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="text-left text-foreground/45 transition-colors hover:text-foreground"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-5 py-10 sm:px-8 lg:px-12 lg:py-12">
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminTopBar({ role }: { role?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--rule)] bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-[64px] w-full max-w-[1320px] items-center gap-3 px-5 sm:px-8">
        <Link href="/admin" className="display text-[21px] leading-none">
          Whispers
        </Link>
        <span aria-hidden className="h-4 w-px bg-[var(--rule-strong)]" />
        <span className="eyebrow">Administration</span>
        <span className="hidden bg-gold px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-foreground sm:inline-block">
          Maquette
        </span>

        <div className="ml-auto flex items-center gap-5">
          <Link
            href="/"
            className="hidden items-center gap-1.5 text-[10.5px] uppercase tracking-[0.13em] text-foreground/45 transition-colors hover:text-foreground sm:inline-flex"
          >
            Voir le site
            <ArrowUpRight className="size-3" />
          </Link>
          {role ? (
            <span className="hidden text-[10px] uppercase tracking-[0.12em] text-foreground/35 md:block">
              {role}
            </span>
          ) : null}
        </div>
      </div>
    </header>
  );
}
