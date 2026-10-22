"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  adminProposals,
  proposalStatusLabels,
  type AdminProposal,
  type ProposalStatus,
} from "@/lib/fake-admin";
import { formatDate } from "@/lib/format";
import { useStoredList } from "@/lib/use-stored-list";

const filters: { value: "ALL" | ProposalStatus; label: string }[] = [
  { value: "PENDING", label: "En attente" },
  { value: "APPROVED", label: "Publiées" },
  { value: "REJECTED", label: "Rejetées" },
  { value: "ALL", label: "Toutes" },
];

export default function ModerationPage() {
  const { items, update } = useStoredList<AdminProposal>(
    "whispers_proposals",
    adminProposals,
  );
  const [filter, setFilter] = useState<"ALL" | ProposalStatus>("PENDING");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const visible = items.filter(
    (proposal) => filter === "ALL" || proposal.status === filter,
  );

  function setStatus(id: string, status: ProposalStatus) {
    update((current) =>
      current.map((proposal) =>
        proposal.id === id ? { ...proposal, status } : proposal,
      ),
    );
    toast(
      status === "APPROVED"
        ? "Proposition approuvée (maquette)"
        : status === "REJECTED"
          ? "Proposition rejetée (maquette)"
          : "Proposition remise en attente (maquette)",
    );
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--rule)] pb-4">
        <p className="eyebrow">Administration</p>
        <h1 className="display mt-1.5 text-[clamp(1.5rem,2.4vw,1.95rem)] leading-[1.1]">
          Modération
        </h1>
        <p className="mt-1.5 max-w-2xl font-serif text-[13.5px] italic leading-snug text-foreground/65">
          Chaque proposition est vérifiée avant publication : citation courte,
          attribution exacte, crédit et lien vers la source.
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
              {item.label}
              <span className="ml-1.5 font-mono text-[10px] text-foreground/60">
                {String(count).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="border-y border-[var(--rule)] py-12 text-center font-serif text-[15px] italic text-foreground/60">
          Rien à relire dans cette catégorie.
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
                        aria-label="Modifier la citation"
                        className="w-full resize-none border border-[var(--rule-strong)] bg-transparent p-3 font-serif text-[16px] leading-relaxed focus:border-sage-300 focus:outline-none"
                      />
                      <div className="flex gap-5">
                        <button
                          type="button"
                          onClick={() => {
                            const value = draft.trim();
                            if (!value) return;
                            update((current) =>
                              current.map((item) =>
                                item.id === proposal.id
                                  ? { ...item, quote: value }
                                  : item,
                              ),
                            );
                            setEditingId(null);
                            toast("Citation modifiée (maquette)");
                          }}
                          className="text-[11px] uppercase tracking-[0.14em] text-foreground"
                        >
                          Enregistrer
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="text-[11px] uppercase tracking-[0.14em] text-foreground/60"
                        >
                          Annuler
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
                    {proposalStatusLabels[proposal.status]}
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
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus(proposal.id, "APPROVED")}
                      className="link-underline text-[11px] uppercase tracking-[0.14em] text-sage-600 dark:text-sage-100"
                    >
                      Approuver
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus(proposal.id, "REJECTED")}
                      className="link-underline text-[11px] uppercase tracking-[0.14em] text-foreground/60 transition-colors hover:text-foreground"
                    >
                      Rejeter
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
