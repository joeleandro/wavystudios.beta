"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError("Credenciais inválidas");
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      router.push(profile?.role === "admin" ? "/admin" : "/dashboard");
    }
  }

  async function quickLogin(role: "admin" | "cliente") {
    setError("");
    setLoading(true);
    const testEmail = role === "admin" ? "admin@wavystudios.pt" : "cliente@wavystudios.pt";
    const testPass = role === "admin" ? "admin123" : "cliente123";

    // First try to login
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPass,
    });

    if (authError) {
      // Account doesn't exist — try to create it via setup
      setSeedMsg("A criar contas de teste... (pode demorar ~5s)");
      try {
        const res = await fetch("/api/setup");
        const data = await res.json();
        setSeedMsg("");

        if (!res.ok) {
          setError(`Erro ao criar contas: ${data.error || "Verifica a configuração do Supabase."}`);
          setLoading(false);
          return;
        }

        // Retry login
        const { error: retryErr } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPass,
        });

        if (retryErr) {
          setError(`Contas criadas mas login falhou. Tenta: ${testEmail} / ${testPass}`);
          setLoading(false);
          return;
        }
      } catch {
        setSeedMsg("");
        setError(`Conta "${role}" não existe. Vai a /api/seed para criar as contas de teste.`);
        setLoading(false);
        return;
      }
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      router.push(profile?.role === "admin" ? "/admin" : "/dashboard");
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh" }}>
      {/* LEFT BRAND PANEL — with animated background */}
      <div className="login-left">
        <div className="login-left-bg" />
        {/* Animated orbs */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "20%", left: "30%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,180,168,.15) 0%, transparent 60%)", animation: "hero-orb1 10s ease-in-out infinite alternate" }} />
          <div style={{ position: "absolute", bottom: "10%", right: "20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.04) 0%, transparent 50%)", animation: "hero-orb2 14s ease-in-out infinite alternate" }} />
          <div style={{ position: "absolute", top: "60%", left: "10%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,0,0,.2) 0%, transparent 70%)", animation: "hero-orb3 8s ease-in-out infinite alternate" }} />
        </div>
        <svg className="login-left-geo" viewBox="0 0 800 800">
          <path d="M400,0 L800,400 L400,800 L0,400 Z" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="1" />
          <circle cx="400" cy="400" r="300" fill="none" stroke="rgba(255,255,255,.08)" strokeDasharray="10 20" strokeWidth="0.8" />
        </svg>
        <div className="login-brand">
          <div className="login-brand-name bebas">Wavy<br />Studios</div>
          <div className="login-brand-sub">Captação &amp; Produção · Lisboa · Porto</div>
          <div className="login-brand-quote">Onde cada sessão te aproxima do som que tens na cabeça.</div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes hero-orb1 { from { transform: translate(0, 0) scale(1); opacity: .7; } to { transform: translate(-20px, 15px) scale(1.1); opacity: 1; } }
          @keyframes hero-orb2 { from { transform: translate(0, 0) scale(1); opacity: .5; } to { transform: translate(15px, -10px) scale(1.1); opacity: .8; } }
          @keyframes hero-orb3 { from { transform: scale(1); opacity: .6; } to { transform: scale(1.2); opacity: 1; } }
        `}} />
      </div>

      {/* RIGHT FORM */}
      <div className="login-right">
        <div className="login-box">
          <div className="login-title bebas">Bem-vindo de volta</div>

          <form onSubmit={handleSubmit}>
            <div className="login-group">
              <label className="login-label">Email</label>
              <input className="login-input" type="email" placeholder="email@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="login-group">
              <label className="login-label">Password</label>
              <input className="login-input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {error && (
              <div style={{ fontSize: 12, color: "#f87171", textAlign: "center", padding: "8px 12px", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 6, marginTop: 8 }}>{error}</div>
            )}

            <button className="login-btn" type="submit" disabled={loading} style={{ marginTop: 28 }}>
              {loading ? <span>A entrar...</span> : (<><span className="material-symbols-outlined" style={{ fontSize: 18 }}>login</span>Entrar</>)}
            </button>
          </form>

          {/* Test accounts */}
          <div style={{ marginTop: 28, borderTop: "1px solid var(--border)", paddingTop: 20 }}>
            <p style={{ fontSize: 10, textAlign: "center", color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 4 }}>Contas de teste</p>
            <p style={{ fontSize: 11, textAlign: "center", color: "var(--text3)", marginBottom: 12, lineHeight: 1.5 }}>
              Se não existirem, serão criadas automaticamente
            </p>

            {seedMsg && (
              <div style={{ fontSize: 12, textAlign: "center", color: "#facc15", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, animation: "wf-rot 1s linear infinite" }}>sync</span>
                {seedMsg}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <button
                type="button"
                onClick={() => quickLogin("admin")}
                disabled={loading}
                style={{ fontSize: 10, padding: "10px 12px", borderRadius: 6, border: "1px solid rgba(139,0,0,.3)", color: "var(--primary)", background: "rgba(139,0,0,.08)", cursor: "pointer", textTransform: "uppercase", letterSpacing: ".15em", transition: "all .2s", opacity: loading ? 0.6 : 1 }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14, display: "block", marginBottom: 4 }}>admin_panel_settings</span>
                Admin
                <div style={{ fontSize: 9, opacity: 0.6, marginTop: 2, textTransform: "none", letterSpacing: 0 }}>admin@wavystudios.pt</div>
              </button>
              <button
                type="button"
                onClick={() => quickLogin("cliente")}
                disabled={loading}
                style={{ fontSize: 10, padding: "10px 12px", borderRadius: 6, border: "1px solid var(--border)", color: "var(--text2)", background: "rgba(255,255,255,.03)", cursor: "pointer", textTransform: "uppercase", letterSpacing: ".15em", transition: "all .2s", opacity: loading ? 0.6 : 1 }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14, display: "block", marginBottom: 4 }}>person</span>
                Cliente
                <div style={{ fontSize: 9, opacity: 0.6, marginTop: 2, textTransform: "none", letterSpacing: 0 }}>cliente@wavystudios.pt</div>
              </button>
            </div>
          </div>

          <div style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: "var(--text3)" }}>
            Não tens conta? <Link href="/cadastro" style={{ color: "var(--primary)", fontWeight: 600 }}>Criar conta</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
