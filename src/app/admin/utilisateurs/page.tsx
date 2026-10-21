"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useSession } from "@/components/session-provider";
import { adminUsers, type AdminUser } from "@/lib/fake-admin";
import { formatDate } from "@/lib/format";
import { canManageUsers, roleLabels, type Role } from "@/lib/session";
import { useRequiredSession } from "@/lib/use-required-session";
import { useStoredList } from "@/lib/use-stored-list";

const USERS_STORAGE_KEY = "whispers_users";
const roles = Object.keys(roleLabels) as Role[];

export default function AdminUsersPage() {
  const { user, ready } = useRequiredSession(["EDITOR", "ADMIN"]);
  const { user: sessionUser } = useSession();
  const { items, update } = useStoredList<AdminUser>(
    USERS_STORAGE_KEY,
    adminUsers,
  );
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items;
    return items.filter((item) =>
      `${item.name} ${item.email}`.toLowerCase().includes(normalized),
    );
  }, [items, query]);

  if (!ready || !user) {
    return <div className="h-32 animate-pulse bg-foreground/5" />;
  }

  if (!canManageUsers(user.role)) {
    return (
      <div className="border-y border-[var(--rule)] py-14 text-center">
        <p className="display text-[22px]">Accès réservé aux administrateurs.</p>
        <p className="mt-2 text-[12.5px] text-foreground/50">
          Votre rôle ({roleLabels[user.role]}) permet la modération et l’édition
          des contenus, pas la gestion des comptes.
        </p>
        <Link
          href="/admin"
          className="link-underline mt-5 inline-block text-[11px] uppercase tracking-[0.16em] text-foreground/60"
        >
          Retour au tableau de bord
        </Link>
      </div>
    );
  }

  function changeRole(email: string, role: Role) {
    update((current) =>
      current.map((item) => (item.email === email ? { ...item, role } : item)),
    );
    toast("Rôle mis à jour (maquette)", { description: email });
  }

  function toggleStatus(email: string) {
    update((current) =>
      current.map((item) =>
        item.email === email
          ? {
              ...item,
              status: item.status === "Actif" ? "Suspendu" : "Actif",
            }
          : item,
      ),
    );
  }

  return (
    <div className="space-y-10">
      <header className="border-b border-[var(--rule)] pb-7">
        <p className="eyebrow">Administration</p>
        <h1 className="display mt-4 text-[clamp(2rem,4vw,2.9rem)] leading-[1.04]">
          Utilisateurs
        </h1>
        <p className="mt-3 max-w-2xl font-serif text-[14.5px] italic leading-relaxed text-foreground/55">
          Comptes, rôles et accès. Un membre propose, un éditeur publie, un
          administrateur gère les comptes.
        </p>
      </header>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher un nom ou une adresse"
          aria-label="Rechercher un utilisateur"
          className="w-full max-w-sm border-0 border-b border-[var(--rule)] bg-transparent pb-2 text-[13.5px] placeholder:text-foreground/30 focus:border-sage-300 focus:outline-none"
        />
        <p className="font-mono text-[10px] text-foreground/35">
          {visible.length} compte{visible.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[44rem] border-collapse text-left">
          <thead>
            <tr className="border-y border-[var(--rule)]">
              {["Membre", "Adresse", "Inscrit le", "Rôle", "Statut"].map(
                (label) => (
                  <th
                    key={label}
                    className="px-3 py-2.5 text-[9.5px] font-normal uppercase tracking-[0.16em] text-foreground/40 first:pl-0 last:pr-0 last:text-right"
                  >
                    {label}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <tr key={item.email} className="border-b border-[var(--rule)]">
                <td className="py-3.5 pl-0 pr-3">
                  <span className="display text-[15px]">{item.name}</span>
                  {item.email === sessionUser?.email ? (
                    <span className="ml-2 text-[9px] uppercase tracking-[0.12em] text-sage-700 dark:text-sage-100">
                      vous
                    </span>
                  ) : null}
                </td>
                <td className="px-3 py-3.5 text-[12.5px] text-foreground/55">
                  {item.email}
                </td>
                <td className="px-3 py-3.5 font-mono text-[10.5px] text-foreground/40">
                  {formatDate(item.joinedAt)}
                </td>
                <td className="px-3 py-3.5">
                  <select
                    value={item.role}
                    onChange={(event) =>
                      changeRole(item.email, event.target.value as Role)
                    }
                    aria-label={`Rôle de ${item.name}`}
                    className="border-0 border-b border-transparent bg-transparent pb-0.5 text-[11.5px] text-foreground/70 hover:border-[var(--rule)] focus:border-sage-300 focus:outline-none"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {roleLabels[role]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3.5 pl-3 pr-0 text-right">
                  <button
                    type="button"
                    onClick={() => toggleStatus(item.email)}
                    className={
                      item.status === "Actif"
                        ? "text-[10px] uppercase tracking-[0.13em] text-foreground/55 hover:text-foreground"
                        : "text-[10px] uppercase tracking-[0.13em] text-destructive"
                    }
                  >
                    {item.status}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[11.5px] leading-relaxed text-foreground/40">
        Maquette : les changements sont enregistrés dans ce navigateur. Les
        règles d’autorisation seront appliquées côté serveur (guards NestJS) avec
        l’API.
      </p>
    </div>
  );
}
