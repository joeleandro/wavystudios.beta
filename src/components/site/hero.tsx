import Link from "next/link";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-radial" />
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
    </section>
  );
}
