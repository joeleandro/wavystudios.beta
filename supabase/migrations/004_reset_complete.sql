-- ════════════════════════════════════════════════════════════════════
-- WAVY STUDIOS — COMPLETE DATABASE RESET
-- ════════════════════════════════════════════════════════════════════
-- Run this in Supabase SQL Editor to RESET EVERYTHING.
-- WARNING: This deletes ALL data. Backup first if needed.
-- ════════════════════════════════════════════════════════════════════

-- 1. Drop all existing tables and triggers (cascade)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;

DROP TABLE IF EXISTS notificacoes CASCADE;
DROP TABLE IF EXISTS pagamentos CASCADE;
DROP TABLE IF EXISTS sessoes CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS planos CASCADE;

-- ════════════════════════════════════════════════════════════════════
-- 2. CREATE TABLES
-- ════════════════════════════════════════════════════════════════════

-- PLANOS
CREATE TABLE planos (
  id                    SERIAL PRIMARY KEY,
  nome                  TEXT NOT NULL,
  preco_mensal          DECIMAL(10,2) NOT NULL,
  horas_semanais        INTEGER NOT NULL,
  horas_mensais         INTEGER NOT NULL,
  duracao_sessao_min    INTEGER NOT NULL,
  mix_master_mes        INTEGER DEFAULT 2,
  sessao_foto           BOOLEAN DEFAULT false,
  instrumental          BOOLEAN DEFAULT false,
  direcao_criativa      BOOLEAN DEFAULT false,
  pagamento_5050        BOOLEAN DEFAULT false,
  criado_em             TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO planos (id, nome, preco_mensal, horas_semanais, horas_mensais, duracao_sessao_min, mix_master_mes, sessao_foto, instrumental, direcao_criativa, pagamento_5050) VALUES
  (1, 'Standard',     150, 4, 16, 60,  2,  false, false, false, false),
  (2, 'Professional', 190, 6, 24, 90,  2,  false, false, false, false),
  (3, 'Avançado',     250, 8, 32, 120, 99, true,  true,  true,  true);

-- PROFILES
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome            TEXT,
  telefone        TEXT,
  plano_id        INTEGER REFERENCES planos(id) ON DELETE SET NULL,
  role            TEXT DEFAULT 'cliente' CHECK (role IN ('cliente', 'admin')),
  data_inicio     DATE,
  data_renovacao  DATE,
  estado          TEXT DEFAULT 'pendente' CHECK (estado IN ('pendente', 'ativo', 'suspenso', 'cancelado')),
  criado_em       TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, nome, telefone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'telefone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- SESSOES
CREATE TABLE sessoes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id        UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tipo              TEXT DEFAULT 'captacao',
  data              DATE NOT NULL,
  hora_inicio       TIME NOT NULL,
  hora_fim          TIME NOT NULL,
  duracao_minutos   INTEGER NOT NULL,
  produtor          TEXT,
  estado            TEXT DEFAULT 'pendente' CHECK (estado IN ('pendente', 'confirmada', 'recusada', 'cancelada', 'concluida')),
  notas             TEXT,
  criado_em         TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessoes_data_hora ON sessoes(data, hora_inicio, hora_fim);
CREATE INDEX idx_sessoes_cliente ON sessoes(cliente_id);

-- PAGAMENTOS
CREATE TABLE pagamentos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id      UUID REFERENCES profiles(id) ON DELETE CASCADE,
  valor           DECIMAL(10,2) NOT NULL,
  metodo          TEXT,
  referencia      TEXT,
  mes_referente   DATE,
  confirmado      BOOLEAN DEFAULT false,
  confirmado_em   TIMESTAMPTZ,
  notas           TEXT,
  criado_em       TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICACOES
CREATE TABLE notificacoes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sessao_id       UUID REFERENCES sessoes(id) ON DELETE CASCADE,
  destinatario    TEXT NOT NULL,
  tipo            TEXT NOT NULL,
  canal           TEXT NOT NULL DEFAULT 'dashboard',
  mensagem        TEXT,
  lida            BOOLEAN DEFAULT false,
  criado_em       TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════════════════════════════════
-- 3. ROW LEVEL SECURITY (RLS)
-- ════════════════════════════════════════════════════════════════════

-- Helper function: check if current user is admin (avoids recursion)
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Enable RLS on all tables
ALTER TABLE planos        ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessoes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos    ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes  ENABLE ROW LEVEL SECURITY;

-- PLANOS: everyone can read
CREATE POLICY "planos_read" ON planos
  FOR SELECT USING (true);

-- PROFILES: own profile or admin sees all
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (auth.uid() = id OR is_admin());

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id OR is_admin());

-- SESSOES: clients see/manage their own; admins see all
CREATE POLICY "sessoes_select" ON sessoes
  FOR SELECT USING (cliente_id = auth.uid() OR is_admin());

CREATE POLICY "sessoes_insert" ON sessoes
  FOR INSERT WITH CHECK (cliente_id = auth.uid() OR is_admin());

CREATE POLICY "sessoes_update" ON sessoes
  FOR UPDATE USING (cliente_id = auth.uid() OR is_admin());

CREATE POLICY "sessoes_delete" ON sessoes
  FOR DELETE USING (cliente_id = auth.uid() OR is_admin());

-- NOTIFICACOES
CREATE POLICY "notifs_select" ON notificacoes
  FOR SELECT USING (
    destinatario = auth.uid()::text
    OR (destinatario = 'admin' AND is_admin())
  );

CREATE POLICY "notifs_insert" ON notificacoes
  FOR INSERT WITH CHECK (true);

-- PAGAMENTOS: only admins manage; clients see their own
CREATE POLICY "pagamentos_admin_all" ON pagamentos
  FOR ALL USING (is_admin());

CREATE POLICY "pagamentos_client_select" ON pagamentos
  FOR SELECT USING (cliente_id = auth.uid());

-- ════════════════════════════════════════════════════════════════════
-- ✅ DONE. Now go to /api/setup to create test accounts.
-- ════════════════════════════════════════════════════════════════════
