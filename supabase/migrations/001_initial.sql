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

INSERT INTO planos VALUES
  (1, 'Standard',     150, 4, 16, 60,  2, false, false, false, false),
  (2, 'Professional', 190, 6, 24, 90,  2, false, false, false, false),
  (3, 'Avançado',     250, 8, 32, 120, 99, true, true,  true,  true);

-- PROFILES (extends Supabase auth.users)
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome            TEXT,
  telefone        TEXT,
  plano_id        INTEGER REFERENCES planos(id),
  role            TEXT DEFAULT 'cliente',
  data_inicio     DATE,
  data_renovacao  DATE,
  estado          TEXT DEFAULT 'pendente',
  criado_em       TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, nome, telefone)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'telefone');
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
  estado            TEXT DEFAULT 'pendente',
  notas             TEXT,
  criado_em         TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessoes_data_hora ON sessoes(data, hora_inicio, hora_fim);
CREATE INDEX idx_sessoes_cliente ON sessoes(cliente_id);

-- PAGAMENTOS
CREATE TABLE pagamentos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id      UUID REFERENCES profiles(id),
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
  sessao_id       UUID REFERENCES sessoes(id),
  destinatario    TEXT NOT NULL,
  tipo            TEXT NOT NULL,
  canal           TEXT NOT NULL DEFAULT 'dashboard',
  mensagem        TEXT,
  lida            BOOLEAN DEFAULT false,
  criado_em       TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE planos ENABLE ROW LEVEL SECURITY;

-- Planos: everyone can read
CREATE POLICY "planos_read" ON planos FOR SELECT USING (true);

-- Profiles policies
CREATE POLICY "profiles_own" ON profiles FOR SELECT USING (
  auth.uid() = id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "profiles_update_admin" ON profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Sessoes policies
CREATE POLICY "sessoes_select" ON sessoes FOR SELECT USING (
  cliente_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "sessoes_insert" ON sessoes FOR INSERT WITH CHECK (
  cliente_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "sessoes_update" ON sessoes FOR UPDATE USING (
  cliente_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Notificacoes policies
CREATE POLICY "notifs_select" ON notificacoes FOR SELECT USING (
  destinatario = auth.uid()::text OR destinatario = 'admin'
);
CREATE POLICY "notifs_insert" ON notificacoes FOR INSERT WITH CHECK (true);

-- Pagamentos policies
CREATE POLICY "pagamentos_admin" ON pagamentos FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
