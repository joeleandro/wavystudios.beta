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
      {/* Burgundy → Black gradient background */}
      <div className="hero-bg" style={{ background: "linear-gradient(135deg, #5c0a0a 0%, #2d0000 30%, #0a0000 70%, #050505 100%)" }}>
        {/* Decorative geometric shapes for visual rhyming */}
        <div className="hero-geo-shapes" />
      </div>

      {/* Additional dark overlay for depth */}
      <div className="hero-overlay" style={{
        background: "radial-gradient(ellipse at 50% 45%, rgba(92,10,10,0.15) 0%, rgba(0,0,0,0.6) 80%)"
      }} />

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

          {/* CENTER — Logo as main visual element */}
          <div className="hero-logo-center">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD69aH4gDqvS6GPs2xSrAsH6uz0MUTCYqNe9923wUo4mY5swSnJVLBhwJFUuStaN2T_cN38aJLdPTrZk1_T0WjJhTQukQ3HpPrVj3G-OORLvLj4s-BJ0MnDFczT0XWDrJ9XV_HfRyB5mtCX493f9HOdOzasnAOtMQn6ZA54RKD9-WT6YTVWvKbv7sIS0Ws6QNdPuMBt6vS0zoh7ONM9u7bCFWpA-r3d4Q24kUhMWTLVcLfgzhm5iypCN_23yY9L4NP9DtnB0OJfJLa6"
              alt="Wavy Studios Logo"
              className="hero-logo-img"
            />
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

      {/* Inline styles for hero-specific elements */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hero-geo-shapes {
          position: absolute; inset: 0; pointer-events: none; overflow: hidden;
        }
        .hero-geo-shapes::before {
          content: ''; position: absolute;
          top: 10%; left: -5%; width: 600px; height: 600px;
          border: 1px solid rgba(139,0,0,.12);
          border-radius: 50%;
          animation: hero-geo-float 20s ease-in-out infinite alternate;
        }
        .hero-geo-shapes::after {
          content: ''; position: absolute;
          bottom: -10%; right: -5%; width: 800px; height: 800px;
          border: 1px solid rgba(139,0,0,.08);
          border-radius: 50%;
          animation: hero-geo-float 25s ease-in-out infinite alternate-reverse;
        }
        @keyframes hero-geo-float {
          from { transform: translate(0,0) rotate(0deg); opacity: .5; }
          to { transform: translate(20px,-15px) rotate(8deg); opacity: 1; }
        }
        .hero-logo-center {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -55%);
          z-index: 0;
          pointer-events: none;
          opacity: 0.12;
          animation: hero-logo-pulse 10s ease-in-out infinite alternate;
        }
        .hero-logo-img {
          width: clamp(300px, 45vw, 600px);
          height: clamp(300px, 45vw, 600px);
          object-fit: contain;
          filter: brightness(2.5) contrast(1.1);
        }
        @keyframes hero-logo-pulse {
          from { opacity: 0.08; transform: translate(-50%, -55%) scale(1); }
          to { opacity: 0.15; transform: translate(-50%, -55%) scale(1.04); }
        }
        @media (max-width: 768px) {
          .hero-logo-center { opacity: 0.06; }
          .hero-logo-img { width: 260px; height: 260px; }
        }
      `}} />
    </section>
  );
}
