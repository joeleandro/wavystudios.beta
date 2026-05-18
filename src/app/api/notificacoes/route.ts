import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

  const destinatario = profile?.role === 'admin' ? 'admin' : user.id

  const { data: notificacoes } = await supabase
    .from('notificacoes')
    .select('*')
    .eq('destinatario', destinatario)
    .order('criado_em', { ascending: false })
    .limit(20)

  const { count } = await supabase
    .from('notificacoes')
    .select('*', { count: 'exact', head: true })
    .eq('destinatario', destinatario)
    .eq('lida', false)

  return NextResponse.json({ notificacoes: notificacoes || [], nao_lidas: count || 0 })
}
