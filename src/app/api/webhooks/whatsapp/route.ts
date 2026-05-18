import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const body = await req.formData()
  const mensagem = (body.get('Body') as string || '').trim().toUpperCase()
  const de = body.get('From') as string

  if (de !== `whatsapp:${process.env.ADMIN_PHONE}`) {
    return NextResponse.json({ ok: false })
  }

  const supabase = await createSupabaseAdmin()

  // Find last pending session
  const { data: ultimaPendente } = await supabase
    .from('sessoes')
    .select('*')
    .eq('estado', 'pendente')
    .order('criado_em', { ascending: false })
    .limit(1)
    .single()

  if (!ultimaPendente) return NextResponse.json({ ok: false, msg: 'Sem sessões pendentes' })

  if (['SIM', '1', 'CONFIRMAR', 'OK'].includes(mensagem)) {
    await supabase.from('sessoes').update({ estado: 'confirmada' }).eq('id', ultimaPendente.id)
    await supabase.from('notificacoes').insert({
      sessao_id: ultimaPendente.id,
      destinatario: ultimaPendente.cliente_id,
      tipo: 'confirmada',
      canal: 'whatsapp',
      mensagem: 'Sessão confirmada via WhatsApp!',
    })
  } else if (['NÃO', 'NAO', '2', 'RECUSAR'].includes(mensagem)) {
    await supabase.from('sessoes').update({ estado: 'recusada' }).eq('id', ultimaPendente.id)
    await supabase.from('notificacoes').insert({
      sessao_id: ultimaPendente.id,
      destinatario: ultimaPendente.cliente_id,
      tipo: 'recusada',
      canal: 'whatsapp',
      mensagem: 'Sessão recusada via WhatsApp.',
    })
  }

  return NextResponse.json({ ok: true })
}
