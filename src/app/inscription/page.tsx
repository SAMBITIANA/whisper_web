import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = {
  title: "Créer un compte — Whispers",
  description: "Créez votre compte Whispers.",
};

export default function InscriptionPage() {
  return (
    <AuthShell
      quote="On ne choisit pas ses étoiles, on choisit la direction dans laquelle on les suit."
      attribution="Niora"
      source="Les étoiles de Niora · Dessin animé · 2019"
      image="/media/auth-inscription.jpg"
      imageAlt="Café filtre en préparation dans un intérieur boisé"
    >
      <AuthForm mode="signup" />
    </AuthShell>
  );
}
