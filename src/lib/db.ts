import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data.db');

let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeDatabase();
  }
  return db;
}

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS planos (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      preco_mensal REAL NOT NULL,
      horas_semanais INTEGER NOT NULL,
      horas_mensais INTEGER NOT NULL,
      duracao_sessao_min INTEGER NOT NULL,
      mix_master_mes INTEGER NOT NULL,
      sessao_foto INTEGER NOT NULL DEFAULT 0,
      instrumental INTEGER NOT NULL DEFAULT 0,
      direcao_criativa INTEGER NOT NULL DEFAULT 0,
      pagamento_5050 INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS clientes (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      telefone TEXT,
      plano_id TEXT,
      data_inicio TEXT,
      estado TEXT NOT NULL DEFAULT 'ativo',
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'cliente',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (plano_id) REFERENCES planos(id)
    );

    CREATE TABLE IF NOT EXISTS sessoes (
      id TEXT PRIMARY KEY,
      cliente_id TEXT NOT NULL,
      tipo TEXT NOT NULL,
      data TEXT NOT NULL,
      hora_inicio TEXT NOT NULL,
      hora_fim TEXT NOT NULL,
      duracao_minutos INTEGER NOT NULL,
      estado TEXT NOT NULL DEFAULT 'pendente',
      criada_em TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    );

    CREATE TABLE IF NOT EXISTS horas_semana (
      id TEXT PRIMARY KEY,
      cliente_id TEXT NOT NULL,
      semana_inicio TEXT NOT NULL,
      horas_plano REAL NOT NULL,
      horas_usadas REAL NOT NULL DEFAULT 0,
      horas_restantes REAL NOT NULL,
      UNIQUE(cliente_id, semana_inicio),
      FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    );

    CREATE TABLE IF NOT EXISTS notificacoes (
      id TEXT PRIMARY KEY,
      destinatario_id TEXT NOT NULL,
      tipo TEXT NOT NULL,
      canal TEXT NOT NULL DEFAULT 'plataforma',
      mensagem TEXT NOT NULL,
      lida INTEGER NOT NULL DEFAULT 0,
      criada_em TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (destinatario_id) REFERENCES clientes(id)
    );
  `);

  // Seed plans if empty
  const count = db.prepare('SELECT COUNT(*) as c FROM planos').get() as { c: number };
  if (count.c === 0) {
    seedPlanos();
  }

  // Seed admin if no admin exists
  const adminCount = db.prepare("SELECT COUNT(*) as c FROM clientes WHERE role = 'admin'").get() as { c: number };
  if (adminCount.c === 0) {
    seedAdmin();
  }
}

function seedPlanos() {
  const insert = db.prepare(`
    INSERT INTO planos (id, nome, preco_mensal, horas_semanais, horas_mensais, duracao_sessao_min, mix_master_mes, sessao_foto, instrumental, direcao_criativa, pagamento_5050)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insert.run('plan_standard', 'Standard', 150, 4, 16, 60, 2, 0, 0, 0, 0);
  insert.run('plan_professional', 'Professional', 190, 6, 24, 90, 2, 0, 0, 0, 0);
  insert.run('plan_avancado', 'Avançado', 250, 8, 32, 120, -1, 1, 1, 1, 1);
}

function seedAdmin() {
  // bcryptjs hash of "admin123"
  const bcrypt = require('bcryptjs');
  const hash = bcrypt.hashSync('admin123', 10);
  
  db.prepare(`
    INSERT INTO clientes (id, nome, email, telefone, estado, password_hash, role)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run('admin_001', 'Admin Wavy', 'admin@wavystudios.com', '+351900000000', 'ativo', hash, 'admin');

  // Seed demo client
  const clientHash = bcrypt.hashSync('cliente123', 10);
  db.prepare(`
    INSERT INTO clientes (id, nome, email, telefone, plano_id, data_inicio, estado, password_hash, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run('client_001', 'João Silva', 'joao@email.com', '+351911111111', 'plan_professional', '2025-01-15', 'ativo', clientHash, 'cliente');

  db.prepare(`
    INSERT INTO clientes (id, nome, email, telefone, plano_id, data_inicio, estado, password_hash, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run('client_002', 'Maria Santos', 'maria@email.com', '+351922222222', 'plan_avancado', '2025-02-01', 'ativo', clientHash, 'cliente');

  db.prepare(`
    INSERT INTO clientes (id, nome, email, telefone, plano_id, data_inicio, estado, password_hash, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run('client_003', 'Pedro Costa', 'pedro@email.com', '+351933333333', 'plan_standard', '2025-03-10', 'ativo', clientHash, 'cliente');

  // Seed some sessions
  const sessoes = [
    ['sess_001', 'client_001', 'captacao', '2025-05-19', '10:00', '11:30', 90, 'confirmada'],
    ['sess_002', 'client_001', 'captacao', '2025-05-20', '14:00', '15:30', 90, 'pendente'],
    ['sess_003', 'client_002', 'captacao', '2025-05-19', '14:00', '16:00', 120, 'confirmada'],
    ['sess_004', 'client_003', 'captacao', '2025-05-21', '09:00', '10:00', 60, 'pendente'],
    ['sess_005', 'client_002', 'mix_master', '2025-05-22', '10:00', '12:00', 120, 'confirmada'],
  ];

  const insertSessao = db.prepare(`
    INSERT INTO sessoes (id, cliente_id, tipo, data, hora_inicio, hora_fim, duracao_minutos, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const s of sessoes) {
    insertSessao.run(...s);
  }
}

export default getDb;
