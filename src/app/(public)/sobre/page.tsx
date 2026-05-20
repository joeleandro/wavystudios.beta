"use client";

import { useState } from "react";

const stats = [
  { val: "100+", label: "Artistas" },
  { val: "400+", label: "Sessões" },
  { val: "2", label: "Estúdios" },
  { val: "60M+", label: "Views" },
];

export default function SobrePage() {
  const [form, setForm] = useState({ nome: "", email: "", assunto: "", mensagem: "" });
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
      {/* ── About ── */}
      <section className="sobre-section">
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span className="section-eyebrow">Quem somos</span>
          <h1 className="bebas" style={{ fontSize: "clamp(40px, 8vw, 80px)", color: "var(--text)" }}>
            SOBRE NÓS
          </h1>
        </div>

        <div className="sobre-intro-grid">
          <div>
            <p style={{ fontSize: "clamp(14px, 1.8vw, 16px)", color: "var(--text2)", lineHeight: 1.95, marginBottom: 22 }}>
              Wavy Studios is a creative music studio founded by{" "}
              <strong style={{ color: "var(--text)" }}>Joshua Tavares</strong> in London on May 25th, 2021.
            </p>
            <p style={{ fontSize: "clamp(14px, 1.8vw, 16px)", color: "var(--text2)", lineHeight: 1.95, marginBottom: 22 }}>
              Now based between Lisbon and Porto, Wavy Studios was built to offer more than a traditional recording experience — combining music, atmosphere, emotion and artistic identity into one immersive creative space.
            </p>
            <p style={{ fontSize: "clamp(14px, 1.8vw, 16px)", color: "var(--text2)", lineHeight: 1.95, marginBottom: 22 }}>
              Rooted in afro-lusophone culture and inspired by modern global sound, Wavy blends recording, production, mix & master and creative direction for a new generation of artists shaping the future of urban music.
            </p>
            <p style={{ fontSize: "clamp(14px, 1.8vw, 16px)", color: "var(--text2)", lineHeight: 1.95, marginBottom: 22 }}>
              From Rap and Trap to Afrobeat, Amapiano and Zouk, every project is approached with intention, detail and soul. Through sound design, recording, production and artistic direction, we help shape authentic projects with depth & identity.
            </p>
            <p style={{ fontSize: "clamp(15px, 1.8vw, 17px)", color: "var(--text)", lineHeight: 1.9, fontStyle: "italic", fontWeight: 500 }}>
              More than a studio, We Are The Wave.
            </p>
          </div>
          <div className="sobre-team-photo">
            <span style={{ fontSize: 12, color: "var(--text3)" }}>Foto da equipa</span>
          </div>
        </div>

        {/* Stats — 4 cols */}
        <div className="sobre-stats-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {stats.map((s) => (
            <div key={s.label} className="glass sobre-stat-card">
              <div className="bebas" style={{ fontSize: "clamp(28px, 4vw, 44px)", color: "var(--text)" }}>
                {s.val}
              </div>
              <div style={{ fontSize: 11, color: "var(--text3)", letterSpacing: ".15em", textTransform: "uppercase", marginTop: 4 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="sobre-contact-section" id="contacto" style={{ borderTop: "1px solid var(--border)" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 className="bebas" style={{ fontSize: "clamp(32px, 6vw, 64px)", color: "var(--text)", marginBottom: 12 }}>
            CONTACTO
          </h2>
          <p style={{ fontSize: 14, color: "var(--text3)" }}>Entra em contacto connosco</p>
        </div>

        <div className="sobre-contact-grid">
          <form onSubmit={handleSubmit}>
            {[
              { key: "nome", label: "Nome", type: "text" },
              { key: "email", label: "Email", type: "email" },
              { key: "assunto", label: "Assunto", type: "text" },
            ].map(({ key, label, type }) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <label className="login-label">{label}</label>
                <input className="login-input" type={type} value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required />
              </div>
            ))}
            <div style={{ marginBottom: 16 }}>
              <label className="login-label">Mensagem</label>
              <textarea className="login-input" style={{ minHeight: 120, resize: "vertical" }} value={form.mensagem} onChange={(e) => setForm({ ...form, mensagem: e.target.value })} required />
            </div>
            {status && <p style={{ fontSize: 13, color: "#4ade80", marginBottom: 12 }}>{status}</p>}
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "A enviar..." : "Enviar Mensagem"}
            </button>
          </form>

          <div className="sobre-contact-info">
            <div style={{ marginBottom: 32 }}>
              <div className="sobre-info-label">Email</div>
              <a href="mailto:wavystudiosinfo@gmail.com" style={{ fontSize: 15, color: "var(--primary)", textDecoration: "none" }}>wavystudiosinfo@gmail.com</a>
            </div>
            <div style={{ marginBottom: 32 }}>
              <div className="sobre-info-label">WhatsApp</div>
              <a href="https://wa.me/351939910528" target="_blank" rel="noopener noreferrer" style={{ fontSize: 15, color: "var(--primary)", textDecoration: "none" }}>+351 939 910 528</a>
            </div>
            <div style={{ marginBottom: 32 }}>
              <div className="sobre-info-label">Lisboa — Nave</div>
              <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.8 }}>
                Praceta João de Lemos 2A<br />Odivelas, 2675-233 Lisboa
              </p>
            </div>
            <div>
              <div className="sobre-info-label">Porto — Cube</div>
              <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.8 }}>
                Rua dos Mártires da Liberdade<br />4050 Porto
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
