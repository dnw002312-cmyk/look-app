import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { useStore } from "@/lib/store";
import { useFavorites } from "@/lib/favorites";
import { ChevronLeft, Heart, Share2, BadgeCheck, Star, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/product/$id")({ component: Product });

function Product() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const { getProduct, allProducts } = useStore();
  const { has, toggle } = useFavorites();
  const product = getProduct(id) ?? allProducts[0];
  const saved = has(product.id);

  return (
    <MobileShell>
      <div className="flex min-h-[100dvh] flex-col bg-background pb-32">
        <div className="relative">
          <img src={product.image} className="aspect-[4/5] w-full object-cover" alt={product.title} />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <button onClick={() => nav({ to: "/home" })} className="grid h-10 w-10 place-items-center rounded-full bg-white/90 backdrop-blur">
              <ChevronLeft className="h-5 w-5 text-ink" />
            </button>
            <div className="flex gap-2">
              <button className="grid h-10 w-10 place-items-center rounded-full bg-white/90 backdrop-blur">
                <Share2 className="h-4 w-4 text-ink" />
              </button>
              <button onClick={() => toggle(product.id)} className="grid h-10 w-10 place-items-center rounded-full bg-white/90 backdrop-blur">
                <Heart className={`h-4 w-4 ${saved ? "fill-brand text-brand" : "text-ink"}`} />
              </button>
            </div>
          </div>
          {/* Pagination dots */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {[0,1,2,3].map(i => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i === 0 ? "w-6 bg-white" : "w-1.5 bg-white/60"}`} />
            ))}
          </div>
        </div>

        <div className="px-5 pt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">{product.brand}</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-[-0.02em] text-ink">{product.title}</h1>
          <p className="mt-2 text-3xl font-extrabold text-ink">{product.price} €</p>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <Spec label="Talla" value={product.size} />
            <Spec label="Color" value={product.color} />
            <Spec label="Estado" value={product.condition} />
          </div>

          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          {/* Seller */}
          <div className="mt-6 flex items-center gap-3 rounded-3xl border border-border bg-card p-4">
            <Link to="/profile" className="flex flex-1 items-center gap-3">
              <img src={product.seller.avatar} className="h-12 w-12 rounded-full object-cover" alt="" />
              <div className="flex-1">
                <p className="flex items-center gap-1 text-sm font-bold text-ink">
                  @{product.seller.name}
                  {product.seller.verified && <BadgeCheck className="h-4 w-4 fill-brand text-white" />}
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-brand text-brand" /> {product.seller.rating} · Vendedor confiable
                </p>
              </div>
            </Link>
            <Link to="/chat/$id" params={{ id: "1" }} className="grid h-10 w-10 place-items-center rounded-full bg-muted">
              <MessageCircle className="h-4 w-4 text-ink" />
            </Link>
          </div>
        </div>

        {/* Sticky buy bar */}
        <div className="fixed bottom-0 left-1/2 w-full max-w-[420px] -translate-x-1/2 border-t border-border bg-background/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-xl">
          <div className="flex gap-2">
            <Link to="/cart" className="flex-1 rounded-full border-2 border-ink py-3.5 text-center text-sm font-semibold text-ink">
              Añadir al carrito
            </Link>
            <Link to="/cart" className="flex-[1.3] rounded-full bg-brand py-3.5 text-center text-sm font-semibold text-ink shadow-lg shadow-brand/30">
              Comprar ahora
            </Link>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted px-3 py-2.5 text-center">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-ink">{value}</p>
    </div>
  );
}
