import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })

  const { data: clientes } = await supabase
    .from('profiles')
    .select('*, planos(nome, preco_mensal, horas_semanais)')
    .eq('role', 'cliente')
    .order('criado_em', { ascending: false })

  return NextResponse.json({ clientes: clientes || [] })
}

export async function PATCH(req: NextRequest) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })

  const body = await req.json()
  const { cliente_id, estado, plano_id, data_inicio, renovar } = body

  if (!cliente_id) {
    return NextResponse.json({ error: 'cliente_id é obrigatório' }, { status: 400 })
  }

  const updateData: any = {}
  if (estado) updateData.estado = estado
  if (plano_id) updateData.plano_id = plano_id
  if (data_inicio) updateData.data_inicio = data_inicio
  if (estado === 'ativo' && !data_inicio) updateData.data_inicio = new Date().toISOString().split('T')[0]

  // "Renovar" — restart the subscription cycle: today + 30 days, keep/activate
  if (renovar) {
    const hoje = new Date().toISOString().split('T')[0]
    updateData.data_inicio = hoje
    updateData.estado = 'ativo'
    const renovacao = new Date(hoje + 'T12:00:00')
    renovacao.setDate(renovacao.getDate() + 30)
    updateData.data_renovacao = renovacao.toISOString().split('T')[0]
  }

  // Auto-set data_renovacao = data_inicio + 30 days when activating
  if (estado === 'ativo' && !renovar) {
    const inicio = updateData.data_inicio || data_inicio || new Date().toISOString().split('T')[0]
    const renovacao = new Date(inicio + 'T12:00:00')
    renovacao.setDate(renovacao.getDate() + 30)
    updateData.data_renovacao = renovacao.toISOString().split('T')[0]
  }

  const { error } = await supabase.from('profiles').update(updateData).eq('id', cliente_id)
  if (error) {
    console.error('[CLIENTES PATCH] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Cliente atualizado' })
}
