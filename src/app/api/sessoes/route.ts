import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { verificarConflito, calcularHoraFim, obterSlotsDisponiveis } from '@/lib/validations/sessoes'
import { verificarHorasSemana, incrementarHorasUsadas } from '@/lib/validations/horas'
import { emailNovaSessionAdmin } from '@/lib/email/resend'

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const data = searchParams.get('data')
  const slots = searchParams.get('slots')
  const duracao = parseInt(searchParams.get('duracao') || '60')

  // Return available slots for a date
  if (data && slots === 'true') {
    const available = await obterSlotsDisponiveis(supabase, data, duracao)
    return NextResponse.json({ slots: available })
  }

  // Get sessions
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

  let query = supabase.from('sessoes').select('*, profiles(nome)')

  if (profile?.role !== 'admin') {
    query = query.eq('cliente_id', user.id)
  }

  const { data: sessoes } = await query.order('data', { ascending: false }).order('hora_inicio')

  return NextResponse.json({ sessoes: sessoes || [] })
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const body = await req.json()
  const { data: dataStr, hora_inicio, tipo = 'captacao', notas, cliente_id, produtor } = body

  // Determine target client (admin can book for others)
  const { data: myProfile, error: myProfileError } = await supabase
    .from('profiles')
    .select('*, planos(*)')
    .eq('id', user.id)
    .single()

  if (myProfileError) {
    console.error('[SESSOES POST] Profile fetch error:', myProfileError)
    return NextResponse.json({ error: 'Erro ao carregar perfil. Contacta o admin.' }, { status: 500 })
  }

  const targetId = (myProfile as any)?.role === 'admin' && cliente_id ? cliente_id : user.id

  // Get target profile with plan — FIX 2: better error handling
  const { data: targetProfile, error: targetError } = await supabase
    .from('profiles')
    .select('*, planos(*)')
    .eq('id', targetId)
    .single()

  if (targetError || !targetProfile) {
    console.error('[SESSOES POST] Target profile error:', targetError, 'targetId:', targetId)
    return NextResponse.json({
      error: 'Perfil não encontrado. Certifica-te que a tua conta foi ativada pelo admin.',
    }, { status: 404 })
  }

  // FIX: Allow booking if user has a valid plan, regardless of estado
  // The estado check was blocking all new users. Instead, just verify plan exists.
  const plano = (targetProfile as any).planos
  if (!plano) {
    const estado = (targetProfile as any).estado
    const isAdmin = (myProfile as any)?.role === 'admin'
    if (!isAdmin) {
      return NextResponse.json({
        error: 'Nenhum plano atribuído à tua conta. Contacta o admin para associar um plano.',
      }, { status: 403 })
    }
  }

  const duracao = plano ? (plano.duracao_sessao_min || 60) : 60
  const horaFim = calcularHoraFim(hora_inicio, duracao)

  // Check conflict (now with 30min buffer)
  const { conflito, proximoSlot } = await verificarConflito(supabase, dataStr, hora_inicio, horaFim)
  if (conflito) {
    return NextResponse.json({
      error: proximoSlot
        ? `Conflito de horário. Próximo slot disponível: ${proximoSlot}`
        : 'Sem slots disponíveis neste dia.',
    }, { status: 409 })
  }

  // Check weekly hours
  const { ok, restantes } = await verificarHorasSemana(supabase, targetId, duracao, dataStr)
  if (!ok) {
    return NextResponse.json({
      error: `Horas semanais esgotadas. Restam ${Math.round(restantes / 60 * 10) / 10}h`,
    }, { status: 400 })
  }

  // Create session — FEATURE: include produtor field
  const { data: sessao, error: insertError } = await supabase.from('sessoes').insert({
    cliente_id: targetId,
    tipo,
    data: dataStr,
    hora_inicio,
    hora_fim: horaFim,
    duracao_minutos: duracao,
    notas,
    produtor: produtor || null,
  }).select().single()

  if (insertError) {
    console.error('[SESSOES POST] Insert error:', insertError)
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // Create notification for admin — include produtor info
  const produtorInfo = produtor ? ` com ${produtor}` : ''
  await supabase.from('notificacoes').insert({
    sessao_id: sessao.id,
    destinatario: 'admin',
    tipo: 'nova_marcacao',
    canal: 'dashboard',
    mensagem: `Nova sessão${produtorInfo} de ${(targetProfile as any).nome}: ${tipo} em ${dataStr} às ${hora_inicio}`,
  })

  // Send email to admin (async, don't block)
  emailNovaSessionAdmin({
    sessao,
    cliente: { nome: (targetProfile as any).nome, email: (targetProfile as any).email || user.email || '', telefone: (targetProfile as any).telefone },
  }).catch((err) => console.error('[EMAIL] Error:', err))

  return NextResponse.json({ sessao, message: 'Sessão marcada com sucesso!' })
}

export async function PATCH(req: NextRequest) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const body = await req.json()
  const { sessao_id, estado } = body

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

  // Get the session
  const { data: sessao } = await supabase.from('sessoes').select('*').eq('id', sessao_id).single()
  if (!sessao) return NextResponse.json({ error: 'Sessão não encontrada' }, { status: 404 })

  // Only admin can confirm/conclude; clients can only cancel their own
  if (profile?.role !== 'admin') {
    if (sessao.cliente_id !== user.id) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    if (estado !== 'cancelada') return NextResponse.json({ error: 'Apenas pode cancelar' }, { status: 403 })
  }

  await supabase.from('sessoes').update({ estado, atualizado_em: new Date().toISOString() }).eq('id', sessao_id)

  // Increment weekly hours when confirmed
  if (estado === 'confirmada' && sessao.estado === 'pendente') {
    await incrementarHorasUsadas(supabase, sessao.cliente_id, sessao.data, sessao.duracao_minutos)
  }

  // Notify client
  if (profile?.role === 'admin' && (estado === 'confirmada' || estado === 'recusada')) {
    const msg = estado === 'confirmada' ? 'A tua sessão foi confirmada!' : 'A tua sessão foi recusada.'
    await supabase.from('notificacoes').insert({
      sessao_id,
      destinatario: sessao.cliente_id,
      tipo: estado === 'confirmada' ? 'confirmada' : 'recusada',
      canal: 'dashboard',
      mensagem: msg,
    })
  }

  return NextResponse.json({ message: `Sessão ${estado}` })
}
