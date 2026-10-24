import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CatalogueBrowser } from "./catalogue-browser";
import { media } from "@/lib/fake-data";

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  const { media } = await import("@/lib/fake-data");
  const topics = Array.from(new Set(media.flatMap((item) => item.topics)));
  const moods = Array.from(new Set(media.map((item) => item.mood)));

  return {
    ...actual,
    fetchMedia: vi.fn(async () => ({
      items: media,
      meta: { page: 1, limit: 100, total: media.length, totalPages: 1 },
    })),
    fetchTaxonomy: vi.fn(async () => ({
      topics: topics.map((name) => ({ slug: name, name, count: 0 })),
      moods: moods.map((name) => ({ slug: name, name, count: 0 })),
      languages: [
        { code: "fr", label: "Français", name: "Français" },
        { code: "en", label: "English", name: "English" },
      ],
    })),
  };
});

describe("CatalogueBrowser", () => {
  it("affiche tout le catalogue par défaut", async () => {
    render(<CatalogueBrowser />);

    expect(
      await screen.findByText(`${media.length} citations`),
    ).toBeInTheDocument();
  });

  it("filtre par recherche textuelle", async () => {
    const user = userEvent.setup();
    render(<CatalogueBrowser />);
    await screen.findByText(`${media.length} citations`);

    await user.type(screen.getByLabelText("Rechercher"), "minuit");

    expect(
      await screen.findByText("1 citation après filtrage"),
    ).toBeInTheDocument();
  });

  it("filtre par format de média", async () => {
    const user = userEvent.setup();
    render(<CatalogueBrowser />);
    await screen.findByText(`${media.length} citations`);

    const trackCount = media.filter((item) => item.kind === "TRACK").length;
    await user.click(screen.getByRole("button", { name: "Filtres" }));
    await user.click(screen.getByRole("button", { name: "Chanson" }));

    expect(
      await screen.findByText(`${trackCount} citations après filtrage`),
    ).toBeInTheDocument();
  });

  it("affiche un état vide quand rien ne correspond", async () => {
    const user = userEvent.setup();
    render(<CatalogueBrowser />);
    await screen.findByText(`${media.length} citations`);

    await user.type(screen.getByLabelText("Rechercher"), "zzz-zzz-zzz");

    expect(
      await screen.findByText("Aucune citation ne correspond."),
    ).toBeInTheDocument();
  });
});
