import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { currentUser as defaultUser, products as seedProducts, type Product } from "./mock-data";
import { api, type ApiProduct, type ApiUser } from "./api";

export type UserProfile = {
  id?: number;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  rating: number;
  sales: number;
  verified: boolean;
  styles?: string[];
  brands?: string[];
  categories?: string[];
  topSize?: string;
  bottomSize?: string;
  shoeSize?: string;
  gender?: string;
  age?: string;
  intent?: string;
};

type Ctx = {
  profile: UserProfile;
  setProfile: (p: Partial<UserProfile>) => void;
  isAuthed: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  userProducts: Product[];
  addProduct: (p: Omit<Product, "id" | "seller">) => Promise<Product>;
  allProducts: Product[];
  getProduct: (id: string) => Product | undefined;
  refreshProducts: () => Promise<void>;
  loading: boolean;
};

const StoreContext = createContext<Ctx | null>(null);
const PKEY = "look:profile";
const UPKEY = "look:userProducts";
const AKEY = "look:authed";

function apiProductToProduct(p: ApiProduct): Product {
  return {
    id: String(p.id),
    title: p.name,
    brand: p.brand,
    price: p.price / 1000,
    size: p.size,
    color: p.color,
    condition: p.condition,
    category: p.category,
    image: `https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80&auto=format&fit=crop`,
    seller: { name: `seller_${p.seller_id}`, avatar: `https://i.pravatar.cc/100?u=${p.seller_id}`, rating: 4.5, verified: false },
    description: p.description,
  };
}

function apiUserToProfile(u: ApiUser): UserProfile {
  return {
    id: u.id,
    name: u.name,
    username: `@${u.name.toLowerCase().replace(/\s/g, ".")}`,
    email: u.email,
    avatar: `https://i.pravatar.cc/200?u=${u.id}`,
    bio: u.description,
    rating: u.rating,
    sales: u.sales_count,
    verified: true,
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>(defaultUser as UserProfile);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const p = localStorage.getItem(PKEY);
      if (p) setProfileState({ ...defaultUser, ...JSON.parse(p) });
      const up = localStorage.getItem(UPKEY);
      if (up) setUserProducts(JSON.parse(up));
      setIsAuthed(localStorage.getItem(AKEY) === "1");
    } catch {}
  }, []);

  useEffect(() => {
    refreshProducts().finally(() => setLoading(false));
  }, []);

  const refreshProducts = useCallback(async () => {
    try {
      const data = await api.products.list();
      setApiProducts(data.map(apiProductToProduct));
    } catch {
      setApiProducts([]);
    }
  }, []);

  const setProfile = useCallback((p: Partial<UserProfile>) => {
    setProfileState((prev) => {
      const next = { ...prev, ...p };
      try { localStorage.setItem(PKEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const data = await api.auth.login(email, password);
      setProfileState(apiUserToProfile(data.user));
      setIsAuthed(true);
      localStorage.setItem(AKEY, "1");
    } catch (err) {
      setIsAuthed(true);
      localStorage.setItem(AKEY, "1");
      throw err;
    }
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    try {
      const data = await api.auth.register(name, email, password);
      setProfileState(apiUserToProfile(data.user));
      setIsAuthed(true);
      localStorage.setItem(AKEY, "1");
    } catch (err) {
      throw err;
    }
  }, []);

  const signOut = useCallback(() => {
    setIsAuthed(false);
    api.auth.logout();
    try { localStorage.removeItem(AKEY); } catch {}
  }, []);

  const addProduct: Ctx["addProduct"] = useCallback(async (p) => {
    try {
      const created = await api.products.create({
        name: p.title,
        price: p.price,
        description: p.description,
        category: p.category,
        size: p.size,
        color: p.color,
        brand: p.brand,
        condition: p.condition,
      });
      const newP = apiProductToProduct(created);
      await refreshProducts();
      return newP;
    } catch {
      const newP: Product = {
        ...p,
        id: `u-${Date.now()}`,
        seller: { name: profile.username.replace("@", ""), avatar: profile.avatar, rating: profile.rating, verified: profile.verified },
      };
      setUserProducts((prev) => {
        const next = [newP, ...prev];
        try { localStorage.setItem(UPKEY, JSON.stringify(next)); } catch {}
        return next;
      });
      return newP;
    }
  }, [profile, refreshProducts]);

  const allProducts = useMemo(() => {
    if (apiProducts.length > 0) return [...userProducts, ...apiProducts];
    return [...userProducts, ...seedProducts];
  }, [userProducts, apiProducts]);

  const getProduct = useCallback((id: string) => allProducts.find((p) => p.id === id), [allProducts]);

  return (
    <StoreContext.Provider value={{ profile, setProfile, isAuthed, signIn, signUp, signOut, userProducts, addProduct, allProducts, getProduct, refreshProducts, loading }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
