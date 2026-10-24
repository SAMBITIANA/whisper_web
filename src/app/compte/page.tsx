"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { ArrowRight, LogOut } from "lucide-react";
import { toast } from "sonner";
import { MediaCard } from "@/components/media-card";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useSession } from "@/components/session-provider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { fetchLibrary, updatePreferences, type ApiLibrary } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { canEditContent, initialsOf, roleLabels } from "@/lib/session";
import { useRequiredSession } from "@/lib/use-required-session";

const proposalStatusLabels = {
  PENDING: "En attente",
  APPROVED: "Publiée",
  REJECTED: "Rejetée",
} as const;

export default function ComptePage() {
  const { user, ready } = useRequiredSession();
  const { account, signOut } = useSession();
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const [languageOverride, setLanguage] = useState<string | null>(null);
  const [newsletterOverride, setNewsletter] = useState<boolean | null>(null);
  const [library, setLibrary] = useState<ApiLibrary | null>(null);
  const language = languageOverride ?? account?.preferredLanguage ?? "fr";
  const newsletter = newsletterOverride ?? account?.newsletterOptIn ?? true;

  useEffect(() => {
    if (!account) return;
    void fetchLibrary().then(setLibrary).catch(() => setLibrary(null));
  }, [account]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-[1180px] flex-1 px-5 py-16 sm:px-8">
          <div className="h-8 w-40 animate-pulse bg-foreground/10" />
          <div className="mt-6 h-16 w-2/3 animate-pulse bg-foreground/5" />
        </main>
      </div>
    );
  }

  const myProposals = library?.proposals ?? [];
  const saved = library?.saved ?? [];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[1180px] flex-1 px-5 py-6 sm:px-8 sm:py-8">
        <header className="border-b border-[var(--rule)] pb-4">
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <p className="eyebrow">Espace personnel</p>
            <h1 className="display text-[clamp(1.5rem,2.8vw,2.15rem)] leading-[1.08]">
              Bonjour, {user.name.split(" ")[0]}.
            </h1>
          </div>
          <p className="mt-1.5 max-w-xl text-[13.5px] leading-snug text-foreground/60">
            {account?.bio ??
              "Votre collection de citations, vos propositions et vos préférences de lecture."}
          </p>
        </header>

        <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="space-y-12 lg:col-span-8">
            <section>
              <SectionHeading
                title="Mes propositions"
                note={`${myProposals.length} envoi${myProposals.length > 1 ? "s" : ""}`}
              />
              {myProposals.length === 0 ? (
                <p className="border-y border-[var(--rule)] py-8 font-serif text-[15px] italic text-foreground/65">
                  Aucune proposition pour l’instant. Une phrase vous a marqué ?
                  Proposez-la depuis le catalogue.
                </p>
              ) : (
                <ul className="border-b border-[var(--rule)]">
                  {myProposals.map((proposal) => (
                    <li
                      key={proposal.id}
                      className="grid gap-2 border-t border-[var(--rule)] py-4 sm:grid-cols-[1fr_auto] sm:items-baseline"
                    >
                      <div>
                        <p className="display text-[17px] leading-snug">
                          «&nbsp;{proposal.quote}&nbsp;»
                        </p>
                        <p className="mt-1.5 text-[10.5px] uppercase tracking-[0.15em] text-foreground/40">
                          {proposal.source} · {formatDate(proposal.submittedAt)}
                        </p>
                      </div>
                      <span
                        className={
                          proposal.status === "APPROVED"
                            ? "text-[10px] uppercase tracking-[0.14em] text-sage-600 dark:text-sage-100"
                            : "text-[10px] uppercase tracking-[0.14em] text-foreground/40"
                        }
                      >
                        {proposalStatusLabels[proposal.status]}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <SectionHeading
                title="Enregistrés"
                note="Votre collection privée"
                href="/catalogue"
                linkLabel="Parcourir"
              />
              <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {saved.map((item) => (
                  <MediaCard
                    key={item.slug}
                    item={item}
                    href={`/citation/${item.slug}`}
                  />
                ))}
                {saved.length === 0 ? (
                  <p className="font-serif text-[15px] italic text-foreground/65">
                    Aucune citation enregistrée pour l’instant.
                  </p>
                ) : null}
              </div>
            </section>
          </div>

          <aside className="panel space-y-6 lg:col-span-4">
            <div>
              <div className="flex items-center gap-4">
                <span className="grid size-14 place-items-center rounded-full border border-[var(--rule-strong)] font-mono text-[14px] text-foreground/70">
                  {initialsOf(user.name)}
                </span>
                <div>
                  <p className="display text-[20px] leading-none">
                    {user.name}
                  </p>
                  <p className="mt-1.5 text-[12px] text-foreground/65">
                    {user.email}
                  </p>
                </div>
              </div>

              <dl className="mt-6 space-y-2.5 text-[12.5px]">
                <div className="flex justify-between gap-4 border-t border-[var(--rule)] pt-2.5">
                  <dt className="eyebrow">Rôle</dt>
                  <dd className="text-foreground/70">{roleLabels[user.role]}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-[var(--rule)] pt-2.5">
                  <dt className="eyebrow">Membre depuis</dt>
                  <dd className="font-mono text-[11.5px] text-foreground/60">
                    {account ? formatDate(account.joinedAt) : "2026"}
                  </dd>
                </div>
              </dl>

              {canEditContent(user.role) ? (
                <Link
                  href="/admin"
                  className="group mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-sage-600 dark:text-sage-100"
                >
                  <span className="link-underline">Ouvrir l’administration</span>
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              ) : null}
            </div>

            <div className="border-t border-[var(--rule-strong)] pt-5">
              <p className="eyebrow">Préférences de lecture</p>

              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between gap-4 border-t border-[var(--rule)] pt-4">
                  <label
                    htmlFor="account-language"
                    className="text-[12.5px] text-foreground/65"
                  >
                    Langue des citations
                  </label>
                  <select
                    id="account-language"
                    value={language}
                    onChange={(event) => {
                      const value = event.target.value;
                      setLanguage(value);
                      void updatePreferences({ language: value })
                        .then(() => toast("Langue mise à jour"))
                        .catch(() => toast("Mise à jour impossible"));
                    }}
                    className="border-0 border-b border-[var(--rule)] bg-transparent pb-1 text-[12.5px] text-foreground/80 focus:border-sage-300 focus:outline-none"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-[var(--rule)] pt-4">
                  <span className="text-[12.5px] text-foreground/65">
                    Thème
                  </span>
                  <div className="flex items-baseline gap-4">
                    {(["light", "dark"] as const).map((theme) => (
                      <button
                        key={theme}
                        type="button"
                        onClick={() => setTheme(theme)}
                        className={
                          resolvedTheme === theme
                            ? "bg-left-bottom bg-no-repeat font-medium text-[11px] uppercase tracking-[0.14em] text-foreground [background-image:linear-gradient(var(--color-sage-600),var(--color-sage-600))] [background-size:100%_1px] dark:[background-image:linear-gradient(var(--color-sage-300),var(--color-sage-300))]"
                            : "link-underline text-[11px] uppercase tracking-[0.14em] text-foreground/65 transition-colors hover:text-foreground"
                        }
                      >
                        {theme === "light" ? "Clair" : "Sombre"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-[var(--rule)] pt-4">
                  <label
                    htmlFor="account-newsletter"
                    className="text-[12.5px] text-foreground/65"
                  >
                    Lettre du dimanche
                  </label>
                  <Switch
                    id="account-newsletter"
                    checked={newsletter}
                    onCheckedChange={(checked) => {
                      setNewsletter(checked);
                      void updatePreferences({ newsletter: checked })
                        .then(() =>
                          toast(
                            checked
                              ? "Inscription à la lettre confirmée"
                              : "Désinscription de la lettre confirmée",
                          ),
                        )
                        .catch(() => toast("Mise à jour impossible"));
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--rule)] pt-5">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  signOut();
                  router.push("/");
                }}
                className="h-9 rounded-none px-0 text-[11px] uppercase tracking-[0.16em] text-foreground/80 hover:bg-transparent hover:text-foreground"
              >
                <LogOut className="size-3.5" />
                Se déconnecter
              </Button>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
