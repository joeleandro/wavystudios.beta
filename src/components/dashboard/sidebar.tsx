"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  role: "admin" | "cliente";
}

const adminLinks = [
  { href: "/admin", icon: "dashboard", label: "Dashboard" },
  { href: "/admin/sessoes", icon: "event", label: "Sessões" },
  { href: "/admin/clientes", icon: "group", label: "Clientes" },
  { href: "/admin/calendario", icon: "calendar_month", label: "Calendário" },
];

const clienteLinks = [
  { href: "/cliente", icon: "dashboard", label: "Dashboard" },
  { href: "/cliente/sessoes", icon: "event", label: "Sessões" },
  { href: "/cliente/marcar", icon: "add_circle", label: "Marcar" },
];

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const links = role === "admin" ? adminLinks : clienteLinks;

  return (
    <aside className="fixed left-0 top-0 h-screen w-[72px] bg-surface-container border-r border-white/5 flex flex-col items-center py-6 z-40">
      {/* Logo */}
      <Link href={role === "admin" ? "/admin" : "/cliente"} className="mb-8">
        <div className="w-10 h-10 glass-card rounded-xl flex items-center justify-center burgundy-glow">
          <span className="font-[var(--font-display)] text-xl text-primary">W</span>
        </div>
      </Link>

      {/* Nav links */}
      <nav className="flex-1 flex flex-col items-center gap-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all group relative ${
                isActive
                  ? "bg-primary-container/20 text-primary"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
              title={link.label}
            >
              <span className="material-symbols-outlined text-xl">{link.icon}</span>
              {/* Tooltip */}
              <span className="absolute left-full ml-3 px-2 py-1 bg-surface-container-highest text-xs text-on-surface rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white/30 hover:text-error hover:bg-error-container/10 transition-all"
          title="Sair"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
        </button>
      </div>
    </aside>
  );
}
