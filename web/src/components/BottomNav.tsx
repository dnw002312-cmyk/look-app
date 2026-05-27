import { Link, useLocation } from "@tanstack/react-router";
import { Home, Compass, Sparkles, Heart, User } from "lucide-react";

type NavItem = { to: "/home" | "/search" | "/ai" | "/favorites" | "/profile"; icon: typeof Home; label: string; center?: boolean };
const items: NavItem[] = [
  { to: "/home", icon: Home, label: "Inicio" },
  { to: "/search", icon: Compass, label: "Explorar" },
  { to: "/ai", icon: Sparkles, label: "IA", center: true },
  { to: "/favorites", icon: Heart, label: "Favoritos" },
  { to: "/profile", icon: User, label: "Perfil" },
];

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="sticky bottom-0 z-40 mt-4 border-t border-border bg-background/95 backdrop-blur-xl">
      <ul className="grid grid-cols-5 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {items.map(({ to, icon: Icon, label, center }) => {
          const active = pathname === to || (to !== "/home" && pathname.startsWith(to));
          if (center) {
            return (
              <li key={to} className="flex justify-center">
                <Link to={to} className="-mt-6 flex h-14 w-14 items-center justify-center rounded-2xl brand-gradient text-white shadow-lg shadow-brand/40 transition active:scale-95">
                  <Icon className="h-7 w-7" strokeWidth={2.2} />
                </Link>
              </li>
            );
          }
          return (
            <li key={to}>
              <Link to={to} className={`flex flex-col items-center gap-1 py-2 text-[10px] font-medium transition ${active ? "text-ink" : "text-muted-foreground"}`}>
                <Icon className={`h-5 w-5 ${active ? "stroke-[2.4]" : ""}`} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
