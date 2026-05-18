import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import getDb from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const db = getDb();
  const user = session.user as { id: string };

  const notificacoes = db.prepare(`
    SELECT * FROM notificacoes 
    WHERE destinatario_id = ? 
    ORDER BY criada_em DESC 
    LIMIT 20
  `).all(user.id);

  const naoLidas = db.prepare(`
    SELECT COUNT(*) as c FROM notificacoes 
    WHERE destinatario_id = ? AND lida = 0
  `).get(user.id) as { c: number };

  return NextResponse.json({ notificacoes, nao_lidas: naoLidas.c });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const db = getDb();
  const user = session.user as { id: string };
  const body = await req.json();

  if (body.mark_all_read) {
    db.prepare("UPDATE notificacoes SET lida = 1 WHERE destinatario_id = ?").run(user.id);
  } else if (body.id) {
    db.prepare("UPDATE notificacoes SET lida = 1 WHERE id = ? AND destinatario_id = ?").run(body.id, user.id);
  }

  return NextResponse.json({ message: "OK" });
}
