import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase/server'
import { emailEntregaFicheiro } from '@/lib/email/resend'

const BUCKET = 'wavy-entregas'
const EXPIRY_DAYS = 14
const MAX_SIZE = 500 * 1024 * 1024 // 500MB
const ALLOWED_EXTENSIONS = ['.mp3', '.wav', '.aiff', '.flac', '.zip', '.jpg', '.png']

// GET /api/entregas — List entregas for current user (or all for admin)
export async function GET() {
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
  const tipo = (formData.get('tipo') as string) || 'projecto_final'

  if (!file) {
    return NextResponse.json({ error: 'Ficheiro não enviado' }, { status: 400 })
  }
  if (!sessaoId || !clienteId) {
    return NextResponse.json({ error: 'sessao_id e cliente_id são obrigatórios' }, { status: 400 })
  }

  // Validate file extension
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return NextResponse.json({
      error: `Formato não suportado (${ext}). Aceites: ${ALLOWED_EXTENSIONS.join(', ')}`,
    }, { status: 400 })
  }

  // Validate file size
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Ficheiro excede 500MB' }, { status: 400 })
  }

  // Use admin client for storage operations (bypass RLS)
  const adminSupabase = await createSupabaseAdmin()

  // Upload to storage
  const storagePath = `${clienteId}/${sessaoId}/${Date.now()}_${file.name}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await adminSupabase.storage
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
  const { data: entrega, error: insertError } = await adminSupabase
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
    await adminSupabase.storage.from(BUCKET).remove([storagePath])
    console.error('[ENTREGAS] Insert error:', insertError)
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // Notify client
  const { data: cliente } = await adminSupabase.from('profiles').select('nome').eq('id', clienteId).single()
  const { data: clienteAuth } = await adminSupabase.auth.admin.getUserById(clienteId)
  const clienteEmail = clienteAuth?.user?.email

  // Create dashboard notification
  await adminSupabase.from('notificacoes').insert({
    sessao_id: sessaoId,
    destinatario: clienteId,
    tipo: 'entrega',
    canal: 'dashboard',
    mensagem: `O teu ${tipo} "${file.name}" está pronto para download. Disponível até ${expiresAt.toLocaleDateString('pt-PT')}.`,
  })

  // Send email (non-blocking)
  if (clienteEmail && cliente) {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://wavystudios-beta.vercel.app'
    emailEntregaFicheiro({
      entrega: { nome_ficheiro: file.name, tipo, expires_at: expiresAt.toISOString() },
      cliente: { nome: cliente.nome, email: clienteEmail },
      downloadUrl: `${baseUrl}/entregas`,
    }).catch(console.error)
  }

  // Send WPP (non-blocking)
  const { data: clienteProfile } = await adminSupabase.from('profiles').select('telefone').eq('id', clienteId).single()
  if (clienteProfile?.telefone && process.env.TWILIO_SID && process.env.TWILIO_TOKEN) {
    sendWppEntrega(clienteProfile.telefone, cliente?.nome || 'Artista', file.name, tipo, expiresAt).catch(console.error)
  }

  return NextResponse.json({ entrega, message: 'Ficheiro enviado com sucesso!' })
}

// ─── WhatsApp helper ───
async function sendWppEntrega(telefone: string, nome: string, nomeFile: string, tipo: string, expiresAt: Date) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://wavystudios-beta.vercel.app'
  const body = new URLSearchParams({
    From: 'whatsapp:+14155238886',
    To: `whatsapp:${telefone}`,
    Body:
      `🎵 *Wavy Studios*\n\n` +
      `Olá ${nome}! O teu ${tipo} "${nomeFile}" está pronto.\n` +
      `Tens até ${expiresAt.toLocaleDateString('pt-PT')} para fazer download.\n\n` +
      `🔗 Acede aqui: ${baseUrl}/entregas`,
  })

  await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_SID}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${process.env.TWILIO_SID}:${process.env.TWILIO_TOKEN}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    }
  )
}
