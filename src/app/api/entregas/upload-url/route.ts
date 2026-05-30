import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const BUCKET = 'wavy-entregas'
const ALLOWED_EXTENSIONS = ['.mp3', '.wav', '.aiff', '.flac', '.zip', '.jpg', '.png']

// GET /api/entregas/upload-url?sessao_id=X&cliente_id=Y&filename=Z
// Returns a signed upload URL so the client can upload the file DIRECTLY to
// Supabase Storage, bypassing the Vercel serverless 4.5MB request-body limit.
export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  // Admin only
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Apenas admin pode enviar ficheiros' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const sessaoId = searchParams.get('sessao_id')
  const clienteId = searchParams.get('cliente_id')
  const filename = searchParams.get('filename')

  if (!sessaoId || !clienteId || !filename) {
    return NextResponse.json({ error: 'sessao_id, cliente_id e filename são obrigatórios' }, { status: 400 })
  }

  // Validate extension
  const ext = '.' + filename.split('.').pop()?.toLowerCase()
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return NextResponse.json({
      error: `Formato não suportado (${ext}). Aceites: ${ALLOWED_EXTENSIONS.join(', ')}`,
    }, { status: 400 })
  }

  // Sanitize filename (keep it simple, avoid path traversal)
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  const storagePath = `${clienteId}/${sessaoId}/${Date.now()}_${safeName}`

  const adminSupabase = await createSupabaseAdmin()
  const { data, error } = await adminSupabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(storagePath)

  if (error || !data) {
    console.error('[ENTREGAS] createSignedUploadUrl error:', error)
    return NextResponse.json({
      error: `Erro ao preparar upload: ${error?.message || 'bucket inexistente?'}`,
    }, { status: 500 })
  }

  return NextResponse.json({ path: storagePath, token: data.token })
}
