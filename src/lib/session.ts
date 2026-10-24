export type Role = "USER" | "EDITOR" | "ADMIN";

export type SessionUser = {
  email: string;
  name: string;
  role: Role;
};

export const roleLabels: Record<Role, string> = {
  USER: "Membre",
  EDITOR: "Éditeur",
  ADMIN: "Administrateur",
};

export const SESSION_COOKIE = "whispers_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

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
