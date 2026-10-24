"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { sourceLabels, type SourceKind } from "@/lib/catalogue";
import {
  createAdminSource,
  fetchAdminSources,
  type ApiSource,
} from "@/lib/api";

const fieldClass =
  "h-9 w-full rounded-none border-0 border-b border-[var(--rule)] bg-transparent px-0 text-[13px] shadow-none placeholder:text-foreground/30 focus-visible:border-sage-300 focus-visible:ring-0 dark:bg-transparent";

const sourceKinds = Object.keys(sourceLabels) as SourceKind[];

export default function AdminSourcesPage() {
  const [sources, setSources] = useState<ApiSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<SourceKind>("FILM");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [character, setCharacter] = useState("");
  const [locator, setLocator] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchAdminSources()
      .then(setSources)
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Le titre de la source est obligatoire.");
      return;
    }

    try {
      const source = await createAdminSource({
        title: title.trim(),
        kind,
        author: author.trim(),
        year: year.trim(),
        character: character.trim(),
        locator: locator.trim(),
      });
      setSources((current) => [source, ...current]);
      setTitle("");
      setAuthor("");
      setYear("");
      setCharacter("");
      setLocator("");
      toast("Source enregistrée", { description: source.title });
    } catch {
      setError("Enregistrement impossible.");
    }
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--rule)] pb-4">
        <p className="eyebrow">Administration</p>
        <h1 className="display mt-1.5 text-[clamp(1.5rem,2.4vw,1.95rem)] leading-[1.1]">
          Sources
        </h1>
        <p className="mt-1.5 max-w-2xl font-serif text-[13.5px] italic leading-snug text-foreground/65">
          Films, livres, discours, proverbes : chaque citation est rattachée à
          une source et à un emplacement exact.
        </p>
      </header>

      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="flex items-baseline justify-between gap-4 border-b border-[var(--rule)] pb-3">
            <p className="eyebrow">Catalogue</p>
            <p className="font-mono text-[10px] text-foreground/35">
              {sources.length} entrées
            </p>
          </div>

          <ul className="border-b border-[var(--rule)]">
            {loading ? (
              <li className="h-24 animate-pulse bg-foreground/5" />
            ) : null}

            {sources.map((source) => {
              const count = source.quoteCount;

              return (
                <li
                  key={source.slug}
                  className="grid gap-1 border-t border-[var(--rule)] py-3.5 sm:grid-cols-[1fr_auto] sm:items-baseline"
                >
                  <div>
                    <p className="display text-[16px] leading-snug">
                      {source.title}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-foreground/40">
                      {sourceLabels[source.kind]}
                      {source.author ? ` · ${source.author}` : ""}
                      {source.year ? ` · ${source.year}` : ""}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-foreground/35">
                    {count} citation{count > 1 ? "s" : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <form
            onSubmit={handleSubmit}
            className="panel space-y-5"
          >
            <p className="eyebrow">Nouvelle source</p>

            <div className="space-y-2">
              <Label htmlFor="source-title" className="eyebrow">
                Titre
              </Label>
              <input
                id="source-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className={fieldClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source-kind" className="eyebrow">
                Type
              </Label>
              <select
                id="source-kind"
                value={kind}
                onChange={(event) => setKind(event.target.value as SourceKind)}
                className="h-9 w-full border-0 border-b border-[var(--rule)] bg-transparent text-[13px] focus:border-sage-300 focus:outline-none"
              >
                {sourceKinds.map((value) => (
                  <option key={value} value={value}>
                    {sourceLabels[value]}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-[1fr_5rem] gap-5">
              <div className="space-y-2">
                <Label htmlFor="source-author" className="eyebrow">
                  Auteur
                </Label>
                <input
                  id="source-author"
                  value={author}
                  onChange={(event) => setAuthor(event.target.value)}
                  className={fieldClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source-year" className="eyebrow">
                  Année
                </Label>
                <input
                  id="source-year"
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                  inputMode="numeric"
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source-character" className="eyebrow">
                Personnage
              </Label>
              <input
                id="source-character"
                value={character}
                onChange={(event) => setCharacter(event.target.value)}
                className={fieldClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source-locator" className="eyebrow">
                Emplacement
              </Label>
              <input
                id="source-locator"
                value={locator}
                onChange={(event) => setLocator(event.target.value)}
                placeholder="p. 84, 01:12…"
                className={fieldClass}
              />
            </div>

            {error ? (
              <p
                role="alert"
                className="border-l-2 border-destructive pl-3 text-[12px] text-destructive"
              >
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              className="h-10 w-full rounded-none text-[11px] uppercase tracking-[0.16em]"
            >
              Ajouter la source
            </Button>
          </form>
        </aside>
      </div>
    </div>
  );
}
