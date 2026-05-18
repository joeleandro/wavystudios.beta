"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", icon: "grid_view", label: "Dashboard" },
  { href: "/sessoes", icon: "calendar_month", label: "Sessões" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser(user);

      const { data: prof } = await supabase
        .from("profiles")
        .select("*, planos(*)")
        .eq("id", user.id)
        .single();
      setProfile(prof);
      setLoading(false);
    }
    getUser();
  }, []);

  if (loading) {
    return <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "2px solid var(--primary-c)", borderTopColor: "transparent", borderRadius: "50%", animation: "wf-rot 1s linear infinite" }} />
    </div>;
  }

  const initials = (profile?.nome || "U").split(" ").map((n: string) => n[0]).join("").slice(0, 2);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <aside className="db-sidebar">
        <Link href="/" className="db-logo bebas">SG</Link>
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
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>home</span>
            <span>›</span><span style={{ color: "var(--text2)" }}>Dashboard</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="db-icon-btn">
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>notifications</span>
              <div className="db-notif-dot" />
            </div>
            <div className="db-user-chip">
              <div className="db-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{initials}</div>
              <span style={{ fontSize: 12, color: "var(--text2)" }}>{profile?.nome || "Cliente"}</span>
            </div>
          </div>
        </header>
        <div className="db-content">
          {children}
        </div>
      </div>
    </div>
  );
}
