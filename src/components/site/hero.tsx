"use client";

import Link from "next/link";

const services = [
  { num: "01", label: "Captação Vocal" },
  { num: "02", label: "Mix & Master" },
  { num: "03", label: "Produção Musical" },
  { num: "04", label: "Direção Criativa" },
];

export function Hero() {
  return (
    <section className="hero-redesign">
      {/* Full-bleed background image */}
      <div className="hero-bg">
        <img
          src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=2400&q=80&auto=format&fit=crop"
          alt="Wavy Studios"
        />
      </div>

      {/* Burgundy gradient overlay (left dark → right transparent) */}
      <div className="hero-overlay" />

      {/* Subtle vignette + film texture */}
      <div className="hero-vignette" />

      {/* Main content */}
      <div className="hero-content">
        <div className="hero-content-inner">
          {/* LEFT — Big title */}
          <div className="hero-title-block">
            <span className="hero-welcome">Bem-vindo ao</span>
            <h1 className="hero-main bebas">
              <span className="hero-main-line">WAVY</span>
              <span className="hero-main-line">STUDIOS</span>
            </h1>
          </div>

          {/* RIGHT — Lead phrase + paragraph */}
          <div className="hero-side">
            <div className="hero-side-accent" />
            <p className="hero-side-lead">
              O som que define<br />a tua carreira.
            </p>
            <p className="hero-side-desc">
              Do estúdio ao mundo, produzimos músicas que ficam na memória.
            </p>
            <Link href="/precos" className="hero-side-cta">
              <span>Ver planos</span>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom services bar */}
      <div className="hero-services">
        <div className="hero-services-inner">
          {services.map((s, i) => (
            <div key={s.num} className="hero-service-item">
              <span className="hero-service-num">#{s.num}</span>
              <span className="hero-service-label">{s.label}</span>
              {i < services.length - 1 && <span className="hero-service-sep" aria-hidden="true" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
