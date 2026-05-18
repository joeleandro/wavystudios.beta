"use client";

import Link from "next/link";

export function Hero() {
  return (
    <section className="hero">
      {/* Slow animated radial background - "Star of the Show" */}
      <div className="hero-radial" />
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        {/* Slow pulsing burgundy orbs */}
        <div style={{ position: "absolute", top: "15%", left: "60%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,0,0,.12) 0%, transparent 70%)", animation: "hero-orb1 12s ease-in-out infinite alternate" }} />
        <div style={{ position: "absolute", bottom: "20%", left: "20%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,180,168,.05) 0%, transparent 60%)", animation: "hero-orb2 15s ease-in-out infinite alternate" }} />
        <div style={{ position: "absolute", top: "50%", right: "5%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,0,0,.08) 0%, transparent 70%)", animation: "hero-orb3 18s ease-in-out infinite alternate" }} />
      </div>

      {/* Slow rotating geometric SVG */}
      <div className="hero-geo">
        <svg viewBox="0 0 1000 1000" width="100%" height="100%">
          <path d="M500,50 L950,500 L500,950 L50,500 Z" fill="none" stroke="#8b0000" strokeWidth="0.8" />
          <circle cx="500" cy="500" r="350" fill="none" stroke="#8b0000" strokeDasharray="10 20" strokeWidth="0.4" />
          <path d="M500,150 L850,500 L500,850 L150,500 Z" fill="none" stroke="#ffb4a8" strokeWidth="0.3" opacity=".4" />
        </svg>
      </div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1440, margin: "0 auto", width: "100%" }}>
        <div className="hero-label">EST. 2024 — ESTÚDIO DE SERVIÇO COMPLETO</div>
        <h1 className="hero-h1 bebas">
          ESTÚDIO DE<br />
          CAPTAÇÃO<br />
          <span className="dim">VOCAL &amp; MUSIC.</span>
        </h1>
        <p className="hero-sub">
          Nascemos na interseção entre a arte sonora e a precisão técnica, entregando experiências musicais que ficam na memória.
        </p>
      </div>
      <div style={{ position: "relative", zIndex: 2, marginTop: 56, alignSelf: "flex-end" }}>
        <Link href="#pricing" className="cta-btn">
          <span>Iniciar Subscrição</span>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>keyboard_double_arrow_right</span>
        </Link>
      </div>
      <div className="scroll-hint">
        <div className="line" />
        <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".45em", textTransform: "uppercase" }}>Scroll Explore</span>
      </div>

      {/* Inline keyframes for hero orbs */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes hero-orb1 { from { transform: translate(0, 0) scale(1); opacity: .7; } to { transform: translate(-30px, 20px) scale(1.15); opacity: 1; } }
        @keyframes hero-orb2 { from { transform: translate(0, 0) scale(1); opacity: .5; } to { transform: translate(20px, -15px) scale(1.1); opacity: .8; } }
        @keyframes hero-orb3 { from { transform: translate(0, 0) scale(1); opacity: .6; } to { transform: translate(-15px, 10px) scale(1.2); opacity: 1; } }
      `}} />
    </section>
  );
}
