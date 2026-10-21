import axios from "axios";
import { z } from "zod";

const serverApiUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, "") ??
  "http://localhost:3200";

/**
 * Côté navigateur les appels passent par le proxy Next (`/api/...` -> Nest) :
 * même origine, pas de CORS. Côté serveur on vise l'API Nest directement.
 */
export const api = axios.create({
  baseURL: typeof window === "undefined" ? `${serverApiUrl}/api` : "/api",
  timeout: 15000,
});

export const helloSchema = z.string();

export async function pingServer(): Promise<string> {
  const { data } = await api.get<unknown>("/");
  return helloSchema.parse(data);
}
