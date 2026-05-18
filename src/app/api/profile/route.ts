import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

// POST /api/profile — Ensure user profile exists in DB
// Called from dashboard/signup if profile creation via client fails (RLS)
export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  // Check if profile already exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('id, nome, role, estado')
    .eq('id', user.id)
    .single()

  if (existing) {
    return NextResponse.json({ profile: existing, created: false })
  }

  // Create profile from user metadata
  const nome = user.user_metadata?.nome ||
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] || 'Artista'
  const telefone = user.user_metadata?.telefone || null

  const { data: newProfile, error: insertErr } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      nome,
      telefone,
      role: 'cliente',
      estado: 'pendente',
    })
    .select('*')
    .single()

  if (insertErr) {
    console.error('[API/profile] Insert error:', insertErr)
    return NextResponse.json({ error: insertErr.message }, { status: 500 })
  }

  return NextResponse.json({ profile: newProfile, created: true })
}
