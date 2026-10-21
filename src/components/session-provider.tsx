"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  clearSessionCookie,
  decodeSession,
  findAccount,
  findLocalAccount,
  readSessionCookieValue,
  saveLocalAccount,
  writeSessionCookie,
  type DemoAccount,
  type Role,
  type SessionUser,
} from "@/lib/session";

const listeners = new Set<() => void>();

function emitSessionChange() {
  listeners.forEach((listener) => listener());
}

function subscribeSession(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function subscribeNoop() {
  return () => {};
}

function readValue(): string {
  return readSessionCookieValue();
}

type SessionContextValue = {
  user: SessionUser | null;
  ready: boolean;
  signIn: (email: string, password: string) => { ok: boolean; error?: string };
  signUp: (input: {
    name: string;
    email: string;
    password: string;
  }) => { ok: boolean; error?: string };
  signOut: () => void;
  updateRole: (role: Role) => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const cookieValue = useSyncExternalStore(
    subscribeSession,
    readValue,
    () => "",
  );
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  const user = useMemo(() => decodeSession(cookieValue), [cookieValue]);

  const signIn = useCallback((email: string, password: string) => {
    const account = findAccount(email) ?? findLocalAccount(email);

    if (!account) {
      return {
        ok: false,
        error:
          "Aucun compte ne correspond à cette adresse. Créez un compte ou utilisez un compte de démonstration.",
      };
    }

    if (account.password !== password) {
      return { ok: false, error: "Mot de passe incorrect." };
    }

    writeSessionCookie({
      email: account.email,
      name: account.name,
      role: account.role,
    });
    emitSessionChange();
    return { ok: true };
  }, []);

  const signUp = useCallback(
    (input: { name: string; email: string; password: string }) => {
      if (findAccount(input.email) ?? findLocalAccount(input.email)) {
        return {
          ok: false,
          error: "Cette adresse est déjà utilisée. Connectez-vous.",
        };
      }

      if (input.password.length < 6) {
        return {
          ok: false,
          error: "Le mot de passe doit contenir au moins 6 caractères.",
        };
      }

      const account: DemoAccount = {
        email: input.email.trim().toLowerCase(),
        name: input.name.trim(),
        role: "USER",
        password: input.password,
        joinedAt: new Date().toISOString().slice(0, 10),
        bio: "",
      };

      saveLocalAccount(account);
      writeSessionCookie({
        email: account.email,
        name: account.name,
        role: account.role,
      });
      emitSessionChange();
      return { ok: true };
    },
    [],
  );

  const signOut = useCallback(() => {
    clearSessionCookie();
    emitSessionChange();
  }, []);

  const updateRole = useCallback((role: Role) => {
    const current = decodeSession(readSessionCookieValue());
    if (!current) return;
    writeSessionCookie({ ...current, role });
    emitSessionChange();
  }, []);

  const value = useMemo(
    () => ({ user, ready: hydrated, signIn, signUp, signOut, updateRole }),
    [user, hydrated, signIn, signUp, signOut, updateRole],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used inside SessionProvider");
  }

  return context;
}
