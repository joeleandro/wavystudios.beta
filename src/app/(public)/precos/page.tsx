"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const plans = [
  { name: "Standard", price: "€150", description: "Para começar com consistência", features: ["Captação Vocal", "4 horas semanais (16h mensais)", "Sessões de 1h cada", "2 Mix/Masters incluídos"], cta: "Saber mais", highlighted: false },
  { name: "Professional", price: "€190", description: "Para quem já está ativo", features: ["Captação Vocal", "6 horas semanais (24h mensais)", "Sessões de 1h30 cada", "2 Mix/Masters incluídos", "Prioridade na marcação", "Suporte dedicado"], cta: "Começar agora", highlighted: true },
  { name: "Avançado", price: "€250", description: "Para elevar o nível máximo", features: ["Tudo do Professional", "8 horas semanais (32h mensais)", "Sessões de 2h cada", "1 Sessão fotográfica (15 fotos)", "1 Instrumental Exclusivo", "Direção Criativa personalizada"], cta: "Falar connosco", highlighted: false },
];

const paymentMethods = [
  { name: "PayPal", display: <span style={{ fontSize: 20, fontWeight: 700, color: "#003087" }}>PayPal</span> },
  { name: "Mastercard", display: <div style={{ display: "flex" }}><div style={{ width: 28, height: 28, borderRadius: "50%", background: "#EB001B", opacity: .85 }} /><div style={{ width: 28, height: 28, borderRadius: "50%", background: "#F79E1B", opacity: .85, marginLeft: -12 }} /></div> },
  { name: "Revolut", display: <span style={{ fontSize: 18, fontWeight: 700 }}>Revolut</span> },
  { name: "MB WAY", display: <span style={{ fontSize: 14, fontWeight: 700, border: "2px solid #c00", padding: "2px 6px" }}>MB <span style={{ fontSize: 10, fontWeight: 400 }}>WAY</span></span> },
];

export default function PrecosPage() {
  const [slots, setSlots] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  });

  useEffect(() => { fetchSlots(); }, [currentMonth]);

  async function fetchSlots() {
    const res = await fetch(`/api/disponibilidades?mes=${currentMonth}`);
    if (res.ok) { const d = await res.json(); setSlots(d.slots || []); }
  }

  function openWpp(metodo: string) {
    const msg = encodeURIComponent(`Olá, gostaria de obter informações sobre pagamento via ${metodo}`);
    window.open(`https://wa.me/351939910528?text=${msg}`, '_blank');
  }

  return (
    <div style={{ paddingTop: 100 }}>
      {/* Pricing */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h1 className="bebas" style={{ fontSize: "clamp(48px, 7vw, 72px)", color: "var(--text)", marginBottom: 16 }}>Planos e Preços</h1>
          <p style={{ fontSize: 15, color: "var(--text3)", maxWidth: 500, margin: "0 auto" }}>Sem contratos, sem surpresas. Escolhe o teu ritmo.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {plans.map((plan) => (
            <div key={plan.name} style={{ position: "relative", borderRadius: 16, border: plan.highlighted ? "1px solid rgba(255,255,255,.1)" : "1px solid rgba(255,255,255,.06)", background: plan.highlighted ? "rgba(255,255,255,.02)" : "transparent", padding: 28, transform: plan.highlighted ? "scale(1.02)" : "none", boxShadow: plan.highlighted ? "0 20px 60px rgba(0,0,0,.3)" : "none" }}>
              {plan.highlighted && (
                <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)" }}>
                  <div style={{ padding: "6px 16px", background: "rgba(255,255,255,.03)", backdropFilter: "blur(8px)", borderRadius: 100, border: "1px solid rgba(255,255,255,.1)", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--primary)", animation: "pulse 2s infinite" }} />
                    <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,.8)" }}>Mais Popular</span>
                  </div>
                </div>
              )}
              <h3 style={{ fontSize: 20, fontWeight: 500, color: "var(--text)", marginBottom: 8 }}>{plan.name}</h3>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span className="bebas" style={{ fontSize: 40, color: "var(--text)" }}>{plan.price}</span>
                <span style={{ fontSize: 13, color: "var(--text3)" }}>por mês</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--text3)", marginTop: 12, marginBottom: 24 }}>{plan.description}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {plan.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: "rgba(255,255,255,.25)" }}>check</span>
                    <span style={{ fontSize: 13, color: "var(--text2)" }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/login" style={{ textDecoration: "none" }}>
                <button style={{ width: "100%", padding: "12px 16px", borderRadius: 12, fontSize: 13, fontWeight: 500, cursor: "pointer", background: plan.highlighted ? "#fff" : "transparent", color: plan.highlighted ? "#000" : "var(--text)", border: plan.highlighted ? "none" : "1px solid rgba(255,255,255,.08)" }}>{plan.cta}</button>
              </Link>
            </div>
          ))}
        </div>

        {/* Payment methods — FIX 4: redirect to WPP */}
        <div style={{ textAlign: "center", marginTop: 80 }}>
          <h3 className="bebas" style={{ fontSize: 32, color: "var(--text)", marginBottom: 24 }}>Métodos de pagamento</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, maxWidth: 600, margin: "0 auto" }}>
          {paymentMethods.map((m) => (
            <div key={m.name} onClick={() => openWpp(m.name)} className="glass" style={{ aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all .3s", filter: "grayscale(1)" }}>
              {m.display}
            </div>
          ))}
        </div>
      </section>

      {/* Availability calendar */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 className="bebas" style={{ fontSize: 36, color: "var(--text)", marginBottom: 8 }}>Disponibilidade</h2>
          <p style={{ fontSize: 13, color: "var(--text3)" }}>Horários ocupados este mês (09h–22h)</p>
        </div>
        <div className="db-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <input type="month" value={currentMonth} onChange={(e) => setCurrentMonth(e.target.value)} style={{ background: "rgba(255,255,255,.04)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 16px", color: "var(--text)", fontSize: 14 }} />
          </div>
          {slots.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {slots.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", background: "rgba(239,68,68,.06)", borderRadius: 8, border: "1px solid rgba(239,68,68,.15)" }}>
                  <span style={{ fontSize: 12, color: "var(--text)", fontWeight: 500 }}>{s.data}</span>
                  <span style={{ fontSize: 12, color: "#f87171" }}>{s.hora_inicio} – {s.hora_fim}</span>
                  <span style={{ fontSize: 10, color: "var(--text3)" }}>ocupado</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "var(--text3)", fontSize: 13, padding: "24px 0" }}>Sem sessões neste mês — tudo disponível!</p>
          )}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text3)" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(239,68,68,.5)" }} />Ocupado
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text3)" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(74,222,128,.5)" }} />Disponível
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}} @media(max-width:768px){[style*="grid-template-columns: repeat(3"]{grid-template-columns:1fr!important}[style*="grid-template-columns: repeat(4"]{grid-template-columns:repeat(2,1fr)!important}}` }} />
    </div>
  );
}
