"use client";

import { useState } from "react";
import Link from "next/link";

const SQL = `-- COPIA E COLA TUDO ISTO NO SUPABASE SQL EDITOR

-- 1. Drop tudo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP TABLE IF EXISTS notificacoes CASCADE;
DROP TABLE IF EXISTS pagamentos CASCADE;
DROP TABLE IF EXISTS sessoes CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS planos CASCADE;

-- 2. Planos
CREATE TABLE planos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  preco_mensal DECIMAL(10,2) NOT NULL,
  horas_semanais INTEGER NOT NULL,
  horas_mensais INTEGER NOT NULL,
  duracao_sessao_min INTEGER NOT NULL,
  mix_master_mes INTEGER DEFAULT 2,
  sessao_foto BOOLEAN DEFAULT false,
  instrumental BOOLEAN DEFAULT false,
  direcao_criativa BOOLEAN DEFAULT false,
  pagamento_5050 BOOLEAN DEFAULT false,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO planos (id, nome, preco_mensal, horas_semanais, horas_mensais, duracao_sessao_min, mix_master_mes, sessao_foto, instrumental, direcao_criativa, pagamento_5050) VALUES
  (1, 'Standard',     150, 4, 16, 60,  2,  false, false, false, false),
  (2, 'Professional', 190, 6, 24, 90,  2,  false, false, false, false),
  (3, 'Avançado',     250, 8, 32, 120, 99, true,  true,  true,  true);

-- 3. Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT,
  telefone TEXT,
  plano_id INTEGER REFERENCES planos(id) ON DELETE SET NULL,
  role TEXT DEFAULT 'cliente' CHECK (role IN ('cliente', 'admin')),
  data_inicio DATE,
  data_renovacao DATE,
  estado TEXT DEFAULT 'pendente' CHECK (estado IN ('pendente', 'ativo', 'suspenso', 'cancelado')),
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, nome, telefone) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'telefone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 4. Sessoes
CREATE TABLE sessoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tipo TEXT DEFAULT 'captacao',
  data DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  duracao_minutos INTEGER NOT NULL,
  produtor TEXT,
  estado TEXT DEFAULT 'pendente' CHECK (estado IN ('pendente', 'confirmada', 'recusada', 'cancelada', 'concluida')),
  notas TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessoes_data_hora ON sessoes(data, hora_inicio, hora_fim);
CREATE INDEX idx_sessoes_cliente ON sessoes(cliente_id);

-- 5. Pagamentos
CREATE TABLE pagamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  valor DECIMAL(10,2) NOT NULL,
  metodo TEXT,
  referencia TEXT,
  mes_referente DATE,
  confirmado BOOLEAN DEFAULT false,
  confirmado_em TIMESTAMPTZ,
  notas TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Notificacoes
CREATE TABLE notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sessao_id UUID REFERENCES sessoes(id) ON DELETE CASCADE,
  destinatario TEXT NOT NULL,
  tipo TEXT NOT NULL,
  canal TEXT NOT NULL DEFAULT 'dashboard',
  mensagem TEXT,
  lida BOOLEAN DEFAULT false,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- 7. RLS
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

ALTER TABLE planos ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "planos_read" ON planos FOR SELECT USING (true);
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id OR is_admin());
CREATE POLICY "sessoes_select" ON sessoes FOR SELECT USING (cliente_id = auth.uid() OR is_admin());
CREATE POLICY "sessoes_insert" ON sessoes FOR INSERT WITH CHECK (cliente_id = auth.uid() OR is_admin());
CREATE POLICY "sessoes_update" ON sessoes FOR UPDATE USING (cliente_id = auth.uid() OR is_admin());
CREATE POLICY "sessoes_delete" ON sessoes FOR DELETE USING (cliente_id = auth.uid() OR is_admin());
CREATE POLICY "notifs_select" ON notificacoes FOR SELECT USING (destinatario = auth.uid()::text OR (destinatario = 'admin' AND is_admin()));
CREATE POLICY "notifs_insert" ON notificacoes FOR INSERT WITH CHECK (true);
CREATE POLICY "pagamentos_admin_all" ON pagamentos FOR ALL USING (is_admin());
CREATE POLICY "pagamentos_client_select" ON pagamentos FOR SELECT USING (cliente_id = auth.uid());`;

