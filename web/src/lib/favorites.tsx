import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "./api";

type Ctx = {
  favorites: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
};

const FavoritesContext = createContext<Ctx | null>(null);
const KEY = "look:favorites";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.favorites.list();
        setFavorites(data.map(String));
      } catch {
        try {
          const raw = localStorage.getItem(KEY);
          if (raw) setFavorites(JSON.parse(raw));
        } catch {}
      }
    })();
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(favorites)); } catch {}
  }, [favorites]);

  const toggle = useCallback(async (id: string) => {
    try {
      const data = await api.favorites.toggle(parseInt(id));
      setFavorites(data.map(String));
    } catch {
      setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
    }
  }, []);

  const has = useCallback((id: string) => favorites.includes(id), [favorites]);

  return <FavoritesContext.Provider value={{ favorites, toggle, has }}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) return { favorites: [] as string[], toggle: () => {}, has: () => false };
  return ctx;
}
