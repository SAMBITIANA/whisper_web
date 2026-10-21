"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/components/session-provider";
import type { Role } from "@/lib/session";

export function useRequiredSession(allow?: Role[]) {
  const { user, ready } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const allowed = allow ? allow.join(",") : "";

  useEffect(() => {
    if (!ready) return;

    if (!user) {
      router.replace(
        `/connexion?next=${encodeURIComponent(pathname ?? "/compte")}`,
      );
      return;
    }

    if (allowed && !allowed.split(",").includes(user.role)) {
      router.replace("/compte");
    }
  }, [ready, user, allowed, router, pathname]);

  const authorized = Boolean(
    user && (!allowed || allowed.split(",").includes(user.role)),
  );

  return { user, ready: ready && authorized };
}
