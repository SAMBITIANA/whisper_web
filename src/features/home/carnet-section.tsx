"use client";

import Image from "next/image";
import { useI18n } from "@/i18n/provider";

export function CarnetSection() {
  const { t } = useI18n();

  return (
        <section className="mx-auto w-full max-w-[1180px] px-5 pt-10 sm:px-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--rule)] pb-3">
            <p className="eyebrow">{t("home.carnet.title")}</p>
            <p className="eyebrow">{t("home.carnet.note")}</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-12 sm:items-start sm:gap-6">
            <figure className="col-span-2 sm:col-span-5">
              <div className="paper-frame">
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src="/media/carnet-riviere.jpg"
                    alt={t("home.carnet.riverAlt")}
                    fill
                    sizes="(min-width: 640px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between">
                <span className="whitespace-nowrap text-[9px] uppercase tracking-[0.12em] text-foreground/60 sm:text-[11px] sm:tracking-[0.19em]">{t("home.carnet.river")}</span>
                <span className="hidden font-mono text-[9.5px] text-foreground/30 sm:block">01</span>
              </figcaption>
            </figure>

            <figure className="sm:col-span-4 sm:mt-20">
              <div className="paper-frame">
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src="/media/carnet-atelier.jpg"
                    alt={t("home.carnet.workshopAlt")}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between">
                <span className="whitespace-nowrap text-[9px] uppercase tracking-[0.12em] text-foreground/60 sm:text-[11px] sm:tracking-[0.19em]">{t("home.carnet.workshop")}</span>
                <span className="hidden font-mono text-[9.5px] text-foreground/30 sm:block">02</span>
              </figcaption>
            </figure>

            <figure className="sm:col-span-3 sm:mt-6">
              <div className="paper-frame">
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src="/media/carnet-vallee.jpg"
                    alt={t("home.carnet.valleyAlt")}
                    fill
                    sizes="(min-width: 640px) 25vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between">
                <span className="whitespace-nowrap text-[9px] uppercase tracking-[0.12em] text-foreground/60 sm:text-[11px] sm:tracking-[0.19em]">{t("home.carnet.valley")}</span>
                <span className="hidden font-mono text-[9.5px] text-foreground/30 sm:block">03</span>
              </figcaption>
            </figure>
          </div>
        </section>
  );
}
