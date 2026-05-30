"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PricingIndividual } from "@/components/ui/pricing-individual";

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
      "6 Mix/Masters incluídos",
      "Direção Criativa personalizada",
    ],
    cta: "Falar connosco",
    highlighted: false,
  },
];

const paymentMethods = [
  {
    name: "PayPal",
    display: (
      <span style={{ fontSize: 20, fontWeight: 700, color: "#003087" }}>
        PayPal
      </span>
    ),
  },
  {
    name: "Mastercard",
    display: (
      <div style={{ display: "flex" }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#EB001B", opacity: 0.85 }} />
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#F79E1B", opacity: 0.85, marginLeft: -12 }} />
      </div>
    ),
  },
  {
    name: "Revolut",
    display: <span style={{ fontSize: 18, fontWeight: 700 }}>Revolut</span>,
  },
  {
    name: "MB WAY",
    display: (
      <span style={{ fontSize: 14, fontWeight: 700, border: "2px solid #c00", padding: "2px 6px" }}>
        MB <span style={{ fontSize: 10, fontWeight: 400 }}>WAY</span>
      </span>
    ),
  },
];

export default function PrecosPage() {
  const [slots, setSlots] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}`;
  });

  useEffect(() => {
    fetchSlots();
  }, [currentMonth]);

  async function fetchSlots() {
    const res = await fetch(`/api/disponibilidades?mes=${currentMonth}`);
    if (res.ok) {
      const d = await res.json();
      setSlots(d.slots || []);
    }
  }

  function openWpp(metodo: string) {
    const msg = encodeURIComponent(
      `Olá, gostaria de obter informações sobre pagamento via ${metodo}`
    );
    window.open(`https://wa.me/351939910528?text=${msg}`, "_blank");
  }

  return (
    <div style={{ paddingTop: 100 }}>
      {/* ── Plans ───────────────────────────────────────────────── */}
      <section className="precos-plans-section">
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h1
            className="bebas"
            style={{
              fontSize: "clamp(40px, 7vw, 72px)",
              color: "var(--text)",
              marginBottom: 16,
            }}
          >
            Planos e Preços
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "var(--text3)",
              maxWidth: 500,
              margin: "0 auto",
              padding: "0 16px",
            }}
          >
            Sem contratos, sem surpresas. Escolhe o teu ritmo.
          </p>
        </div>

        <div className="precos-plans-grid">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="precos-plan-card"
              data-highlighted={plan.highlighted}
            >
              {plan.highlighted && (
                <div className="precos-popular-badge">
                  <span
                    className="precos-popular-dot"
                    style={{ animation: "pulse 2s infinite" }}
                  />
                  <span>Mais Popular</span>
                </div>
              )}
              <h3 className="precos-plan-name">{plan.name}</h3>
              <div className="precos-plan-price-row">
                <span className="bebas precos-plan-price">{plan.price}</span>
                <span className="precos-plan-period">por mês</span>
              </div>
              <p className="precos-plan-desc">{plan.description}</p>
              <div className="precos-plan-features">
                {plan.features.map((f, i) => (
                  <div key={i} className="precos-plan-feature">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 16, color: "rgba(255,255,255,.25)" }}
                    >
                      check
                    </span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/login" style={{ textDecoration: "none" }}>
                <button
                  className="precos-plan-cta"
                  data-highlighted={plan.highlighted}
                >
                  {plan.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div style={{ textAlign: "center", marginTop: 80, marginBottom: 24 }}>
          <h3
            className="bebas"
            style={{
              fontSize: "clamp(24px, 5vw, 32px)",
              color: "var(--text)",
            }}
          >
            Métodos de pagamento
          </h3>
        </div>
        <div className="precos-payment-grid">
          {paymentMethods.map((m) => (
            <div
              key={m.name}
              onClick={() => openWpp(m.name)}
              className="glass precos-payment-card"
            >
              {m.display}
            </div>
          ))}
        </div>
      </section>

      {/* ── Preçário Individualizado ─────────────────────────── */}
      <PricingIndividual />

      {/* ── Availability calendar ──────────────────────────────── */}
      <section className="precos-availability-section">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2
            className="bebas"
            style={{
              fontSize: "clamp(28px, 5vw, 36px)",
              color: "var(--text)",
              marginBottom: 8,
            }}
          >
            Disponibilidade
          </h2>
          <p style={{ fontSize: 13, color: "var(--text3)" }}>
            Horários ocupados este mês (12h–04h)
          </p>
        </div>
        <div className="db-card" style={{ padding: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <input
              type="month"
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
              style={{
                background: "rgba(255,255,255,.04)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "8px 16px",
                color: "var(--text)",
                fontSize: 14,
              }}
            />
          </div>
          {slots.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {slots.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 12px",
                    background: "rgba(239,68,68,.06)",
                    borderRadius: 8,
                    border: "1px solid rgba(239,68,68,.15)",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--text)",
                      fontWeight: 500,
                    }}
                  >
                    {s.data}
                  </span>
                  <span style={{ fontSize: 12, color: "#f87171" }}>
                    {s.hora_inicio} – {s.hora_fim}
                  </span>
                  <span style={{ fontSize: 10, color: "var(--text3)" }}>
                    ocupado
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p
              style={{
                textAlign: "center",
                color: "var(--text3)",
                fontSize: 13,
                padding: "24px 0",
              }}
            >
              Sem sessões neste mês — tudo disponível!
            </p>
          )}
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              marginTop: 20,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                color: "var(--text3)",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "rgba(239,68,68,.5)",
                }}
              />
              Ocupado
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                color: "var(--text3)",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "rgba(74,222,128,.5)",
                }}
              />
              Disponível
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}` }} />
    </div>
  );
}
