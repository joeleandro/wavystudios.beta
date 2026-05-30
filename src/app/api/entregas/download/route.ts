import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase/server'

const BUCKET = 'wavy-entregas'

// GET /api/entregas/download?id={entrega_id}
export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const entregaId = searchParams.get('id')

  if (!entregaId) {
    return NextResponse.json({ error: 'ID da entrega é obrigatório' }, { status: 400 })
  }

  const adminSupabase = await createSupabaseAdmin()

  // Get entrega
  const { data: entrega, error } = await adminSupabase
    .from('entregas')
    .select('*')
    .eq('id', entregaId)
    .single()

  if (error || !entrega) {
    return NextResponse.json({ error: 'Entrega não encontrada' }, { status: 404 })
  }

  // Check ownership (unless admin)
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && entrega.cliente_id !== user.id) {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  // Check expiry
  const now = new Date()
  const expiresAt = new Date(entrega.expires_at)
  if (now > expiresAt) {
    return NextResponse.json({ error: 'Ficheiro expirado. Já não está disponível.' }, { status: 410 })
  }

  // Generate signed URL (valid 1 hour for immediate download)
  const { data: signedUrl, error: urlError } = await adminSupabase.storage
    .from(BUCKET)
    .createSignedUrl(entrega.storage_path, 60 * 60) // 1 hour

  if (urlError || !signedUrl) {
    console.error('[ENTREGAS] Signed URL error:', urlError)
    return NextResponse.json({ error: 'Erro ao gerar link de download' }, { status: 500 })
  }

  // Increment download count
  const newCount = (entrega.download_count || 0) + 1
  await adminSupabase
    .from('entregas')
    .update({ download_count: newCount })
    .eq('id', entregaId)

  return NextResponse.json({
    url: signedUrl.signedUrl,
    nome_ficheiro: entrega.nome_ficheiro,
    expires_at: entrega.expires_at,
    download_count: newCount,
  })
}
