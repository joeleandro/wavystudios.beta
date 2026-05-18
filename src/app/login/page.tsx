"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlobalEffects } from "@/components/site/global-effects";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"client" | "admin">("client");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      setError("Credenciais inválidas");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/session");
    const session = await res.json();

    if (session?.user?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/cliente");
    }
  }

  return (
    <>
      <GlobalEffects />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh" }}>
        {/* LEFT BRAND PANEL */}
        <div className="login-left">
          <div className="login-left-bg" />
          <svg className="login-left-geo" viewBox="0 0 800 800">
            <path d="M400,0 L800,400 L400,800 L0,400 Z" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="1" />
            <circle cx="400" cy="400" r="300" fill="none" stroke="rgba(255,255,255,.08)" strokeDasharray="10 20" strokeWidth="0.8" />
          </svg>
          <div className="login-brand">
            <div className="login-brand-name bebas">SG<br />Studio</div>
            <div className="login-brand-sub">Sound &amp; Vision · Lisboa</div>
            <div className="login-brand-quote">&ldquo;O estúdio onde o som encontra a sua forma definitiva.&rdquo;</div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="login-right">
          <div className="login-box">
            <div className="login-tabs">
              <div className={`login-tab ${tab === "client" ? "active-tab" : ""}`} onClick={() => setTab("client")}>Cliente</div>
              <div className={`login-tab ${tab === "admin" ? "active-tab" : ""}`} onClick={() => setTab("admin")}>Admin</div>
            </div>

            <div className="login-title bebas">{tab === "admin" ? "Painel Admin" : "Bem-vindo de volta"}</div>

            <form onSubmit={handleSubmit}>
              <div className="login-group">
                <label className="login-label">Email</label>
                <input
                  className="login-input"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="login-group">
                <label className="login-label">Password</label>
                <input
                  className="login-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div style={{ fontSize: 12, color: "#f87171", textAlign: "center", padding: "8px 12px", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 6, marginTop: 8 }}>
                  {error}
                </div>
              )}

              <button className="login-btn" type="submit" disabled={loading} style={{ marginTop: 28 }}>
                {loading ? (
                  <span>A entrar...</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>login</span>
                    Entrar
                  </>
                )}
              </button>
            </form>

            {/* Demo credentials */}
            <div style={{ marginTop: 28, borderTop: "1px solid var(--border)", paddingTop: 20 }}>
              <p style={{ fontSize: 10, textAlign: "center", color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 12 }}>Contas de demonstração</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => { setEmail("admin@wavystudios.com"); setPassword("admin123"); setTab("admin"); }}
                  style={{ fontSize: 10, padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)", color: "var(--text3)", background: "transparent", cursor: "pointer", textTransform: "uppercase", letterSpacing: ".15em" }}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail("joao@email.com"); setPassword("cliente123"); setTab("client"); }}
                  style={{ fontSize: 10, padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)", color: "var(--text3)", background: "transparent", cursor: "pointer", textTransform: "uppercase", letterSpacing: ".15em" }}
                >
                  Cliente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
