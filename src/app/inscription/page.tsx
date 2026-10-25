import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";
import { getServerI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();

  return {
    title: t("auth.metadataSignupTitle"),
    description: t("auth.metadataSignupDescription"),
  };
}

export default function InscriptionPage() {
  return (
    <AuthShell
      quote="On ne choisit pas ses étoiles, on choisit la direction dans laquelle on les suit."
      attribution="Niora"
      source="Les étoiles de Niora · Dessin animé · 2019"
      image="/media/auth-inscription.jpg"
      imageAltKey="auth.imageAltSignup"
    >
      <AuthForm mode="signup" />
    </AuthShell>
  );
}
