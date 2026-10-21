export type Role = "USER" | "EDITOR" | "ADMIN";

export type SessionUser = {
  email: string;
  name: string;
  role: Role;
};

export type DemoAccount = SessionUser & {
  password: string;
  joinedAt: string;
  bio: string;
};

export const roleLabels: Record<Role, string> = {
  USER: "Membre",
  EDITOR: "Éditeur",
  ADMIN: "Administrateur",
};

export const SESSION_COOKIE = "whispers_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export const demoAccounts: DemoAccount[] = [
  {
    email: "julien@whispers.app",
    name: "Julien R.",
    role: "ADMIN",
    password: "whispers",
    joinedAt: "2025-11-04",
    bio: "Fondateur. Édite la sélection du jour et relit les propositions.",
  },
  {
    email: "lea@whispers.app",
    name: "Léa M.",
    role: "EDITOR",
    password: "whispers",
    joinedAt: "2026-01-17",
    bio: "Éditrice. Sources, traductions et cadre de citation.",
  },
  {
    email: "sam@whispers.app",
    name: "Sam K.",
    role: "USER",
    password: "whispers",
    joinedAt: "2026-09-02",
    bio: "Membre. Collectionne les répliques de films des années 90.",
  },
];

export const LOCAL_ACCOUNTS_KEY = "whispers_local_accounts";

export function readLocalAccounts(): DemoAccount[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(LOCAL_ACCOUNTS_KEY) ?? "[]",
    ) as DemoAccount[];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function findLocalAccount(email: string): DemoAccount | undefined {
  return readLocalAccounts().find(
    (account) => account.email.toLowerCase() === email.trim().toLowerCase(),
  );
}

export function saveLocalAccount(account: DemoAccount): void {
  if (typeof window === "undefined") return;

  const accounts = readLocalAccounts().filter(
    (item) => item.email !== account.email,
  );
  window.localStorage.setItem(
    LOCAL_ACCOUNTS_KEY,
    JSON.stringify([account, ...accounts]),
  );
}

export function findAccount(email: string): DemoAccount | undefined {
  return demoAccounts.find(
    (account) => account.email.toLowerCase() === email.trim().toLowerCase(),
  );
}

function base64Encode(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function base64Decode(value: string): string {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeSession(user: SessionUser): string {
  return base64Encode(
    JSON.stringify({
      email: user.email,
      name: user.name,
      role: user.role,
    }),
  );
}

export function decodeSession(value: string | undefined): SessionUser | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(base64Decode(value)) as Partial<SessionUser>;
    if (!parsed.email || !parsed.name || !parsed.role) return null;
    if (!["USER", "EDITOR", "ADMIN"].includes(parsed.role)) return null;
    return {
      email: parsed.email,
      name: parsed.name,
      role: parsed.role as Role,
    };
  } catch {
    return null;
  }
}

export function readSessionCookieValue(): string {
  if (typeof document === "undefined") return "";

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${SESSION_COOKIE}=`));

  return match?.split("=").slice(1).join("=") ?? "";
}

export function readSessionCookie(): SessionUser | null {
  return decodeSession(readSessionCookieValue());
}

export function writeSessionCookie(user: SessionUser): void {
  document.cookie = `${SESSION_COOKIE}=${encodeSession(user)}; path=/; max-age=${SESSION_MAX_AGE}; samesite=lax`;
}

export function clearSessionCookie(): void {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function canEditContent(role: Role): boolean {
  return role === "EDITOR" || role === "ADMIN";
}

export function canManageUsers(role: Role): boolean {
  return role === "ADMIN";
}
