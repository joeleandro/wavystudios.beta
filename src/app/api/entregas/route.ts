import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { emailEntregaCliente } from '@/lib/notifications/email'
import { wppEntregaCliente } from '@/lib/notifications/whatsapp'

const BUCKET = 'wavy-entregas'
const EXPIRY_DAYS = 14
const MAX_SIZE = 500 * 1024 * 1024 // 500MB
const ALLOWED_TYPES = ['.mp3', '.wav', '.aiff', '.flac', '.zip', '.jpg', '.png']

// GET /api/entregas — List entregas for current user (or all for admin)
export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

  let query = supabase
    .from('entregas')
    .select('*, profiles!entregas_cliente_id_fkey(nome), sessoes(data, tipo)')
    .order('criado_em', { ascending: false })

  if (profile?.role !== 'admin') {
    query = query.eq('cliente_id', user.id)
  }

  const { data: entregas, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ entregas: entregas || [] })
}

// POST /api/entregas — Admin uploads a file for a client
export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  // Check admin role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Apenas admin pode enviar ficheiros' }, { status: 403 })
  }

  // Parse multipart form data
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const sessaoId = formData.get('sessao_id') as string
  const clienteId = formData.get('cliente_id') as string
  const tipo = formData.get('tipo') as string || 'projecto_final'

  if (!file) {
    return NextResponse.json({ error: 'Ficheiro não enviado' }, { status: 400 })
  }
  if (!sessaoId || !clienteId) {
    return NextResponse.json({ error: 'sessao_id e cliente_id são obrigatórios' }, { status: 400 })
  }

  // Validate file extension
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  if (!ALLOWED_TYPES.includes(ext)) {
    return NextResponse.json({
      error: `Formato não suportado (${ext}). Aceites: ${ALLOWED_TYPES.join(', ')}`,
    }, { status: 400 })
  }

  // Validate file size
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Ficheiro excede 500MB' }, { status: 400 })
  }

  // Upload to storage
  const storagePath = `${clienteId}/${sessaoId}/${Date.now()}_${file.name}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    console.error('[ENTREGAS] Upload error:', uploadError)
    return NextResponse.json({ error: `Erro no upload: ${uploadError.message}` }, { status: 500 })
  }

  // Calculate expiry date
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + EXPIRY_DAYS)

  // Insert record in DB
  const { data: entrega, error: insertError } = await supabase
    .from('entregas')
    .insert({
      sessao_id: sessaoId,
      cliente_id: clienteId,
      nome_ficheiro: file.name,
      tipo,
      storage_path: storagePath,
      tamanho_bytes: file.size,
      expires_at: expiresAt.toISOString(),
      download_count: 0,
      enviado_por: user.id,
    })
    .select()
    .single()

  if (insertError) {
    // Clean up uploaded file
    await supabase.storage.from(BUCKET).remove([storagePath])
    console.error('[ENTREGAS] Insert error:', insertError)
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // Notify client
  const { data: cliente } = await supabase.from('profiles').select('nome, telefone').eq('id', clienteId).single()

  // Create dashboard notification
  await supabase.from('notificacoes').insert({
    sessao_id: sessaoId,
    destinatario: clienteId,
    tipo: 'entrega',
    canal: 'dashboard',
    mensagem: `O teu ${tipo} "${file.name}" está pronto para download. Disponível até ${expiresAt.toLocaleDateString('pt-PT')}.`,
  })

  // Send email + WPP (non-blocking)
  if (cliente) {
    const { data: clienteAuth } = await supabase.auth.admin.getUserById(clienteId)
    const clienteEmail = clienteAuth?.user?.email
    if (clienteEmail) {
      emailEntregaCliente(clienteEmail, cliente.nome, file.name, tipo, expiresAt).catch(console.error)
    }
    if (cliente.telefone) {
      wppEntregaCliente(cliente.telefone, cliente.nome, file.name, tipo, expiresAt).catch(console.error)
    }
  }

  return NextResponse.json({ entrega, message: 'Ficheiro enviado com sucesso!' })
}
