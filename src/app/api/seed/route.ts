import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase/server'

// GET /api/seed — Creates test accounts (admin + cliente)
// Safe to call multiple times — uses upsert
export async function GET() {
  // Guard: needs service role key
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({
      error: 'SUPABASE_SERVICE_ROLE_KEY não está configurada.',
      hint: 'Adiciona SUPABASE_SERVICE_ROLE_KEY ao teu ficheiro .env.local e reinicia o servidor.',
    }, { status: 500 })
  }

  const supabase = await createSupabaseAdmin()
  const results: any[] = []

  // ── 1. ADMIN ──────────────────────────────────────────────
  const adminEmail = 'admin@wavystudios.pt'
  const adminPass  = 'admin123'

  // Check if already exists
  const { data: existingAdmins } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  const existingAdmin = existingAdmins?.users?.find(u => u.email === adminEmail)

  let adminId: string | null = existingAdmin?.id ?? null

  if (!adminId) {
    const { data: newAdmin, error: adminErr } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPass,
      email_confirm: true,
      user_metadata: { nome: 'Admin Wavy', telefone: '+351939910528' },
    })
    if (adminErr) {
      results.push({ admin: 'error', message: adminErr.message })
    } else {
      adminId = newAdmin.user.id
      results.push({ admin: 'created', id: adminId })
    }
  } else {
    results.push({ admin: 'already_exists', id: adminId })
  }

  if (adminId) {
    const { error: profErr } = await supabase.from('profiles').upsert({
      id: adminId,
      nome: 'Admin Wavy',
      telefone: '+351939910528',
      role: 'admin',
      estado: 'ativo',
    }, { onConflict: 'id' })
    if (profErr) results.push({ admin_profile: 'error', message: profErr.message })
    else results.push({ admin_profile: 'ok' })
  }

  // ── 2. CLIENTE ────────────────────────────────────────────
  const clienteEmail = 'cliente@wavystudios.pt'
  const clientePass  = 'cliente123'

  const existingCliente = existingAdmins?.users?.find(u => u.email === clienteEmail)
  let clienteId: string | null = existingCliente?.id ?? null

  if (!clienteId) {
    const { data: newCliente, error: clienteErr } = await supabase.auth.admin.createUser({
      email: clienteEmail,
      password: clientePass,
      email_confirm: true,
      user_metadata: { nome: 'João Demo', telefone: '+351911111111' },
    })
    if (clienteErr) {
      results.push({ cliente: 'error', message: clienteErr.message })
    } else {
      clienteId = newCliente.user.id
      results.push({ cliente: 'created', id: clienteId })
    }
  } else {
    results.push({ cliente: 'already_exists', id: clienteId })
  }

  if (clienteId) {
    // Try with plano_id: 2, fallback to no plan if it doesn't exist
    const { error: profErr } = await supabase.from('profiles').upsert({
      id: clienteId,
      nome: 'João Demo',
      telefone: '+351911111111',
      plano_id: 2,
      role: 'cliente',
      estado: 'ativo',
      data_inicio: new Date().toISOString().split('T')[0],
      data_renovacao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }, { onConflict: 'id' })

    if (profErr) {
      // plano_id might not exist — try without it
      const { error: profErr2 } = await supabase.from('profiles').upsert({
        id: clienteId,
        nome: 'João Demo',
        telefone: '+351911111111',
        role: 'cliente',
        estado: 'ativo',
        data_inicio: new Date().toISOString().split('T')[0],
        data_renovacao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      }, { onConflict: 'id' })
      if (profErr2) results.push({ cliente_profile: 'error', message: profErr2.message })
      else results.push({ cliente_profile: 'ok_no_plan', hint: 'Sem plano atribuído — atribui um plano no admin.' })
    } else {
      results.push({ cliente_profile: 'ok' })
    }
  }

  // ── 3. Verify ─────────────────────────────────────────────
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, nome, role, estado, plano_id')
    .in('role', ['admin', 'cliente'])
    .order('role')

  return NextResponse.json({
    message: '✅ Seed complete!',
    results,
    profiles: profiles || [],
    credentials: {
      admin:   `${adminEmail} / ${adminPass}`,
      cliente: `${clienteEmail} / ${clientePass}`,
    },
  })
}
