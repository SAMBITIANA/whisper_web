"use client";

import { useState } from "react";
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
import { media } from "@/lib/fake-data";
import { adminProposals, proposalStatusLabels } from "@/lib/fake-admin";
import { formatDate } from "@/lib/format";
import {
  canEditContent,
  demoAccounts,
  initialsOf,
  roleLabels,
} from "@/lib/session";
import { useRequiredSession } from "@/lib/use-required-session";

const saved = media.slice(0, 3);

export default function ComptePage() {
  const { user, ready } = useRequiredSession();
  const { signOut } = useSession();
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const [language, setLanguage] = useState("fr");
  const [newsletter, setNewsletter] = useState(true);

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

  const account = demoAccounts.find((item) => item.email === user.email);
  const myProposals = adminProposals.filter(
    (proposal) => proposal.author === user.name,
  );

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[1180px] flex-1 px-5 py-12 sm:px-8">
        <header className="border-b border-[var(--rule)] pb-8">
          <p className="eyebrow">Espace personnel</p>
          <h1 className="display mt-4 text-[clamp(2.2rem,4.6vw,3.4rem)] leading-[1.03]">
            Bonjour, {user.name.split(" ")[0]}.
          </h1>
          <p className="mt-3 max-w-xl font-serif text-[15px] italic leading-relaxed text-foreground/55">
            {account?.bio ??
              "Votre collection de citations, vos propositions et vos préférences de lecture."}
          </p>
        </header>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-16 lg:col-span-8">
            <section>
              <SectionHeading
                title="Mes propositions"
                note={`${myProposals.length} envoi${myProposals.length > 1 ? "s" : ""}`}
              />
              {myProposals.length === 0 ? (
                <p className="border-y border-[var(--rule)] py-8 font-serif text-[15px] italic text-foreground/50">
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
                            ? "text-[10px] uppercase tracking-[0.14em] text-sage-700 dark:text-sage-100"
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
              </div>
            </section>
          </div>

          <aside className="space-y-8 lg:col-span-4">
            <div className="border-y border-[var(--rule)] py-6">
              <div className="flex items-center gap-4">
                <span className="grid size-14 place-items-center rounded-full border border-[var(--rule-strong)] font-mono text-[14px] text-foreground/70">
                  {initialsOf(user.name)}
                </span>
                <div>
                  <p className="display text-[20px] leading-none">
                    {user.name}
                  </p>
                  <p className="mt-1.5 text-[12px] text-foreground/50">
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
                  className="group mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-sage-700 dark:text-sage-100"
                >
                  <span className="link-underline">Ouvrir l’administration</span>
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              ) : null}
            </div>

            <div>
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
                      setLanguage(event.target.value);
                      toast("Langue mise à jour (maquette)");
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
                            ? "text-[11px] uppercase tracking-[0.14em] text-foreground [background-size:100%_1px]"
                            : "link-underline text-[11px] uppercase tracking-[0.14em] text-foreground/40 transition-colors hover:text-foreground"
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
                      toast(
                        checked
                          ? "Inscription à la lettre (maquette)"
                          : "Désinscription de la lettre (maquette)",
                      );
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
                className="h-9 rounded-none px-0 text-[11px] uppercase tracking-[0.16em] text-foreground/55 hover:bg-transparent hover:text-foreground"
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
