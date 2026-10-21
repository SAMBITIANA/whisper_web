import { Suspense } from "react";
import { CatalogueBrowser } from "@/components/catalogue-browser";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { mediaKindLabels, type MediaKind } from "@/lib/fake-data";

export const metadata = {
  title: "Catalogue — Whispers",
  description: "Toutes les citations, par format, sujet et humeur.",
};

type CatalogueSearchParams = {
  topic?: string;
  mood?: string;
  type?: string;
  sort?: string;
};

function parseKind(value: string | undefined): MediaKind | null {
  return value && value in mediaKindLabels ? (value as MediaKind) : null;
}

async function CatalogueWithParams({
  searchParams,
}: {
  searchParams: Promise<CatalogueSearchParams>;
}) {
  const params = await searchParams;

  return (
    <CatalogueBrowser
      initialTopic={params.topic}
      initialMood={params.mood}
      initialKind={parseKind(params.type)}
      initialSort={
        params.sort === "popular" || params.sort === "discussed"
          ? params.sort
          : undefined
      }
    />
  );
}

export default function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<CatalogueSearchParams>;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[1180px] flex-1 px-5 py-12 sm:px-8">
        <header className="mb-8 border-b border-[var(--rule)] pb-6">
          <p className="eyebrow">Catalogue</p>
          <h1 className="display mt-4 text-[clamp(2.4rem,5vw,3.75rem)] leading-[1.02]">
            Toutes les citations
          </h1>
          <p className="mt-4 max-w-2xl font-serif text-[16px] italic leading-relaxed text-foreground/60">
            Vidéos, images, galeries et chansons — chaque citation porte sa
            source, son sujet et sa traduction.
          </p>
        </header>

        <Suspense fallback={<CatalogueBrowser />}>
          <CatalogueWithParams searchParams={searchParams} />
        </Suspense>
      </main>

      <SiteFooter />
    </div>
  );
}
