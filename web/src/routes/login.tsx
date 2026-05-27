import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { Logo } from "@/components/Logo";
import { ChevronLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const nav = useNavigate();
  const { signIn } = useStore();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("maria@email.com");
  const [pass, setPass] = useState("pass");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const go = async () => {
    setError("");
    setLoading(true);
    try {
      await signIn(email, pass);
      nav({ to: "/home" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileShell>
      <div className="flex min-h-[100dvh] flex-col bg-background px-6 pb-8 pt-6">
        <button onClick={() => nav({ to: "/" })} className="grid h-10 w-10 place-items-center rounded-full bg-muted">
          <ChevronLeft className="h-5 w-5 text-ink" />
        </button>

        <div className="mt-8 flex flex-col items-center">
          <Logo size={56} variant="ink" />
          <h1 className="mt-5 text-3xl font-extrabold tracking-[-0.03em] text-ink">Bienvenida de nuevo</h1>
          <p className="mt-1 text-sm text-muted-foreground">Inicia sesión para seguir comprando y vendiendo</p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); go(); }}
          className="mt-8 space-y-3"
        >
          {error && (
            <div className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted px-4 py-3.5">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Correo electrónico" className="flex-1 bg-transparent text-sm outline-none" />
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted px-4 py-3.5">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <input value={pass} onChange={(e) => setPass(e.target.value)} type={show ? "text" : "password"} placeholder="Contraseña" className="flex-1 bg-transparent text-sm outline-none" />
            <button type="button" onClick={() => setShow((s) => !s)} className="text-muted-foreground">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="flex justify-end">
            <button type="button" className="text-xs font-semibold text-brand">¿Olvidaste tu contraseña?</button>
          </div>

          <button type="submit" disabled={loading} className="mt-4 w-full rounded-full bg-ink py-4 text-base font-semibold text-white shadow-lg shadow-ink/20 transition active:scale-[0.98] disabled:opacity-50">
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-3 text-[10px] uppercase tracking-wider text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> o continúa con <div className="h-px flex-1 bg-border" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button onClick={go} className="rounded-full border border-border bg-card py-3 text-sm font-semibold text-ink">Google</button>
          <button onClick={go} className="rounded-full border border-border bg-card py-3 text-sm font-semibold text-ink">Apple</button>
        </div>

        <p className="mt-auto pt-8 text-center text-sm text-muted-foreground">
          ¿No tienes cuenta? <Link to="/register" className="font-bold text-ink">Crear cuenta</Link>
        </p>
      </div>
    </MobileShell>
  );
}
