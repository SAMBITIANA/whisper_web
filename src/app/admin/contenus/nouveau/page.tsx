"use client";

import { useRouter } from "next/navigation";
import { NewContentForm } from "@/features/admin/new-content-form";

export default function NouveauContenuPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <NewContentForm onCreated={() => router.push("/admin/contenus")} />
    </div>
  );
}
