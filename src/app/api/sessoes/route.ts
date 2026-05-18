import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import getDb from "@/lib/db";
import { bookSession, getAvailableSlots } from "@/lib/session-logic";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const db = getDb();
  const user = session.user as { id: string; role: string };
  const { searchParams } = new URL(req.url);
  const data = searchParams.get("data");
  const clienteId = searchParams.get("cliente_id");

  // Get available slots for a date
  if (data && searchParams.get("slots") === "true") {
    const duracao = parseInt(searchParams.get("duracao") || "60");
    const slots = getAvailableSlots(data, duracao);
    return NextResponse.json({ slots });
  }

  // Get sessions
  let query: string;
  let params: string[];

  if (user.role === "admin") {
    if (clienteId) {
      query = `
        SELECT s.*, c.nome as cliente_nome 
        FROM sessoes s 
        JOIN clientes c ON s.cliente_id = c.id 
        WHERE s.cliente_id = ?
        ORDER BY s.data DESC, s.hora_inicio
      `;
      params = [clienteId];
    } else {
      query = `
        SELECT s.*, c.nome as cliente_nome 
        FROM sessoes s 
        JOIN clientes c ON s.cliente_id = c.id 
        ORDER BY s.data DESC, s.hora_inicio
      `;
      params = [];
    }
  } else {
    query = `
      SELECT s.*, c.nome as cliente_nome 
      FROM sessoes s 
      JOIN clientes c ON s.cliente_id = c.id 
      WHERE s.cliente_id = ?
      ORDER BY s.data DESC, s.hora_inicio
    `;
    params = [user.id];
  }

  const sessoes = db.prepare(query).all(...params);
  return NextResponse.json({ sessoes });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const user = session.user as { id: string; role: string };
  const body = await req.json();
  const { tipo, data, hora_inicio, cliente_id } = body;

  // Admin can book for any client, client can only book for themselves
  const targetClienteId = user.role === "admin" && cliente_id ? cliente_id : user.id;

  if (!tipo || !data || !hora_inicio) {
    return NextResponse.json({ error: "Campos obrigatórios em falta" }, { status: 400 });
  }

  const result = bookSession(targetClienteId, tipo, data, hora_inicio);
  
  if (!result.success) {
    return NextResponse.json({ error: result.message }, { status: 409 });
  }

  return NextResponse.json({ message: result.message, sessaoId: result.sessaoId });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const user = session.user as { id: string; role: string };
  const body = await req.json();
  const { sessao_id, estado } = body;

  if (!sessao_id || !estado) {
    return NextResponse.json({ error: "Campos obrigatórios em falta" }, { status: 400 });
  }

  // Only admin can confirm/conclude, clients can only cancel their own
  const db = getDb();
  const sessao = db.prepare("SELECT * FROM sessoes WHERE id = ?").get(sessao_id) as { cliente_id: string; estado: string } | undefined;
  
  if (!sessao) {
    return NextResponse.json({ error: "Sessão não encontrada" }, { status: 404 });
  }

  if (user.role !== "admin" && sessao.cliente_id !== user.id) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  if (user.role !== "admin" && estado !== "cancelada") {
    return NextResponse.json({ error: "Apenas pode cancelar sessões" }, { status: 403 });
  }

  db.prepare("UPDATE sessoes SET estado = ? WHERE id = ?").run(estado, sessao_id);

  // Notify client on confirmation/cancellation
  if (user.role === "admin" && (estado === "confirmada" || estado === "cancelada")) {
    const { generateId } = require("@/lib/utils");
    const notifId = `notif_${Date.now()}`;
    const msg = estado === "confirmada" 
      ? "A tua sessão foi confirmada!" 
      : "A tua sessão foi cancelada pelo admin.";
    
    db.prepare(`
      INSERT INTO notificacoes (id, destinatario_id, tipo, canal, mensagem)
      VALUES (?, ?, ?, 'plataforma', ?)
    `).run(notifId, sessao.cliente_id, estado === "confirmada" ? "confirmacao" : "cancelamento", msg);
  }

  return NextResponse.json({ message: `Sessão ${estado}` });
}
