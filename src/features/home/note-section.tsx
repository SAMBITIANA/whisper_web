export function NoteSection() {
  return (
        <aside className="mx-auto mt-12 w-full max-w-[1180px] px-5 sm:px-8">
          <div className="grid gap-8 border-y border-[var(--rule)] py-8 md:grid-cols-[6rem_1fr] md:gap-14">
            <p className="eyebrow md:pt-2">Note</p>
            <p className="font-serif text-[clamp(1.15rem,2vw,1.5rem)] leading-[1.5] text-pretty text-foreground/75">
              Le texte n’est jamais gravé dans l’image&nbsp;: il reste une couche
              séparée, posée par-dessus la vidéo, l’image ou la chanson. C’est ce
              qui permet de le lire dans sa langue, de le changer en cours de
              lecture et de le partager tel quel — sans retoucher le média.
            </p>
          </div>
        </aside>
  );
}
