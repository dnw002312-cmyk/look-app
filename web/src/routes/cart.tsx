import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
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
    <AppShell>
      <div className="flex min-h-[100dvh] flex-col bg-background pb-32 md:pb-8">
        <header className="flex items-center gap-3 border-b border-border px-5 pb-3 pt-6 md:px-8 md:pt-8">
          <div className="mx-auto flex w-full max-w-6xl items-center gap-3">
            <button onClick={() => nav({ to: "/home" })} className="grid h-10 w-10 place-items-center rounded-full bg-muted hover:bg-muted/70">
              <ChevronLeft className="h-5 w-5 text-ink" />
            </button>
            <h1 className="text-xl font-extrabold tracking-[-0.02em] text-ink md:text-2xl">Carrito</h1>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-5 pt-4 md:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {items.map((it, idx) => (
                <div key={it.id} className="flex gap-3 rounded-3xl border border-border bg-card p-3">
                  <img src={it.image} className="h-24 w-24 rounded-2xl object-cover" alt={it.title} />
                  <div className="flex flex-1 flex-col">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{it.brand}</p>
                    <p className="text-sm font-bold text-ink">{it.title}</p>
                    <p className="text-xs text-muted-foreground">Talla {it.size} · {it.color}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <p className="text-base font-extrabold text-ink">₡{(it.price * it.qty).toLocaleString()}</p>
                      <button onClick={() => setItems(items.filter((_, x) => x !== idx))} className="text-muted-foreground hover:text-destructive">
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
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              {/* Summary */}
              <div className="rounded-3xl bg-muted p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resumen</p>
                <Row label="Subtotal" value={`₡${subtotal.toLocaleString()}`} />
                <Row label="Envío" value={`₡${shipping.toLocaleString()}`} />
                <div className="my-3 h-px bg-border" />
                <Row label="Total" value={`₡${total.toLocaleString()}`} bold />
              </div>
              {/* Desktop checkout button */}
              <button className="hidden w-full rounded-full bg-ink py-4 text-base font-semibold text-white shadow-lg shadow-ink/30 hover:bg-ink/90 lg:block">
                Finalizar compra · ₡{total.toLocaleString()}
              </button>
            </aside>
          </div>
        </main>

        {/* Sticky checkout (mobile) */}
        <div className="sticky bottom-0 z-10 mt-auto border-t border-border bg-background/95 p-4 backdrop-blur-xl lg:hidden">
          <button className="w-full rounded-full bg-ink py-4 text-base font-semibold text-white shadow-lg shadow-ink/30">
            Finalizar compra · ₡{total.toLocaleString()}
          </button>
        </div>
      </div>
    </AppShell>
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
