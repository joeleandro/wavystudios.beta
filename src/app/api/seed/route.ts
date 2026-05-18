import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase/server'

// GET /api/seed — Creates test accounts (admin + cliente)
// Run once after setting up Supabase
export async function GET() {
  const supabase = await createSupabaseAdmin()

  const results: any[] = []

  // 1. Create Admin user
  const { data: adminUser, error: adminErr } = await supabase.auth.admin.createUser({
    email: 'admin@sgstudio.pt',
    password: 'admin123',
    email_confirm: true,
    user_metadata: { nome: 'Admin SG', telefone: '+351939910528' },
  })

  if (adminErr && !adminErr.message.includes('already been registered')) {
    results.push({ admin: 'error', message: adminErr.message })
  } else if (adminUser?.user) {
    // Create/update profile as admin
    await supabase.from('profiles').upsert({
      id: adminUser.user.id,
      nome: 'Admin SG',
      telefone: '+351939910528',
      role: 'admin',
      estado: 'ativo',
    })
    results.push({ admin: 'created', id: adminUser.user.id })
  } else {
    // User already exists — find and update role
    const { data: users } = await supabase.auth.admin.listUsers()
    const existing = users?.users?.find(u => u.email === 'admin@sgstudio.pt')
    if (existing) {
      await supabase.from('profiles').upsert({
        id: existing.id,
        nome: 'Admin SG',
        telefone: '+351939910528',
        role: 'admin',
        estado: 'ativo',
      })
      results.push({ admin: 'already exists, role updated', id: existing.id })
    }
  }

  // 2. Create Client user
  const { data: clientUser, error: clientErr } = await supabase.auth.admin.createUser({
    email: 'cliente@sgstudio.pt',
    password: 'cliente123',
    email_confirm: true,
    user_metadata: { nome: 'João Demo', telefone: '+351911111111' },
  })

  if (clientErr && !clientErr.message.includes('already been registered')) {
    results.push({ cliente: 'error', message: clientErr.message })
  } else if (clientUser?.user) {
    await supabase.from('profiles').upsert({
      id: clientUser.user.id,
      nome: 'João Demo',
      telefone: '+351911111111',
      plano_id: 2, // Professional
      role: 'cliente',
      estado: 'ativo',
      data_inicio: new Date().toISOString().split('T')[0],
    })
    results.push({ cliente: 'created', id: clientUser.user.id })
  } else {
    const { data: users } = await supabase.auth.admin.listUsers()
    const existing = users?.users?.find(u => u.email === 'cliente@sgstudio.pt')
    if (existing) {
      await supabase.from('profiles').upsert({
        id: existing.id,
        nome: 'João Demo',
        telefone: '+351911111111',
        plano_id: 2,
        role: 'cliente',
        estado: 'ativo',
        data_inicio: new Date().toISOString().split('T')[0],
      })
      results.push({ cliente: 'already exists, profile updated', id: existing.id })
    }
  }

  // 3. Verify profiles exist
  const { data: profiles, error: profErr } = await supabase
    .from('profiles')
    .select('id, nome, role, estado, plano_id')
    .order('role')

  return NextResponse.json({
    message: 'Seed complete!',
    results,
    profiles: profiles || [],
    profilesError: profErr?.message || null,
    instructions: {
      admin: 'admin@sgstudio.pt / admin123',
      cliente: 'cliente@sgstudio.pt / cliente123',
    },
  })
}
