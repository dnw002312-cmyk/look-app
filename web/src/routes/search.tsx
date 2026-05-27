import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { ProductCard } from "@/components/ProductCard";
import { categories } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { Search as SearchIcon, SlidersHorizontal, X, Camera, Sparkles, ImageIcon } from "lucide-react";

type SearchParams = { q?: string; cat?: string };

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    q: typeof s.q === "string" ? s.q : "",
    cat: typeof s.cat === "string" ? s.cat : "",
  }),
  component: SearchPage,
});

const filterGroups = [
  { key: "size", label: "Talla", opts: ["XS", "S", "M", "L", "XL", "38", "40", "42"] },
  { key: "color", label: "Color", opts: ["Negro", "Blanco", "Beige", "Verde", "Rosa", "Marino", "Gris", "Camel", "Marrón"] },
  { key: "condition", label: "Estado", opts: ["Nuevo", "Como nuevo", "Bueno", "Aceptable"] },
];

function SearchPage() {
  const { q: initialQ, cat: initialCat } = Route.useSearch();
  const nav = useNavigate({ from: "/search" });
  const { allProducts } = useStore();
  const [q, setQ] = useState(initialQ);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Record<string, string[]>>({});
  const [price, setPrice] = useState(200);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const cat = initialCat;

  const toggle = (g: string, v: string) =>
    setActive(a => {
      const cur = a[g] || [];
      return { ...a, [g]: cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v] };
    });

  const filtered = useMemo(() => {
    const term = q.toLowerCase().trim();
    return allProducts.filter(p => {
      if (cat && p.category !== cat) return false;
      if (term && !(p.title.toLowerCase().includes(term) || p.brand.toLowerCase().includes(term) || p.category.toLowerCase().includes(term))) return false;
      if (p.price > price) return false;
      for (const g of filterGroups) {
        const sel = active[g.key] || [];
        if (sel.length && !sel.includes((p as any)[g.key])) return false;
      }
      return true;
    });
  }, [allProducts, q, cat, price, active]);

  const clearCat = () => nav({ search: (prev: SearchParams) => ({ ...prev, cat: "" }) });
  const setCat = (v: string) => nav({ search: (prev: SearchParams) => ({ ...prev, cat: v }) });

  const onPickPhoto = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  };

  const activeCount = Object.values(active).reduce((n, v) => n + v.length, 0) + (price < 200 ? 1 : 0);

  return (
    <MobileShell>
      <div className="flex min-h-[100dvh] flex-col bg-background">
        <header className="sticky top-0 z-30 bg-background/95 px-5 pb-3 pt-5 backdrop-blur-xl">
          <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-ink">Explorar</h1>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-full bg-muted px-4 py-3">
              <SearchIcon className="h-4 w-4 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Marca, prenda, estilo..." className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
              {q && <button onClick={() => setQ("")}><X className="h-4 w-4 text-muted-foreground" /></button>}
            </div>
            <button onClick={() => fileRef.current?.click()} className="grid h-12 w-12 place-items-center rounded-full bg-brand text-ink" aria-label="Buscar por foto">
              <Camera className="h-4 w-4" />
            </button>
            <button onClick={() => setOpen(true)} className="relative grid h-12 w-12 place-items-center rounded-full bg-ink text-white">
              <SlidersHorizontal className="h-4 w-4" />
              {activeCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-brand text-[10px] font-bold text-ink">{activeCount}</span>}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onPickPhoto(f); e.currentTarget.value = ""; }} />
          </div>

          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
            {cat && (
              <button onClick={clearCat} className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white">
                {cat} <X className="h-3 w-3" />
              </button>
            )}
            {categories.filter(c => c.id !== cat).map(c => (
              <button key={c.id} onClick={() => setCat(c.id)} className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-ink">
                <span>{c.emoji}</span> {c.label}
              </button>
            ))}
          </div>
        </header>

        <main className="px-5 pb-4">
          {photo && (
            <div className="mb-3 flex items-center gap-3 rounded-2xl border border-border bg-brand-soft p-3">
              <img src={photo} alt="" className="h-14 w-14 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="flex items-center gap-1 text-xs font-bold text-ink"><Sparkles className="h-3 w-3" /> Búsqueda visual activa</p>
                <p className="text-[11px] text-muted-foreground">Mostrando prendas similares por color y estilo</p>
              </div>
              <button onClick={() => setPhoto(null)} className="grid h-7 w-7 place-items-center rounded-full bg-white"><X className="h-3 w-3 text-ink" /></button>
            </div>
          )}

          <p className="mb-3 text-xs text-muted-foreground">{filtered.length} resultados {cat && <>en <span className="font-semibold text-ink">{cat}</span></>}</p>

          {filtered.length === 0 ? (
            <div className="grid place-items-center py-16 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-muted text-muted-foreground"><ImageIcon className="h-6 w-6" /></div>
              <p className="mt-3 text-sm font-semibold text-ink">Sin resultados</p>
              <p className="text-xs text-muted-foreground">Prueba con otros filtros o categoría</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </main>

        {open && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm" onClick={() => setOpen(false)}>
            <div className="w-full max-w-[420px] rounded-t-[28px] bg-background p-6" onClick={(e) => e.stopPropagation()}>
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted" />
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-ink">Filtros avanzados</h3>
                <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-muted">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 max-h-[60vh] space-y-5 overflow-y-auto">
                <div>
                  <p className="mb-2 text-sm font-semibold text-ink">Precio máx: {price} €</p>
                  <input type="range" min={5} max={200} value={price} onChange={(e) => setPrice(+e.target.value)} className="w-full accent-[color:var(--brand)]" />
                </div>
                {filterGroups.map(g => (
                  <div key={g.key}>
                    <p className="mb-2 text-sm font-semibold text-ink">{g.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {g.opts.map(o => {
                        const sel = (active[g.key] || []).includes(o);
                        return (
                          <button key={o} onClick={() => toggle(g.key, o)}
                            className={`rounded-full border-2 px-3 py-1.5 text-xs font-semibold transition ${sel ? "border-brand bg-brand/10 text-ink" : "border-border bg-card text-foreground"}`}>
                            {o}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-2">
                <button onClick={() => { setActive({}); setPrice(200); }} className="flex-1 rounded-full border border-border bg-card py-4 text-sm font-semibold text-ink">Limpiar</button>
                <button onClick={() => setOpen(false)} className="flex-[1.5] rounded-full bg-ink py-4 text-sm font-semibold text-white">Ver {filtered.length} resultados</button>
              </div>
            </div>
          </div>
        )}

        <BottomNav />
      </div>
    </MobileShell>
  );
}
