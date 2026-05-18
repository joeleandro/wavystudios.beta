import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check env vars exist
  if (!url || !key || url.includes('placeholder')) {
    return NextResponse.json({
      status: 'error',
      message: 'Supabase env vars not configured',
      details: {
        NEXT_PUBLIC_SUPABASE_URL: url ? '✓ set' : '✗ missing',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: key ? '✓ set' : '✗ missing',
      }
    }, { status: 500 })
  }

  try {
    const supabase = createClient(url, key)

    // Test 1: Check connection by querying planos table
    const { data: planos, error: planosError } = await supabase
      .from('planos')
      .select('id, nome, preco_mensal')
      .order('id')

    if (planosError) {
      return NextResponse.json({
        status: 'error',
        message: 'Connected to Supabase but query failed',
        error: planosError.message,
        hint: planosError.hint || 'Run the SQL migration in supabase/migrations/001_initial.sql',
      }, { status: 500 })
    }

    // Test 2: Check auth service
    const { error: authError } = await supabase.auth.getSession()

    return NextResponse.json({
      status: 'ok',
      message: 'Supabase connected successfully!',
      checks: {
        connection: '✓',
        database: '✓',
        auth: authError ? '⚠ ' + authError.message : '✓',
        planos_count: planos?.length || 0,
        planos: planos,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (err: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to connect to Supabase',
      error: err.message,
    }, { status: 500 })
  }
}
