"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { type MessageKey } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { formatDate } from "@/lib/format";
import {
  fetchAdminProposals,
  reviewProposal,
  type ApiProposal,
} from "@/lib/api";

type ProposalStatus = ApiProposal["status"];

const proposalStatusKeys: Record<ProposalStatus, MessageKey> = {
  PENDING: "proposal.status.pending",
  APPROVED: "proposal.status.approved",
  REJECTED: "proposal.status.rejected",
};

const filters: { value: "ALL" | ProposalStatus; labelKey: MessageKey }[] = [
  { value: "PENDING", labelKey: "proposal.filter.pending" },
  { value: "APPROVED", labelKey: "proposal.filter.approved" },
  { value: "REJECTED", labelKey: "proposal.filter.rejected" },
  { value: "ALL", labelKey: "proposal.filter.all" },
];

export default function ModerationPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<ApiProposal[]>([]);
  const [filter, setFilter] = useState<"ALL" | ProposalStatus>("PENDING");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchAdminProposals()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const visible = items.filter(
    (proposal) => filter === "ALL" || proposal.status === filter,
  );

  async function setStatus(id: string, status: ProposalStatus) {
    try {
      const updated = await reviewProposal(id, { status });
      setItems((current) =>
        current.map((proposal) => (proposal.id === id ? updated : proposal)),
      );
      toast(
        status === "APPROVED"
          ? t("admin.proposalApproved")
          : status === "REJECTED"
            ? t("admin.proposalRejected")
            : t("admin.proposalPendingAgain"),
      );
    } catch {
      toast(t("common.updateFailed"));
    }
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--rule)] pb-4">
        <p className="eyebrow">{t("common.admin")}</p>
        <h1 className="display mt-1.5 text-[clamp(1.5rem,2.4vw,1.95rem)] leading-[1.1]">
          {t("admin.moderation")}
        </h1>
        <p className="mt-1.5 max-w-2xl font-serif text-[13.5px] italic leading-snug text-foreground/65">
          {t("admin.moderationIntro")}
        </p>
      </header>

      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-b border-[var(--rule)] pb-3">
        {filters.map((item) => {
          const count = items.filter(
            (proposal) => item.value === "ALL" || proposal.status === item.value,
          ).length;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={
                filter === item.value
                  ? "text-[12px] uppercase tracking-[0.14em] text-foreground"
                  : "text-[12px] uppercase tracking-[0.14em] text-foreground/60 transition-colors hover:text-foreground/70"
              }
            >
              {t(item.labelKey)}
              <span className="ml-1.5 font-mono text-[10px] text-foreground/60">
                {String(count).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="h-48 animate-pulse bg-foreground/5" />
      ) : visible.length === 0 ? (
        <p className="border-y border-[var(--rule)] py-12 text-center font-serif text-[15px] italic text-foreground/60">
          {t("admin.nothingToReview")}
        </p>
      ) : (
        <ul className="border-b border-[var(--rule)]">
          {visible.map((proposal) => {
            const editing = editingId === proposal.id;

            return (
              <li
                key={proposal.id}
                className="grid gap-5 border-t border-[var(--rule)] py-6 lg:grid-cols-[1fr_15rem]"
              >
                <div>
                  {editing ? (
                    <div className="panel space-y-3">
                      <textarea
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        rows={3}
                        aria-label={t("admin.editQuoteLabel")}
                        className="w-full resize-none border border-[var(--rule-strong)] bg-transparent p-3 font-serif text-[16px] leading-relaxed focus:border-sage-300 focus:outline-none"
                      />
                      <div className="flex gap-5">
                        <button
                          type="button"
                          onClick={() => {
                            const value = draft.trim();
                            if (!value) return;
                            void reviewProposal(proposal.id, { quote: value })
                              .then((updated) => {
                                setItems((current) =>
                                  current.map((item) =>
                                    item.id === proposal.id ? updated : item,
                                  ),
                                );
                                setEditingId(null);
                                toast(t("admin.quoteUpdated"));
                              })
                              .catch(() => toast(t("common.updateFailed")));
                          }}
                          className="text-[11px] uppercase tracking-[0.14em] text-foreground"
                        >
                          {t("common.save")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="text-[11px] uppercase tracking-[0.14em] text-foreground/60"
                        >
                          {t("common.cancel")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="display text-[18px] leading-snug">
                      «&nbsp;{proposal.quote}&nbsp;»
                    </p>
                  )}

                  <p className="mt-2.5 text-[10.5px] uppercase tracking-[0.15em] text-foreground/60">
                    {proposal.author} · {proposal.source} ·{" "}
                    {formatDate(proposal.submittedAt)}
                  </p>
                </div>

                <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 lg:justify-end">
                  <span
                    className={
                      proposal.status === "APPROVED"
                        ? "text-[10px] uppercase tracking-[0.14em] text-sage-600 dark:text-sage-100"
                        : proposal.status === "REJECTED"
                          ? "text-[10px] uppercase tracking-[0.14em] text-foreground/60"
                          : "text-[10px] uppercase tracking-[0.14em] text-foreground/65"
                    }
                  >
                    {t(proposalStatusKeys[proposal.status])}
                  </span>

                  <div className="flex items-baseline gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(proposal.id);
                        setDraft(proposal.quote);
                      }}
                      className="link-underline text-[11px] uppercase tracking-[0.14em] text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {t("admin.edit")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus(proposal.id, "APPROVED")}
                      className="link-underline text-[11px] uppercase tracking-[0.14em] text-sage-600 dark:text-sage-100"
                    >
                      {t("admin.approve")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus(proposal.id, "REJECTED")}
                      className="link-underline text-[11px] uppercase tracking-[0.14em] text-foreground/60 transition-colors hover:text-foreground"
                    >
                      {t("admin.reject")}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
