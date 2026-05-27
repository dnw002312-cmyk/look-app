import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { products } from "@/lib/mock-data";
import { ChevronLeft, MapPin, CreditCard, Plus, Minus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/cart")({ component: Cart });

function Cart() {
  const nav = useNavigate();
  const [items, setItems] = useState(products.slice(0, 2).map(p => ({ ...p, qty: 1 })));
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = items.length ? 4.95 : 0;
  const total = subtotal + shipping;

  return (
    <MobileShell>
      <div className="flex min-h-[100dvh] flex-col bg-background pb-32">
        <header className="flex items-center gap-3 px-5 pb-2 pt-6">
          <button onClick={() => nav({ to: "/home" })} className="grid h-10 w-10 place-items-center rounded-full bg-muted">
            <ChevronLeft className="h-5 w-5 text-ink" />
          </button>
          <h1 className="text-xl font-extrabold tracking-[-0.02em] text-ink">Carrito</h1>
        </header>

        <main className="space-y-4 px-5 pt-4">
          {items.map((it, idx) => (
            <div key={it.id} className="flex gap-3 rounded-3xl border border-border bg-card p-3">
              <img src={it.image} className="h-24 w-24 rounded-2xl object-cover" alt={it.title} />
              <div className="flex flex-1 flex-col">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{it.brand}</p>
                <p className="text-sm font-bold text-ink">{it.title}</p>
                <p className="text-xs text-muted-foreground">Talla {it.size} · {it.color}</p>
                <div className="mt-auto flex items-center justify-between">
                  <p className="text-base font-extrabold text-ink">{(it.price * it.qty).toFixed(2)} €</p>
                  <button onClick={() => setItems(items.filter((_, x) => x !== idx))} className="text-muted-foreground">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Address */}
          <Section icon={<MapPin className="h-4 w-4" />} title="Dirección de envío">
            <p className="text-sm font-semibold text-ink">Sofía Marín</p>
            <p className="text-xs text-muted-foreground">Calle Fuencarral 42, 28004 Madrid</p>
          </Section>

          {/* Payment */}
          <Section icon={<CreditCard className="h-4 w-4" />} title="Método de pago">
            <p className="text-sm font-semibold text-ink">Visa terminada en •• 4821</p>
            <p className="text-xs text-muted-foreground">Vence 09/27</p>
          </Section>

          {/* Summary */}
          <div className="rounded-3xl bg-muted p-4">
            <Row label="Subtotal" value={`${subtotal.toFixed(2)} €`} />
            <Row label="Envío" value={`${shipping.toFixed(2)} €`} />
            <div className="my-3 h-px bg-border" />
            <Row label="Total" value={`${total.toFixed(2)} €`} bold />
          </div>
        </main>

        <div className="fixed bottom-0 left-1/2 w-full max-w-[420px] -translate-x-1/2 border-t border-border bg-background/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-xl">
          <button className="w-full rounded-full bg-ink py-4 text-base font-semibold text-white shadow-lg shadow-ink/30">
            Finalizar compra · {total.toFixed(2)} €
          </button>
        </div>
      </div>
    </MobileShell>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {icon} {title}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className={`text-sm ${bold ? "font-extrabold text-ink" : "text-muted-foreground"}`}>{label}</span>
      <span className={`text-sm ${bold ? "font-extrabold text-ink text-base" : "font-semibold text-ink"}`}>{value}</span>
    </div>
  );
}
