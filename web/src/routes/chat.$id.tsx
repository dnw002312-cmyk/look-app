import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MobileShell } from "@/components/MobileShell";
import { chats, products } from "@/lib/mock-data";
import { aiSellerReply } from "@/lib/ai.functions";
import { ChevronLeft, Image as ImageIcon, Send, Phone, Sparkles } from "lucide-react";

export const Route = createFileRoute("/chat/$id")({ component: ChatRoom });

type Msg = { from: "me" | "them"; text?: string; image?: string; time: string };

const PRODUCT_BY_CHAT: Record<string, string> = { "1": "1", "2": "2", "3": "4" };

function ChatRoom() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const chat = chats.find((c) => c.id === id) ?? chats[0];
  const productId = PRODUCT_BY_CHAT[id] ?? "1";
  const product = products.find((p) => p.id === productId)!;
  const reply = useServerFn(aiSellerReply);

  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { from: "them", text: `¡Hola! Vi que te interesó "${product.title}" 👀`, time: "10:21" },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = async () => {
    if (!text.trim() || sending) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    const userMsg: Msg = { from: "me", text: text.trim(), time };
    const history = [...messages, userMsg];
    setMessages(history);
    setText("");
    setSending(true);
    try {
      const r = await reply({
        data: {
          sellerName: chat.name,
          productTitle: product.title,
          history: history.map((m) => ({ from: m.from, text: m.text ?? "" })).filter((m) => m.text),
        },
      });
      const t = new Date();
      setMessages((prev) => [...prev, { from: "them", text: r.reply, time: `${t.getHours()}:${String(t.getMinutes()).padStart(2, "0")}` }]);
    } catch (e: any) {
      setMessages((prev) => [...prev, { from: "them", text: "(error: no pude responder ahora mismo)", time }]);
    } finally {
      setSending(false);
      requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }));
    }
  };

  return (
    <MobileShell>
      <div className="flex min-h-[100dvh] flex-col bg-background">
        <header className="flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-xl">
          <button onClick={() => nav({ to: "/chat" })} className="grid h-9 w-9 place-items-center rounded-full bg-muted">
            <ChevronLeft className="h-4 w-4 text-ink" />
          </button>
          <div className="relative">
            <img src={chat.avatar} className="h-10 w-10 rounded-full object-cover" alt="" />
            {chat.online && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-background" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-ink">@{chat.name}</p>
            <p className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand">
              <Sparkles className="h-2.5 w-2.5" /> Respuestas con IA
            </p>
          </div>
          <button className="grid h-9 w-9 place-items-center rounded-full bg-muted">
            <Phone className="h-4 w-4 text-ink" />
          </button>
        </header>

        {/* Product preview */}
        <div className="mx-4 mt-3 flex items-center gap-3 rounded-2xl border border-border bg-card p-2">
          <img src={product.image} className="h-12 w-12 rounded-xl object-cover" alt="" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-ink">{product.title}</p>
            <p className="text-[10px] text-muted-foreground">Talla {product.size} · {product.price}€</p>
          </div>
          <button className="rounded-full bg-ink px-3 py-1.5 text-[10px] font-bold text-white">Comprar</button>
        </div>

        <main ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-5">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] ${m.from === "me" ? "rounded-3xl rounded-br-md bg-ink text-white" : "rounded-3xl rounded-bl-md bg-muted text-ink"} ${m.image ? "overflow-hidden p-1" : "px-4 py-2.5"}`}>
                {m.image ? <img src={m.image} className="h-44 w-44 rounded-2xl object-cover" alt="" />
                  : <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>}
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
        </main>

        <footer className="flex items-center gap-2 border-t border-border bg-background/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
          <button className="grid h-11 w-11 place-items-center rounded-full bg-muted">
            <ImageIcon className="h-4 w-4 text-ink" />
          </button>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            disabled={sending}
            placeholder="Escribe un mensaje"
            className="flex-1 rounded-full bg-muted px-4 py-3 text-sm outline-none disabled:opacity-60"
          />
          <button onClick={send} disabled={sending || !text.trim()} className="grid h-11 w-11 place-items-center rounded-full bg-brand text-ink disabled:opacity-50">
            <Send className="h-4 w-4" />
          </button>
        </footer>
      </div>
    </MobileShell>
  );
}
