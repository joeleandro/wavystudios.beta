import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import getDb from "@/lib/db";
import { getWeeklyStatus } from "@/lib/session-logic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const db = getDb();
  const user = session.user as { id: string; role: string };

  if (user.role === "admin") {
    // Admin stats
    const now = new Date();
    const monthStart = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-01`;
    const monthEnd = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-31`;

    const clientesAtivos = db.prepare("SELECT COUNT(*) as c FROM clientes WHERE estado = 'ativo' AND role = 'cliente'").get() as { c: number };
    
    const receitaMes = db.prepare(`
      SELECT COALESCE(SUM(p.preco_mensal), 0) as total 
      FROM clientes c 
      JOIN planos p ON c.plano_id = p.id 
      WHERE c.estado = 'ativo' AND c.role = 'cliente'
    `).get() as { total: number };

    const horasMes = db.prepare(`
      SELECT COALESCE(SUM(duracao_minutos), 0) as total 
      FROM sessoes 
      WHERE data >= ? AND data <= ? 
      AND estado IN ('confirmada', 'concluida')
    `).get(monthStart, monthEnd) as { total: number };

    const sessoesHoje = db.prepare(`
      SELECT COUNT(*) as c FROM sessoes 
      WHERE data = ? AND estado IN ('pendente', 'confirmada')
    `).get(now.toISOString().split('T')[0]) as { c: number };

    const sessoesPendentes = db.prepare(`
      SELECT COUNT(*) as c FROM sessoes WHERE estado = 'pendente'
    `).get() as { c: number };

    const ocupacao = (() => {
      // Assume studio available 12h/day, ~22 working days
      const horasDisponiveis = 12 * 22;
      const horasUsadas = horasMes.total / 60;
      return Math.round((horasUsadas / horasDisponiveis) * 100);
    })();

    const sessoesRecentes = db.prepare(`
      SELECT s.*, c.nome as cliente_nome 
      FROM sessoes s 
      JOIN clientes c ON s.cliente_id = c.id 
      ORDER BY s.criada_em DESC 
      LIMIT 10
    `).all();

    return NextResponse.json({
      clientes_ativos: clientesAtivos.c,
      receita_mes: receitaMes.total,
      horas_mes: Math.round(horasMes.total / 60 * 10) / 10,
      sessoes_hoje: sessoesHoje.c,
      sessoes_pendentes: sessoesPendentes.c,
      ocupacao,
      sessoes_recentes: sessoesRecentes,
    });
  } else {
    // Client stats
    const weeklyStatus = getWeeklyStatus(user.id);
    
    const proximaSessao = db.prepare(`
      SELECT * FROM sessoes 
      WHERE cliente_id = ? AND data >= date('now') AND estado IN ('pendente', 'confirmada')
      ORDER BY data, hora_inicio 
      LIMIT 1
    `).get(user.id);

    const totalSessoes = db.prepare(`
      SELECT COUNT(*) as c FROM sessoes WHERE cliente_id = ? AND estado = 'concluida'
    `).get(user.id) as { c: number };

    return NextResponse.json({
      weekly: weeklyStatus,
      proxima_sessao: proximaSessao,
      total_sessoes_concluidas: totalSessoes.c,
    });
  }
}
