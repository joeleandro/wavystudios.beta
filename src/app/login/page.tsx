"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Credenciais inválidas");
      setLoading(false);
      return;
    }

    // Fetch session to check role
    const res = await fetch("/api/auth/session");
    const session = await res.json();
    
    if (session?.user?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/cliente");
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10">
          <svg className="w-full h-full animate-spin" style={{ animationDuration: "60s" }} viewBox="0 0 1000 1000">
            <path d="M500,50 L950,500 L500,950 L50,500 Z" fill="none" stroke="#8b0000" strokeWidth="0.5" />
            <circle cx="500" cy="500" r="350" fill="none" stroke="#8b0000" strokeDasharray="10 20" strokeWidth="0.3" />
            <path d="M500,150 L850,500 L500,850 L150,500 Z" fill="none" stroke="#8b0000" strokeWidth="0.2" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-container/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-container/3 rounded-full blur-[100px]" />
      </div>

      {/* Film grain overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.04] mix-blend-overlay"
        style={{ 
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" 
        }} 
      />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 glass-card rounded-2xl flex items-center justify-center mb-6 burgundy-glow">
            <span className="font-[var(--font-display)] text-3xl text-primary tracking-wider">W</span>
          </div>
          <h1 className="font-[var(--font-display)] text-4xl text-headline tracking-wider uppercase">
            Wavy Studios
          </h1>
          <p className="text-label-opacity text-xs uppercase tracking-[0.4em] mt-2">
            Plataforma de Gestão
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-label-opacity">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container border border-white/5 rounded-lg px-4 py-3 text-sm text-on-surface placeholder:text-white/20 focus:outline-none focus:border-primary-container/50 focus:ring-1 focus:ring-primary-container/20 transition-all"
              placeholder="mail@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-label-opacity">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container border border-white/5 rounded-lg px-4 py-3 text-sm text-on-surface placeholder:text-white/20 focus:outline-none focus:border-primary-container/50 focus:ring-1 focus:ring-primary-container/20 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="text-error text-xs text-center py-2 px-3 bg-error-container/10 rounded-lg border border-error-container/20">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-container hover:bg-primary-container/80 text-white py-3.5 rounded-lg text-xs font-semibold uppercase tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-not-allowed burgundy-glow"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                A entrar...
              </span>
            ) : (
              "Entrar"
            )}
          </button>

          {/* Demo credentials */}
          <div className="pt-4 border-t border-white/5 space-y-3">
            <p className="text-[10px] text-center text-label-opacity uppercase tracking-[0.15em]">
              Contas de demonstração
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setEmail("admin@wavystudios.com"); setPassword("admin123"); }}
                className="text-[10px] py-2 px-3 rounded-lg border border-white/5 text-label-opacity hover:text-white hover:border-primary-container/30 transition-all uppercase tracking-wider"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => { setEmail("joao@email.com"); setPassword("cliente123"); }}
                className="text-[10px] py-2 px-3 rounded-lg border border-white/5 text-label-opacity hover:text-white hover:border-primary-container/30 transition-all uppercase tracking-wider"
              >
                Cliente
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-[9px] text-white/20 uppercase tracking-[0.3em] mt-8">
          © 2024 Wavy Studios — Future Based Design
        </p>
      </div>
    </div>
  );
}
