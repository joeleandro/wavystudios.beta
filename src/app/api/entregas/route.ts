import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase/server'
import { emailEntregaFicheiro } from '@/lib/email/resend'

// Allow large file uploads (Next.js defaults to 4MB)
export const runtime = 'nodejs'
export const maxDuration = 60

const BUCKET = 'wavy-entregas'
const EXPIRY_DAYS = 14

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

// POST /api/entregas — Admin confirms an upload (file already in Storage via signed URL)
// Body (JSON): { sessao_id, cliente_id, tipo, nome_ficheiro, storage_path, tamanho_bytes }
export async function POST(req: NextRequest) {
  try {
    console.log('[ENTREGAS] 1. Recebendo confirmação...')
    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    // Check admin role
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Apenas admin pode enviar ficheiros' }, { status: 403 })
    }

    const body = await req.json()
    const {
      sessao_id: sessaoId,
      cliente_id: clienteId,
      tipo = 'projecto_final',
      nome_ficheiro: nomeFicheiro,
      storage_path: storagePath,
      tamanho_bytes: tamanhoBytes,
    } = body

    if (!sessaoId || !clienteId || !nomeFicheiro || !storagePath) {
      return NextResponse.json({ error: 'Dados em falta (sessao_id, cliente_id, nome_ficheiro, storage_path)' }, { status: 400 })
    }

    console.log('[ENTREGAS] 2. Confirmar:', nomeFicheiro, storagePath, tamanhoBytes)

    const adminSupabase = await createSupabaseAdmin()

    // Verify the file actually exists in storage (defensive)
    const { error: dlErr } = await adminSupabase.storage.from(BUCKET).download(storagePath)
    if (dlErr) {
      console.error('[ENTREGAS] File not found in storage:', dlErr)
      return NextResponse.json({ error: 'Ficheiro não encontrado no storage. Tenta novamente.' }, { status: 400 })
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
        nome_ficheiro: nomeFicheiro,
        tipo,
        storage_path: storagePath,
        tamanho_bytes: tamanhoBytes || 0,
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
    const { data: cliente } = await adminSupabase.from('profiles').select('nome, telefone').eq('id', clienteId).single()
    const { data: clienteAuth } = await adminSupabase.auth.admin.getUserById(clienteId)
    const clienteEmail = clienteAuth?.user?.email

    // Create dashboard notification
    await adminSupabase.from('notificacoes').insert({
      sessao_id: sessaoId,
      destinatario: clienteId,
      tipo: 'entrega',
      canal: 'dashboard',
      mensagem: `O teu ${tipo} "${nomeFicheiro}" está pronto para download. Disponível até ${expiresAt.toLocaleDateString('pt-PT')}.`,
    })

    // Send email (non-blocking)
    if (clienteEmail && cliente) {
      const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://wavystudios-beta.vercel.app'
      emailEntregaFicheiro({
        entrega: { nome_ficheiro: nomeFicheiro, tipo, expires_at: expiresAt.toISOString() },
        cliente: { nome: cliente.nome, email: clienteEmail },
        downloadUrl: `${baseUrl}/entregas`,
      }).catch(console.error)
    }

    // Send WPP (non-blocking)
    if (cliente?.telefone && process.env.TWILIO_SID && process.env.TWILIO_TOKEN) {
      sendWppEntrega(cliente.telefone, cliente?.nome || 'Artista', nomeFicheiro, tipo, expiresAt).catch(console.error)
    }

    return NextResponse.json({ entrega, message: 'Ficheiro enviado com sucesso!' })
  } catch (err) {
    console.error('[ENTREGAS] CATCH error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
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
