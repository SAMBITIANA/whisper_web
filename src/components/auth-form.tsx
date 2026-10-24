"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/components/session-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { errorMessage, requestMagicLink } from "@/lib/api";

type Mode = "signin" | "signup";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4">
      <path
        d="M21.6 12.23c0-.68-.06-1.36-.19-2.02H12v3.83h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.32 2.98-7.33Z"
        fill="currentColor"
      />
      <path
        d="M12 22c2.7 0 4.96-.9 6.62-2.44l-3.24-2.5c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.75-5.59-4.1H3.06v2.58A10 10 0 0 0 12 22Z"
        fill="currentColor"
        opacity="0.75"
      />
      <path
        d="M6.41 13.92a6 6 0 0 1 0-3.84V7.5H3.06a10 10 0 0 0 0 9l3.35-2.58Z"
        fill="currentColor"
        opacity="0.55"
      />
      <path
        d="M12 5.98c1.47 0 2.79.5 3.82 1.5l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.94 5.5l3.35 2.58C7.2 7.73 9.4 5.98 12 5.98Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { signIn, signUp } = useSession();
  const [method, setMethod] = useState<"password" | "magic">("password");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);

  const isSignup = mode === "signup";

  function destination(): string {
    if (typeof window === "undefined") return "/compte";
    return new URLSearchParams(window.location.search).get("next") ?? "/compte";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (method === "magic") {
      if (!email.trim()) {
        setError("Indiquez votre adresse e-mail.");
        return;
      }
      try {
        await requestMagicLink(email.trim());
        setMagicSent(true);
        toast("Lien magique demandé", {
          description: `Si un compte existe pour ${email}, un lien a été créé.`,
        });
      } catch (requestError) {
        setError(errorMessage(requestError, "Envoi impossible."));
      }
      return;
    }

    if (isSignup) {
      const result = await signUp({ name, email, password });
      if (!result.ok) {
        setError(result.error ?? "Inscription impossible.");
        return;
      }
      toast("Compte créé", { description: `Bienvenue, ${name}.` });
      router.push(destination());
      return;
    }

    const result = await signIn(email, password);
    if (!result.ok) {
      setError(result.error ?? "Connexion impossible.");
      return;
    }
    toast("Connexion réussie");
    router.push(destination());
  }

  return (
    <div className="w-full">
      <div className="lg:hidden">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-foreground/65"
        >
          <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Retour au site
        </Link>
      </div>

      <p className="eyebrow mt-8 lg:mt-0">
        {isSignup ? "Créer un compte" : "Espace personnel"}
      </p>
      <h1 className="display mt-1.5 text-[clamp(1.6rem,3vw,2.1rem)] leading-[1.08] text-balance">
        {isSignup ? "Rejoindre Whispers." : "Revenir à ses citations."}
      </h1>
      <p className="mt-3 max-w-sm text-[13.5px] leading-relaxed text-foreground/65">
        {isSignup
          ? "Un compte pour proposer des citations, garder vos favoris et suivre vos propositions."
          : "Retrouvez vos favoris, vos propositions et votre langue de lecture."}
      </p>

      {!isSignup ? (
        <div className="mt-8 flex items-baseline gap-6 border-b border-[var(--rule)]">
          {(
            [
              ["password", "Mot de passe"],
              ["magic", "Lien magique"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setMethod(value);
                setError(null);
                setMagicSent(false);
              }}
              className={
                method === value
                  ? "-mb-px border-b-2 border-sage-600 bg-sage-100 px-2 pb-2.5 pt-1.5 text-[12px] font-medium uppercase tracking-[0.14em] text-sage-900 dark:border-sage-300 dark:bg-sage-300/20 dark:text-sage-100"
                  : "-mb-px border-b-2 border-transparent px-2 pb-2.5 pt-1.5 text-[12px] uppercase tracking-[0.14em] text-foreground/65 transition-colors hover:text-foreground"
              }
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}

      {magicSent ? (
        <div className="panel mt-8">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-sage-600 dark:text-sage-100">
            <Mail className="size-4" />
            Lien envoyé
          </div>
          <p className="mt-3 text-[13.5px] leading-relaxed text-foreground/60">
            Si un compte existe pour{" "}
            <span className="font-medium">{email}</span>, un lien de connexion y
            sera envoyé. En maquette, l’envoi est simulé — utilisez l’onglet «
            Mot de passe ».
          </p>
          <button
            type="button"
            onClick={() => setMagicSent(false)}
            className="link-underline mt-4 text-[11px] uppercase tracking-[0.16em] text-foreground/65"
          >
            Utiliser une autre adresse
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="panel mt-8 space-y-6">
          {isSignup ? (
            <div className="space-y-2">
              <Label htmlFor="name" className="eyebrow">
                Nom affiché
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
                className="h-10 rounded-none border-0 border-b border-[var(--rule)] bg-transparent px-0 text-[14px] shadow-none focus-visible:border-sage-300 focus-visible:ring-0 dark:bg-transparent"
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email" className="eyebrow">
              Adresse e-mail
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              placeholder="vous@exemple.fr"
              className="h-10 rounded-none border-0 border-b border-[var(--rule)] bg-transparent px-0 text-[14px] shadow-none placeholder:text-foreground/65 focus-visible:border-sage-300 focus-visible:ring-0 dark:bg-transparent"
            />
          </div>

          {method === "password" ? (
            <div className="space-y-2">
              <div className="flex items-baseline justify-between gap-4">
                <Label htmlFor="password" className="eyebrow">
                  Mot de passe
                </Label>
                {!isSignup ? (
                  <button
                    type="button"
                    onClick={() =>
                      toast("Réinitialisation simulée", {
                        description:
                          "Maquette : le parcours de récupération sera branché à l’API.",
                      })
                    }
                    className="link-underline text-[10.5px] uppercase tracking-[0.14em] text-foreground/65 transition-colors hover:text-foreground"
                  >
                    Oublié ?
                  </button>
                ) : null}
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={isSignup ? "new-password" : "current-password"}
                required
                className="h-10 rounded-none border-0 border-b border-[var(--rule)] bg-transparent px-0 text-[14px] shadow-none focus-visible:border-sage-300 focus-visible:ring-0 dark:bg-transparent"
              />
              {isSignup ? (
                <p className="text-[11.5px] text-foreground/65">
                  Six caractères minimum. Le stockage sécurisé arrivera avec
                  l’API.
                </p>
              ) : null}
            </div>
          ) : null}

          {error ? (
            <p
              role="alert"
              className="border-l-2 border-destructive pl-3 text-[12.5px] leading-relaxed text-destructive"
            >
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            className="h-11 w-full rounded-none text-[11px] uppercase tracking-[0.16em]"
          >
            {isSignup
              ? "Créer mon compte"
              : method === "magic"
                ? "Recevoir un lien"
                : "Se connecter"}
            <ArrowRight />
          </Button>
        </form>
      )}

      {!isSignup ? (
        <div className="[@media(max-height:700px)]:hidden">
          <div className="my-7 flex items-center gap-4">
            <span className="h-px flex-1 bg-[var(--rule)]" />
            <span className="eyebrow">ou</span>
            <span className="h-px flex-1 bg-[var(--rule)]" />
          </div>

          <button
            type="button"
            onClick={() =>
              toast("Google bientôt disponible", {
                description: "Maquette : l’OAuth sera branché à l’API.",
              })
            }
            className="flex h-11 w-full items-center justify-center gap-2.5 border border-[var(--rule-strong)] text-[11px] uppercase tracking-[0.16em] text-foreground/70 transition-colors hover:border-sage-300 hover:text-foreground"
          >
            <GoogleMark />
            Continuer avec Google
          </button>
        </div>
      ) : null}

      <p className="mt-8 text-[12.5px] text-foreground/65">
        {isSignup ? (
          <>
            Déjà un compte ?{" "}
            <Link
              href="/connexion"
              className="link-underline text-foreground/80 hover:text-foreground"
            >
              Se connecter
            </Link>
          </>
        ) : (
          <>
            Pas encore de compte ?{" "}
            <Link
              href="/inscription"
              className="link-underline text-foreground/80 hover:text-foreground"
            >
              Créer un compte
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
