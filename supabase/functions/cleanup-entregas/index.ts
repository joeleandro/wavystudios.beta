// Supabase Edge Function: cleanup-entregas
// Runs daily via cron to delete expired file deliveries from Storage and DB.
// Schedule: '0 0 * * *' (every day at 00:00 UTC)
//
// To deploy:
//   supabase functions deploy cleanup-entregas
//
// To schedule via pg_cron (run in Supabase SQL Editor):
//   SELECT cron.schedule(
//     'cleanup-entregas',
//     '0 0 * * *',
//     $$ SELECT net.http_post(
//       url := 'https://<project-ref>.supabase.co/functions/v1/cleanup-entregas',
//       headers := '{"Authorization": "Bearer <service_role_key>"}'::jsonb
//     ) $$
//   );

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const BUCKET = 'wavy-entregas'

Deno.serve(async (req) => {
  // Only allow POST (cron calls) or manual invocations with auth
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseKey)

  const now = new Date().toISOString()

  // 1. Fetch all expired entregas
  const { data: expired, error: fetchError } = await supabase
    .from('entregas')
    .select('id, storage_path, nome_ficheiro')
    .lt('expires_at', now)

  if (fetchError) {
    console.error('[CLEANUP] Fetch error:', fetchError)
    return new Response(JSON.stringify({ error: fetchError.message }), { status: 500 })
  }

  if (!expired || expired.length === 0) {
    console.log('[CLEANUP] No expired files to clean up.')
    return new Response(JSON.stringify({ cleaned: 0 }), { status: 200 })
  }

  console.log(`[CLEANUP] Found ${expired.length} expired entregas.`)

  let cleaned = 0

  for (const entrega of expired) {
    // 2a. Delete file from Storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .remove([entrega.storage_path])

    if (storageError) {
      console.error(`[CLEANUP] Storage delete failed for ${entrega.storage_path}:`, storageError)
      // Continue anyway — file might already be gone
    }

    // 2b. Delete record from DB
    const { error: dbError } = await supabase
      .from('entregas')
      .delete()
      .eq('id', entrega.id)

    if (dbError) {
      console.error(`[CLEANUP] DB delete failed for ${entrega.id}:`, dbError)
    } else {
      cleaned++
      console.log(`[CLEANUP] Deleted: ${entrega.nome_ficheiro} (${entrega.storage_path})`)
    }
  }

  console.log(`[CLEANUP] Done. Cleaned ${cleaned}/${expired.length} files.`)

  return new Response(
    JSON.stringify({ cleaned, total: expired.length }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
})
