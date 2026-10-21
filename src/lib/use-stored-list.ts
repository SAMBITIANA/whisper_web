"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useStoredList<T>(key: string, fallback: T[]) {
  const [items, setItems] = useState<T[]>(fallback);
  const fallbackRef = useRef(fallback);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      setItems(raw ? (JSON.parse(raw) as T[]) : fallbackRef.current);
    } catch {
      setItems(fallbackRef.current);
    }
  }, [key]);

  const update = useCallback(
    (next: T[] | ((current: T[]) => T[])) => {
      setItems((current) => {
        const value =
          typeof next === "function"
            ? (next as (current: T[]) => T[])(current)
            : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(value));
        } catch {
          return value;
        }
        return value;
      });
    },
    [key],
  );

  return { items, update };
}
