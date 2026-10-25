"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Globe2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/i18n/provider";
import {
  createAdminLanguage,
  errorMessage,
  fetchAdminLanguages,
  updateAdminLanguage,
  type ApiAdminLanguage,
} from "@/lib/api";
import { useRequiredSession } from "@/lib/use-required-session";

const fieldClassName =
  "h-10 w-full rounded-md border border-[var(--rule)] bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-sage-600 focus:outline-none dark:focus:border-sage-300";

export default function AdminSettingsPage() {
  const { t } = useI18n();
  const { user, ready } = useRequiredSession(["EDITOR", "ADMIN"]);
  const [languages, setLanguages] = useState<ApiAdminLanguage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [nativeName, setNativeName] = useState("");

  useEffect(() => {
    void fetchAdminLanguages()
      .then(setLanguages)
      .finally(() => setLoading(false));
  }, []);

  if (!ready || !user) {
    return <div className="h-32 animate-pulse rounded-lg bg-foreground/5" />;
  }

  if (user.role !== "ADMIN") {
    return (
      <div className="rounded-lg border border-[var(--rule)] bg-card p-8 text-center">
        <p className="text-sm font-medium text-foreground">
          Accès réservé aux administrateurs.
        </p>
        <Link
          href="/admin"
          className="mt-3 inline-block text-xs font-medium text-sage-600 hover:underline dark:text-sage-100"
        >
          Retour au tableau de bord
        </Link>
      </div>
    );
  }

  async function addLanguage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedCode = code.trim();

    if (!trimmedCode || !name.trim() || !nativeName.trim()) {
      toast("Renseignez le code, le nom et le nom natif.");
      return;
    }

    setSaving(true);

    try {
      const language = await createAdminLanguage({
        code: trimmedCode,
        name: name.trim(),
        nativeName: nativeName.trim(),
      });
      setLanguages((current) =>
        [...current, language].sort((a, b) => a.sortOrder - b.sortOrder),
      );
      setCode("");
      setName("");
      setNativeName("");
      toast("Langue ajoutée");
    } catch (error) {
      toast(errorMessage(error, "Ajout impossible."));
    } finally {
      setSaving(false);
    }
  }

  async function toggleLanguage(language: ApiAdminLanguage) {
    setUpdating(language.code);

    try {
      const updated = await updateAdminLanguage(language.code, {
        isActive: !language.isActive,
      });
      setLanguages((current) =>
        current.map((item) => (item.code === updated.code ? updated : item)),
      );
      toast(updated.isActive ? "Langue activée" : "Langue désactivée");
    } catch (error) {
      toast(errorMessage(error, "Mise à jour impossible."));
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {t("common.admin")}
        </p>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground sm:text-[26px]">
          {t("admin.settings")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Langues de l’application et des contenus.
        </p>
      </header>

      <form
        onSubmit={addLanguage}
        className="rounded-lg border border-[var(--rule)] bg-card p-4"
      >
        <div className="flex items-center gap-2">
          <Globe2 aria-hidden className="size-4 text-sage-600 dark:text-sage-100" />
          <h2 className="text-sm font-semibold text-foreground">
            Ajouter une langue
          </h2>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-[7rem_minmax(0,1fr)_minmax(0,1fr)_auto]">
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="es"
            aria-label="Code de la langue"
            className={fieldClassName}
          />
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Spanish"
            aria-label="Nom de la langue"
            className={fieldClassName}
          />
          <input
            value={nativeName}
            onChange={(event) => setNativeName(event.target.value)}
            placeholder="Español"
            aria-label="Nom natif de la langue"
            className={fieldClassName}
          />
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-sage-600 px-4 text-xs font-medium text-white transition-colors hover:bg-sage-900 disabled:opacity-50 dark:bg-sage-300 dark:text-sage-900 dark:hover:bg-sage-100"
          >
            <Plus aria-hidden className="size-3.5" />
            Ajouter
          </button>
        </div>
      </form>

      <section className="rounded-lg border border-[var(--rule)] bg-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--rule)] p-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {t("admin.languages")}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Les langues actives sont proposées dans l’application.
            </p>
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">
            {languages.length} langue{languages.length > 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="p-4">
            <div className="h-24 animate-pulse rounded-md bg-foreground/5" />
          </div>
        ) : languages.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            Aucune langue enregistrée.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--rule)]">
            {languages.map((language) => (
              <li
                key={language.code}
                className="flex flex-wrap items-center gap-3 p-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
                      {language.code}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {language.name}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {language.nativeName} · ordre {language.sortOrder}
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <span
                    className={
                      language.isActive
                        ? "text-[11px] font-medium uppercase tracking-[0.12em] text-sage-600 dark:text-sage-300"
                        : "text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground"
                    }
                  >
                    {language.isActive ? "Active" : "Inactive"}
                  </span>
                  <Switch
                    checked={language.isActive}
                    onCheckedChange={() => void toggleLanguage(language)}
                    disabled={updating === language.code}
                    aria-label={`Activer ou désactiver ${language.name}`}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Ajouter une langue ne traduit pas encore automatiquement l’interface ni
        les contenus. Les catalogues et les jobs de traduction restent à
        générer.
      </p>
    </div>
  );
}
