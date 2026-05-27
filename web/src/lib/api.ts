const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function getToken(): string | null {
  return localStorage.getItem("look_token");
}

function setToken(token: string) {
  localStorage.setItem("look_token", token);
}

function clearToken() {
  localStorage.removeItem("look_token");
  localStorage.removeItem("look_user");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers["Authorization"] = token;
  }
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Error de red" }));
    throw new Error(err.error || "Error de red");
  }
  return res.json();
}

export type ApiUser = {
  id: number;
  name: string;
  email: string;
  photo: string;
  description: string;
  rating: number;
  sales_count: number;
  followers: number;
  following: number;
  avg_response_time: string;
  join_date: string;
};

export type ApiProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  icon: string;
  seller_id: number;
  size: string;
  color: string;
  brand: string;
  condition: string;
  gender: string;
  style: string;
  location: string;
  description: string;
  date_posted: string;
  likes: number;
};

export type CartItem = {
  id: number;
  name: string;
  icon: string;
  effectivePrice: number;
};

export const api = {
  auth: {
    login: async (email: string, _password: string) => {
      const data = await request<{ token: string; user: ApiUser }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setToken(data.token);
      localStorage.setItem("look_user", JSON.stringify(data.user));
      return data;
    },
    register: async (name: string, email: string, password: string) => {
      const data = await request<{ token: string; user: ApiUser }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      setToken(data.token);
      localStorage.setItem("look_user", JSON.stringify(data.user));
      return data;
    },
    logout: () => {
      clearToken();
    },
    getUser: (): ApiUser | null => {
      const raw = localStorage.getItem("look_user");
      return raw ? JSON.parse(raw) : null;
    },
  },

  products: {
    list: (params?: {
      category?: string;
      query?: string;
      size?: string;
      color?: string;
      brand?: string;
      condition?: string;
      minPrice?: number;
      maxPrice?: number;
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.set("category", params.category);
      if (params?.query) searchParams.set("query", params.query);
      if (params?.size) searchParams.set("size", params.size);
      if (params?.color) searchParams.set("color", params.color);
      if (params?.brand) searchParams.set("brand", params.brand);
      if (params?.condition) searchParams.set("condition", params.condition);
      if (params?.minPrice) searchParams.set("minPrice", String(params.minPrice));
      if (params?.maxPrice) searchParams.set("maxPrice", String(params.maxPrice));
      const qs = searchParams.toString();
      return request<ApiProduct[]>(`/api/products${qs ? `?${qs}` : ""}`);
    },
    get: (id: number) => request<ApiProduct>(`/api/products/${id}`),
    create: (product: {
      name: string;
      price: number;
      description: string;
      category: string;
      size: string;
      color: string;
      brand: string;
      condition: string;
      icon?: string;
    }) =>
      request<ApiProduct>("/api/products", {
        method: "POST",
        body: JSON.stringify(product),
      }),
  },

  users: {
    get: (id: number) => request<ApiUser>(`/api/users/${id}`),
    updateProfile: (data: {
      name?: string;
      email?: string;
      description?: string;
      photo?: string;
      newPassword?: string;
    }) =>
      request<ApiUser>("/api/users/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  cart: {
    list: () => request<CartItem[]>("/api/cart"),
    add: (productId: number) =>
      request<CartItem[]>("/api/cart", {
        method: "POST",
        body: JSON.stringify({ productId }),
      }),
    remove: (productId: number) =>
      request<CartItem[]>(`/api/cart/${productId}`, { method: "DELETE" }),
    checkout: () => request<{ ok: boolean }>("/api/cart/checkout", { method: "POST" }),
  },

  favorites: {
    list: () => request<number[]>("/api/favorites"),
    toggle: (productId: number) =>
      request<number[]>("/api/favorites/toggle", {
        method: "POST",
        body: JSON.stringify({ productId }),
      }),
  },

  follows: {
    list: () => request<number[]>("/api/follows"),
    toggle: (sellerId: number) =>
      request<number[]>("/api/follows/toggle", {
        method: "POST",
        body: JSON.stringify({ sellerId }),
      }),
  },

  messages: {
    list: () =>
      request<Record<string, { from: number; text: string; time: string }[]>>("/api/messages"),
    get: (convId: string) =>
      request<{ from: number; text: string; time: string }[]>(`/api/messages/${convId}`),
    send: (convId: string, text: string) =>
      request<{ from: number; text: string; time: string }[]>(`/api/messages/${convId}`, {
        method: "POST",
        body: JSON.stringify({ text }),
      }),
  },
};
