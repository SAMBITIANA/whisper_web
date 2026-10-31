"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Globe2, Pencil, Plus } from "lucide-react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { toast } from "sonner";
import { useI18n } from "@/i18n/provider";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  createAdminLanguage,
  errorMessage,
  fetchAdminLanguages,
  updateAdminLanguage,
  type ApiAdminLanguage,
} from "@/lib/api";
import { useRequiredSession } from "@/lib/use-required-session";

const fieldClassName =
  "h-10 w-full rounded-md border border-[var(--rule)] bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-sage-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:focus:border-sage-300";

const selectClassName =
  "h-9 rounded-md border border-[var(--rule)] bg-background px-2.5 text-xs text-foreground focus:border-sage-600 focus:outline-none dark:focus:border-sage-300";

const searchClassName =
  "h-9 w-full rounded-md border border-[var(--rule)] bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-sage-600 focus:outline-none sm:w-56 dark:focus:border-sage-300";

type StatusFilter = "all" | "active" | "inactive";
type SortKey = "order" | "code" | "name";

function LanguageSwitch({
  active,
  disabled,
  onCheckedChange,
  label,
}: {
  active: boolean;
  disabled?: boolean;
  onCheckedChange: () => void;
  label: string;
}) {
  const { t } = useI18n();

  return (
    <SwitchPrimitive.Root
      checked={active}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      aria-label={label}
      className={`relative inline-flex h-7 w-[84px] shrink-0 items-center rounded-full border border-transparent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sage-600/40 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-sage-300/40 ${
        active ? "bg-sage-600 dark:bg-sage-300" : "bg-muted"
      }`}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 flex items-center text-[9px] font-semibold uppercase tracking-[0.12em] ${
          active
            ? "justify-start pl-3 text-white dark:text-sage-900"
            : "justify-end pr-3 text-muted-foreground"
        }`}
      >
        {active ? t("common.active") : t("common.inactive")}
      </span>
      <SwitchPrimitive.Thumb
        className={`pointer-events-none block size-5 rounded-full bg-background shadow-sm transition-transform ${
          active ? "translate-x-[60px]" : "translate-x-1"
        }`}
      />
    </SwitchPrimitive.Root>
  );
}

export default function AdminLanguagesPage() {
  const { t } = useI18n();
  const { user, ready } = useRequiredSession(["EDITOR", "ADMIN"]);

  if (!ready || !user) {
    return <div className="h-32 animate-pulse rounded-lg bg-foreground/5" />;
  }

  if (user.role !== "ADMIN") {
    return (
      <div className="rounded-lg border border-[var(--rule)] bg-card p-8 text-center">
        <p className="text-sm font-medium text-foreground">
          {t("admin.adminsOnly")}
        </p>
        <Link
          href="/admin"
          className="mt-3 inline-block text-xs font-medium text-sage-600 hover:underline dark:text-sage-100"
        >
          {t("admin.backToDashboard")}
        </Link>
      </div>
    );
  }

  return <LanguagesContent />;
}

function LanguagesContent() {
  const { t } = useI18n();
  const [languages, setLanguages] = useState<ApiAdminLanguage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [nativeName, setNativeName] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortKey>("order");

  useEffect(() => {
    void fetchAdminLanguages()
      .then(setLanguages)
      .catch(() => toast(t("admin.loadLanguagesError")))
      .finally(() => setLoading(false));
  }, [t]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return languages
      .filter((language) =>
        status === "all"
          ? true
          : status === "active"
            ? language.isActive
            : !language.isActive,
      )
      .filter(
        (language) =>
          !needle ||
          language.code.toLowerCase().includes(needle) ||
          language.name.toLowerCase().includes(needle) ||
          language.nativeName.toLowerCase().includes(needle),
      )
      .sort((a, b) => {
        if (sort === "code") {
          return a.code.localeCompare(b.code);
        }

        if (sort === "name") {
          return a.name.localeCompare(b.name);
        }

        return a.sortOrder - b.sortOrder;
      });
  }, [languages, query, status, sort]);

  function resetForm() {
    setEditingCode(null);
    setCode("");
    setName("");
    setNativeName("");
    setSortOrder("");
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);

    if (!next) {
      resetForm();
    }
  }

  function openCreate() {
    resetForm();
    setOpen(true);
  }

  function startEdit(language: ApiAdminLanguage) {
    setEditingCode(language.code);
    setCode(language.code);
    setName(language.name);
    setNativeName(language.nativeName);
    setSortOrder(String(language.sortOrder));
    setOpen(true);
  }

  async function saveLanguage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedCode = code.trim();
    const trimmedName = name.trim();
    const trimmedNativeName = nativeName.trim();

    if (!trimmedCode || !trimmedName || !trimmedNativeName) {
      toast(t("admin.languageFieldsRequired"));
      return;
    }

    setSaving(true);
    const input = {
      name: trimmedName,
      nativeName: trimmedNativeName,
      sortOrder: sortOrder.trim() ? Number(sortOrder) : undefined,
    };

    try {
      const language = editingCode
        ? await updateAdminLanguage(editingCode, input)
        : await createAdminLanguage({ ...input, code: trimmedCode });

      setLanguages((current) =>
        (editingCode
          ? current.map((item) =>
              item.code === language.code ? language : item,
            )
          : [...current, language]
        ).sort((a, b) => a.sortOrder - b.sortOrder),
      );
      setOpen(false);
      resetForm();
      toast(
        editingCode ? t("admin.languageUpdated") : t("admin.languageAdded"),
      );
    } catch (error) {
      toast(
        errorMessage(
          error,
          editingCode
            ? t("common.updateFailed")
            : t("admin.languageAddFailed"),
        ),
      );
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
      toast(updated.isActive ? t("admin.languageEnabled") : t("admin.languageDisabled"));
    } catch (error) {
      toast(errorMessage(error, t("common.updateFailed")));
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-[var(--rule)] bg-card">
        <div className="flex flex-col gap-3 rounded-t-lg border-b border-[var(--rule)] bg-muted/60 p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("admin.searchLanguages")}
              aria-label={t("admin.searchLanguages")}
              className={searchClassName}
            />
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as StatusFilter)}
              aria-label={t("admin.statusColumn")}
              className={selectClassName}
            >
              <option value="all">{t("admin.filterAll")}</option>
              <option value="active">{t("admin.filterActive")}</option>
              <option value="inactive">{t("admin.filterInactive")}</option>
            </select>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              aria-label={t("admin.sortBy")}
              className={selectClassName}
            >
              <option value="order">{t("admin.sortOrder")}</option>
              <option value="code">{t("admin.sortCode")}</option>
              <option value="name">{t("admin.sortName")}</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs tabular-nums text-muted-foreground">
              {t(
                visible.length === 1
                  ? "admin.languageCount"
                  : "admin.languageCountPlural",
                { count: visible.length },
              )}
            </span>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-sage-600 px-3 text-[11px] font-medium text-white transition-colors hover:bg-sage-900 dark:bg-sage-300 dark:text-sage-900 dark:hover:bg-sage-100"
            >
              <Plus aria-hidden className="size-3" />
              {t("admin.addLanguage")}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-4">
            <div className="h-24 animate-pulse rounded-md bg-foreground/5" />
          </div>
        ) : languages.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            {t("admin.noLanguages")}
          </p>
        ) : visible.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            {t("admin.noLanguageMatch")}
          </p>
        ) : (
          <ul className="divide-y divide-[var(--rule)]">
            {visible.map((language) => (
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
                    {t("admin.languageOrder", {
                      name: language.nativeName,
                      order: language.sortOrder,
                    })}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => startEdit(language)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--rule-strong)] px-2.5 text-[11px] text-foreground/75 transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Pencil aria-hidden className="size-3" />
                  {t("common.edit")}
                </button>
                <LanguageSwitch
                  active={language.isActive}
                  disabled={updating === language.code}
                  onCheckedChange={() => void toggleLanguage(language)}
                  label={t("admin.languageToggleLabel", { name: language.name })}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {t("admin.languagesFooter")}
      </p>

      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
          side="right"
          className="gap-0 data-[side=right]:w-full! sm:max-w-lg!"
        >
          <SheetHeader className="border-b border-[var(--rule)]">
            <div className="flex items-center gap-2">
              <Globe2
                aria-hidden
                className="size-4 text-sage-600 dark:text-sage-100"
              />
              <SheetTitle>
                {editingCode ? t("admin.editLanguage") : t("admin.addLanguage")}
              </SheetTitle>
            </div>
            <SheetDescription className="text-xs">
              {t("admin.languagesDescription")}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={saveLanguage} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <div className="space-y-2">
                <Label htmlFor="language-code" className="eyebrow">
                  {t("admin.languageCodeLabel")}
                </Label>
                <input
                  id="language-code"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="es"
                  aria-label={t("admin.languageCodeLabel")}
                  disabled={editingCode !== null}
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language-name" className="eyebrow">
                  {t("admin.languageNameLabel")}
                </Label>
                <input
                  id="language-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={t("admin.languageNamePlaceholder")}
                  aria-label={t("admin.languageNameLabel")}
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language-native-name" className="eyebrow">
                  {t("admin.languageNativeLabel")}
                </Label>
                <input
                  id="language-native-name"
                  value={nativeName}
                  onChange={(event) => setNativeName(event.target.value)}
                  placeholder={t("admin.languageNativePlaceholder")}
                  aria-label={t("admin.languageNativeLabel")}
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language-sort-order" className="eyebrow">
                  {t("admin.sortOrder")}
                </Label>
                <input
                  id="language-sort-order"
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  placeholder="4"
                  aria-label={t("admin.sortOrder")}
                  inputMode="numeric"
                  className={fieldClassName}
                />
              </div>
            </div>

            <SheetFooter className="border-t border-[var(--rule)]">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-md bg-sage-600 px-4 text-xs font-medium text-white transition-colors hover:bg-sage-900 disabled:opacity-50 dark:bg-sage-300 dark:text-sage-900 dark:hover:bg-sage-100"
              >
                <Plus aria-hidden className="size-3.5" />
                {editingCode ? t("common.save") : t("admin.add")}
              </button>
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="h-10 w-full rounded-md border border-[var(--rule-strong)] px-3 text-xs text-foreground/75 transition-colors hover:bg-muted hover:text-foreground"
              >
                {t("common.cancel")}
              </button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
