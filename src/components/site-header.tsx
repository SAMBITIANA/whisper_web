"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LayoutDashboard, LogOut, Moon, Search, Sun, User } from "lucide-react";
import { cn } from "cn";
import { useTheme } from "next-themes";
import { useSession } from "@/components/session-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { canEditContent, initialsOf, roleLabels } from "@/lib/session";

const navigation = [
  { href: "/catalogue", label: "Catalogue", type: null },
  { href: "/catalogue?type=VIDEO", label: "Vidéos", type: "VIDEO" },
  { href: "/catalogue?type=IMAGE", label: "Images", type: "IMAGE" },
  { href: "/catalogue?type=TRACK", label: "Chansons", type: "TRACK" },
];

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "link-underline text-[11px] uppercase tracking-[0.16em] transition-colors",
        active
          ? "font-medium text-foreground [background-image:linear-gradient(var(--color-sage-600),var(--color-sage-600))] [background-size:100%_1px] dark:[background-image:linear-gradient(var(--color-sage-300),var(--color-sage-300))]"
          : "text-foreground/70 hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
}

function SiteNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentType = searchParams.get("type");

  return (
    <nav className="hidden items-center gap-7 md:flex">
      {navigation.map((item) => {
        const active =
          pathname === "/catalogue"
            ? item.type
              ? currentType === item.type
              : !currentType
            : item.type === null && pathname === item.href;

        return (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            active={active}
          />
        );
      })}
    </nav>
  );
}

export function SiteHeader() {
  const { resolvedTheme, setTheme } = useTheme();
  const { user, ready, signOut } = useSession();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--rule)] bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-[74px] w-full max-w-[1180px] items-center gap-9 px-5 sm:px-8">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="display text-[27px] leading-none">Whispers</span>
          <span
            aria-hidden
            className="mb-0.5 size-[5px] rounded-full bg-sage-300 transition-transform duration-300 group-hover:scale-125"
          />
        </Link>

        <Suspense
          fallback={
            <nav className="hidden items-center gap-7 md:flex">
              {navigation.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={false}
                />
              ))}
            </nav>
          }
        >
          <SiteNav />
        </Suspense>

        <div className="ml-auto flex items-center gap-4">
          <div className="relative hidden lg:block">
            <Search className="pointer-events-none absolute left-0 top-1/2 size-[15px] -translate-y-1/2 text-foreground/35" />
            <Input
              placeholder="Rechercher une citation"
              aria-label="Rechercher une citation"
              className="h-8 w-52 rounded-none border-0 border-b border-[var(--rule)] bg-transparent pl-6 text-[13px] shadow-none placeholder:text-foreground/35 focus-visible:border-sage-300 focus-visible:ring-0 dark:bg-transparent"
            />
          </div>

          <Link
            href="/catalogue"
            className="link-underline hidden text-[11px] uppercase tracking-[0.16em] text-sage-600 sm:block dark:text-sage-100"
          >
            Proposer une citation
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-full border border-[var(--rule-strong)] text-foreground/80 hover:border-sage-300 hover:bg-muted hover:text-foreground"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Changer de thème"
          >
            <Sun className="size-[15px] dark:hidden" />
            <Moon className="hidden size-[15px] dark:block" />
          </Button>

          {ready ? (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex size-8 items-center justify-center rounded-full border border-[var(--rule-strong)] font-mono text-[10px] tracking-wide text-foreground/80 transition-colors hover:border-sage-600 hover:bg-sage-600 hover:text-paper dark:hover:border-sage-300 dark:hover:bg-sage-300 dark:hover:text-sage-900"
                    aria-label={`Compte de ${user.name}`}
                  >
                    {initialsOf(user.name)}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="space-y-1">
                    <span className="block text-[13px] font-normal text-foreground">
                      {user.name}
                    </span>
                    <span className="block text-[10px] uppercase tracking-[0.14em] text-foreground/60">
                      {roleLabels[user.role]}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => router.push("/compte")}>
                    <User />
                    Mon compte
                  </DropdownMenuItem>
                  {canEditContent(user.role) ? (
                    <DropdownMenuItem onSelect={() => router.push("/admin")}>
                      <LayoutDashboard />
                      Administration
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => {
                      signOut();
                      router.push("/");
                    }}
                  >
                    <LogOut />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/connexion"
                className="link-underline text-[11px] uppercase tracking-[0.16em] text-foreground/75 transition-colors hover:text-foreground"
              >
                Connexion
              </Link>
            )
          ) : null}
        </div>
      </div>
    </header>
  );
}
