import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase/server'

// POST /api/profile — Ensure profile exists (uses service role to bypass RLS)
export async function POST(req: NextRequest) {
  // Get the user from the request session
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  // Use admin client to bypass RLS for reading/writing profiles
  const admin = await createSupabaseAdmin()

  // Check if profile already exists
  const { data: existing } = await admin
    .from('profiles')
    .select('id, nome, role, estado, plano_id')
    .eq('id', user.id)
    .single()

  if (existing) {
    return NextResponse.json({ profile: existing, created: false })
  }

  // Create profile from user metadata using admin client (bypasses RLS)
  const nome =
    user.user_metadata?.nome ||
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    'Artista'
  const telefone = user.user_metadata?.telefone || null

  const { data: newProfile, error: insertErr } = await admin
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

// GET /api/profile — Return current user's profile (useful for debugging)
export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const admin = await createSupabaseAdmin()
  const { data: profile } = await admin
    .from('profiles')
    .select('*, planos(*)')
    .eq('id', user.id)
    .single()

  return NextResponse.json({ user: { id: user.id, email: user.email }, profile })
}
