"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin", icon: "grid_view", label: "Dashboard" },
  { href: "/admin/sessoes", icon: "event", label: "Sessões" },
  { href: "/admin/clientes", icon: "group", label: "Clientes" },
  { href: "/admin/pagamentos", icon: "payments", label: "Pagamentos" },
];

const bottomNavItems = [
  { href: "/admin", icon: "home", label: "Início" },
  { href: "/admin/sessoes", icon: "calendar_month", label: "Sessões" },
  { href: "/admin/clientes", icon: "group", label: "Clientes" },
  { href: "/admin/pagamentos", icon: "payments", label: "Pag." },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data: prof } = await supabase
        .from("profiles")
        .select("role, nome")
        .eq("id", user.id)
        .single();
      if (prof?.role !== "admin") { router.push("/dashboard"); return; }
      setUser(user);
      setProfile(prof);
      setLoading(false);
    }
    check();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg)" }}>
        <aside className="db-sidebar">
          <div className="db-logo bebas">W</div>
        </aside>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <header className="db-topbar">
            <div className="skeleton" style={{ width: 120, height: 14 }} />
            <div className="skeleton" style={{ width: 100, height: 28, borderRadius: 14 }} />
          </header>
          <div className="db-content">
            <div className="skeleton" style={{ width: 220, height: 30, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: 160, height: 12, marginBottom: 26 }} />
            <div className="db-grid-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="skeleton" style={{ height: 110 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const primeiroNome =
    profile?.nome?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Admin";
  const initials = (profile?.nome || primeiroNome || "AD")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname?.startsWith(href);
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <aside className="db-sidebar">
        <Link href="/" className="db-logo bebas">W</Link>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={`db-nav-item ${pathname === item.href ? "db-active" : ""}`}>
            <span className="material-symbols-outlined">{item.icon}</span>
            <div className="db-tooltip">{item.label}</div>
          </Link>
        ))}
        <div className="db-divider" />
        <Link href="/" className="db-nav-item">
          <span className="material-symbols-outlined">home</span>
          <div className="db-tooltip">Site</div>
        </Link>
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <button onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }} className="db-nav-item">
            <span className="material-symbols-outlined">logout</span>
            <div className="db-tooltip">Sair</div>
          </button>
          <div className="db-avatar">{initials}</div>
        </div>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header className="db-topbar">
          <div className="db-breadcrumb">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>admin_panel_settings</span>
            <span>›</span>
            <span style={{ color: "var(--text2)" }}>Olá, {primeiroNome} 👋</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="db-icon-btn">
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>notifications</span>
              <div className="db-notif-dot" />
            </div>
            <div className="db-user-chip">
              <div className="db-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{initials}</div>
              <span style={{ fontSize: 12, color: "var(--text2)" }}>{primeiroNome}</span>
            </div>
          </div>
        </header>
        <div className="db-content">
          {children}
        </div>

        {/* Mobile bottom navigation */}
        <nav className="db-bottom-nav" aria-label="Mobile navigation">
          {bottomNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`db-bottom-nav-item ${isActive(item.href) ? "active" : ""}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="db-bottom-nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
