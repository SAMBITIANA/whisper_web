import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./page";

const pingServer = vi.fn();
const socketHandlers: Record<string, (...args: unknown[]) => void> = {};
const disconnect = vi.fn();

vi.mock("@/lib/api", () => ({
  pingServer: () => pingServer(),
}));

vi.mock("@/lib/socket", () => ({
  createSocket: () => ({
    on: (event: string, handler: (...args: unknown[]) => void) => {
      socketHandlers[event] = handler;
    },
    connect: vi.fn(),
    disconnect,
  }),
}));

describe("Home", () => {
  beforeEach(() => {
    pingServer.mockReset();
    pingServer.mockResolvedValue("Hello World!");
    disconnect.mockClear();
  });

  it("affiche la réponse de l'API et l'état du socket", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Hello World!")).toBeInTheDocument();
    });

    expect(screen.getByText("Connexion en cours...")).toBeInTheDocument();
  });
});
