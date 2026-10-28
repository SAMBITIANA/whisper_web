"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutGrid, Pencil, Plus } from "lucide-react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { toast } from "sonner";
import { useI18n } from "@/i18n/provider";
import type { MessageKey } from "@/i18n/config";
import { Label } from "@/components/ui/label";
import {
  createAdminMediaFormat,
  errorMessage,
  fetchAdminMediaFormats,
  updateAdminMediaFormat,
  type ApiAdminMediaFormat,
} from "@/lib/api";
import { useRequiredSession } from "@/lib/use-required-session";

const fieldClassName =
  "h-10 w-full rounded-md border border-[var(--rule)] bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-sage-600 focus:outline-none dark:focus:border-sage-300";

function StatusSwitch({
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

export default function AdminFormatsPage() {
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

  return (
    <div className="space-y-5">
      <Link
        href="/admin/parametres"
        className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
      >
        {t("common.back")}
      </Link>

      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {t("common.admin")}
        </p>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground sm:text-[26px]">
          {t("admin.formats")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("admin.formatIntro")}
        </p>
      </header>

      <FormatsContent />
    </div>
  );
}

function FormatsContent() {
  const { t } = useI18n();
  const [formats, setFormats] = useState<ApiAdminMediaFormat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [labelKey, setLabelKey] = useState("");
  const [icon, setIcon] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    void fetchAdminMediaFormats()
      .then(setFormats)
      .catch(() => toast(t("admin.loadFormatsError")))
      .finally(() => setLoading(false));
  }, [t]);

  function resetForm() {
    setEditingId(null);
    setCode("");
    setLabelKey("");
    setIcon("");
    setSortOrder("");
  }

  function startEdit(format: ApiAdminMediaFormat) {
    setEditingId(format.id);
    setCode(format.code);
    setLabelKey(format.labelKey);
    setIcon(format.icon ?? "");
    setSortOrder(String(format.sortOrder));
  }

  async function saveFormat(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedCode = code.trim();
    const trimmedLabelKey = labelKey.trim();

    if (!trimmedCode || !trimmedLabelKey) {
      toast(t("admin.formatRequired"));
      return;
    }

    setSaving(true);
    const input = {
      code: trimmedCode,
      labelKey: trimmedLabelKey,
      icon: icon.trim() || undefined,
      sortOrder: sortOrder.trim() ? Number(sortOrder) : undefined,
    };

    try {
      const format = editingId
        ? await updateAdminMediaFormat(editingId, input)
        : await createAdminMediaFormat(input);

      setFormats((current) =>
        (editingId
          ? current.map((item) => (item.id === format.id ? format : item))
          : [...current, format]
        ).sort((a, b) => a.sortOrder - b.sortOrder),
      );
      resetForm();
      toast(editingId ? t("admin.formatUpdated") : t("admin.formatAdded"));
    } catch (error) {
      toast(
        errorMessage(
          error,
          editingId ? t("common.updateFailed") : t("admin.addFormatError"),
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleFormat(format: ApiAdminMediaFormat) {
    setUpdating(format.id);

    try {
      const updated = await updateAdminMediaFormat(format.id, {
        isActive: !format.isActive,
      });
      setFormats((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      toast(updated.isActive ? t("admin.formatEnabled") : t("admin.formatDisabled"));
    } catch (error) {
      toast(errorMessage(error, t("common.updateFailed")));
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="space-y-5">
      <form
        onSubmit={saveFormat}
        className="rounded-lg border border-[var(--rule)] bg-card p-4"
      >
        <div className="flex items-center gap-2">
          <LayoutGrid
            aria-hidden
            className="size-4 text-sage-600 dark:text-sage-100"
          />
          <h2 className="text-sm font-semibold text-foreground">
            {editingId ? t("admin.editFormat") : t("admin.addFormat")}
          </h2>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("admin.addFormatNote")}
        </p>
        <div className="mt-4 grid items-end gap-3 sm:grid-cols-[7rem_minmax(0,1.2fr)_7rem_6rem_auto]">
          <div className="space-y-2">
            <Label htmlFor="format-code" className="eyebrow">
              {t("admin.formatCode")}
            </Label>
            <input
              id="format-code"
              value={code}
              onChange={(event) => setCode(event.target.value.toUpperCase())}
              placeholder={t("admin.formatCodePlaceholder")}
              className={fieldClassName}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="format-label-key" className="eyebrow">
              {t("admin.formatLabelKey")}
            </Label>
            <input
              id="format-label-key"
              value={labelKey}
              onChange={(event) => setLabelKey(event.target.value)}
              placeholder={t("admin.formatLabelKeyPlaceholder")}
              className={fieldClassName}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="format-icon" className="eyebrow">
              {t("admin.formatIcon")}
            </Label>
            <input
              id="format-icon"
              value={icon}
              onChange={(event) => setIcon(event.target.value)}
              placeholder={t("admin.formatIconPlaceholder")}
              className={fieldClassName}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="format-sort-order" className="eyebrow">
              {t("admin.formatSortOrder")}
            </Label>
            <input
              id="format-sort-order"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              placeholder={t("admin.formatSortOrderPlaceholder")}
              inputMode="numeric"
              className={fieldClassName}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md bg-sage-600 px-4 text-xs font-medium text-white transition-colors hover:bg-sage-900 disabled:opacity-50 dark:bg-sage-300 dark:text-sage-900 dark:hover:bg-sage-100"
            >
              <Plus aria-hidden className="size-3.5" />
              {saving
                ? t("admin.addingFormat")
                : editingId
                  ? t("common.save")
                  : t("admin.addFormatAction")}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="h-10 rounded-md border border-[var(--rule-strong)] px-3 text-xs text-foreground/75 transition-colors hover:bg-muted hover:text-foreground"
              >
                {t("common.cancel")}
              </button>
            ) : null}
          </div>
        </div>
      </form>

      <section className="rounded-lg border border-[var(--rule)] bg-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--rule)] p-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {t("admin.formats")}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("admin.formatsDescription")}
            </p>
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">
            {t(
              formats.length === 1
                ? "admin.formatsCount"
                : "admin.formatsCountPlural",
              { count: formats.length },
            )}
          </span>
        </div>

        {loading ? (
          <div className="p-4">
            <div className="h-24 animate-pulse rounded-md bg-foreground/5" />
          </div>
        ) : formats.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            {t("admin.noFormats")}
          </p>
        ) : (
          <ul className="divide-y divide-[var(--rule)]">
            {formats.map((format) => (
              <li
                key={format.id}
                className="flex flex-wrap items-center gap-3 p-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
                      {format.code}
                    </span>
                    <span
                      className="text-sm font-medium text-foreground"
                      title={format.labelKey}
                    >
                      {t(format.labelKey as MessageKey)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("admin.formatOrder", {
                      icon: format.icon?.trim() || "—",
                      order: format.sortOrder,
                    })}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => startEdit(format)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--rule-strong)] px-2.5 text-[11px] text-foreground/75 transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Pencil aria-hidden className="size-3" />
                  {t("common.edit")}
                </button>
                <StatusSwitch
                  active={format.isActive}
                  disabled={updating === format.id}
                  onCheckedChange={() => void toggleFormat(format)}
                  label={t("admin.enableFormat", { code: format.code })}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {t("admin.formatNote")}
      </p>
    </div>
  );
}
