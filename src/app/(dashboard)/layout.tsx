"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", icon: "grid_view", label: "Dashboard" },
  { href: "/sessoes", icon: "calendar_month", label: "Sessões" },
  { href: "/entregas", icon: "cloud_download", label: "Entregas" },
];

const bottomNavItems = [
  { href: "/dashboard", icon: "home", label: "Início" },
  { href: "/sessoes", icon: "calendar_month", label: "Sessões" },
  { href: "/entregas", icon: "cloud_download", label: "Entregas" },
  { href: "/dashboard?perfil=1", icon: "person", label: "Perfil" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileWarning, setProfileWarning] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser(user);

      const { data: prof, error } = await supabase
        .from("profiles")
        .select("*, planos(*)")
        .eq("id", user.id)
        .single();

      // Profile doesn't exist yet — try to create via server API
      if (error && error.code === "PGRST116") {
        // Profile doesn't exist — create via server API (uses service role, bypasses RLS)
        try {
          const res = await fetch("/api/profile", { method: "POST" });
          if (res.ok) {
            // Re-fetch with planos join after creation
            const { data: refetch } = await supabase
              .from("profiles")
              .select("*, planos(*)")
              .eq("id", user.id)
              .single();
            setProfile(refetch || { nome: user.user_metadata?.nome || user.email?.split("@")[0] || "Artista", estado: "pendente" });
          } else {
            const fallbackName = user.user_metadata?.nome || user.email?.split("@")[0] || "Artista";
            setProfileWarning(true);
            setProfile({ nome: fallbackName, estado: "pendente" });
          }
        } catch {
          const fallbackName = user.user_metadata?.nome || user.email?.split("@")[0] || "Artista";
          setProfileWarning(true);
          setProfile({ nome: fallbackName, estado: "pendente" });
        }
      } else if (error) {
        console.warn("[Dashboard] Profile fetch warning:", error);
        const fallbackName =
          user.user_metadata?.nome ||
          user.email?.split("@")[0] ||
          "Artista";
        setProfileWarning(true);
        setProfile({ nome: fallbackName, estado: "pendente" });
      } else {
        setProfile(prof);
      }
      setLoading(false);
    }
    getUser();
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
            <div className="db-grid-main-sm" style={{ marginTop: 16 }}>
              <div className="skeleton" style={{ height: 240 }} />
              <div className="skeleton" style={{ height: 240 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const primeiroNome =
    profile?.nome?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "artista";
  const initials = (profile?.nome || primeiroNome || "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Detect active tab on bottom nav
  const isActive = (href: string) => {
    const cleanHref = href.split("?")[0];
    if (cleanHref === "/dashboard") return pathname === "/dashboard";
    return pathname?.startsWith(cleanHref);
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
          <button
            type="button"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await supabase.auth.signOut();
              window.location.href = "/login";
            }}
            className="db-nav-item"
            style={{ cursor: "pointer" }}
          >
            <span className="material-symbols-outlined">logout</span>
            <div className="db-tooltip">Sair</div>
          </button>
          <div className="db-avatar">{initials}</div>
        </div>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header className="db-topbar">
          <div className="db-breadcrumb">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>home</span>
            <span>›</span>
            <span style={{ color: "var(--text2)" }}>Olá, {primeiroNome} 👋</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              onClick={() => router.push("/dashboard?notif=1")}
              className="db-icon-btn"
              style={{ cursor: "pointer" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>notifications</span>
              <div className="db-notif-dot" />
            </button>
            <div className="db-user-chip">
              <div className="db-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{initials}</div>
              <span style={{ fontSize: 12, color: "var(--text2)" }}>{primeiroNome}</span>
            </div>
          </div>
        </header>
        <div className="db-content">
          {profileWarning && (
            <div
              className="db-card"
              style={{
                background: "rgba(234,179,8,.06)",
                borderColor: "rgba(234,179,8,.2)",
                marginBottom: 18,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#facc15" }}>info</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>Conta em configuração</div>
                  <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>
                    A tua conta ainda está a ser preparada. Entra em contacto connosco se precisares de assistência.
                  </div>
                </div>
              </div>
            </div>
          )}
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
