import { connection } from "next/server";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CarnetSection } from "@/features/home/carnet-section";
import { CommunitySection } from "@/features/home/community-section";
import { FeaturedSection } from "@/features/home/featured-section";
import { FormatsSection } from "@/features/home/formats-section";
import { FreshSection } from "@/features/home/fresh-section";
import { MoodsTopicsSection } from "@/features/home/moods-topics-section";
import { NoteSection } from "@/features/home/note-section";
import { ProposalSection } from "@/features/home/proposal-section";
import { TrendingSection } from "@/features/home/trending-section";
import { fetchHome } from "@/lib/api";

export const instant = false;

export default async function HomePage() {
  await connection();
  const home = await fetchHome();
  const featured = home.featured;

  if (!featured) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-serif text-[16px] italic text-foreground/65">
          Aucune citation publiée pour l’instant.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <FeaturedSection
          featured={featured}
          stats={home.stats}
          languages={home.languages}
        />
        <TrendingSection items={home.trending} />
        <MoodsTopicsSection moods={home.moods} topics={home.topics} />
        <CarnetSection />
        <FreshSection items={home.fresh} />
        <NoteSection />
        <ProposalSection items={home.songs} />
        <FormatsSection />
        <CommunitySection items={home.community} />
      </main>

      <SiteFooter />
    </div>
  );
}
