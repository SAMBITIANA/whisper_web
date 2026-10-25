import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";
import { getServerI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();

  return {
    title: t("auth.metadataSigninTitle"),
    description: t("auth.metadataSigninDescription"),
  };
}

export default function ConnexionPage() {
  return (
    <AuthShell
      quote="Ce n’est pas parce qu’on a perdu le chemin qu’il faut s’arrêter de marcher."
      attribution="Le Chef de gare"
      source="Le dernier train de minuit · 1998 · 01:12"
      image="/media/auth-connexion.jpg"
      imageAltKey="auth.imageAltSignin"
    >
      <AuthForm mode="signin" />
    </AuthShell>
  );
}
