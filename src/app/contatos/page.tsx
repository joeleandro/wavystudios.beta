"use client";

import { Navigation } from "@/components/site/navigation";
import { SiteFooter } from "@/components/site/footer";
import { GlobalEffects } from "@/components/site/global-effects";

export default function ContatosPage() {
  return (
    <>
      <GlobalEffects />
      <Navigation />
      <main>
        <div style={{ padding: "180px 64px 60px" }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".5em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 20 }}>Fala connosco</div>
          <h1 className="bebas" style={{ fontSize: "clamp(64px, 10vw, 140px)", lineHeight: .9, textTransform: "uppercase" }}>Contatos</h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, padding: "0 64px 120px" }}>
          {/* Form */}
          <div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--text3)", display: "block", marginBottom: 8 }}>Nome</label>
              <input className="login-input" type="text" placeholder="O teu nome" />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--text3)", display: "block", marginBottom: 8 }}>Email</label>
              <input className="login-input" type="email" placeholder="email@exemplo.com" />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--text3)", display: "block", marginBottom: 8 }}>Assunto</label>
              <input className="login-input" type="text" placeholder="Subscrição, sessão, parceria..." />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--text3)", display: "block", marginBottom: 8 }}>Mensagem</label>
              <textarea className="login-input" style={{ minHeight: 140, resize: "none" }} placeholder="Conta-nos mais..." />
            </div>
            <button className="login-btn" style={{ marginTop: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>
              Enviar Mensagem
            </button>
          </div>

          {/* Info */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".3em", textTransform: "uppercase", color: "var(--primary-c)", marginBottom: 24 }}>Informações</div>
            {[
              { icon: "location_on", label: "Endereço", value: "Rua do Som, 100 · Lisboa" },
              { icon: "phone", label: "Telefone / WhatsApp", value: "+351 912 345 678" },
              { icon: "mail", label: "Email", value: "mail@sgstudio.pt" },
              { icon: "schedule", label: "Horário", value: "Seg–Sáb · 10h00 – 22h00" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 32 }}>
                <div style={{ width: 44, height: 44, background: "rgba(139,0,0,.1)", border: "1px solid rgba(139,0,0,.2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 15, color: "var(--text2)" }}>{item.value}</div>
                </div>
              </div>
            ))}

            <div style={{ background: "rgba(139,0,0,.06)", border: "1px solid rgba(139,0,0,.2)", borderRadius: 12, padding: 24, marginTop: 24 }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".28em", textTransform: "uppercase", color: "var(--primary)", marginBottom: 12 }}>Resposta rápida</div>
              <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text2)", lineHeight: 1.8, marginBottom: 16 }}>Para questões urgentes ou para iniciar uma subscrição, fala connosco diretamente pelo WhatsApp.</p>
              <button className="login-btn" style={{ background: "rgba(37,211,102,.15)", border: "1px solid rgba(37,211,102,.3)", color: "rgba(37,211,102,.9)" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chat</span>
                Abrir WhatsApp
              </button>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
