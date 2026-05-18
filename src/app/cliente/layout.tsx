"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const navItems = [
  { href: "/cliente", icon: "grid_view", label: "Dashboard" },
  { href: "/cliente/sessoes", icon: "calendar_month", label: "Sessões" },
  { href: "/cliente/marcar", icon: "add_circle", label: "Marcar" },
];

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    else if (status === "authenticated" && (session?.user as { role?: string })?.role === "admin") router.push("/admin");
  }, [session, status, router]);

  if (status === "loading") {
    return <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "2px solid var(--primary-c)", borderTopColor: "transparent", borderRadius: "50%", animation: "wf-rot 1s linear infinite" }} />
    </div>;
  }
  if (status !== "authenticated") return null;

  const userName = session?.user?.name || "Cliente";
  const initials = userName.split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <aside className="db-sidebar">
        <Link href="/" className="db-logo bebas">SG</Link>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={`db-nav-item ${pathname === item.href ? "db-active" : ""}`}>
            <span className="material-symbols-outlined">{item.icon}</span>
            <div className="db-tooltip">{item.label}</div>
          </Link>
        ))}
        <div className="db-divider" />
        <Link href="/manual" className="db-nav-item">
          <span className="material-symbols-outlined">description</span>
          <div className="db-tooltip">Manual</div>
        </Link>
        <Link href="/" className="db-nav-item">
          <span className="material-symbols-outlined">home</span>
          <div className="db-tooltip">Voltar ao Site</div>
        </Link>
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="db-nav-item">
            <span className="material-symbols-outlined">logout</span>
            <div className="db-tooltip">Sair</div>
          </button>
          <div className="db-avatar">{initials}</div>
        </div>
      </aside>

      {/* Main */}
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
              <span style={{ fontSize: 12, color: "var(--text2)" }}>{userName}</span>
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
