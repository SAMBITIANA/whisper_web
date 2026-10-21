import type { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return children;
}

export function useTheme() {
  return {
    resolvedTheme: "light",
    setTheme: () => {},
  };
}
