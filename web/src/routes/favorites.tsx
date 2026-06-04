import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { BottomNav } from "@/components/BottomNav";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/mock-data";
import { useFavorites } from "@/lib/favorites";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/favorites")({ component: Favorites });

function Favorites() {
  const { favorites } = useFavorites();
  const liked = products.filter((p) => favorites.includes(p.id));

  return (
    <AppShell>
      <div className="flex min-h-[100dvh] flex-col bg-background">
        <header className="px-5 pt-6 md:px-8 md:pt-8">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-ink md:text-4xl">Favoritos</h1>
            <p className="mt-1 text-sm text-muted-foreground">{liked.length} prendas guardadas</p>
          </div>
        </header>

        <main className="flex-1 px-5 py-5 md:px-8">
          <div className="mx-auto max-w-6xl">
            {liked.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft">
                  <Heart className="h-6 w-6 text-ink" />
                </div>
                <p className="mt-3 text-sm font-bold text-ink">Aún no tienes favoritos</p>
                <p className="text-xs text-muted-foreground">Pulsa el corazón en cualquier prenda para guardarla.</p>
                <Link to="/home" className="mt-4 inline-block rounded-full bg-ink px-5 py-2.5 text-xs font-bold text-white">Explorar</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-4">
                {liked.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </main>

        <BottomNav />
      </div>
    </AppShell>
  );
}
