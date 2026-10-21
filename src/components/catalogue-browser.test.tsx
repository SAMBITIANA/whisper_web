import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CatalogueBrowser } from "./catalogue-browser";
import { media } from "@/lib/fake-data";

describe("CatalogueBrowser", () => {
  it("affiche tout le catalogue par défaut", () => {
    render(<CatalogueBrowser />);

    expect(screen.getByText(`${media.length} citations`)).toBeInTheDocument();
  });

  it("filtre par recherche textuelle", async () => {
    const user = userEvent.setup();
    render(<CatalogueBrowser />);

    await user.type(screen.getByLabelText("Rechercher"), "minuit");

    expect(screen.getByText("1 citation après filtrage")).toBeInTheDocument();
  });

  it("filtre par format de média", async () => {
    const user = userEvent.setup();
    render(<CatalogueBrowser />);

    const trackCount = media.filter((item) => item.kind === "TRACK").length;
    await user.click(screen.getByRole("button", { name: "Filtres" }));
    await user.click(screen.getByRole("button", { name: "Chanson" }));

    expect(
      screen.getByText(`${trackCount} citations après filtrage`),
    ).toBeInTheDocument();
  });

  it("affiche un état vide quand rien ne correspond", async () => {
    const user = userEvent.setup();
    render(<CatalogueBrowser />);

    await user.type(screen.getByLabelText("Rechercher"), "zzz-zzz-zzz");

    expect(
      screen.getByText("Aucune citation ne correspond."),
    ).toBeInTheDocument();
  });
});
