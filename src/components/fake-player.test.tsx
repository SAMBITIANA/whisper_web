import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FakePlayer } from "./fake-player";
import { getMedia } from "@/lib/fake-data";
import type { ApiMedia } from "@/lib/api";
import { typography } from "@/lib/format";

const item = getMedia("dernier-train-de-minuit")! as ApiMedia;

function hasText(text: string) {
  return (_content: string, element: Element | null) =>
    (element?.textContent ?? "").includes(text);
}

describe("FakePlayer", () => {
  it("affiche la citation dans la langue choisie", async () => {
    const user = userEvent.setup();
    render(<FakePlayer item={item} />);

    expect(
      screen.getAllByText(hasText(typography(item.quote.fr))).length,
    ).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /Français/ }));
    await user.click(screen.getByRole("menuitem", { name: "English" }));

    expect(
      screen.getAllByText(hasText(typography(item.quote.en ?? ""))).length,
    ).toBeGreaterThan(0);
  });

  it("affiche la source de la citation", () => {
    render(<FakePlayer item={item} />);

    expect(
      screen.getAllByText(/Le dernier train de minuit/).length,
    ).toBeGreaterThan(0);
  });
});
