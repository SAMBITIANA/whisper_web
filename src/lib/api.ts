import axios from "axios";
import { z } from "zod";
import type {
  CatalogueMedia,
  CatalogueSource,
  LanguageCode,
  MediaKind,
  SourceKind,
} from "@/types/catalogue";

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
  withCredentials: true,
});

export const helloSchema = z.string();

export async function pingServer(): Promise<string> {
  const { data } = await api.get<unknown>("/");
  return helloSchema.parse(data);
}

export type ApiRole = "USER" | "EDITOR" | "ADMIN";

export type ApiUser = {
  id: string;
  email: string;
  name: string;
  role: ApiRole;
  status: string;
  joinedAt: string;
  bio: string | null;
  avatarUrl: string | null;
  preferredLanguage: string;
  newsletterOptIn: boolean;
  themePreference: string;
  emailVerifiedAt: string | null;
};

export type ApiMedia = CatalogueMedia & {
  id: string;
  status: string;
  originalLanguage: string;
  topicSlugs: string[];
  moodSlug: string;
  saves: number;
  featured: boolean;
  community: boolean;
  userState?: { saved: boolean; reaction: string | null };
};

export type ApiSource = CatalogueSource & {
  id: string;
  quoteCount: number;
  characters: { id: string; name: string; description: string | null }[];
  rightsStatus: string;
};

export type ApiTaxonomy = {
  topics: { slug: string; name: string; count: number }[];
  moods: { slug: string; name: string; count: number }[];
  languages: { code: LanguageCode; label: string; name: string }[];
  formats: { code: string; labelKey: string; icon: string | null }[];
};

export type ApiHome = {
  featured: ApiMedia | null;
  trending: ApiMedia[];
  fresh: ApiMedia[];
  songs: ApiMedia[];
  community: ApiMedia[];
  moods: string[];
  topics: string[];
  languages: { code: LanguageCode; label: string }[];
  stats: { media: number; formats: number; languages: number; views: number };
};

export type ApiProposal = {
  id: string;
  quote: string;
  source: string;
  sourceTitle: string | null;
  sourceUrl: string | null;
  locator: string | null;
  language: string;
  author: string;
  authorId: string | null;
  submittedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason: string | null;
  mediaSlug: string | null;
};

export type ApiLibrary = {
  saved: ApiMedia[];
  liked: (ApiMedia & { reaction: string })[];
  history: (ApiMedia & { viewedAt: string })[];
  proposals: ApiProposal[];
};

export type ApiMe = {
  user: ApiUser;
  stats: { favorites: number; reactions: number; views: number; proposals: number };
};

export type ApiAdminDashboard = {
  stats: {
    views: number;
    reactions: number;
    pending: number;
    published: number;
    media: number;
    users: number;
  };
  distribution: { kind: MediaKind; count: number }[];
  proposals: { total: number; pending: number; approved: number; rejected: number };
  activity: {
    id: string;
    text: string;
    when: string;
    action?: string;
    targetType?: string | null;
  }[];
  pipeline: { label: string; value: string; note: string }[];
};

export type ApiAdminMedia = {
  id: string;
  slug: string;
  kind: MediaKind;
  title: string;
  source: string;
  date: string;
  views: number;
  status: string;
  poster: string | null;
  href: string;
};

export type ApiAdminUser = {
  id: string;
  email: string;
  name: string;
  role: ApiRole;
  status: "Actif" | "Suspendu";
  joinedAt: string;
};

export type ApiAdminLanguage = {
  code: string;
  name: string;
  nativeName: string;
  isActive: boolean;
  sortOrder: number;
};

export type ApiAdminMediaFormat = {
  id: string;
  code: string;
  labelKey: string;
  icon: string | null;
  isActive: boolean;
  sortOrder: number;
};

export function errorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string") return message;
    if (Array.isArray(message) && typeof message[0] === "string") return message[0];
  }
  return fallback;
}

export async function fetchSession(): Promise<ApiUser | null> {
  try {
    const { data } = await api.get<{ user: ApiUser }>("/auth/session");
    return data.user;
  } catch {
    return null;
  }
}

export async function login(email: string, password: string) {
  const { data } = await api.post<{ user: ApiUser }>("/auth/login", {
    email,
    password,
  });
  return data.user;
}

