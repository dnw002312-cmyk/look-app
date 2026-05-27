import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { useStore } from "@/lib/store";
import { useFavorites } from "@/lib/favorites";
import { Settings, Share2, Star, BadgeCheck, ShoppingBag, Heart, Clock, Edit3, Camera, LogOut } from "lucide-react";
import { useRef, useState } from "react";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  const { profile, setProfile, userProducts, allProducts, signOut } = useStore();
  const { favorites } = useFavorites();
  const [tab, setTab] = useState<"closet" | "favs" | "hist">("closet");
  const fileRef = useRef<HTMLInputElement>(null);

  const closet = userProducts.length > 0 ? userProducts : allProducts.slice(0, 4);
  const favProducts = allProducts.filter((p) => favorites.includes(p.id));

  const onAvatar = (file: File) => {
    const r = new FileReader();
    r.onload = () => setProfile({ avatar: String(r.result) });
    r.readAsDataURL(file);
  };

  const list = tab === "closet" ? closet : tab === "favs" ? favProducts : allProducts.slice(4, 8);

  return (
    <MobileShell>
      <div className="flex min-h-[100dvh] flex-col bg-background">
        <header className="ink-gradient relative px-5 pb-16 pt-6 text-white">
          <div className="flex items-center justify-between">
            <button className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
              <Share2 className="h-4 w-4" />
            </button>
            <h1 className="text-sm font-semibold uppercase tracking-wider">Mi perfil</h1>
            <button onClick={signOut} className="grid h-10 w-10 place-items-center rounded-full bg-white/10" aria-label="Salir">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-6 flex flex-col items-center text-center">
            <div className="relative">
              <img src={profile.avatar} className="h-24 w-24 rounded-full border-4 border-white object-cover" alt="" />
              <button onClick={() => fileRef.current?.click()} className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-brand ring-4 ring-[color:var(--ink)]">
                <Camera className="h-3.5 w-3.5 text-ink" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onAvatar(f); e.currentTarget.value = ""; }} />
              {profile.verified && (
                <span className="absolute -top-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-white">
                  <BadgeCheck className="h-4 w-4 text-brand" />
                </span>
              )}
            </div>
            <h2 className="mt-3 text-xl font-extrabold">{profile.name}</h2>
            <p className="text-xs text-white/60">{profile.username}</p>
            <p className="mt-2 max-w-[260px] text-sm text-white/80">{profile.bio}</p>
          </div>
        </header>

        <div className="-mt-10 mx-5 grid grid-cols-3 gap-3 rounded-3xl bg-card p-4 shadow-xl shadow-ink/10">
          <Stat icon={<ShoppingBag className="h-4 w-4" />} value={userProducts.length || profile.sales} label="Publicaciones" />
          <Stat icon={<Star className="h-4 w-4 fill-brand text-brand" />} value={profile.rating} label="Valoración" />
          <Stat icon={<Heart className="h-4 w-4 text-brand" />} value={favorites.length} label="Favoritos" />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 px-5">
          <button onClick={() => { const n = prompt("Tu nombre", profile.name); if (n) setProfile({ name: n }); }} className="flex items-center justify-center gap-2 rounded-full border border-border bg-card py-3 text-sm font-semibold text-ink">
            <Edit3 className="h-4 w-4" /> Editar perfil
          </button>
          <Link to="/sell" className="flex items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-semibold text-ink">
            + Subir prenda
          </Link>
        </div>

        <div className="mt-6 px-5 pb-4">
          <div className="flex gap-2 border-b border-border">
            <Tab active={tab === "closet"} onClick={() => setTab("closet")}>Mi closet</Tab>
            <Tab active={tab === "favs"} onClick={() => setTab("favs")}><Heart className="h-3.5 w-3.5" /> Favoritos</Tab>
            <Tab active={tab === "hist"} onClick={() => setTab("hist")}><Clock className="h-3.5 w-3.5" /> Historial</Tab>
          </div>
          {list.length === 0 ? (
            <div className="grid place-items-center py-12 text-center">
              <p className="text-sm font-semibold text-ink">{tab === "favs" ? "Aún no tienes favoritos" : "Nada por aquí"}</p>
              <Link to="/search" className="mt-3 rounded-full bg-ink px-4 py-2 text-xs font-bold text-white">Explorar</Link>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {list.map(p => (
                <Link to="/product/$id" params={{ id: p.id }} key={p.id} className="block overflow-hidden rounded-2xl bg-muted">
                  <div className="relative aspect-square overflow-hidden">
                    <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                    <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold text-ink">Activo</span>
                  </div>
                  <div className="px-2 py-2">
                    <p className="truncate text-xs font-semibold text-ink">{p.title}</p>
                    <p className="text-sm font-bold text-ink">{p.price} €</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    </MobileShell>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-1 grid h-8 w-8 place-items-center rounded-full bg-brand-soft text-ink">{icon}</div>
      <p className="text-base font-extrabold text-ink">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function Tab({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 pb-2.5 text-xs font-semibold transition ${active ? "border-ink text-ink" : "border-transparent text-muted-foreground"}`}>
      {children}
    </button>
  );
}
