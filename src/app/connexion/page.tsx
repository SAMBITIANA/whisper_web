import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = {
  title: "Connexion — Whispers",
  description: "Connectez-vous à votre espace Whispers.",
};

export default function ConnexionPage() {
  return (
    <AuthShell
      quote="Ce n’est pas parce qu’on a perdu le chemin qu’il faut s’arrêter de marcher."
      attribution="Le Chef de gare"
      source="Le dernier train de minuit · 1998 · 01:12"
      image="/media/auth-connexion.jpg"
      imageAlt="Ruelle de briques dans la lumière du matin"
    >
      <AuthForm mode="signin" />
    </AuthShell>
  );
}
