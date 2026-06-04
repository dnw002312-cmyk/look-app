import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo, Wordmark } from "@/components/Logo";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "LOOK — Compra. Vende. Reutiliza." }, { name: "description", content: "Marketplace de ropa de segunda mano." }] }),
  component: Welcome,
});

function Welcome() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden ink-gradient">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-brand/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-40 h-80 w-80 rounded-full bg-brand/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-8 py-16 text-center text-white">
        <div className="grid h-28 w-28 place-items-center rounded-[28px] bg-white shadow-2xl shadow-brand/30">
          <Logo size={72} variant="ink" />
        </div>
        <h1 className="mt-8 text-6xl font-extrabold tracking-[-0.05em] md:text-7xl">
          <Wordmark />
        </h1>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-white/80 md:text-xl">
          Compra. Vende. Reutiliza.
        </p>
        <p className="mt-2 max-w-md text-sm text-white/55 md:text-base">
          El marketplace de moda circular para tu próxima pieza favorita.
        </p>

        <div className="mt-10 grid w-full max-w-md gap-3 md:max-w-lg">
          <Link to="/login" className="block w-full rounded-full bg-brand py-4 text-center text-base font-semibold text-ink shadow-lg shadow-brand/20 transition active:scale-[0.98]">
            Iniciar sesión
          </Link>
          <Link to="/register" className="block w-full rounded-full border border-white/20 bg-white/5 py-4 text-center text-base font-semibold text-white backdrop-blur transition active:scale-[0.98]">
            Crear cuenta
          </Link>
          <p className="pt-2 text-center text-xs text-white/40">
            Al continuar aceptas los términos de uso
          </p>
        </div>
      </div>
    </div>
  );
}
