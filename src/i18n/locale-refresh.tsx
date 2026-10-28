"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./provider";

export function LocaleRefresh() {
  const { locale } = useI18n();
  const router = useRouter();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }

    router.refresh();
  }, [locale, router]);

  return null;
}
