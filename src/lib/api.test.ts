import { describe, expect, it } from "vitest";
import { helloSchema } from "./api";

describe("helloSchema", () => {
  it("valide la réponse du serveur", () => {
    expect(helloSchema.parse("Hello World!")).toBe("Hello World!");
  });

  it("rejette une réponse inattendue", () => {
    expect(() => helloSchema.parse({ ok: true })).toThrow();
  });
});
