"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Check if user is logged in
  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch {}
      setCheckingAuth(false);
    }
    checkUser();
  }, []);

  return (
    <>
      <nav className={`main-nav ${scrolled ? "scrolled" : ""}`}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD69aH4gDqvS6GPs2xSrAsH6uz0MUTCYqNe9923wUo4mY5swSnJVLBhwJFUuStaN2T_cN38aJLdPTrZk1_T0WjJhTQukQ3HpPrVj3G-OORLvLj4s-BJ0MnDFczT0XWDrJ9XV_HfRyB5mtCX493f9HOdOzasnAOtMQn6ZA54RKD9-WT6YTVWvKbv7sIS0Ws6QNdPuMBt6vS0zoh7ONM9u7bCFWpA-r3d4Q24kUhMWTLVcLfgzhm5iypCN_23yY9L4NP9DtnB0OJfJLa6"
            alt="Logo"
            style={{ width: 52, height: 52, objectFit: "contain", filter: "brightness(2)" }}
          />
        </Link>

        {/* Desktop nav links */}
        <div className="nav-links">
          <Link href="/precos" className="nav-link">Serviços</Link>
          <Link href="/estudios" className="nav-link">Estúdios</Link>
          <Link href="/sobre" className="nav-link">Sobre</Link>
          <Link href="/#artists" className="nav-link">Artistas</Link>
        </div>

        {/* Desktop: Show profile icon if logged in, otherwise Login button */}
        <div className="nav-right nav-desktop-only">
          {!checkingAuth && user ? (
            <Link
              href="/dashboard"
              style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--primary-c), #c41a1a)",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(255,180,168,.2)",
                transition: "all .2s",
              }}
              title="Meu Dashboard"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#fff" }}>person</span>
            </Link>
          ) : (
            <LiquidMetalButton label="Login" onClick={() => router.push("/login")} />
          )}
        </div>

        {/* Mobile: Hamburger menu button */}
        <button
          className="nav-mobile-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
            {mobileOpen ? "close" : "menu"}
          </span>
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-links">
              <Link href="/" onClick={() => setMobileOpen(false)}>Início</Link>
              <Link href="/precos" onClick={() => setMobileOpen(false)}>Serviços</Link>
              <Link href="/estudios" onClick={() => setMobileOpen(false)}>Estúdios</Link>
              <Link href="/sobre" onClick={() => setMobileOpen(false)}>Sobre</Link>
              {user ? (
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} style={{ color: "var(--primary)" }}>Dashboard</Link>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)} style={{ color: "var(--primary)" }}>Login</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
