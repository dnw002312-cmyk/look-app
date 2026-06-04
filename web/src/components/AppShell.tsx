import type { ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Home, Compass, Sparkles, Heart, User } from "lucide-react";
import { Wordmark } from "./Logo";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type NavItem = {
  to: "/home" | "/search" | "/ai" | "/favorites" | "/profile";
  icon: typeof Home;
  label: string;
  badge?: boolean;
};

const items: NavItem[] = [
  { to: "/home", icon: Home, label: "Inicio" },
  { to: "/search", icon: Compass, label: "Explorar" },
  { to: "/ai", icon: Sparkles, label: "IA Stylist" },
  { to: "/favorites", icon: Heart, label: "Favoritos" },
  { to: "/profile", icon: User, label: "Perfil" },
];

function SidebarNav() {
  const { pathname } = useLocation();
  const { profile } = useStore();
  return (
    <aside className="hidden md:flex md:w-[var(--sidebar-w)] md:shrink-0 md:flex-col md:border-r md:border-border md:bg-card">
      <div className="flex h-16 items-center gap-2 border-b border-border px-5">
        <Wordmark className="text-2xl text-ink" />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {items.map(({ to, icon: Icon, label }) => {
            const active = pathname === to || (to !== "/home" && pathname.startsWith(to));
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                    active
                      ? "bg-brand-soft text-ink"
                      : "text-muted-foreground hover:bg-muted hover:text-ink",
                  )}
                >
                  <Icon
                    className={cn("h-5 w-5", active && "text-brand")}
                    strokeWidth={active ? 2.4 : 2}
                  />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-3">
        <Link
          to="/profile"
          className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-muted"
        >
          <img
            src={profile.avatar}
            alt={profile.name}
            className="h-9 w-9 rounded-full border-2 border-brand object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{profile.name}</p>
            <p className="truncate text-xs text-muted-foreground">@{profile.username}</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-frame flex min-h-screen bg-background text-foreground">
      <SidebarNav />
      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
