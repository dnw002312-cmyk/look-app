import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/mock-data";
import { useFavorites } from "@/lib/favorites";

export function ProductCard({ product }: { product: Product }) {
  const { has, toggle } = useFavorites();
  const saved = has(product.id);
  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group block overflow-hidden rounded-2xl bg-card transition active:scale-[0.98]"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
        <img src={product.image} alt={product.title} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
        <button
          onClick={(e) => { e.preventDefault(); toggle(product.id); }}
          className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow-sm backdrop-blur transition active:scale-90"
          aria-label="Guardar"
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-brand text-brand" : "text-ink"}`} />
        </button>
        <div className="absolute bottom-2 left-2 rounded-full bg-ink/90 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
          Talla {product.size}
        </div>
      </div>
      <div className="px-1 pt-2">
        <p className="truncate text-xs font-medium text-muted-foreground">{product.brand}</p>
        <p className="truncate text-sm font-semibold text-ink">{product.title}</p>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm font-bold text-ink">{product.price} €</span>
          <span className="text-[10px] text-muted-foreground">@{product.seller.name}</span>
        </div>
      </div>
    </Link>
  );
}
