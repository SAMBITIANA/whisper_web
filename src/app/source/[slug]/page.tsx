import { notFound } from "next/navigation";
import { connection } from "next/server";

import { SourceView } from "@/features/source/source-view";
import { getServerI18n } from "@/i18n/server";
import { fetchSource } from "@/lib/api";

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
    const source = await fetchSource(slug);
    return { title: `${source.title} — ${t("brand.name")}` };
  } catch {
    return { title: t("source.notFoundTitle") };
  }
}

export default async function SourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connection();

  let source;
  try {
    source = await fetchSource(slug);
  } catch {
    notFound();
  }

  return <SourceView source={source} />;
}
