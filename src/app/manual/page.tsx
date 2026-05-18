"use client";

import { useState } from "react";
import { Navigation } from "@/components/site/navigation";
import { SiteFooter } from "@/components/site/footer";
import { GlobalEffects } from "@/components/site/global-effects";

const sections = [
  { id: "how", label: "Como funciona", content: (
    <>
      <h2 className="bebas" style={{ fontSize: 40, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 20, borderBottom: "1px solid var(--border)", paddingBottom: 16 }}>Como funciona</h2>
      <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text2)", lineHeight: 1.9, marginBottom: 14 }}>O SG Studio funciona por sistema de subscrição mensal. Após a confirmação do pagamento via WhatsApp, o admin ativa o teu plano e tens acesso imediato ao dashboard para marcares as tuas sessões.</p>
      <div style={{ background: "rgba(139,0,0,.08)", border: "1px solid rgba(139,0,0,.2)", borderLeft: "3px solid var(--primary-c)", borderRadius: "0 8px 8px 0", padding: "14px 18px", margin: "16px 0", fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}><strong style={{ color: "var(--primary)", fontWeight: 600 }}>Nota:</strong> O plano é ativado manualmente pelo admin após confirmação de pagamento.</div>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", margin: "24px 0 10px", letterSpacing: ".06em" }}>Passo a passo</h3>
      <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text2)", lineHeight: 1.9, marginBottom: 14 }}>1. Escolhe o teu plano na página de Serviços.</p>
      <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text2)", lineHeight: 1.9, marginBottom: 14 }}>2. Confirma o pagamento com o admin via WhatsApp.</p>
      <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text2)", lineHeight: 1.9, marginBottom: 14 }}>3. Recebes notificação quando o plano for ativado.</p>
      <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text2)", lineHeight: 1.9, marginBottom: 14 }}>4. Acede ao dashboard e marca as tuas sessões.</p>
    </>
  )},
  { id: "planos", label: "Planos", content: (
    <>
      <h2 className="bebas" style={{ fontSize: 40, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 20, borderBottom: "1px solid var(--border)", paddingBottom: 16 }}>Planos</h2>
      <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text2)", lineHeight: 1.9, marginBottom: 14 }}><strong style={{ color: "var(--text)" }}>Standard (€150/mês)</strong> — 4h semanais (16h mensais), sessões de 1h, 2 Mix/Masters incluídos.</p>
      <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text2)", lineHeight: 1.9, marginBottom: 14 }}><strong style={{ color: "var(--text)" }}>Professional (€190/mês)</strong> — 6h semanais (24h mensais), sessões de 1h30, 2 Mix/Masters incluídos.</p>
      <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text2)", lineHeight: 1.9, marginBottom: 14 }}><strong style={{ color: "var(--text)" }}>Avançado (€250/mês)</strong> — 8h semanais (32h mensais), sessões de 2h, sessão fotográfica, instrumental exclusivo e direção criativa.</p>
      <div style={{ background: "rgba(139,0,0,.08)", border: "1px solid rgba(139,0,0,.2)", borderLeft: "3px solid var(--primary-c)", borderRadius: "0 8px 8px 0", padding: "14px 18px", margin: "16px 0", fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}><strong style={{ color: "var(--primary)", fontWeight: 600 }}>Horas não acumuláveis:</strong> As horas não utilizadas não transitam para o mês seguinte.</div>
    </>
  )},
  { id: "regras", label: "Regras", content: (
    <>
      <h2 className="bebas" style={{ fontSize: 40, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 20, borderBottom: "1px solid var(--border)", paddingBottom: 16 }}>Regras</h2>
      <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text2)", lineHeight: 1.9, marginBottom: 14 }}>Não são efetuados reembolsos em nenhuma circunstância.</p>
      <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text2)", lineHeight: 1.9, marginBottom: 14 }}>Sessões canceladas pelo cliente não poderão ser remarcadas.</p>
      <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text2)", lineHeight: 1.9, marginBottom: 14 }}>As horas de utilização semanal não são acumuláveis.</p>
      <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text2)", lineHeight: 1.9, marginBottom: 14 }}>Todas as entregas devem ser pedidas no prazo máximo de 30 dias após a última sessão.</p>
    </>
  )},
  { id: "faq", label: "FAQ", content: (
    <>
      <h2 className="bebas" style={{ fontSize: 40, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 20, borderBottom: "1px solid var(--border)", paddingBottom: 16 }}>FAQ</h2>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", margin: "24px 0 10px" }}>Posso mudar de plano a meio do mês?</h3>
      <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text2)", lineHeight: 1.9, marginBottom: 14 }}>Sim, mas a mudança entra em vigor no mês seguinte. Fala com o admin via WhatsApp.</p>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", margin: "24px 0 10px" }}>O que acontece se chegar ao limite?</h3>
      <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text2)", lineHeight: 1.9, marginBottom: 14 }}>Não consegues marcar mais sessões. Podes fazer upgrade ou aguardar o mês seguinte.</p>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", margin: "24px 0 10px" }}>Em quanto tempo recebo confirmação?</h3>
      <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text2)", lineHeight: 1.9, marginBottom: 14 }}>O admin confirma normalmente em menos de 2 horas.</p>
    </>
  )},
];

export default function ManualPage() {
  const [active, setActive] = useState("how");

  return (
    <>
      <GlobalEffects />
      <Navigation />
      <main>
        <div style={{ padding: "180px 64px 60px" }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".5em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 20 }}>Documentação</div>
          <h1 className="bebas" style={{ fontSize: "clamp(64px, 10vw, 140px)", lineHeight: .9, textTransform: "uppercase" }}>Manual<br />do Cliente</h1>
          <p style={{ maxWidth: 540, fontSize: 16, fontWeight: 300, color: "var(--text2)", marginTop: 32, lineHeight: 1.8 }}>
            Tudo o que precisas saber sobre como funciona o estúdio e a plataforma.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 0, padding: "0 64px 120px" }}>
          <nav style={{ position: "sticky", top: 120, height: "fit-content", paddingRight: 40, borderRight: "1px solid var(--border)" }}>
            {sections.map((s) => (
              <span
                key={s.id}
                onClick={() => setActive(s.id)}
                style={{
                  display: "block", fontSize: 12, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase",
                  color: active === s.id ? "var(--primary)" : "var(--text3)",
                  padding: "10px 16px", borderRadius: 8, cursor: "pointer",
                  background: active === s.id ? "rgba(139,0,0,.08)" : "transparent",
                  borderLeft: active === s.id ? "2px solid var(--primary-c)" : "2px solid transparent",
                  transition: "all .2s", marginBottom: 4,
                }}
              >
                {s.label}
              </span>
            ))}
          </nav>
          <div style={{ paddingLeft: 60 }}>
            {sections.find(s => s.id === active)?.content}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