export default function SetupPage() {
  const [setupResult, setSetupResult] = useState<any>(null);
  const [setupLoading, setSetupLoading] = useState(false);
  const [adminResult, setAdminResult] = useState<any>(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function runSetup() {
    setSetupLoading(true);
    try {
      const res = await fetch("/api/setup");
      const data = await res.json();
      setSetupResult(data);
    } catch (e: any) {
      setSetupResult({ error: e.message });
    }
    setSetupLoading(false);
  }

  async function makeAdmin() {
    setAdminLoading(true);
    try {
      const res = await fetch("/api/make-admin?secret=wavy2024");
      const data = await res.json();
      setAdminResult(data);
    } catch (e: any) {
      setAdminResult({ error: e.message });
    }
    setAdminLoading(false);
  }

  function copySQL() {
    navigator.clipboard.writeText(SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "60px 20px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 className="bebas" style={{ fontSize: 48, color: "var(--text)", marginBottom: 8 }}>Setup Wavy Studios</h1>
        <p style={{ fontSize: 14, color: "var(--text3)", marginBottom: 40 }}>
          Refazer base de dados e criar contas. Página privada — não a partilhes publicamente.
        </p>

        {/* STEP 1: Reset DB */}
        <div className="db-card" style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, color: "var(--text)", marginBottom: 8 }}>
            <span style={{ color: "var(--primary)" }}>1.</span> Reset Base de Dados
          </h2>
          <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 16, lineHeight: 1.6 }}>
            Vai ao <a href="https://supabase.com/dashboard" target="_blank" style={{ color: "var(--primary)", textDecoration: "underline" }}>Supabase Dashboard</a> → o teu projecto → <strong>SQL Editor</strong> → cola o SQL abaixo e clica <strong>Run</strong>.
          </p>
          <div style={{ position: "relative" }}>
            <textarea
              readOnly
              value={SQL}
              style={{
                width: "100%",
                minHeight: 200,
                fontFamily: "monospace",
                fontSize: 11,
                padding: 12,
                background: "rgba(0,0,0,.3)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                color: "var(--text2)",
                resize: "vertical",
              }}
            />
            <button
              onClick={copySQL}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                padding: "6px 12px",
                fontSize: 11,
                background: copied ? "rgba(34,197,94,.15)" : "rgba(139,0,0,.15)",
                border: copied ? "1px solid rgba(34,197,94,.3)" : "1px solid rgba(139,0,0,.3)",
                color: copied ? "#4ade80" : "var(--primary)",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 600,
                letterSpacing: ".1em",
                textTransform: "uppercase",
              }}
            >
              {copied ? "✓ Copiado" : "Copiar SQL"}
            </button>
          </div>
          <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 8 }}>
            ⚠️ Isto apaga todas as tabelas existentes. Os utilizadores em <code>auth.users</code> não são apagados.
          </p>
        </div>

        {/* STEP 2: Setup test accounts */}
        <div className="db-card" style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, color: "var(--text)", marginBottom: 8 }}>
            <span style={{ color: "var(--primary)" }}>2.</span> Criar contas de teste
          </h2>
          <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 16 }}>
            Cria as contas <code>admin@wavystudios.pt</code> e <code>cliente@wavystudios.pt</code>.
          </p>
          <button
            onClick={runSetup}
            disabled={setupLoading}
            style={{
              padding: "12px 24px",
              background: "var(--primary-c)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              opacity: setupLoading ? 0.6 : 1,
            }}
          >
            {setupLoading ? "A criar..." : "Executar Setup"}
          </button>
          {setupResult && (
            <pre style={{ marginTop: 16, padding: 12, background: "rgba(0,0,0,.3)", borderRadius: 8, fontSize: 11, color: "var(--text2)", overflow: "auto", maxHeight: 300 }}>
              {JSON.stringify(setupResult, null, 2)}
            </pre>
          )}
        </div>

        {/* STEP 3: Make current user admin */}
        <div className="db-card" style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, color: "var(--text)", marginBottom: 8 }}>
            <span style={{ color: "var(--primary)" }}>3.</span> Tornar a tua conta admin
          </h2>
          <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 16 }}>
            Tens de estar logado primeiro. Faz login na tua conta e depois clica abaixo.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/login" style={{ padding: "10px 20px", background: "rgba(255,255,255,.05)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, color: "var(--text)", textDecoration: "none" }}>
              Ir fazer login
            </Link>
            <button
              onClick={makeAdmin}
              disabled={adminLoading}
              style={{
                padding: "10px 20px",
                background: "rgba(139,0,0,.15)",
                border: "1px solid rgba(139,0,0,.3)",
                color: "var(--primary)",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                opacity: adminLoading ? 0.6 : 1,
              }}
            >
              {adminLoading ? "..." : "Tornar-me admin"}
            </button>
          </div>
          {adminResult && (
            <pre style={{ marginTop: 16, padding: 12, background: "rgba(0,0,0,.3)", borderRadius: 8, fontSize: 11, color: "var(--text2)", overflow: "auto" }}>
              {JSON.stringify(adminResult, null, 2)}
            </pre>
          )}
        </div>

        {/* STEP 4: Done */}
        <div className="db-card">
          <h2 style={{ fontSize: 18, color: "var(--text)", marginBottom: 8 }}>
            <span style={{ color: "var(--primary)" }}>4.</span> Pronto!
          </h2>
          <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 16, lineHeight: 1.6 }}>
            Vai ao <Link href="/admin" style={{ color: "var(--primary)" }}>painel admin</Link> e gere os teus clientes, sessões e pagamentos.
          </p>
          <p style={{ fontSize: 12, color: "var(--text3)" }}>
            Credenciais de teste:
            <br />Admin: <code>admin@wavystudios.pt</code> / <code>admin123</code>
            <br />Cliente: <code>cliente@wavystudios.pt</code> / <code>cliente123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
