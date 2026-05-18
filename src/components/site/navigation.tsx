"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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
          <Link href="/" className="nav-link active-link">Início</Link>
          <a href="#pricing" className="nav-link">Serviços</a>
          <a href="#team" className="nav-link">Sobre</a>
          <a href="#artists" className="nav-link">Artistas</a>
        </div>

        {/* Desktop: Liquid Metal Login */}
        <div className="nav-right nav-desktop-only">
          <LiquidMetalButton label="Login" onClick={() => router.push("/login")} />
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
              <a href="#pricing" onClick={() => setMobileOpen(false)}>Serviços</a>
              <a href="#team" onClick={() => setMobileOpen(false)}>Sobre</a>
              <a href="#artists" onClick={() => setMobileOpen(false)}>Artistas</a>
              <Link href="/login" onClick={() => setMobileOpen(false)} style={{ color: "var(--primary)" }}>Login</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
