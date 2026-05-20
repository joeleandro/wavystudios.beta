"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const services = [
  { num: "#01", label: "Captação Vocal" },
  { num: "#02", label: "Mix & Master" },
  { num: "#03", label: "Produção Musical" },
  { num: "#04", label: "Direção Criativa" },
];

export function Hero() {
  const router = useRouter();
  return (
    <section className="hw-hero">

      {/* ── inline nav (replaces the floating nav on home page) ── */}
      <nav className="hw-nav">
        <Link href="/" className="hw-logo">Wavy Studios</Link>
        <div className="hw-nav-links">
          <Link href="/precos" className="hw-nav-link">Serviços</Link>
          <Link href="/estudios" className="hw-nav-link">Estúdios</Link>
          <Link href="/sobre" className="hw-nav-link">Sobre</Link>
        </div>
        <button className="hw-btn-contact" onClick={() => router.push("/login")}>
          Entrar
          <span className="hw-btn-arrow">→</span>
        </button>
      </nav>

      {/* ── noise grain overlay ── */}
      <div className="hw-grain" aria-hidden="true" />

      {/* ── radial glow top-right ── */}
      <div className="hw-glow" aria-hidden="true" />

      {/* ── microphone / studio silhouette SVG ── */}
      <div className="hw-img-wrap" aria-hidden="true">
        <svg viewBox="0 0 300 480" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
          <defs>
            <radialGradient id="hw-glow1" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#FF8080" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3D0000" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="hw-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B0000" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#0a0000" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="hw-mic-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C0392B" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0a0000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* background ambient glow */}
          <ellipse cx="150" cy="200" rx="140" ry="200" fill="url(#hw-glow1)" />

          {/* Mic stand */}
          <rect x="145" y="300" width="10" height="120" rx="5" fill="#3D0000" opacity="0.7" />
          <ellipse cx="150" cy="420" rx="45" ry="10" fill="#2A0000" opacity="0.6" />
          {/* Stand arm */}
          <rect x="120" y="220" width="8" height="90" rx="4" transform="rotate(-10 120 220)" fill="#2A0000" opacity="0.6" />

          {/* Mic body glow */}
          <ellipse cx="155" cy="160" rx="55" ry="80" fill="url(#hw-mic-glow)" />

          {/* Mic capsule */}
          <rect x="125" y="90" width="58" height="100" rx="29" fill="#1A0000" opacity="0.85" />
          {/* Mic mesh lines */}
          <g opacity="0.25" stroke="#C0392B" strokeWidth="1.2" fill="none">
            <line x1="135" y1="105" x2="175" y2="105" />
            <line x1="130" y1="118" x2="180" y2="118" />
            <line x1="128" y1="130" x2="182" y2="130" />
            <line x1="128" y1="142" x2="182" y2="142" />
            <line x1="130" y1="154" x2="180" y2="154" />
            <line x1="133" y1="166" x2="177" y2="166" />
            <line x1="138" y1="178" x2="172" y2="178" />
          </g>
          {/* Mic highlight */}
          <ellipse cx="140" cy="120" rx="12" ry="18" fill="#8B0000" opacity="0.3" />

          {/* Headphone arc */}
          <path d="M 90 200 Q 150 120 210 200" fill="none" stroke="#4A0000" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
          {/* Headphone cups */}
          <ellipse cx="90" cy="210" rx="20" ry="26" fill="#2D0000" opacity="0.7" />
          <ellipse cx="210" cy="210" rx="20" ry="26" fill="#2D0000" opacity="0.7" />
          {/* Headphone glow details */}
          <ellipse cx="90" cy="210" rx="12" ry="16" fill="#8B0000" opacity="0.25" />
          <ellipse cx="210" cy="210" rx="12" ry="16" fill="#8B0000" opacity="0.25" />

          {/* Sound wave rings */}
          <g opacity="0.12" fill="none" stroke="#C0392B">
            <ellipse cx="154" cy="140" rx="75" ry="75" strokeWidth="1.5" />
            <ellipse cx="154" cy="140" rx="100" ry="100" strokeWidth="1" />
            <ellipse cx="154" cy="140" rx="125" ry="125" strokeWidth="0.8" />
          </g>

          {/* Waveform hint at bottom */}
          <g opacity="0.2" stroke="#C0392B" strokeWidth="2" fill="none" strokeLinecap="round">
            <polyline points="40,380 60,360 80,395 100,350 120,390 140,365 160,390 180,350 200,395 220,360 240,380 260,370 280,380" />
          </g>

          {/* bottom fade */}
          <rect width="300" height="480" fill="url(#hw-fade)" />
        </svg>
      </div>

      {/* ── hero copy ── */}
      <div className="hw-content">

        <p className="hw-eyebrow">O teu som começa aqui</p>

        <h1 className="hw-headline">
          Wavy<br />Studios
        </h1>

        <div className="hw-tagline-block">
          <strong>O som que define a tua carreira.</strong>
          <p>Do estúdio ao mundo — gravamos, mixamos e damos vida às tuas ideias musicais.</p>
        </div>

        <div className="hw-services">
          {services.map((s) => (
            <div className="hw-service-item" key={s.num}>
              <div className="hw-service-num">{s.num}</div>
              <div className="hw-service-name">{s.label}</div>
            </div>
          ))}
        </div>

      </div>

      {/* ── scroll cue ── */}
      <div className="hw-scroll-cue" aria-hidden="true">
        <span>↓</span>
      </div>

    </section>
  );
}
