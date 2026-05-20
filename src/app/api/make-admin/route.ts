import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase/server'

// GET /api/make-admin?secret=wavy2024
// Makes the currently logged-in user an admin
// Protected by a simple secret to prevent abuse
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')

  if (secret !== 'wavy2024') {
    return NextResponse.json({ error: 'Secret inválido' }, { status: 403 })
  }

  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado. Faz login primeiro.' }, { status: 401 })

  const admin = await createSupabaseAdmin()

  // Update role to admin
  const { error } = await admin.from('profiles').update({
    role: 'admin',
    estado: 'ativo',
  }).eq('id', user.id)

  if (error) {
    // Profile might not exist — create it
    const { error: insertErr } = await admin.from('profiles').upsert({
      id: user.id,
      nome: user.user_metadata?.nome || user.email?.split('@')[0] || 'Admin',
      telefone: user.user_metadata?.telefone || null,
      role: 'admin',
      estado: 'ativo',
    }, { onConflict: 'id' })

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 })
    }
  }

  return NextResponse.json({
    ok: true,
    message: `✅ User ${user.email} agora é admin!`,
    hint: 'Recarrega a página /admin para aceder ao painel.',
  })
}
