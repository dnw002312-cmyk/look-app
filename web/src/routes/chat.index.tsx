import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { BottomNav } from "@/components/BottomNav";
import { Search, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/chat/")({ component: ChatList });

type SellerInfo = { name: string; avatar: string; online: boolean };

type StoredConv = {
  id: string;
  seller: SellerInfo;
  productId: string;
  lastText: string;
  lastTime: string;
  ts: number;
  unread: number;
};

const FALLBACK_CONVS: StoredConv[] = [
  { id: "lucia.vtg", seller: { name: "lucia.vtg", avatar: "https://i.pravatar.cc/100?img=47", online: true }, productId: "4", lastText: "¿Sigue disponible la chaqueta?", lastTime: "2m", ts: Date.now() - 120000, unread: 2 },
  { id: "marco_st", seller: { name: "marco_st", avatar: "https://i.pravatar.cc/100?img=12", online: false }, productId: "6", lastText: "Te mando foto del estado real", lastTime: "1h", ts: Date.now() - 3600000, unread: 0 },
  { id: "kicks.lab", seller: { name: "kicks.lab", avatar: "https://i.pravatar.cc/100?img=33", online: true }, productId: "11", lastText: "Perfecto, envío mañana 📦", lastTime: "Ayer", ts: Date.now() - 86400000, unread: 0 },
];

function loadConversations(): StoredConv[] {
  if (typeof window === "undefined") return FALLBACK_CONVS;
  try {
    const raw = localStorage.getItem("look_conversations");
    if (!raw) return FALLBACK_CONVS;
    const map = JSON.parse(raw) as Record<string, StoredConv>;
    const list = Object.values(map);
    if (list.length === 0) return FALLBACK_CONVS;
    return list.sort((a, b) => b.ts - a.ts);
  } catch {
    return FALLBACK_CONVS;
  }
}

function ChatList() {
  const [convs, setConvs] = useState<StoredConv[]>(FALLBACK_CONVS);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setConvs(loadConversations());
    const onFocus = () => setConvs(loadConversations());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const filtered = convs.filter((c) =>
    !query ? true : (c.seller.name + " " + c.lastText).toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <AppShell>
      <div className="flex min-h-[100dvh] flex-col bg-background">
        <header className="px-5 pb-3 pt-6 md:px-8 md:pt-8">
          <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-ink md:text-3xl">Mensajes</h1>
          <div className="mt-3 flex items-center gap-2 rounded-full bg-muted px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar conversación"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </header>

        <main className="flex-1 px-2 py-2 md:px-6">
          <div className="mx-auto w-full max-w-3xl">
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
                <MessageCircle className="h-10 w-10 opacity-40" />
                <p className="text-sm">No hay conversaciones todavía</p>
                <p className="text-xs">Escribile a un vendedor desde un producto</p>
              </div>
            )}

            {filtered.map((c) => (
              <Link
                key={c.id}
                to="/chat/$id"
                params={{ id: c.id }}
                className="flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-muted"
              >
                <div className="relative">
                  <img src={c.seller.avatar} className="h-12 w-12 rounded-full object-cover" alt="" />
                  {c.seller.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-brand ring-2 ring-background" />}
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-bold text-ink">@{c.seller.name}</p>
                    <span className="shrink-0 text-[10px] text-muted-foreground">{c.lastTime}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs text-muted-foreground">{c.lastText}</p>
                    {c.unread > 0 && (
                      <span className="ml-2 grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-brand px-1.5 text-[10px] font-bold text-ink">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>

        <BottomNav />
      </div>
    </AppShell>
  );
}
