import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { chats } from "@/lib/mock-data";
import { Search } from "lucide-react";

export const Route = createFileRoute("/chat/")({ component: ChatList });

function ChatList() {
  return (
    <MobileShell>
      <div className="flex min-h-[100dvh] flex-col bg-background">
        <header className="px-5 pb-3 pt-6">
          <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-ink">Mensajes</h1>
          <div className="mt-3 flex items-center gap-2 rounded-full bg-muted px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input placeholder="Buscar conversación" className="w-full bg-transparent text-sm outline-none" />
          </div>
        </header>

        <main className="flex-1 px-2 py-2">
          {chats.map(c => (
            <Link key={c.id} to="/chat/$id" params={{ id: c.id }} className="flex items-center gap-3 rounded-2xl px-3 py-3 transition active:bg-muted">
              <div className="relative">
                <img src={c.avatar} className="h-12 w-12 rounded-full object-cover" alt="" />
                {c.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-brand ring-2 ring-background" />}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between">
                  <p className="text-sm font-bold text-ink">@{c.name}</p>
                  <span className="text-[10px] text-muted-foreground">{c.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="truncate text-xs text-muted-foreground">{c.last}</p>
                  {c.unread > 0 && <span className="ml-2 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1.5 text-[10px] font-bold text-ink">{c.unread}</span>}
                </div>
              </div>
            </Link>
          ))}
        </main>

        <BottomNav />
      </div>
    </MobileShell>
  );
}
