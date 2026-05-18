import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase/server'

/**
 * GET /api/setup
 * Full database + user reset. Safe to call multiple times.
 * Creates: planos, test users (admin + cliente), profiles
 */
export async function GET() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({
      error: 'SUPABASE_SERVICE_ROLE_KEY não configurada.',
      hint: 'Adiciona ao .env.local e reinicia.',
    }, { status: 500 })
  }

  const db = await createSupabaseAdmin()
  const log: string[] = []

  // ── STEP 1: Seed planos ────────────────────────────────────────
  const planos = [
    {
      id: 1,
      nome: 'Standard',
      descricao: 'Para artistas a começar',
      preco_mensal: 150,
      horas_semanais: 2,
      duracao_sessao_min: 60,
      mix_master_mes: 1,
    },
    {
      id: 2,
      nome: 'Professional',
      descricao: 'Para artistas activos',
      preco_mensal: 280,
      horas_semanais: 4,
      duracao_sessao_min: 90,
      mix_master_mes: 2,
    },
    {
      id: 3,
      nome: 'Advanced',
      descricao: 'Para profissionais',
      preco_mensal: 450,
      horas_semanais: 8,
      duracao_sessao_min: 120,
      mix_master_mes: 4,
    },
  ]

  for (const plano of planos) {
    const { error } = await db.from('planos').upsert(plano, { onConflict: 'id' })
    if (error) log.push(`⚠️  plano ${plano.nome}: ${error.message}`)
    else log.push(`✅ plano ${plano.nome} ok`)
  }

  // ── STEP 2: List existing users ────────────────────────────────
  const { data: usersData } = await db.auth.admin.listUsers({ perPage: 1000 })
  const existingUsers = usersData?.users ?? []

  // ── STEP 3: Admin account ──────────────────────────────────────
  const adminEmail = 'admin@wavystudios.pt'
  let adminId: string | null = existingUsers.find(u => u.email === adminEmail)?.id ?? null

  if (!adminId) {
    const { data, error } = await db.auth.admin.createUser({
      email: adminEmail,
      password: 'admin123',
      email_confirm: true,
      user_metadata: { nome: 'Admin Wavy', telefone: '+351939910528' },
    })
    if (error) { log.push(`❌ admin create: ${error.message}`) }
    else { adminId = data.user.id; log.push(`✅ admin criado: ${adminId}`) }
  } else {
    log.push(`ℹ️  admin já existe: ${adminId}`)
  }

  if (adminId) {
    const { error } = await db.from('profiles').upsert({
      id: adminId,
      nome: 'Admin Wavy',
      telefone: '+351939910528',
      role: 'admin',
      estado: 'ativo',
    }, { onConflict: 'id' })
    if (error) log.push(`⚠️  admin profile: ${error.message}`)
    else log.push(`✅ admin profile ok`)
  }

  // ── STEP 4: Cliente account ────────────────────────────────────
  const clienteEmail = 'cliente@wavystudios.pt'
  let clienteId: string | null = existingUsers.find(u => u.email === clienteEmail)?.id ?? null

  if (!clienteId) {
    const { data, error } = await db.auth.admin.createUser({
      email: clienteEmail,
      password: 'cliente123',
      email_confirm: true,
      user_metadata: { nome: 'João Demo', telefone: '+351911111111' },
    })
    if (error) { log.push(`❌ cliente create: ${error.message}`) }
    else { clienteId = data.user.id; log.push(`✅ cliente criado: ${clienteId}`) }
  } else {
    log.push(`ℹ️  cliente já existe: ${clienteId}`)
  }

  if (clienteId) {
    const { error } = await db.from('profiles').upsert({
      id: clienteId,
      nome: 'João Demo',
      telefone: '+351911111111',
      role: 'cliente',
      estado: 'ativo',
      plano_id: 2,
      data_inicio: new Date().toISOString().split('T')[0],
    }, { onConflict: 'id' })
    if (error) {
      // Retry without plano_id in case FK doesn't exist
      const { error: e2 } = await db.from('profiles').upsert({
        id: clienteId,
        nome: 'João Demo',
        telefone: '+351911111111',
        role: 'cliente',
        estado: 'ativo',
        data_inicio: new Date().toISOString().split('T')[0],
      }, { onConflict: 'id' })
      if (e2) log.push(`⚠️  cliente profile: ${e2.message}`)
      else log.push(`✅ cliente profile ok (sem plano — atribui no admin)`)
    } else {
      log.push(`✅ cliente profile ok (plano Professional)`)
    }
  }

  // ── STEP 5: Fix all orphan profiles (users with no profile) ───
  const allUsers = existingUsers.filter(u => u.email !== adminEmail && u.email !== clienteEmail)
  for (const u of allUsers) {
    const { data: existingProfile } = await db.from('profiles').select('id').eq('id', u.id).single()
    if (!existingProfile) {
      const nome = u.user_metadata?.nome || u.user_metadata?.full_name || u.email?.split('@')[0] || 'Artista'
      const { error } = await db.from('profiles').insert({
        id: u.id,
        nome,
        telefone: u.user_metadata?.telefone || null,
        role: 'cliente',
        estado: 'pendente',
      })
      if (error) log.push(`⚠️  orphan ${u.email}: ${error.message}`)
      else log.push(`✅ criou profile para ${u.email}`)
    }
  }

  // ── STEP 6: Verify ─────────────────────────────────────────────
  const { data: profiles } = await db
    .from('profiles')
    .select('id, nome, role, estado, plano_id')
    .order('role')

  const { data: planosDB } = await db.from('planos').select('id, nome, duracao_sessao_min').order('id')

  return NextResponse.json({
    ok: true,
    log,
    summary: {
      profiles: profiles?.length ?? 0,
      planos: planosDB?.length ?? 0,
    },
    credentials: {
      admin: `${adminEmail} / admin123`,
      cliente: `${clienteEmail} / cliente123`,
    },
    profiles,
    planos: planosDB,
  })
}
