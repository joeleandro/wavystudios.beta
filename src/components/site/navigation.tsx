"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`main-nav ${scrolled ? "scrolled" : ""}`}>
      <Link href="/" className="nav-logo">SG</Link>
      <div className="nav-links">
        <Link href="/" className="nav-link active-link">Início</Link>
        <a href="#pricing" className="nav-link">Serviços</a>
        <a href="#team" className="nav-link">Sobre</a>
        <a href="#artists" className="nav-link">Artistas</a>
      </div>
      <div className="nav-right">
        <Link href="/login" className="nav-login">Login</Link>
        <div className="nav-menu-btn">
          <span className="material-symbols-outlined">grid_view</span>
        </div>
      </div>
    </nav>
  );
}
