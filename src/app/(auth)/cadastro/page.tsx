"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) { setError("Password deve ter no mínimo 8 caracteres"); return; }
    if (password !== confirmPassword) { setError("Passwords não coincidem"); return; }
    if (!telefone) { setError("Telefone é obrigatório"); return; }

    setLoading(true);

    // 1. Create auth user
    const { data: signUpData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nome, telefone },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (authError) {
      setError(authError.message === "User already registered" ? "Email já registado" : authError.message);
      setLoading(false);
      return;
    }

    // 2. If user was created AND is immediately confirmed (email confirm disabled),
    //    sign them in and call the server-side profile API (bypasses RLS)
    if (signUpData?.user && signUpData.session) {
      // User is already signed in (email confirmation disabled)
      try {
        await fetch("/api/profile", { method: "POST" });
      } catch {
        // Non-fatal — dashboard will retry
      }
    } else if (signUpData?.user && !signUpData.session) {
      // Email confirmation required — sign in manually to get a session
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (!signInError) {
        try {
          await fetch("/api/profile", { method: "POST" });
        } catch {
          // Non-fatal
        }
      }
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: 24 }}>
        <div style={{ maxWidth: 440, textAlign: "center" }}>
          <div style={{ width: 64, height: 64, background: "rgba(34,197,94,.12)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 32, color: "#4ade80" }}>check_circle</span>
          </div>
          <h2 className="bebas" style={{ fontSize: 36, marginBottom: 12, color: "var(--text)" }}>Conta criada!</h2>
          <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.8, marginBottom: 16 }}>
            A tua conta foi registada com sucesso.
          </p>
          <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 24, lineHeight: 1.7 }}>
            O admin irá atribuir um plano e ativar a tua subscrição. Já podes entrar no dashboard.
          </p>
          <Link href="/dashboard" className="login-btn" style={{ display: "inline-flex", width: "auto", padding: "12px 32px" }}>
            Entrar no Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh" }}>
      <div className="login-left">
        <div className="login-left-bg" />
        <svg className="login-left-geo" viewBox="0 0 800 800">
          <path d="M400,0 L800,400 L400,800 L0,400 Z" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="1" />
          <circle cx="400" cy="400" r="300" fill="none" stroke="rgba(255,255,255,.08)" strokeDasharray="10 20" strokeWidth="0.8" />
        </svg>
        <div className="login-brand">
          <div className="login-brand-name bebas">Wavy<br />Studios</div>
          <div className="login-brand-sub">Cria a tua conta</div>
          <div className="login-brand-quote">Após o registo, o admin atribui o plano e tens acesso imediato ao dashboard.</div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-box">
          <div className="login-title bebas">Criar conta</div>

          <form onSubmit={handleSubmit}>
            <div className="login-group">
              <label className="login-label">Nome completo</label>
              <input className="login-input" type="text" placeholder="O teu nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>
            <div className="login-group">
              <label className="login-label">Email</label>
              <input className="login-input" type="email" placeholder="email@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="login-group">
              <label className="login-label">Telefone (WhatsApp)</label>
              <input className="login-input" type="tel" placeholder="+351 9XX XXX XXX" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
            </div>
            <div className="login-group">
              <label className="login-label">Password</label>
              <input className="login-input" type="password" placeholder="Mín. 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="login-group">
              <label className="login-label">Confirmar Password</label>
              <input className="login-input" type="password" placeholder="Repetir password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>

            {error && (
              <div style={{ fontSize: 12, color: "#f87171", padding: "8px 12px", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 6, marginTop: 8 }}>{error}</div>
            )}

            <button className="login-btn" type="submit" disabled={loading} style={{ marginTop: 20 }}>
              {loading ? <span>A criar...</span> : (<><span className="material-symbols-outlined" style={{ fontSize: 18 }}>person_add</span>Criar Conta</>)}
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: "var(--text3)" }}>
            Já tens conta? <Link href="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Entrar</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
