"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useI18n } from "@/i18n/provider";
import {
  errorMessage,
  fetchSession,
  login,
  logout,
  signup,
  type ApiUser,
} from "@/lib/api";
import type { SessionUser } from "@/lib/session";

type AuthResult = { ok: boolean; error?: string };

type SessionContextValue = {
  user: SessionUser | null;
  account: ApiUser | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (input: {
    name: string;
    email: string;
    password: string;
  }) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

function toSessionUser(account: ApiUser): SessionUser {
  return {
    email: account.email,
    name: account.name,
    role: account.role,
  };
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const [account, setAccount] = useState<ApiUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    void fetchSession().then((user) => {
      if (!active) return;
      setAccount(user);
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const user = await login(email, password);
      setAccount(user);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: errorMessage(error, t("auth.signinError")),
      };
    }
  }, [t]);

  const signUp = useCallback(
    async (input: { name: string; email: string; password: string }) => {
      try {
        const user = await signup(input);
        setAccount(user);
        return { ok: true };
      } catch (error) {
        return {
          ok: false,
          error: errorMessage(error, t("auth.signupError")),
        };
      }
    },
    [t],
  );

  const signOut = useCallback(async () => {
    try {
      await logout();
    } finally {
      setAccount(null);
    }
  }, []);

  const user = useMemo(
    () => (account ? toSessionUser(account) : null),
    [account],
  );

  const value = useMemo(
    () => ({ user, account, ready, signIn, signUp, signOut }),
    [user, account, ready, signIn, signUp, signOut],
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

export function useOptionalSession(): SessionContextValue | null {
  return useContext(SessionContext);
}
