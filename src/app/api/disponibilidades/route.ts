import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Public endpoint — no auth required
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mes = searchParams.get('mes') // format: 2025-05

  if (!mes || !/^\d{4}-\d{2}$/.test(mes)) {
    return NextResponse.json({ error: 'Formato inválido. Use: ?mes=2025-05' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const startDate = `${mes}-01`
  const endDate = `${mes}-31`

  const { data: sessoes, error } = await supabase
    .from('sessoes')
    .select('data, hora_inicio, hora_fim')
    .gte('data', startDate)
    .lte('data', endDate)
    .in('estado', ['pendente', 'confirmada'])
    .order('data')
    .order('hora_inicio')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ slots: sessoes || [] })
}
