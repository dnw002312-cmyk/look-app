import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { useStore } from "@/lib/store";
import { ChevronLeft, Check, Camera, Sparkles, Loader2 } from "lucide-react";

export const Route = createFileRoute("/register")({ component: Register });

const STYLES = ["Casual", "Vintage", "Streetwear", "Elegante", "Deportivo", "Minimalista", "Y2K", "Boho"];
const BRANDS = ["Zara", "Levi's", "Carhartt", "COS", "Nike", "Vintage", "Mango", "Adidas", "H&M"];
const CATEGORIES = ["Blusas", "Pantalones", "Zapatos", "Vestidos", "Jackets", "Bolsos", "Accesorios"];
const TOP_SIZES = ["XS", "S", "M", "L", "XL"];
const BOTTOM_SIZES = ["34", "36", "38", "40", "42", "44"];
const SHOE_SIZES = ["36", "37", "38", "39", "40", "41", "42", "43"];
const TOTAL = 9;

type FormData = {
  name: string;
  email: string;
  pass: string;
  gender: string;
  age: string;
  topSize: string;
  bottomSize: string;
  shoeSize: string;
  styles: string[];
  brands: string[];
  categories: string[];
  intent: string;
  avatar: string;
};

function Register() {
  const nav = useNavigate();
  const { setProfile, signUp } = useStore();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<FormData>({
    name: "", email: "", pass: "",
    gender: "Mujer", age: "",
    topSize: "", bottomSize: "", shoeSize: "",
    styles: [], brands: [], categories: [],
    intent: "Comprar y vender", avatar: "",
  });

  const next = () => setStep((s) => Math.min(TOTAL, s + 1));
  const back = () => (step === 1 ? nav({ to: "/" }) : setStep((s) => s - 1));
  const toggleArr = (key: "styles" | "brands" | "categories", v: string) =>
    setData((d) => ({ ...d, [key]: d[key].includes(v) ? d[key].filter((x) => x !== v) : [...d[key], v] }));
  const onAvatar = (file: File) => {
    const r = new FileReader();
    r.onload = () => setData((d) => ({ ...d, avatar: String(r.result) }));
    r.readAsDataURL(file);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return data.name.trim() && data.email.trim() && data.pass.length >= 4;
      case 3: return !!data.age;
      case 5: return data.styles.length > 0;
      case 6: return data.brands.length > 0 || data.categories.length > 0;
      default: return true;
    }
  };

  const finish = async () => {
    setSaving(true);
    setErr(null);
    const name = data.name.trim() || "Tú";
    const username = "@" + name.toLowerCase().replace(/\s+/g, ".").slice(0, 16);
    const avatar = data.avatar || `https://i.pravatar.cc/200?u=${encodeURIComponent(data.email || name)}`;
    const bio = [data.styles?.join(" · "), data.brands?.join(" · ")].filter(Boolean).join(" | ") || "Nuevo en LOOK";

    const profileData = {
      name, username, email: data.email, avatar, bio,
      gender: data.gender,
      styles: data.styles, brands: data.brands, categories: data.categories,
      topSize: data.topSize, bottomSize: data.bottomSize, shoeSize: data.shoeSize,
      sales: 0, rating: 5.0, verified: false,
    };

    try {
      await signUp(name, data.email, data.pass);
      setProfile(profileData);
    } catch (e: any) {
      console.warn("API register failed, using local:", e?.message);
      setProfile(profileData);
    }

    setSaving(false);
    nav({ to: "/home" });
  };

  return (
    <MobileShell>
      <div className="flex min-h-[100dvh] flex-col bg-background px-6 pb-8 pt-6">
        <div className="flex items-center gap-3">
          <button onClick={back} className="grid h-10 w-10 place-items-center rounded-full bg-muted">
            <ChevronLeft className="h-5 w-5 text-ink" />
          </button>
          <div className="flex-1">
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full brand-gradient transition-all" style={{ width: `${(step / TOTAL) * 100}%` }} />
            </div>
          </div>
          <span className="text-xs font-bold text-muted-foreground">{step}/{TOTAL}</span>
        </div>

        <div className="mt-8 flex-1">
          {step === 1 && (
            <Step title="Crea tu perfil" subtitle="Empecemos con lo básico">
              <Input label="Nombre" placeholder="Sofía Marín" onChange={(v) => setData({ ...data, name: v })} />
              <Input label="Email" placeholder="tu@email.com" type="email" onChange={(v) => setData({ ...data, email: v })} />
              <Input label="Contraseña" placeholder="••••••••" type="password" onChange={(v) => setData({ ...data, pass: v })} />
            </Step>
          )}

          {step === 2 && (
            <Step title="¿Cómo te identificas?" subtitle="Personalizaremos tu feed">
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: "Mujer", emoji: "👩" },
                  { id: "Hombre", emoji: "👨" },
                  { id: "Prefiero no decirlo", emoji: "✨" },
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setData({ ...data, gender: g.id })}
                    className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left transition active:scale-[0.98] ${data.gender === g.id ? "border-brand bg-brand-soft text-ink" : "border-border bg-card text-foreground"}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xl">{g.emoji}</span>
                      <span className="font-semibold">{g.id}</span>
                    </span>
                    <span className={`grid h-6 w-6 place-items-center rounded-full border-2 ${data.gender === g.id ? "border-brand bg-brand" : "border-border"}`}>
                      {data.gender === g.id && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                    </span>
                  </button>
                ))}
              </div>
            </Step>
          )}

          {step === 3 && (
            <Step title="¿Cuál es tu edad?" subtitle="Para recomendaciones más precisas">
              <input
                autoFocus
                type="number"
                value={data.age}
                onChange={(e) => setData({ ...data, age: e.target.value })}
                placeholder="Ej. 24"
                className="mt-4 w-full rounded-2xl border-2 border-border bg-muted px-5 py-5 text-2xl font-bold text-ink outline-none transition focus:border-brand focus:bg-white"
              />
            </Step>
          )}

          {step === 4 && (
            <Step title="Tus tallas" subtitle="Para recomendaciones que te queden">
              <SizePicker label="Talla parte superior" opts={TOP_SIZES} value={data.topSize} onChange={(v) => setData({ ...data, topSize: v })} />
              <SizePicker label="Talla parte inferior" opts={BOTTOM_SIZES} value={data.bottomSize} onChange={(v) => setData({ ...data, bottomSize: v })} />
              <SizePicker label="Talla de zapatos" opts={SHOE_SIZES} value={data.shoeSize} onChange={(v) => setData({ ...data, shoeSize: v })} />
            </Step>
          )}

          {step === 5 && (
            <Step title="Tus estilos favoritos" subtitle="Elige todos los que te representan">
              <Chips opts={STYLES} value={data.styles} onToggle={(v) => toggleArr("styles", v)} />
            </Step>
          )}

          {step === 6 && (
            <Step title="Marcas y categorías" subtitle="Selecciona las que te interesen">
              <Chips label="Marcas favoritas" opts={BRANDS} value={data.brands} onToggle={(v) => toggleArr("brands", v)} />
              <Chips label="Categorías favoritas" opts={CATEGORIES} value={data.categories} onToggle={(v) => toggleArr("categories", v)} />
            </Step>
          )}

          {step === 7 && (
            <Step title="¿Qué quieres hacer?" subtitle="Puedes cambiarlo cuando quieras">
              {["Comprar", "Vender", "Comprar y vender"].map((o) => (
                <button key={o} onClick={() => setData({ ...data, intent: o })} className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left ${data.intent === o ? "border-brand bg-brand-soft" : "border-border bg-card"}`}>
                  <span className="text-base font-bold text-ink">{o}</span>
                  {data.intent === o && <Check className="h-5 w-5 text-brand" />}
                </button>
              ))}
            </Step>
          )}

          {step === 8 && (
            <Step title="Foto de perfil" subtitle="Tus compradores confiarán más">
              <div className="flex flex-col items-center py-6">
                <button onClick={() => fileRef.current?.click()} className="grid h-32 w-32 place-items-center overflow-hidden rounded-full border-2 border-dashed border-border bg-muted text-muted-foreground">
                  {data.avatar ? <img src={data.avatar} alt="" className="h-full w-full object-cover" /> : <Camera className="h-8 w-8" />}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onAvatar(f); e.currentTarget.value = ""; }} />
                <button onClick={() => fileRef.current?.click()} className="mt-5 rounded-full bg-ink px-5 py-2.5 text-xs font-bold text-white">Subir foto</button>
                <button onClick={next} className="mt-2 text-xs font-semibold text-muted-foreground">Omitir por ahora</button>
              </div>
            </Step>
          )}

          {step === 9 && (
            <Step title="" subtitle="">
              <div className="flex flex-col items-center py-10 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-3xl brand-gradient text-white shadow-lg shadow-brand/40">
                  <Sparkles className="h-9 w-9" />
                </div>
                <h2 className="mt-6 text-2xl font-extrabold text-ink">Tu perfil está listo</h2>
                <p className="mt-2 max-w-xs text-sm text-muted-foreground">Bienvenida a LOOK. Te hemos preparado una selección personalizada con tus estilos y tallas.</p>
              </div>
            </Step>
          )}
        </div>

        {err && <p className="mb-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{err}</p>}

        <button
          onClick={() => (step === TOTAL ? finish() : next())}
          disabled={!canProceed() || saving}
          className="mt-6 w-full rounded-full bg-ink py-4 text-base font-semibold text-white shadow-lg shadow-ink/20 transition active:scale-[0.98] disabled:opacity-40"
        >
          {saving ? (
            <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Creando cuenta...</span>
          ) : step === TOTAL ? (
            "Entrar a LOOK"
          ) : (
            "Continuar"
          )}
        </button>
      </div>
    </MobileShell>
  );
}

function Step({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      {title && <div><h1 className="text-2xl font-extrabold tracking-[-0.02em] text-ink">{title}</h1><p className="mt-1 text-sm text-muted-foreground">{subtitle}</p></div>}
      {children}
    </div>
  );
}

function Input({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement> & { onChange: (v: string) => void }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <input {...(p as any)} onChange={(e) => (p as any).onChange(e.target.value)} className="w-full rounded-2xl border border-border bg-muted px-4 py-3.5 text-sm outline-none focus:border-brand focus:bg-white" />
    </div>
  );
}

function SizePicker({ label, opts, value, onChange }: { label: string; opts: string[]; value?: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {opts.map((o) => (
          <button key={o} onClick={() => onChange(o)} className={`shrink-0 rounded-xl border px-4 py-2.5 text-sm font-bold ${value === o ? "border-brand bg-brand-soft text-ink" : "border-border bg-card text-muted-foreground"}`}>{o}</button>
        ))}
      </div>
    </div>
  );
}

function Chips({ label, opts, value, onToggle }: { label?: string; opts: string[]; value: string[]; onToggle: (v: string) => void }) {
  return (
    <div>
      {label && <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>}
      <div className="flex flex-wrap gap-2">
        {opts.map((o) => {
          const on = value.includes(o);
          return (
            <button key={o} onClick={() => onToggle(o)} className={`rounded-full border px-4 py-2 text-sm font-bold ${on ? "border-brand bg-brand-soft text-ink" : "border-border bg-card text-muted-foreground"}`}>{o}</button>
          );
        })}
      </div>
    </div>
  );
}
