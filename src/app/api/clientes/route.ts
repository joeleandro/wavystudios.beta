import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import getDb from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const user = session.user as { id: string; role: string };
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const db = getDb();
  const clientes = db.prepare(`
    SELECT c.id, c.nome, c.email, c.telefone, c.estado, c.data_inicio, c.role,
           p.nome as plano_nome, p.preco_mensal, p.horas_semanais
    FROM clientes c 
    LEFT JOIN planos p ON c.plano_id = p.id
    WHERE c.role = 'cliente'
    ORDER BY c.nome
  `).all();

  return NextResponse.json({ clientes });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const user = session.user as { role: string };
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const db = getDb();
  const body = await req.json();
  const { nome, email, telefone, plano_id, password } = body;

  if (!nome || !email || !password || !plano_id) {
    return NextResponse.json({ error: "Campos obrigatórios em falta" }, { status: 400 });
  }

  // Check if email exists
  const existing = db.prepare("SELECT id FROM clientes WHERE email = ?").get(email);
  if (existing) {
    return NextResponse.json({ error: "Email já registado" }, { status: 409 });
  }

  const bcrypt = require("bcryptjs");
  const hash = bcrypt.hashSync(password, 10);
  const id = `client_${Date.now()}`;

  db.prepare(`
    INSERT INTO clientes (id, nome, email, telefone, plano_id, data_inicio, estado, password_hash, role)
    VALUES (?, ?, ?, ?, ?, date('now'), 'ativo', ?, 'cliente')
  `).run(id, nome, email, telefone || null, plano_id, hash);

  return NextResponse.json({ message: "Cliente criado com sucesso", id });
}