export async function signup(input: {
  name: string;
  email: string;
  password: string;
}) {
  const { data } = await api.post<{ user: ApiUser }>("/auth/signup", input);
  return data.user;
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function requestMagicLink(email: string) {
  await api.post("/auth/magic-link", { email });
}

export async function fetchHome(): Promise<ApiHome> {
  const { data } = await api.get<ApiHome>("/home");
  return data;
}

export async function fetchMedia(params: Record<string, string | undefined> = {}) {
  const { data } = await api.get<{
    items: ApiMedia[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }>("/media", { params });
  return data;
}

export async function fetchMediaBySlug(slug: string): Promise<ApiMedia> {
  const { data } = await api.get<ApiMedia>(`/media/${slug}`);
  return data;
}

export async function fetchRelated(slug: string, limit = 3) {
  const { data } = await api.get<{ items: ApiMedia[] }>(
    `/media/${slug}/related`,
    { params: { limit } },
  );
  return data.items;
}

export async function fetchSources() {
  const { data } = await api.get<{ items: ApiSource[] }>("/sources");
  return data.items;
}

export async function fetchSource(slug: string) {
  const { data } = await api.get<ApiSource & { media: ApiMedia[] }>(
    `/sources/${slug}`,
  );
  return data;
}

export async function fetchTaxonomy(): Promise<ApiTaxonomy> {
  const { data } = await api.get<ApiTaxonomy>("/taxonomy");
  return data;
}

export async function fetchMe(): Promise<ApiMe> {
  const { data } = await api.get<ApiMe>("/me");
  return data;
}

export async function updatePreferences(input: {
  language?: string;
  theme?: string;
  newsletter?: boolean;
}) {
  const { data } = await api.patch<{ user: ApiUser }>("/me/preferences", input);
  return data.user;
}

export async function fetchLibrary(): Promise<ApiLibrary> {
  const { data } = await api.get<ApiLibrary>("/me/library");
  return data;
}

export async function toggleFavorite(slug: string, saved: boolean) {
  const { data } = saved
    ? await api.delete<{ saved: boolean }>(`/media/${slug}/favorite`)
    : await api.put<{ saved: boolean }>(`/media/${slug}/favorite`);
  return data;
}

export async function setReaction(slug: string, type: string) {
  const { data } = await api.put<{ reaction: string }>(
    `/media/${slug}/reaction`,
    { type },
  );
  return data;
}

export async function removeReaction(slug: string) {
  const { data } = await api.delete<{ reaction: string | null }>(
    `/media/${slug}/reaction`,
  );
  return data;
}

export async function recordView(slug: string) {
  await api.post(`/media/${slug}/view`, {});
}

export async function createProposal(input: {
  quote: string;
  sourceTitle: string;
  locator?: string;
  mediaId?: string;
}) {
  const { data } = await api.post<ApiProposal>("/proposals", input);
  return data;
}

export async function fetchMyProposals() {
  const { data } = await api.get<{ items: ApiProposal[] }>("/me/proposals");
  return data.items;
}

export async function fetchAdminDashboard(): Promise<ApiAdminDashboard> {
  const { data } = await api.get<ApiAdminDashboard>("/admin/dashboard");
  return data;
}

export async function fetchAdminMedia() {
  const { data } = await api.get<{ items: ApiAdminMedia[] }>("/admin/media");
  return data.items;
}

export async function fetchAdminSources() {
  const { data } = await api.get<{ items: ApiSource[] }>("/admin/sources");
  return data.items;
}

export async function fetchAdminProposals(status?: string) {
  const { data } = await api.get<{ items: ApiProposal[] }>("/admin/proposals", {
    params: status ? { status } : undefined,
  });
  return data.items;
}

export async function reviewProposal(
  id: string,
  input: {
    status?: ApiProposal["status"];
    quote?: string;
    rejectionReason?: string;
  },
) {
  const { data } = await api.patch<ApiProposal>(
    `/admin/proposals/${id}`,
    input,
  );
  return data;
}

export async function fetchAdminUsers() {
  const { data } = await api.get<{ items: ApiAdminUser[] }>("/admin/users");
  return data.items;
}

export async function updateAdminUserRole(id: string, role: ApiRole) {
  await api.patch(`/admin/users/${id}/role`, { role });
}

export async function updateAdminUserStatus(
  id: string,
  status: "ACTIVE" | "SUSPENDED",
) {
  await api.patch(`/admin/users/${id}/status`, { status });
}

export async function fetchAdminLanguages() {
  const { data } = await api.get<{ items: ApiAdminLanguage[] }>(
    "/admin/languages",
  );
  return data.items;
}

export async function createAdminLanguage(input: {
  code: string;
  name: string;
  nativeName: string;
  sortOrder?: number;
  isActive?: boolean;
}) {
  const { data } = await api.post<ApiAdminLanguage>(
    "/admin/languages",
    input,
  );
  return data;
}

export async function updateAdminLanguage(
  code: string,
  input: {
    name?: string;
    nativeName?: string;
    sortOrder?: number;
    isActive?: boolean;
  },
) {
  const { data } = await api.patch<ApiAdminLanguage>(
    `/admin/languages/${code}`,
    input,
  );
  return data;
}

export async function fetchAdminMediaFormats() {
  const { data } = await api.get<{ items: ApiAdminMediaFormat[] }>(
    "/admin/media-formats",
  );
  return data.items;
}

export async function createAdminMediaFormat(input: {
  code: string;
  labelKey: string;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
}) {
  const { data } = await api.post<ApiAdminMediaFormat>(
    "/admin/media-formats",
    input,
  );
  return data;
}

export async function updateAdminMediaFormat(
  id: string,
  input: {
    code?: string;
    labelKey?: string;
    icon?: string;
    sortOrder?: number;
    isActive?: boolean;
  },
) {
  const { data } = await api.patch<ApiAdminMediaFormat>(
    `/admin/media-formats/${id}`,
    input,
  );
  return data;
}

export async function deleteAdminMediaFormat(id: string) {
  const { data } = await api.delete<{ deleted: boolean }>(
    `/admin/media-formats/${id}`,
  );
  return data;
}

export type ApiQuoteCandidate = {
  quote_fr: string;
  title_fr: string;
  topics: string[];
  mood: string;
};

export async function generateAdminQuotes(input: {
  theme?: string;
  mood?: string;
  count?: number;
  instructions?: string;
}) {
  const { data } = await api.post<{
    jobId: string;
    provider: string;
    model: string;
    costCents: number;
    candidates: ApiQuoteCandidate[];
  }>("/ai/text/quotes", input, { timeout: 60_000 });

  return data;
}

export async function generateAdminScenes(input: {
  sentences: string[];
  mood?: string;
  width?: number;
  height?: number;
  seed?: number;
  instructions?: string;
}) {
  const { data } = await api.post<{
    jobId: string;
    provider: string;
    model: string;
    costCents: number;
    items: { sentence: string; prompt: string; url: string }[];
  }>("/ai/image/scenes", input, { timeout: 240_000 });

  return data;
}

export async function generateAdminMusic(input: {
  mood: string;
  durationSec: number;
  instructions?: string;
}) {
  const { data } = await api.post<{
    jobId: string;
    provider: string;
    model: string;
    url: string | null;
    costCents: number;
  }>("/ai/music", input, { timeout: 240_000 });

  return data;
}

export async function generateAdminLocalize(input: {
  text: string;
  sourceLanguage: string;
  targets?: string[];
  styleGuide?: string;
}) {
  const { data } = await api.post<{
    jobId: string;
    sourceLanguage: string;
    provider: string;
    translations: { language: string; text: string }[];
    audio: {
      language: string;
      text: string;
      url: string | null;
      durationSec: number;
      cacheKey: string;
    }[];
  }>("/ai/localize", input, { timeout: 600_000 });

  return data;
}

export async function generateAdminSpeech(input: {
  text: string;
  language: string;
  voice?: string;
}) {
  const { data } = await api.post<{
    jobId: string;
    provider: string;
    model: string;
    language: string;
    cacheKey: string;
    url: string | null;
    durationSec: number;
    costCents: number;
  }>("/ai/speech", input, { timeout: 180_000 });

  return data;
}

export async function uploadAdminFile(file: File) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post<{
    url: string;
    posterUrl?: string;
    durationSec?: number;
  }>("/admin/uploads", form);
  return data;
}

export async function createAdminMedia(input: {
  kind: MediaKind;
  title: string;
  sourceSlug: string;
  character?: string;
  language: string;
  quote: string;
  topics?: string;
  mood?: string;
  durationSec?: number;
  posterUrl?: string;
  mediaUrl?: string;
  status: "DRAFT" | "PUBLISHED";
  images?: string[];
  musicUrl?: string;
}) {
  const { data } = await api.post("/admin/media", input);
  return data;
}

export type ApiAdminMediaDetail = {
  id: string;
  kind: MediaKind;
  title: string;
  status: string;
  sourceSlug: string;
  character: string;
  language: string;
  quote: string;
  topics: string;
  mood: string;
  durationSec: number;
  posterUrl: string;
  mediaUrl: string;
};

export async function fetchAdminMediaItem(id: string) {
  const { data } = await api.get<ApiAdminMediaDetail>(`/admin/media/${id}`);
  return data;
}

export async function updateAdminMedia(
  id: string,
  input: {
    kind?: MediaKind;
    title?: string;
    sourceSlug?: string;
    character?: string;
    language?: string;
    quote?: string;
    topics?: string;
    mood?: string;
    durationSec?: number;
    posterUrl?: string;
    mediaUrl?: string;
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    images?: string[];
    musicUrl?: string;
  },
) {
  const { data } = await api.patch(`/admin/media/${id}`, input);
  return data;
}

export async function archiveAdminMedia(id: string) {
  const { data } = await api.post<{ archived: boolean }>(
    `/admin/media/${id}/archive`,
  );
  return data;
}

export async function createAdminSource(input: {
  title: string;
  kind: SourceKind;
  author?: string;
  year?: string;
  character?: string;
  locator?: string;
}) {
  const { data } = await api.post<ApiSource>("/admin/sources", input);
  return data;
}
