"use client";

import { useState } from "react";
import Link from "next/link";

const plans = [
  {
    name: "Standard",
    price: "€150",
    description: "Para começar com consistência",
    features: [
      "Captação Vocal",
      "4 horas semanais (16h mensais)",
      "Sessões de 1h cada",
      "2 Mix/Masters incluídos",
    ],
    cta: "Saber mais",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "€190",
    description: "Para quem já está ativo",
    features: [
      "Captação Vocal",
      "6 horas semanais (24h mensais)",
      "Sessões de 1h30 cada",
      "4 Mix/Masters incluídos",
      "Prioridade na marcação",
      "Suporte dedicado",
    ],
    cta: "Começar agora",
    highlighted: true,
  },
  {
    name: "Avançado",
    price: "€250",
    description: "Para elevar o nível máximo",
    features: [
      "8 horas semanais (32h mensais)",
      "Sessões de 2h cada",
      "1 Sessão fotográfica (15 fotos)",
      "2 Instrumental Exclusivo",
      "Direção Criativa personalizada",
    ],
    cta: "Falar connosco",
    highlighted: false,
  },
];

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" style={{ background: "var(--bg)", padding: "120px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 48px" }}>
          <h2 className="bebas" style={{ fontSize: "clamp(40px, 6vw, 64px)", color: "var(--text)", marginBottom: 16, letterSpacing: ".02em" }}>
            Planos e Preços
          </h2>
          <p style={{ fontSize: 15, color: "var(--text3)", lineHeight: 1.7, marginBottom: 24 }}>
            Sem contratos longos, sem surpresas. Escolhe o plano que faz sentido para ti e começa a gravar.
          </p>

          {/* Toggle */}
          <div style={{ display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,.03)", borderRadius: 100, padding: 4 }}>
            <button
              onClick={() => setIsAnnual(false)}
              style={{
                padding: "10px 24px", borderRadius: 100, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer", transition: "all .2s",
                background: !isAnnual ? "rgba(255,255,255,.07)" : "transparent",
                color: !isAnnual ? "var(--text)" : "var(--text3)",
              }}
            >
              Mensal
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              style={{
                padding: "10px 24px", borderRadius: 100, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer", transition: "all .2s",
                background: isAnnual ? "rgba(255,255,255,.07)" : "transparent",
                color: isAnnual ? "var(--text)" : "var(--text3)",
              }}
            >
              Anual
            </button>
          </div>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                position: "relative",
                borderRadius: 16,
                border: plan.highlighted ? "1px solid rgba(255,255,255,.1)" : "1px solid rgba(255,255,255,.06)",
                background: plan.highlighted ? "rgba(255,255,255,.02)" : "transparent",
                padding: 28,
                transition: "all .3s",
                transform: plan.highlighted ? "scale(1.02)" : "none",
                boxShadow: plan.highlighted ? "0 20px 60px rgba(0,0,0,.3)" : "none",
              }}
            >
              {/* Most Popular badge */}
              {plan.highlighted && (
                <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)" }}>
                  <div style={{ position: "relative" }}>
                    <div style={{ padding: "6px 16px", background: "rgba(255,255,255,.03)", backdropFilter: "blur(8px)", borderRadius: 100, border: "1px solid rgba(255,255,255,.1)", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--primary)", animation: "pulse 2s infinite" }} />
                      <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,.8)" }}>Mais Popular</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Plan info */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 20, fontWeight: 500, color: "var(--text)", marginBottom: 8 }}>{plan.name}</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span className="bebas" style={{ fontSize: 40, color: "var(--text)" }}>{plan.price}</span>
                  <span style={{ fontSize: 13, color: "var(--text3)" }}>por mês</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--text3)", marginTop: 12 }}>{plan.description}</p>
              </div>

              {/* Features */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                {plan.features.map((feature, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: "rgba(255,255,255,.25)" }}>check</span>
                    <span style={{ fontSize: 13, color: "var(--text2)" }}>{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link href="/login" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 12, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all .2s",
                    background: plan.highlighted ? "#fff" : "transparent",
                    color: plan.highlighted ? "#000" : "var(--text)",
                    border: plan.highlighted ? "none" : "1px solid rgba(255,255,255,.08)",
                  }}
                >
                  {plan.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div style={{ textAlign: "center", marginTop: 80 }}>
          <h3 className="bebas" style={{ fontSize: 32, letterSpacing: ".04em", color: "var(--text)", marginBottom: 24 }}>Métodos de pagamento</h3>
        </div>
        <div className="payment-grid" style={{ maxWidth: 600, margin: "0 auto" }}>
          <div className="glass pay-card"><span style={{ fontSize: 20, fontWeight: 700, color: "#003087" }}>PayPal</span></div>
          <div className="glass pay-card">
            <div style={{ display: "flex" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#EB001B", opacity: .85 }} />
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#F79E1B", opacity: .85, marginLeft: -12 }} />
            </div>
          </div>
          <div className="glass pay-card"><span style={{ fontSize: 18, fontWeight: 700 }}>Revolut</span></div>
          <div className="glass pay-card">
            <span style={{ fontSize: 14, fontWeight: 700, border: "2px solid #c00", padding: "2px 6px" }}>MB <span style={{ fontSize: 10, fontWeight: 400 }}>WAY</span></span>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}` }} />
      </div>
    </section>
  );
}
