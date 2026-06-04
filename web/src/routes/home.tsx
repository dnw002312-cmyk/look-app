import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { BottomNav } from "@/components/BottomNav";
import { ProductCard } from "@/components/ProductCard";
import { categories } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { Bell, Search, Sparkles } from "lucide-react";

export const Route = createFileRoute("/home")({ component: Home });

function Home() {
  const { profile, allProducts } = useStore();
  return (
    <AppShell>
      <div className="flex min-h-[100dvh] flex-col bg-background">
        <header className="sticky top-0 z-30 border-b border-border bg-background/90 px-5 pb-3 pt-5 backdrop-blur-xl md:px-8 md:pt-6">
          <div className="mx-auto flex max-w-6xl items-center gap-3">
            <Link to="/profile">
              <img src={profile.avatar} alt="" className="h-11 w-11 rounded-full border-2 border-brand object-cover" />
            </Link>
            <Link to="/notifications" className="relative ml-auto grid h-11 w-11 place-items-center rounded-full bg-muted">
              <Bell className="h-5 w-5 text-ink" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brand ring-2 ring-background" />
            </Link>
          </div>
          <div className="mx-auto mt-4 max-w-6xl">
            <Link to="/search" className="flex items-center gap-3 rounded-full bg-muted px-4 py-3 text-sm text-muted-foreground transition hover:bg-muted/70">
              <Search className="h-4 w-4" />
              <span>Buscar marca, talla, estilo...</span>
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl space-y-7 px-5 pb-4 pt-4 md:px-8 md:pt-6">
          <section>
            <div className="no-scrollbar flex gap-3 overflow-x-auto md:gap-4">
              {categories.map((c) => (
                <Link key={c.id} to="/search" search={{ cat: c.id }} className="flex shrink-0 flex-col items-center gap-1.5">
                  <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-soft text-2xl shadow-sm transition hover:scale-105 active:scale-95">
                    {c.emoji}
                  </span>
                  <span className="text-[11px] font-semibold text-ink">{c.label}</span>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <div className="relative overflow-hidden rounded-3xl ink-gradient p-5 text-white md:p-7">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/30 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-brand/20 blur-3xl" />
              <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">
                    <Sparkles className="h-3 w-3" /> IA Stylist
                  </span>
                  <h3 className="mt-3 text-xl font-extrabold leading-tight md:text-2xl">Tu drop semanal está listo</h3>
                  <p className="mt-1 text-sm text-white/70 md:text-base">12 piezas curadas para tu estilo.</p>
                </div>
                <Link to="/ai" className="self-start rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink shadow-lg shadow-brand/30 transition active:scale-[0.98] md:self-auto">
                  Ver selección
                </Link>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-end justify-between">
              <div>
                <h2 className="text-lg font-extrabold tracking-[-0.02em] text-ink md:text-xl">Recomendado para ti</h2>
                <p className="text-xs text-muted-foreground">Basado en tu estilo</p>
              </div>
              <Link to="/search" className="text-xs font-semibold text-brand">Ver todo</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-4">
              {allProducts.slice(0, 12).map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        </main>

        <BottomNav />
      </div>
    </AppShell>
  );
}
