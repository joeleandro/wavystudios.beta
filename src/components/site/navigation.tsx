"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/precos", label: "Serviços" },
  { href: "/portfolio", label: "Portfólio" },
  { href: "/cyclo", label: "Cyclo" },
  { href: "/estudios", label: "Estúdios" },
  { href: "/sobre", label: "Sobre" },
];

const desktopLinks = navLinks.filter(l => l.href !== "/");

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const close = () => setMobileOpen(false);

  return (
    <>
      <nav className={`main-nav ${scrolled ? "scrolled" : ""}`}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD69aH4gDqvS6GPs2xSrAsH6uz0MUTCYqNe9923wUo4mY5swSnJVLBhwJFUuStaN2T_cN38aJLdPTrZk1_T0WjJhTQukQ3HpPrVj3G-OORLvLj4s-BJ0MnDFczT0XWDrJ9XV_HfRyB5mtCX493f9HOdOzasnAOtMQn6ZA54RKD9-WT6YTVWvKbv7sIS0Ws6QNdPuMBt6vS0zoh7ONM9u7bCFWpA-r3d4Q24kUhMWTLVcLfgzhm5iypCN_23yY9L4NP9DtnB0OJfJLa6"
            alt="Wavy Studios"
            className="nav-logo-img"
            style={{ width: 38, height: 38, objectFit: "contain", filter: "brightness(2)" }}
          />
        </Link>

        {/* Desktop nav — pill container */}
        <div className="nav-pill nav-desktop-only">
          {desktopLinks.map(link => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-pill-link${isActive ? " nav-pill-active" : ""}`}
              >
                {link.label.toUpperCase()}
              </Link>
            );
          })}
        </div>

        {/* Desktop: Login pill button */}
        <div className="nav-right nav-desktop-only">
          <Link href="/login" className="nav-login-pill">LOGIN</Link>
        </div>

        {/* Mobile: Hamburger button */}
        <button
          className="nav-mobile-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu"
          aria-expanded={mobileOpen}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>menu</span>
        </button>
      </nav>

      {/* ── FULLSCREEN MOBILE MENU ── */}
      <div
        className={`mm-backdrop ${mobileOpen ? "mm-open" : ""}`}
        aria-hidden={!mobileOpen}
        onClick={close}
      >
        <div
          className={`mm-panel ${mobileOpen ? "mm-panel-open" : ""}`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
        >
          {/* ── Panel header ── */}
          <div className="mm-header">
            <Link href="/" className="mm-logo" onClick={close}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD69aH4gDqvS6GPs2xSrAsH6uz0MUTCYqNe9923wUo4mY5swSnJVLBhwJFUuStaN2T_cN38aJLdPTrZk1_T0WjJhTQukQ3HpPrVj3G-OORLvLj4s-BJ0MnDFczT0XWDrJ9XV_HfRyB5mtCX493f9HOdOzasnAOtMQn6ZA54RKD9-WT6YTVWvKbv7sIS0Ws6QNdPuMBt6vS0zoh7ONM9u7bCFWpA-r3d4Q24kUhMWTLVcLfgzhm5iypCN_23yY9L4NP9DtnB0OJfJLa6"
                alt="Wavy Studios"
                style={{ width: 38, height: 38, objectFit: "contain", filter: "brightness(2)" }}
              />
              <span className="mm-logo-text">Wavy Studios</span>
            </Link>
            <button
              className="mm-close"
              onClick={close}
              aria-label="Fechar menu"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>close</span>
            </button>
          </div>

          {/* ── Nav links ── */}
          <nav className="mm-links">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={`mm-link ${pathname === link.href ? "mm-link-active" : ""}`}
                onClick={close}
                style={{ animationDelay: `${0.08 + i * 0.04}s` }}
              >
                <span className="mm-link-text">{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* ── Divider ── */}
          <div className="mm-divider" />

          {/* ── Contact info ── */}
          <div className="mm-contact">
            <p className="mm-contact-label">Contacto</p>
            <a href="mailto:wavystudiosinfo@gmail.com" className="mm-contact-item">
              <span className="mm-contact-row-label">Email</span>
              <span className="mm-contact-row-value">wavystudiosinfo@gmail.com</span>
            </a>
            <a href="tel:+351939910528" className="mm-contact-item">
              <span className="mm-contact-row-label">Telefone</span>
              <span className="mm-contact-row-value">+351 939 910 528</span>
            </a>
            <div className="mm-contact-item" style={{ cursor: "default" }}>
              <span className="mm-contact-row-label">Estúdios</span>
              <span className="mm-contact-row-value">Lisboa · Porto</span>
            </div>
          </div>

          {/* ── Login button ── */}
          <div className="mm-footer">
            <Link href="/login" className="mm-login-btn" onClick={close}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>login</span>
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
