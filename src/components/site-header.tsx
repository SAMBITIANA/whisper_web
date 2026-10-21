"use client";

import Link from "next/link";
import { Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const navigation = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/catalogue?type=VIDEO", label: "Vidéos" },
  { href: "/catalogue?type=IMAGE", label: "Images" },
  { href: "/catalogue?type=TRACK", label: "Chansons" },
];

export function SiteHeader() {
  const { resolvedTheme, setTheme } = useTheme();

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

        <nav className="hidden items-center gap-7 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="link-underline text-[11px] uppercase tracking-[0.16em] text-foreground/60 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

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
            className="size-8 rounded-full text-foreground/60 hover:bg-transparent hover:text-foreground"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Changer de thème"
          >
            <Sun className="size-[15px] dark:hidden" />
            <Moon className="hidden size-[15px] dark:block" />
          </Button>
        </div>
      </div>
    </header>
  );
}
