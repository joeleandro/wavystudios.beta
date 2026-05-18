"use client";

import Link from "next/link";

export function Hero() {
  return (
    <section className="hero">
      {/* Slow animated background orbs */}
      <div className="hero-radial" />
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "15%", left: "60%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,0,0,.12) 0%, transparent 70%)", animation: "hero-orb1 12s ease-in-out infinite alternate" }} />
        <div style={{ position: "absolute", bottom: "20%", left: "20%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,180,168,.05) 0%, transparent 60%)", animation: "hero-orb2 15s ease-in-out infinite alternate" }} />
        <div style={{ position: "absolute", top: "50%", right: "5%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,0,0,.08) 0%, transparent 70%)", animation: "hero-orb3 18s ease-in-out infinite alternate" }} />
      </div>

      {/* Geometric SVG */}
      <div className="hero-geo">
        <svg viewBox="0 0 1000 1000" width="100%" height="100%">
          <path d="M500,50 L950,500 L500,950 L50,500 Z" fill="none" stroke="#8b0000" strokeWidth="0.8" />
          <circle cx="500" cy="500" r="350" fill="none" stroke="#8b0000" strokeDasharray="10 20" strokeWidth="0.4" />
          <path d="M500,150 L850,500 L500,850 L150,500 Z" fill="none" stroke="#ffb4a8" strokeWidth="0.3" opacity=".4" />
        </svg>
      </div>

      {/* Logo centered in hero — "Star of the Show" — LARGE like reference */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -55%)", zIndex: 1, opacity: 0.15, pointerEvents: "none" }}>
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD69aH4gDqvS6GPs2xSrAsH6uz0MUTCYqNe9923wUo4mY5swSnJVLBhwJFUuStaN2T_cN38aJLdPTrZk1_T0WjJhTQukQ3HpPrVj3G-OORLvLj4s-BJ0MnDFczT0XWDrJ9XV_HfRyB5mtCX493f9HOdOzasnAOtMQn6ZA54RKD9-WT6YTVWvKbv7sIS0Ws6QNdPuMBt6vS0zoh7ONM9u7bCFWpA-r3d4Q24kUhMWTLVcLfgzhm5iypCN_23yY9L4NP9DtnB0OJfJLa6"
          alt=""
          style={{ width: "clamp(500px, 65vw, 900px)", height: "clamp(500px, 65vw, 900px)", objectFit: "contain", filter: "brightness(3) contrast(1.2)" }}
        />
      </div>

      {/* Content — bottom-left, smaller and humanized */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 700, width: "100%" }}>
        <div className="hero-label">DESDE 2024 — CAPTAÇÃO & PRODUÇÃO MUSICAL</div>
        <h1 className="hero-h1 bebas" style={{ fontSize: "clamp(64px, 10vw, 140px)" }}>
          O TEU SOM<br />
          MERECE<br />
          <span className="dim">MAIS.</span>
        </h1>
        <p className="hero-sub">
          Gravamos, misturamos e damos vida às tuas ideias. Um estúdio feito por artistas, para artistas — onde cada sessão é um passo em direção ao teu próximo hit.
        </p>
      </div>

      {/* CTA */}
      <div style={{ position: "relative", zIndex: 2, marginTop: 40, alignSelf: "flex-start" }}>
        <Link href="#pricing" className="cta-btn">
          <span>Começar Agora</span>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>keyboard_double_arrow_right</span>
        </Link>
      </div>

      <div className="scroll-hint">
        <div className="line" />
        <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".45em", textTransform: "uppercase" }}>Explorar</span>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes hero-orb1 { from { transform: translate(0, 0) scale(1); opacity: .7; } to { transform: translate(-30px, 20px) scale(1.15); opacity: 1; } }
        @keyframes hero-orb2 { from { transform: translate(0, 0) scale(1); opacity: .5; } to { transform: translate(20px, -15px) scale(1.1); opacity: .8; } }
        @keyframes hero-orb3 { from { transform: scale(1); opacity: .6; } to { transform: scale(1.2); opacity: 1; } }
      `}} />
    </section>
  );
}
