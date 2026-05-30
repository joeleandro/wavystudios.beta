import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase/server'
import { emailSessaoConfirmada, emailSessaoRecusada } from '@/lib/email/resend'
import { incrementarHorasUsadas } from '@/lib/validations/horas'

// Confirm/refuse session via email link (uses sessao_id directly)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sessaoId = searchParams.get('sessao_id')
  const acao = searchParams.get('acao') // confirmar | recusar

  if (!sessaoId || !acao) {
    return new NextResponse('Parâmetros em falta', { status: 400 })
  }

  const supabase = await createSupabaseAdmin()

  // Get session with client profile
  const { data: sessao } = await supabase
    .from('sessoes')
    .select('*, profiles(nome, id)')
    .eq('id', sessaoId)
    .single()

  if (!sessao) return new NextResponse('Sessão não encontrada', { status: 404 })
  if (sessao.estado !== 'pendente') return new NextResponse('Sessão já processada', { status: 400 })

  const novoEstado = acao === 'confirmar' ? 'confirmada' : 'recusada'

  // Update session
  await supabase.from('sessoes').update({ estado: novoEstado, atualizado_em: new Date().toISOString() }).eq('id', sessaoId)

  // Increment weekly hours when confirmed
  if (novoEstado === 'confirmada') {
    await incrementarHorasUsadas(supabase, sessao.cliente_id, sessao.data, sessao.duracao_minutos)
  }

  // Notify client via dashboard
  await supabase.from('notificacoes').insert({
    sessao_id: sessaoId,
    destinatario: sessao.cliente_id,
    tipo: novoEstado,
    canal: 'dashboard',
    mensagem: novoEstado === 'confirmada'
      ? `Sessão de ${sessao.data} às ${sessao.hora_inicio} confirmada!`
      : `Sessão de ${sessao.data} às ${sessao.hora_inicio} recusada.`,
  })

  // Email client
  const { data: authUser } = await supabase.auth.admin.getUserById(sessao.cliente_id)
  const clienteEmail = authUser?.user?.email
  const clienteNome = sessao.profiles?.nome || authUser?.user?.user_metadata?.nome || 'Artista'

  if (clienteEmail) {
    if (novoEstado === 'confirmada') {
      emailSessaoConfirmada({
        sessao: {
          data: sessao.data,
          hora_inicio: sessao.hora_inicio,
          hora_fim: sessao.hora_fim,
          tipo: sessao.tipo,
          produtor: sessao.produtor,
        },
        cliente: { nome: clienteNome, email: clienteEmail },
      }).catch(console.error)
    } else {
      emailSessaoRecusada({
        sessao: { data: sessao.data, hora_inicio: sessao.hora_inicio },
        cliente: { nome: clienteNome, email: clienteEmail },
      }).catch(console.error)
    }
  }

  // Redirect to admin dashboard
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://wavystudios-beta.vercel.app'
  return NextResponse.redirect(`${baseUrl}/admin?sessao=${novoEstado}`)
}
