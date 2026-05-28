"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

const services = [
  {
    name: "Pós-Produção",
    subtitle: "Mix & Master",
    description: "Finalização profissional do teu som, desde o mix à masterização.",
    popular: false,
    icon: "tune",
    options: [
      { label: "Mix", price: 40, unit: "" },
      { label: "Master", price: 70, unit: "" },
      { label: "Mix & Master", price: 100, unit: "" },
    ],
    includes: [
      "Entrega em WAV e MP3",
      "Revisão incluída",
      "Prazo: 5 dias úteis",
      "Comunicação direta",
    ],
  },
  {
    name: "Captação",
    subtitle: "em Estúdio",
    description: "Gravação profissional nos nossos estúdios em Lisboa e Porto.",
    popular: true,
    icon: "mic",
    options: [
      { label: "Diurna (12h–21h)", price: 30, unit: "/hora" },
      { label: "Noturna (21h–05h)", price: 35, unit: "/hora" },
    ],
    includes: [
      "Técnico de som incluído",
      "Gravação com live plugins",
      "Equipamento profissional",
      "Sala isolada",
      "Monitorização em tempo real",
    ],
  },
  {
    name: "Produção",
    subtitle: "Musical",
    description: "Beats e instrumentais criados à tua medida para os teus projetos.",
    popular: false,
    icon: "piano",
    options: [
      { label: "Instrumental Exclusivo (WAV)", price: 150, unit: "" },
      { label: "Instrumental Refeito (WAV)", price: 80, unit: "" },
      { label: "Stems / Faixas Separadas", price: 50, unit: "" },
    ],
    includes: [
      "Direitos exclusivos",
      "Ficheiros WAV sem marca d'água",
      "Stems opcionais",
      "Revisão incluída",
    ],
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const { ref, inView } = useInView(0.1);
  const [selectedOption, setSelectedOption] = useState(0);

  return (
    <div
      ref={ref}
      className="pricing-ind-card"
      data-popular={service.popular}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(32px)",
        transition: `opacity .6s ease ${index * 0.15}s, transform .6s ease ${index * 0.15}s`,
      }}
    >
      {service.popular && (
        <div className="pricing-ind-badge">
          <span className="material-symbols-outlined" style={{ fontSize: 12 }}>star</span>
          Mais Popular
        </div>
      )}

      {/* Header */}
      <div className="pricing-ind-header">
        <div className="pricing-ind-icon">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{service.icon}</span>
        </div>
        <div>
          <h3 className="pricing-ind-name">{service.name}</h3>
          <span className="pricing-ind-sub">{service.subtitle}</span>
        </div>
      </div>

      <p className="pricing-ind-desc">{service.description}</p>

      {/* Option selector */}
      <div className="pricing-ind-options">
        {service.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelectedOption(i)}
            className="pricing-ind-option"
            data-selected={selectedOption === i}
          >
            <span className="pricing-ind-option-label">{opt.label}</span>
            <span className="pricing-ind-option-price">
              €{opt.price}<span className="pricing-ind-unit">{opt.unit}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Selected price display */}
      <div className="pricing-ind-price-row">
        <span className="pricing-ind-price-big">€{service.options[selectedOption].price}</span>
        {service.options[selectedOption].unit && (
          <span className="pricing-ind-price-unit">{service.options[selectedOption].unit}</span>
        )}
      </div>

      {/* Features */}
      <ul className="pricing-ind-features">
        {service.includes.map((feat, i) => (
          <li key={i}>
            <Check size={13} strokeWidth={2.5} style={{ color: "var(--primary)", flexShrink: 0 }} />
            <span>{feat}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link href="/login" className="pricing-ind-cta" data-popular={service.popular}>
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
        Marcar agora
      </Link>
    </div>
  );
}

export function PricingIndividual() {
  const { ref: titleRef, inView: titleInView } = useInView(0.1);

  return (
    <section className="pricing-ind-section">
      {/* Section header */}
      <div
        ref={titleRef}
        className="pricing-ind-header-block"
        style={{
          opacity: titleInView ? 1 : 0,
          transform: titleInView ? "none" : "translateY(24px)",
          transition: "opacity .7s ease, transform .7s ease",
        }}
      >
        <span className="section-eyebrow">Serviços Individuais</span>
        <h2 className="section-title pricing-ind-title">
          Preçário<br />
          <span style={{ color: "var(--primary-c)" }}>Individualizado</span>
        </h2>
        <p className="pricing-ind-subtitle">
          Sem subscrição. Paga apenas o que precisas, quando precisas.
        </p>
      </div>

      {/* Cards grid */}
      <div className="pricing-ind-grid">
        {services.map((service, i) => (
          <ServiceCard key={service.name} service={service} index={i} />
        ))}
      </div>

      {/* Footer note */}
      <div className="pricing-ind-footer">
        <span className="material-symbols-outlined" style={{ fontSize: 16, opacity: 0.5 }}>info</span>
        <p>Todos os projetos gravados em estúdio permanecem armazenados por 30 dias.</p>
      </div>
    </section>
  );
}
