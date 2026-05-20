"use client";

import { useState } from "react";

export default function SobrePage() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/contacto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setStatus(data.message || "Enviado!");
    setLoading(false);
    setForm({ nome: "", email: "", assunto: "", mensagem: "" });
  }

  return (
    <div style={{ paddingTop: 100 }}>
      {/* About */}
      <section className="sobre-section">
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span className="section-eyebrow">Quem somos</span>
          <h1
            className="bebas"
            style={{
              fontSize: "clamp(40px, 8vw, 80px)",
              color: "var(--text)",
            }}
          >
            SOBRE NÓS
          </h1>
        </div>

        <div className="sobre-intro-grid">
          <div>
            <p
              style={{
                fontSize: "clamp(14px, 2vw, 16px)",
                color: "var(--text2)",
                lineHeight: 1.9,
                marginBottom: 20,
              }}
            >
              A Wavy Studios nasceu em 2024 com uma missão clara: dar aos
              artistas um espaço onde o som encontra a sua forma definitiva.
            </p>
            <p
              style={{
                fontSize: "clamp(14px, 2vw, 16px)",
                color: "var(--text2)",
                lineHeight: 1.9,
                marginBottom: 20,
              }}
            >
              Com estúdios em Lisboa e Porto, oferecemos captação vocal, mix
              &amp; master, produção musical e direção criativa — tudo sob o
              mesmo teto.
            </p>
            <p
              style={{
                fontSize: "clamp(14px, 2vw, 16px)",
                color: "var(--text2)",
                lineHeight: 1.9,
              }}
            >
              A nossa visão é simples: cada artista merece ter acesso a
              qualidade profissional, com flexibilidade e sem barreiras.
            </p>
          </div>
          <div className="sobre-team-photo">
            <span style={{ fontSize: 12, color: "var(--text3)" }}>
              Foto da equipa
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="sobre-stats-grid">
          {[
            { val: "50+", label: "Artistas" },
            { val: "200+", label: "Sessões" },
            { val: "2", label: "Estúdios" },
          ].map((s) => (
            <div key={s.label} className="glass sobre-stat-card">
              <div
                className="bebas"
                style={{ fontSize: "clamp(36px, 6vw, 48px)", color: "var(--text)" }}
              >
                {s.val}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text3)",
                  letterSpacing: ".15em",
                  textTransform: "uppercase",
                  marginTop: 4,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section
        className="sobre-contact-section"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2
            className="bebas"
            style={{
              fontSize: "clamp(32px, 6vw, 64px)",
              color: "var(--text)",
              marginBottom: 12,
            }}
          >
            CONTACTO
          </h2>
          <p style={{ fontSize: 14, color: "var(--text3)" }}>
            Entra em contacto connosco
          </p>
        </div>

        <div className="sobre-contact-grid">
          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label className="login-label">Nome</label>
              <input
                className="login-input"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="login-label">Email</label>
              <input
                className="login-input"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="login-label">Assunto</label>
              <input
                className="login-input"
                value={form.assunto}
                onChange={(e) => setForm({ ...form, assunto: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="login-label">Mensagem</label>
              <textarea
                className="login-input"
                style={{ minHeight: 120, resize: "vertical" }}
                value={form.mensagem}
                onChange={(e) =>
                  setForm({ ...form, mensagem: e.target.value })
                }
                required
              />
            </div>
            {status && (
              <p
                style={{
                  fontSize: 13,
                  color: "#4ade80",
                  marginBottom: 12,
                }}
              >
                {status}
              </p>
            )}
            <button
              className="login-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "A enviar..." : "Enviar Mensagem"}
            </button>
          </form>

          {/* Info */}
          <div className="sobre-contact-info">
            <div style={{ marginBottom: 32 }}>
              <div className="sobre-info-label">Email</div>
              <p style={{ fontSize: 15, color: "var(--text2)" }}>
                wavystudiosinfo@gmail.com
              </p>
            </div>
            <div style={{ marginBottom: 32 }}>
              <div className="sobre-info-label">WhatsApp</div>
              <a
                href="https://wa.me/351939910528"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 15, color: "var(--primary)" }}
              >
                +351 939 910 528
              </a>
            </div>
            <div style={{ marginBottom: 32 }}>
              <div className="sobre-info-label">Lisboa</div>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--text2)",
                  lineHeight: 1.8,
                }}
              >
                Rua do Som, 100
                <br />
                1200-000 Lisboa
              </p>
            </div>
            <div>
              <div className="sobre-info-label">Porto</div>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--text2)",
                  lineHeight: 1.8,
                }}
              >
                Rua da Música, 50
                <br />
                4000-000 Porto
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
