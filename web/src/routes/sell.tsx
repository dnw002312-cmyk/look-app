import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { useStore } from "@/lib/store";
import { Camera, X, Check } from "lucide-react";

export const Route = createFileRoute("/sell")({ component: Sell });

const SIZES = ["XS", "S", "M", "L", "XL", "38", "40", "42", "Único"];
const COLORS = ["Negro", "Blanco", "Beige", "Verde", "Rosa", "Marino", "Gris", "Camel", "Marrón", "Multicolor"];
const CONDITIONS = ["Nuevo", "Como nuevo", "Bueno", "Aceptable"];
const CATS = ["Mujer", "Hombre", "Vintage", "Streetwear", "Formal", "Accesorios", "Zapatos"];

function Sell() {
  const nav = useNavigate();
  const { addProduct } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "", price: "", brand: "",
    size: "M", color: "Negro", condition: "Como nuevo", category: "Mujer",
    description: "",
  });
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const upd = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).slice(0, 6 - photos.length).forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => setPhotos((p) => [...p, String(reader.result)]);
      reader.readAsDataURL(f);
    });
  };

  const publish = () => {
    setErr(null);
    if (!form.title.trim()) return setErr("Pon un nombre a la prenda");
    if (!form.price || +form.price <= 0) return setErr("Indica un precio válido");
    if (photos.length === 0) return setErr("Sube al menos una foto");

    addProduct({
      title: form.title,
      brand: form.brand || "Sin marca",
      price: +form.price,
      size: form.size,
      color: form.color,
      condition: form.condition,
      category: form.category,
      image: photos[0],
      description: form.description || "Prenda en buen estado.",
    });
    setDone(true);
    setTimeout(() => nav({ to: "/profile" }), 1200);
  };

  return (
    <MobileShell>
      <div className="flex min-h-[100dvh] flex-col bg-background">
        <header className="flex items-center justify-between px-5 pb-4 pt-6">
          <button onClick={() => nav({ to: "/home" })} className="grid h-10 w-10 place-items-center rounded-full bg-muted">
            <X className="h-4 w-4 text-ink" />
          </button>
          <h1 className="text-base font-extrabold text-ink">Nueva publicación</h1>
          <span className="w-10" />
        </header>

        <main className="space-y-5 px-5 pb-32">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fotos {photos.length}/6</p>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((p, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                  <img src={p} className="h-full w-full object-cover" alt="" />
                  {i === 0 && <span className="absolute left-1 top-1 rounded-full bg-brand px-1.5 py-0.5 text-[9px] font-bold text-ink">Portada</span>}
                  <button onClick={() => setPhotos(photos.filter((_, x) => x !== i))} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-ink/80 text-white">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {photos.length < 6 && (
                <button onClick={() => fileRef.current?.click()} className="grid aspect-square place-items-center rounded-2xl border-2 border-dashed border-border bg-muted/50 text-muted-foreground transition active:scale-95">
                  <div className="flex flex-col items-center gap-1">
                    <Camera className="h-5 w-5" />
                    <span className="text-[10px] font-semibold">Añadir</span>
                  </div>
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { onFiles(e.target.files); e.currentTarget.value = ""; }} />
            </div>
          </div>

          <Field label="Nombre de la prenda" placeholder="Ej. Chaqueta vintage Levi's" value={form.title} onChange={(v) => upd("title", v)} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Precio (€)" type="number" placeholder="35" value={form.price} onChange={(v) => upd("price", v)} />
            <Field label="Marca" placeholder="Levi's" value={form.brand} onChange={(v) => upd("brand", v)} />
          </div>
          <Select label="Categoría" opts={CATS} value={form.category} onChange={(v) => upd("category", v)} />
          <div className="grid grid-cols-3 gap-3">
            <Select label="Talla" opts={SIZES} value={form.size} onChange={(v) => upd("size", v)} />
            <Select label="Color" opts={COLORS} value={form.color} onChange={(v) => upd("color", v)} />
            <Select label="Estado" opts={CONDITIONS} value={form.condition} onChange={(v) => upd("condition", v)} />
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Descripción</p>
            <textarea rows={4} value={form.description} onChange={(e) => upd("description", e.target.value)} placeholder="Cuéntale al comprador sobre el estado, ajuste y detalles..." className="w-full resize-none rounded-2xl border border-border bg-muted px-4 py-3 text-sm outline-none focus:border-brand focus:bg-white" />
          </div>

          {err && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{err}</p>}
        </main>

        <div className="fixed bottom-0 left-1/2 w-full max-w-[420px] -translate-x-1/2 border-t border-border bg-background/95 p-4 pb-20 backdrop-blur-xl">
          <button onClick={publish} disabled={done} className="w-full rounded-full bg-ink py-4 text-base font-semibold text-white shadow-lg shadow-ink/20 transition active:scale-[0.98] disabled:opacity-60">
            {done ? <span className="inline-flex items-center gap-2"><Check className="h-4 w-4" /> ¡Publicado!</span> : "Publicar artículo"}
          </button>
        </div>

        <BottomNav />
      </div>
    </MobileShell>
  );
}

function Field({ label, value, onChange: setValue, ...props }: { label: string; value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <input {...props} value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-2xl border border-border bg-muted px-4 py-3 text-sm font-medium outline-none focus:border-brand focus:bg-white" />
    </div>
  );
}

function Select({ label, opts, value, onChange }: { label: string; opts: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-border bg-muted px-3 py-3 text-sm font-medium text-ink outline-none focus:border-brand focus:bg-white">
        {opts.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
