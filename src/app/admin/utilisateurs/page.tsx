"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useSession } from "@/components/session-provider";
import {
  fetchAdminUsers,
  updateAdminUserRole,
  updateAdminUserStatus,
  type ApiAdminUser,
} from "@/lib/api";
import { formatDate } from "@/lib/format";
import { canManageUsers, roleLabels, type Role } from "@/lib/session";
import { useRequiredSession } from "@/lib/use-required-session";

const roles = Object.keys(roleLabels) as Role[];

export default function AdminUsersPage() {
  const { user, ready } = useRequiredSession(["EDITOR", "ADMIN"]);
  const { user: sessionUser } = useSession();
  const [items, setItems] = useState<ApiAdminUser[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchAdminUsers()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

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
        <p className="mt-2 text-[12.5px] text-foreground/65">
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

  async function changeRole(id: string, role: Role) {
    try {
      await updateAdminUserRole(id, role);
      setItems((current) =>
        current.map((item) => (item.id === id ? { ...item, role } : item)),
      );
      toast("Rôle mis à jour");
    } catch {
      toast("Mise à jour impossible");
    }
  }

  async function toggleStatus(item: ApiAdminUser) {
    const status = item.status === "Actif" ? "SUSPENDED" : "ACTIVE";
    try {
      await updateAdminUserStatus(item.id, status);
      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? { ...entry, status: status === "ACTIVE" ? "Actif" : "Suspendu" }
            : entry,
        ),
      );
    } catch {
      toast("Mise à jour impossible");
    }
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--rule)] pb-4">
        <p className="eyebrow">Administration</p>
        <h1 className="display mt-1.5 text-[clamp(1.5rem,2.4vw,1.95rem)] leading-[1.1]">
          Utilisateurs
        </h1>
        <p className="mt-1.5 max-w-2xl font-serif text-[13.5px] italic leading-snug text-foreground/65">
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
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8">
                  <div className="h-24 animate-pulse bg-foreground/5" />
                </td>
              </tr>
            ) : null}
            {visible.map((item) => (
              <tr key={item.id} className="border-b border-[var(--rule)]">
                <td className="py-3.5 pl-0 pr-3">
                  <span className="display text-[15px]">{item.name}</span>
                  {item.email === sessionUser?.email ? (
                    <span className="ml-2 text-[9px] uppercase tracking-[0.12em] text-sage-600 dark:text-sage-100">
                      vous
                    </span>
                  ) : null}
                </td>
                <td className="px-3 py-3.5 text-[12.5px] text-foreground/65">
                  {item.email}
                </td>
                <td className="px-3 py-3.5 font-mono text-[10.5px] text-foreground/40">
                  {formatDate(item.joinedAt)}
                </td>
                <td className="px-3 py-3.5">
                  <select
                    value={item.role}
                    onChange={(event) =>
                      void changeRole(item.id, event.target.value as Role)
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
                    onClick={() => void toggleStatus(item)}
                    className={
                      item.status === "Actif"
                        ? "text-[10px] uppercase tracking-[0.13em] text-foreground/65 hover:text-foreground"
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
        Les rôles et statuts sont enregistrés côté serveur et appliqués par les
        guards NestJS.
      </p>
    </div>
  );
}
