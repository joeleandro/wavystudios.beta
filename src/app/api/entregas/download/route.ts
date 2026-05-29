import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

const BUCKET = 'wavy-entregas'

// GET /api/entregas/download?id={entrega_id}
// Generates a signed URL for the client to download their file
export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const entregaId = searchParams.get('id')

  if (!entregaId) {
    return NextResponse.json({ error: 'ID da entrega não fornecido' }, { status: 400 })
  }

  // Get the entrega record
  const { data: entrega, error } = await supabase
    .from('entregas')
    .select('*')
    .eq('id', entregaId)
    .single()

  if (error || !entrega) {
    return NextResponse.json({ error: 'Entrega não encontrada' }, { status: 404 })
  }

  // Check ownership (client can only download their own)
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && entrega.cliente_id !== user.id) {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  // Check expiry
  const now = new Date()
  const expiresAt = new Date(entrega.expires_at)
  if (now > expiresAt) {
    return NextResponse.json({
      error: 'Ficheiro expirado. O link de download já não está disponível.',
    }, { status: 410 })
  }

  // Generate signed URL (valid for 1 hour)
  const { data: signedData, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(entrega.storage_path, 60 * 60) // 1 hour

  if (signError || !signedData?.signedUrl) {
    console.error('[ENTREGAS/DOWNLOAD] Signed URL error:', signError)
    return NextResponse.json({ error: 'Erro ao gerar link de download' }, { status: 500 })
  }

  // Increment download count
  await supabase
    .from('entregas')
    .update({ download_count: (entrega.download_count || 0) + 1 })
    .eq('id', entregaId)

  return NextResponse.json({
    url: signedData.signedUrl,
    nome_ficheiro: entrega.nome_ficheiro,
    expires_at: entrega.expires_at,
    download_count: (entrega.download_count || 0) + 1,
  })
}
