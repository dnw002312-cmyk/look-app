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

const IMG_POOLS: Record<string, string[]> = {
  Mujer: [
    "photo-1539008835657-9e8e9680c956", "photo-1582142306909-195724d33ffc",
    "photo-1564257577-2d3eea2b8d6e", "photo-1542272604-787c3835535d",
    "photo-1515886657613-9f3515b0c78f", "photo-1485518882345-15568b007407",
    "photo-1496747611176-843222e1e57c", "photo-1509631179647-0177331693ae",
    "photo-1551803091-e20673f15770", "photo-1469334031218-e382a71b716b",
  ],
  Hombre: [
    "photo-1602810318383-e386cc2a3ccf", "photo-1473966968600-fa801b869a1a",
    "photo-1586790170083-2f9ceadc732d", "photo-1556821840-3a63f95609a7",
    "photo-1593030761757-71fae45fa0e7", "photo-1490578474895-699cd4e2cf59",
    "photo-1617137968427-85924c800a22", "photo-1542060748-10c28b62716f",
  ],
  Vintage: [
    "photo-1551028719-00167b16eac5", "photo-1544022613-e87ca75a784a",
    "photo-1562157873-818bc0726f68", "photo-1503342217505-b0a15ec3261c",
    "photo-1551488831-00ddcb6c6bd3", "photo-1520975954732-35dd22299614",
  ],
  Streetwear: [
    "photo-1503342217505-b0a15ec3261c", "photo-1620799140188-3b2a02fd9a77",
    "photo-1517438476312-10d79c077509", "photo-1521572163474-6864f9cf17ab",
    "photo-1576566588028-4147f3842f27", "photo-1614975058942-90a37f5b2f7b",
  ],
  Formal: [
    "photo-1591047139829-d91aecb6caea", "photo-1594938298603-c8148c4dae35",
    "photo-1507679799987-c73779587ccf", "photo-1593030103066-0093718efeb9",
  ],
  Accesorios: [
    "photo-1584917865442-de89df76afd3", "photo-1624222247344-550fb60583dc",
    "photo-1572635196237-14b3f281503f", "photo-1601924994987-69e26d50dc26",
    "photo-1590874103328-eac38a683ce7", "photo-1553062407-98eeb64c6a62",
  ],
  Zapatos: [
    "photo-1542291026-7eec264c27ff", "photo-1605812860427-4024433a70fd",
    "photo-1603487742131-4160ec999306", "photo-1595950653106-6c9ebd614d3a",
    "photo-1543508282-6319a3e2621f", "photo-1460353581641-37baddab0fa2",
  ],
};

  function pickImage(p: ApiProduct): string {
    const title = p.name.toLowerCase();
    if (title.includes("vestido")) return `https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&q=80&auto=format&fit=crop`;
    if (title.includes("pantalón") || title.includes("jeans") || title.includes("pantalon") || title.includes("chino")) return `https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80&auto=format&fit=crop`;
    if (title.includes("falda")) return `https://images.unsplash.com/photo-1582142306909-195724d33ffc?w=600&q=80&auto=format&fit=crop`;
    if (title.includes("camisa") || title.includes("blusa")) return `https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80&auto=format&fit=crop`;
    if (title.includes("chaqueta") || title.includes("abrigo")) return `https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80&auto=format&fit=crop`;
    if (title.includes("bolso") || title.includes("cartera")) return `https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80&auto=format&fit=crop`;
    if (title.includes("zapato") || title.includes("zapatilla") || title.includes("sneaker")) return `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80&auto=format&fit=crop`;
    if (title.includes("sudadera") || title.includes("hoodie")) return `https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80&auto=format&fit=crop`;

    const cat = p.category || "Mujer";
    const pool = IMG_POOLS[cat] || IMG_POOLS.Mujer;
    const numId = typeof p.id === 'string' ? p.id.charCodeAt(0) : p.id;
    const idx = (numId || 0) % pool.length;
    return `https://images.unsplash.com/${pool[idx]}?w=600&q=80&auto=format&fit=crop`;
  }

function apiProductToProduct(p: ApiProduct): Product {
  return {
    id: String(p.id),
    title: p.name,
      brand: p.brand,
      price: p.price,
      size: p.size,
    color: p.color,
    condition: p.condition,
    category: p.category,
    image: pickImage(p),
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
