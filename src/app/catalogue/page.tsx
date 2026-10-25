import { Suspense } from "react";
import { CatalogueBrowser } from "@/components/catalogue-browser";
import { CatalogueHeader } from "@/components/catalogue-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { mediaKindKeys, type MediaKind } from "@/lib/catalogue";
import { getServerI18n } from "@/i18n/server";

export async function generateMetadata() {
  const { t } = await getServerI18n();

  return {
    title: t("meta.catalogueTitle"),
    description: t("meta.catalogueDescription"),
  };
}

type CatalogueSearchParams = {
  topic?: string;
  mood?: string;
  type?: string;
  sort?: string;
};

function parseKind(value: string | undefined): MediaKind | null {
  return value && value in mediaKindKeys ? (value as MediaKind) : null;
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

      <main className="mx-auto w-full max-w-[1180px] flex-1 px-5 py-6 sm:px-8 sm:py-8">
        <CatalogueHeader />

        <Suspense fallback={<CatalogueBrowser />}>
          <CatalogueWithParams searchParams={searchParams} />
        </Suspense>
      </main>

      <SiteFooter />
    </div>
  );
}
