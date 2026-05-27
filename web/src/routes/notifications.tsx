import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { ChevronLeft, Heart, UserPlus, MessageCircle, Package, Tag } from "lucide-react";

export const Route = createFileRoute("/notifications")({ component: Notifications });

const NOTIFS = [
  { id: "1", icon: Heart, color: "text-rose-500 bg-rose-50", title: "A lucia.vtg le encantó tu publicación", sub: "Chaqueta vintage oversize", time: "Hace 5 min" },
  { id: "2", icon: MessageCircle, color: "text-brand bg-brand-soft", title: "Nuevo mensaje de @marco_st", sub: "Te mando foto del estado real", time: "Hace 1 h" },
  { id: "3", icon: Package, color: "text-blue-600 bg-blue-50", title: "Tu pedido va en camino", sub: "Llegada estimada: martes 28", time: "Hace 3 h" },
  { id: "4", icon: UserPlus, color: "text-ink bg-muted", title: "@anabel.co empezó a seguirte", sub: "Tienes 1 nueva seguidora", time: "Ayer" },
  { id: "5", icon: Tag, color: "text-emerald-600 bg-emerald-50", title: "¡Has vendido una prenda!", sub: "Blazer estructurado · 32€", time: "Ayer" },
  { id: "6", icon: Heart, color: "text-rose-500 bg-rose-50", title: "12 personas guardaron tu prenda", sub: "Hoodie oversize verde", time: "Hace 2 días" },
];

function Notifications() {
  const nav = useNavigate();
  return (
    <MobileShell>
      <div className="flex min-h-[100dvh] flex-col bg-background">
        <header className="flex items-center gap-3 px-5 pb-2 pt-6">
          <button onClick={() => nav({ to: "/home" })} className="grid h-10 w-10 place-items-center rounded-full bg-muted">
            <ChevronLeft className="h-5 w-5 text-ink" />
          </button>
          <h1 className="text-xl font-extrabold tracking-[-0.02em] text-ink">Notificaciones</h1>
        </header>

        <main className="space-y-2 px-3 py-4">
          {NOTIFS.map((n) => (
            <Link key={n.id} to="/home" className="flex items-start gap-3 rounded-2xl bg-card p-3 transition active:scale-[0.99]">
              <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${n.color}`}>
                <n.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{n.title}</p>
                <p className="truncate text-xs text-muted-foreground">{n.sub}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground/70">{n.time}</p>
              </div>
            </Link>
          ))}
        </main>
      </div>
    </MobileShell>
  );
}
