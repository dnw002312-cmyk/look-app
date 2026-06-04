import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { products, type Product } from "@/lib/mock-data";
import { ChevronLeft, Image as ImageIcon, Send, Phone, Sparkles, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/chat/$id")({ component: ChatRoom });

type Msg = { from: "me" | "them"; text: string; time: string; ts: number };

type SellerInfo = { name: string; avatar: string; online: boolean };

const SELLERS: Record<string, SellerInfo> = {
  "lucia.vtg": { name: "lucia.vtg", avatar: "https://i.pravatar.cc/100?img=47", online: true },
  "marco_st": { name: "marco_st", avatar: "https://i.pravatar.cc/100?img=12", online: false },
  "ana": { name: "anabel.co", avatar: "https://i.pravatar.cc/100?img=44", online: true },
  "anabel.co": { name: "anabel.co", avatar: "https://i.pravatar.cc/100?img=44", online: true },
  "kicks.lab": { name: "kicks.lab", avatar: "https://i.pravatar.cc/100?img=33", online: true },
  "estilo.ana": { name: "estilo.ana", avatar: "https://i.pravatar.cc/100?img=20", online: false },
  "vintage.bag": { name: "vintage.bag", avatar: "https://i.pravatar.cc/100?img=49", online: true },
  "julio.mens": { name: "julio.mens", avatar: "https://i.pravatar.cc/100?img=15", online: true },
  "1": { name: "lucia.vtg", avatar: "https://i.pravatar.cc/100?img=47", online: true },
  "2": { name: "marco_st", avatar: "https://i.pravatar.cc/100?img=12", online: false },
  "3": { name: "kicks.lab", avatar: "https://i.pravatar.cc/100?img=33", online: true },
};

const PRODUCT_BY_SELLER: Record<string, string> = {
  "lucia.vtg": "4",
  "marco_st": "6",
  "ana": "1",
  "anabel.co": "1",
  "kicks.lab": "11",
  "estilo.ana": "3",
  "vintage.bag": "16",
  "julio.mens": "7",
  "1": "1",
  "2": "2",
  "3": "4",
};

function storageKey(convId: string) {
  return `look_chat_${convId}`;
}

function timeNow() {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function loadHistory(convId: string): Msg[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(convId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Msg[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveHistory(convId: string, msgs: Msg[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(convId), JSON.stringify(msgs.slice(-200)));
  } catch {}
}

function touchConversation(convId: string, seller: SellerInfo, productId: string, lastText: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("look_conversations");
    const map: Record<string, { id: string; seller: SellerInfo; productId: string; lastText: string; lastTime: string; ts: number; unread: number }> = raw ? JSON.parse(raw) : {};
    const existing = map[convId];
    map[convId] = {
      id: convId,
      seller,
      productId,
      lastText,
      lastTime: timeNow(),
      ts: Date.now(),
      unread: existing?.unread ?? 0,
    };
    localStorage.setItem("look_conversations", JSON.stringify(map));
  } catch {}
}

function ChatRoom() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const seller = SELLERS[id] ?? { name: id, avatar: `https://i.pravatar.cc/100?u=${id}`, online: false };
  const productId = PRODUCT_BY_SELLER[id] ?? "1";
  const product: Product = useMemo(
    () => products.find((p) => p.id === productId) ?? products[0],
    [productId],
  );

  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existing = loadHistory(id);
    if (existing.length === 0) {
      const initial: Msg[] = [
        {
          from: "them",
          text: `¡Hola! 👋 Vi que te interesó "${product.title}". ¿Cómo te puedo ayudar?`,
          time: timeNow(),
          ts: Date.now(),
        },
      ];
      setMessages(initial);
      saveHistory(id, initial);
    } else {
      setMessages(existing);
    }
    setHydrated(true);
    touchConversation(id, seller, productId, existing.at(-1)?.text ?? `¡Hola! 👋 Vi que te interesó "${product.title}".`);
  }, [id]);

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, [messages, sending]);

  const send = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setError(null);
    const now = Date.now();
    const userMsg: Msg = { from: "me", text: trimmed, time: timeNow(), ts: now };
    const history = [...messages, userMsg];
    setMessages(history);
    saveHistory(id, history);
    touchConversation(id, seller, productId, trimmed);
    setText("");
    setSending(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerName: seller.name,
          productTitle: product.title,
          history: history.map((m) => ({ from: m.from, text: m.text })),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Error" }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const data = (await res.json()) as { reply: string };
      const reply: Msg = { from: "them", text: data.reply, time: timeNow(), ts: Date.now() };
      const next = [...history, reply];
      setMessages(next);
      saveHistory(id, next);
      touchConversation(id, seller, productId, data.reply);
    } catch (e: any) {
      setError(e?.message || "No pude responder ahora mismo");
      setMessages((prev) => {
        const fallback: Msg = {
          from: "them",
          text: "Disculpá, tuve un problema de conexión 🫠 ¿me escribís de nuevo?",
          time: timeNow(),
          ts: Date.now(),
        };
        const next = [...prev, fallback];
        saveHistory(id, next);
        return next;
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <AppShell>
      <div className="flex min-h-[100dvh] flex-col bg-background">
        <header className="flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-xl md:px-8">
          <div className="mx-auto flex w-full max-w-4xl items-center gap-3">
            <button onClick={() => nav({ to: "/chat" })} className="grid h-9 w-9 place-items-center rounded-full bg-muted hover:bg-muted/70" aria-label="Volver">
              <ChevronLeft className="h-4 w-4 text-ink" />
            </button>
            <div className="relative">
              <img src={seller.avatar} className="h-10 w-10 rounded-full object-cover" alt="" />
              {seller.online && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-background" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-ink">@{seller.name}</p>
              <p className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand">
                <Sparkles className="h-2.5 w-2.5" /> Respuestas con IA
              </p>
            </div>
            <button className="grid h-9 w-9 place-items-center rounded-full bg-muted" aria-label="Llamar">
              <Phone className="h-4 w-4 text-ink" />
            </button>
          </div>
        </header>

        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="mx-auto mt-3 flex w-[calc(100%-2rem)] max-w-4xl items-center gap-3 rounded-2xl border border-border bg-card p-2 hover:bg-muted md:mx-8 md:w-[calc(100%-4rem)]"
        >
          <img src={product.image} className="h-12 w-12 rounded-xl object-cover" alt="" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-ink">{product.title}</p>
            <p className="text-[10px] text-muted-foreground">Talla {product.size} · ₡{product.price.toLocaleString()}</p>
          </div>
          <span className="rounded-full bg-ink px-3 py-1.5 text-[10px] font-bold text-white">Ver</span>
        </Link>

        <main ref={scrollRef} className="mx-auto w-full max-w-4xl flex-1 space-y-3 overflow-y-auto px-4 py-5 md:px-8">
          {hydrated && messages.length === 0 && (
            <p className="text-center text-xs text-muted-foreground">Iniciá la conversación 👋</p>
          )}

          {messages.map((m, i) => (
            <div key={`${m.ts}-${i}`} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] md:max-w-[60%] ${m.from === "me" ? "rounded-3xl rounded-br-md bg-ink text-white" : "rounded-3xl rounded-bl-md bg-muted text-ink"} px-4 py-2.5`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.text}</p>
                <p className={`mt-1 text-[9px] ${m.from === "me" ? "text-white/50" : "text-muted-foreground"}`}>{m.time}</p>
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex justify-start">
              <div className="rounded-3xl rounded-bl-md bg-muted px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-ink/40" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-ink/40 [animation-delay:0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-ink/40 [animation-delay:0.3s]" />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mx-auto flex w-fit max-w-md items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] text-rose-700">
              <AlertCircle className="h-3 w-3" /> {error}
            </div>
          )}
        </main>

        <footer className="flex items-center gap-2 border-t border-border bg-background/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
          <div className="mx-auto flex w-full max-w-4xl items-center gap-2">
            <button className="grid h-11 w-11 place-items-center rounded-full bg-muted" aria-label="Adjuntar imagen" type="button">
              <ImageIcon className="h-4 w-4 text-ink" />
            </button>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              disabled={sending}
              placeholder="Escribe un mensaje"
              className="flex-1 rounded-full bg-muted px-4 py-3 text-sm outline-none disabled:opacity-60"
            />
            <button
              onClick={send}
              disabled={sending || !text.trim()}
              className="grid h-11 w-11 place-items-center rounded-full bg-brand text-ink disabled:opacity-50"
              aria-label="Enviar"
              type="button"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </footer>
      </div>
    </AppShell>
  );
}
