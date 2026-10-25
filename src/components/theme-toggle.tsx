"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/provider";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useI18n();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "size-8 rounded-full border border-[var(--rule-strong)] text-foreground/80 hover:border-sage-300 hover:bg-muted hover:text-foreground",
        className,
      )}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={t("common.changeTheme")}
    >
      <Sun className="size-[15px] dark:hidden" />
      <Moon className="hidden size-[15px] dark:block" />
    </Button>
  );
}
