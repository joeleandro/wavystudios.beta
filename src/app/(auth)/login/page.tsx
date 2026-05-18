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

    // Check role for redirect
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      router.push(profile?.role === "admin" ? "/admin" : "/dashboard");
    }
  }

  return (
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

          <div style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "var(--text3)" }}>
            Não tens conta? <Link href="/cadastro" style={{ color: "var(--primary)", fontWeight: 600 }}>Criar conta</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
