"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/components/session-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n/provider";
import { errorMessage, requestMagicLink } from "@/lib/api";

type Mode = "signin" | "signup";

const providers = [
  { id: "google", label: "Google", src: "/providers/google.png" },
  { id: "apple", label: "Apple", src: "/providers/apple.png" },
  { id: "facebook", label: "Facebook", src: "/providers/facebook.png" },
] as const;

const fieldClassName =
  "h-10 rounded-none border-0 border-b border-[var(--rule)] bg-transparent px-0 text-[14px] shadow-none transition-colors placeholder:text-foreground/65 focus-visible:ring-0 dark:bg-transparent";

export function AuthForm({ mode }: { mode: Mode }) {
  const { t } = useI18n();
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
        setError(t("auth.requiredEmail"));
        return;
      }
      try {
        await requestMagicLink(email.trim());
        setMagicSent(true);
        toast(t("auth.magicRequested"), {
          description: t("auth.magicRequestedBody", { email }),
        });
      } catch (requestError) {
        setError(errorMessage(requestError, t("auth.sendError")));
      }
      return;
    }

    if (isSignup) {
      const result = await signUp({ name, email, password });
      if (!result.ok) {
        setError(result.error ?? t("auth.signupError"));
        return;
      }
      toast(t("auth.accountCreated"), { description: t("auth.welcome", { name }) });
      router.push(destination());
      return;
    }

    const result = await signIn(email, password);
    if (!result.ok) {
      setError(result.error ?? t("auth.signinError"));
      return;
    }
    toast(t("auth.signedIn"));
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
          {t("common.site")}
        </Link>
      </div>

      <p className="eyebrow mt-8 lg:mt-0">
        {isSignup ? t("auth.createAccount") : t("auth.personal")}
      </p>
      <h1 className="display mt-1.5 text-[clamp(1.6rem,3vw,2.1rem)] leading-[1.08] text-balance">
        {isSignup ? t("auth.joinTitle") : t("auth.signinTitle")}
      </h1>
      <p className="mt-3 max-w-sm text-[13.5px] leading-relaxed text-foreground/65">
        {isSignup
          ? t("auth.joinDescription")
          : t("auth.signinDescription")}
      </p>

      {!isSignup ? (
        <div className="mt-6 flex items-baseline gap-6 border-b border-[var(--rule)]">
          {(
            [
              ["password", t("auth.password")],
              ["magic", t("auth.magic")],
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
            {t("auth.magicSent")}
          </div>
          <p className="mt-3 text-[13.5px] leading-relaxed text-foreground/60">
            {t("auth.magicSentBody", { email })}
          </p>
          <button
            type="button"
            onClick={() => setMagicSent(false)}
            className="link-underline mt-4 text-[11px] uppercase tracking-[0.16em] text-foreground/65"
          >
            {t("auth.useAnother")}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="panel mt-6 space-y-6">
          {isSignup ? (
            <div className="space-y-2">
              <Label htmlFor="name" className="eyebrow">
                {t("auth.name")}
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
                className={fieldClassName}
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email" className="eyebrow">
              {t("auth.email")}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              placeholder="vous@exemple.fr"
              className={fieldClassName}
            />
          </div>

          {method === "password" ? (
            <div className="space-y-2">
              <div className="flex items-baseline justify-between gap-4">
                <Label htmlFor="password" className="eyebrow">
                  {t("auth.password")}
                </Label>
                {!isSignup ? (
                  <button
                    type="button"
                    onClick={() =>
                      toast(t("auth.resetMock"), {
                        description: t("auth.resetMockBody"),
                      })
                    }
                    className="link-underline text-[10.5px] uppercase tracking-[0.14em] text-foreground/65 transition-colors hover:text-foreground"
                  >
                    {t("auth.forgot")}
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
                className={fieldClassName}
              />
              {isSignup ? (
                <p className="text-[11.5px] text-foreground/65">
                  {t("auth.passwordHint")}
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
              ? t("auth.submitSignup")
              : method === "magic"
                ? t("auth.submitMagic")
                : t("auth.submitSignin")}
            <ArrowRight />
          </Button>
        </form>
      )}

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-[var(--rule)]" />
        <span className="eyebrow">{t("auth.or")}</span>
        <span className="h-px flex-1 bg-[var(--rule)]" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            aria-label={`Continuer avec ${provider.label}`}
            onClick={() =>
              toast(t("auth.providerSoon", { provider: provider.label }), {
                description: t("auth.oauthMock"),
              })
            }
            className="flex h-11 items-center justify-center gap-2 border border-[var(--rule-strong)] px-2 text-[10px] uppercase tracking-[0.12em] text-foreground/70 transition-colors hover:border-sage-300 hover:text-foreground"
          >
            <Image
              src={provider.src}
              alt=""
              width={20}
              height={20}
              className={
                provider.id === "apple"
                  ? "size-[18px] object-contain dark:invert"
                  : "size-[18px] object-contain"
              }
            />
            {provider.label}
          </button>
        ))}
      </div>

      <p className="mt-8 text-[12.5px] text-foreground/65">
        {isSignup ? (
          <>
            {t("auth.already")}{" "}
            <Link
              href="/connexion"
              className="link-underline text-foreground/80 hover:text-foreground"
            >
              {t("common.login")}
            </Link>
          </>
        ) : (
          <>
            {t("auth.noAccount")}{" "}
            <Link
              href="/inscription"
              className="link-underline text-foreground/80 hover:text-foreground"
            >
              {t("common.signup")}
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
