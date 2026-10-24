import Image from "next/image";

export function CarnetSection() {
  return (
        <section className="mx-auto w-full max-w-[1180px] px-5 pt-10 sm:px-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--rule)] pb-3">
            <p className="eyebrow">Carnet de repérages</p>
            <p className="eyebrow">Images d’illustration</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-12 sm:items-start sm:gap-6">
            <figure className="col-span-2 sm:col-span-5">
              <div className="paper-frame">
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src="/media/carnet-riviere.jpg"
                    alt="Rivière brumeuse traversée par un pêcheur"
                    fill
                    sizes="(min-width: 640px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between">
                <span className="whitespace-nowrap text-[9px] uppercase tracking-[0.12em] text-foreground/60 sm:text-[11px] sm:tracking-[0.19em]">La rivière, 6 h 40</span>
                <span className="hidden font-mono text-[9.5px] text-foreground/30 sm:block">01</span>
              </figcaption>
            </figure>

            <figure className="sm:col-span-4 sm:mt-20">
              <div className="paper-frame">
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src="/media/carnet-atelier.jpg"
                    alt="Intérieur d’un atelier, vestes et cadres aux murs"
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between">
                <span className="whitespace-nowrap text-[9px] uppercase tracking-[0.12em] text-foreground/60 sm:text-[11px] sm:tracking-[0.19em]">L’atelier, après-midi</span>
                <span className="hidden font-mono text-[9.5px] text-foreground/30 sm:block">02</span>
              </figcaption>
            </figure>

            <figure className="sm:col-span-3 sm:mt-6">
              <div className="paper-frame">
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src="/media/carnet-vallee.jpg"
                    alt="Vallée de Yosemite vue depuis la rivière"
                    fill
                    sizes="(min-width: 640px) 25vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between">
                <span className="whitespace-nowrap text-[9px] uppercase tracking-[0.12em] text-foreground/60 sm:text-[11px] sm:tracking-[0.19em]">La vallée, fin d’été</span>
                <span className="hidden font-mono text-[9.5px] text-foreground/30 sm:block">03</span>
              </figcaption>
            </figure>
          </div>
        </section>
  );
}
