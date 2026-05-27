import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MobileShell } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { aiOutfits } from "@/lib/ai.functions";
import { Sparkles, Loader2, Wand2, Shirt, Heart, ShoppingBag } from "lucide-react";
import { useFavorites } from "@/lib/favorites";

export const Route = createFileRoute("/ai")({ component: AIPage });

const VIBES = [
  { id: "casual", label: "Casual del día", emoji: "👕" },
  { id: "concierto", label: "Outfit para concierto", emoji: "🎤" },
  { id: "vintage", label: "Vintage vibes", emoji: "🕰️" },
  { id: "minimal", label: "Minimal clean fit", emoji: "🤍" },
  { id: "streetwear", label: "Streetwear combo", emoji: "🧢" },
  { id: "elegante", label: "Elegante de noche", emoji: "🖤" },
];

type OutfitItem = { type: string; name: string; brand: string; price: number; color: string; why: string };
type Outfit = { title: string; description: string; items: OutfitItem[]; totalPrice: number; tags: string[] };

function AIPage() {
  const gen = useServerFn(aiOutfits);
  const [loading, setLoading] = useState(false);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [activeVibe, setActiveVibe] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toggle, has } = useFavorites();

  const handleGenerate = async (vibe: string, label: string) => {
    setLoading(true); setError(null); setActiveVibe(vibe);
    try {
      const r = await gen({ data: { vibe: label, styles: ["minimalista", "vintage"], sizes: { top: "M", bottom: "M", shoes: "40" } } });
      setOutfits(r.outfits ?? []);
    } catch (e: any) {
      setError(e?.message ?? "No se pudo generar el look");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileShell>
      <div className="flex min-h-[100dvh] flex-col bg-background">
        <header className="px-5 pt-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
            <Sparkles className="h-3 w-3" /> LOOK IA
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-ink">Tu guía LOOK IA</h1>
          <p className="mt-1 text-sm text-muted-foreground">Outfits generados al instante con piezas reales de segunda mano.</p>
        </header>

        <section className="mt-6 px-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Elige tu vibe</p>
          <div className="grid grid-cols-2 gap-2.5">
            {VIBES.map((v) => (
              <button
                key={v.id}
                disabled={loading}
                onClick={() => handleGenerate(v.id, v.label)}
                className={`flex items-center gap-2 rounded-2xl border p-3 text-left text-sm font-semibold transition active:scale-[0.98] disabled:opacity-50 ${
                  activeVibe === v.id ? "border-brand bg-brand-soft text-ink" : "border-border bg-card text-ink hover:border-brand/50"
                }`}
              >
                <span className="text-xl">{v.emoji}</span>
                <span className="leading-tight">{v.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-7 flex-1 px-5 pb-6">
          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-3xl bg-muted py-12">
              <div className="grid h-14 w-14 place-items-center rounded-2xl brand-gradient text-white">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
              <p className="text-sm font-semibold text-ink">Creando tu selección…</p>
              <p className="text-xs text-muted-foreground">La IA está combinando piezas para ti</p>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>
          )}

          {!loading && outfits.length === 0 && !error && (
            <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl brand-gradient text-white">
                <Wand2 className="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm font-semibold text-ink">Selecciona un vibe</p>
              <p className="text-xs text-muted-foreground">La IA te montará 4 outfits completos.</p>
            </div>
          )}

          <div className="space-y-4">
            {!loading && outfits.map((o, i) => (
              <article key={i} className="overflow-hidden rounded-3xl border border-border bg-card">
                <header className="ink-gradient p-4 text-white">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      <Sparkles className="h-3 w-3" /> Look {i + 1}
                    </span>
                    <span className="text-sm font-extrabold">{o.totalPrice}€ total</span>
                  </div>
                  <h3 className="mt-2 text-lg font-extrabold leading-tight">{o.title}</h3>
                  <p className="mt-1 text-xs text-white/70">{o.description}</p>
                  {o.tags?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {o.tags.map((t) => (
                        <span key={t} className="rounded-full bg-brand/30 px-2 py-0.5 text-[10px] font-semibold">#{t}</span>
                      ))}
                    </div>
                  )}
                </header>
                <ul className="divide-y divide-border">
                  {o.items.map((it, j) => {
                    const id = `ai-${i}-${j}`;
                    const liked = has(id);
                    return (
                      <li key={j} className="flex items-start gap-3 p-3">
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-soft text-ink">
                          <Shirt className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="truncate text-sm font-bold text-ink">{it.name}</p>
                            <p className="shrink-0 text-sm font-extrabold text-ink">{it.price}€</p>
                          </div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{it.brand} · {it.color} · {it.type}</p>
                          <p className="mt-1 text-xs italic text-muted-foreground">"{it.why}"</p>
                        </div>
                        <button onClick={() => toggle(id)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted">
                          <Heart className={`h-4 w-4 ${liked ? "fill-brand text-brand" : "text-ink"}`} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <div className="flex gap-2 p-3">
                  <Link to="/search" className="flex-1 rounded-full bg-muted py-2.5 text-center text-xs font-bold text-ink">Ver similares</Link>
                  <button className="flex-1 rounded-full bg-ink py-2.5 text-center text-xs font-bold text-white inline-flex items-center justify-center gap-1.5">
                    <ShoppingBag className="h-3.5 w-3.5" /> Comprar look
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <BottomNav />
      </div>
    </MobileShell>
  );
}
