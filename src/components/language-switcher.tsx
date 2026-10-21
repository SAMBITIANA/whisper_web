"use client";

import { useState } from "react";
import { Languages } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { languages, type LanguageCode } from "@/lib/fake-data";

export function LanguageSwitcher({
  value,
  onChange,
  className,
}: {
  value: LanguageCode;
  onChange: (language: LanguageCode) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Languages />
          {languages.find((language) => language.code === value)?.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onSelect={() => onChange(language.code)}
            className={cn(
              language.code === value && "bg-secondary text-secondary-foreground",
            )}
          >
            {language.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
