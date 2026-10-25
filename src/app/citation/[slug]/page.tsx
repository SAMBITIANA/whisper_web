import { notFound } from "next/navigation";
import { connection } from "next/server";

import { CitationView } from "@/features/citation/citation-view";
import { getServerI18n } from "@/i18n/server";
import { sourceKindKeys } from "@/lib/catalogue";
import { fetchMediaBySlug, fetchRelated } from "@/lib/api";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { t } = await getServerI18n();
  await connection();

  try {
    const item = await fetchMediaBySlug(slug);
    return {
      title: `${item.quote.fr} — ${t("brand.name")}`,
      description: `${item.source.title} · ${t(sourceKindKeys[item.source.kind])}`,
    };
  } catch {
    return { title: t("citation.notFoundTitle") };
  }
}

export default async function CitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connection();

  let item;
  try {
    item = await fetchMediaBySlug(slug);
  } catch {
    notFound();
  }

  const related = await fetchRelated(slug, 3).catch(() => []);

  return <CitationView item={item} related={related} />;
}
