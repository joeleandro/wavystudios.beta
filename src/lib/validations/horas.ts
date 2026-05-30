import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Get Monday (start of week) for a given date — timezone-safe using UTC.
 */
export function getSegunda(date: Date): string {
  const d = new Date(date)
  const day = d.getUTCDay() // 0=Dom, 1=Seg, ...
  const diff = day === 0 ? -6 : 1 - day
  d.setUTCDate(d.getUTCDate() + diff)
  const yyyy = d.getUTCFullYear()
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(d.getUTCDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Get Sunday (end of week) for a given date — timezone-safe using UTC.
 */
function getDomingo(date: Date): string {
  const d = new Date(date)
  const day = d.getUTCDay()
  const diff = day === 0 ? 0 : 7 - day
  d.setUTCDate(d.getUTCDate() + diff)
  const yyyy = d.getUTCFullYear()
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(d.getUTCDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Verify weekly hours availability for a client.
 * Calculates directly from sessoes table (no horas_semana table needed).
 */
export async function verificarHorasSemana(
  supabase: SupabaseClient,
  clienteId: string,
  duracaoMin: number,
  dataStr: string
): Promise<{ ok: boolean; restantes: number; usadas: number; plano: number }> {
  const semanaInicio = getSegunda(new Date(dataStr + 'T12:00:00'))
  const semanaFim = getDomingo(new Date(dataStr + 'T12:00:00'))

  console.log('[HORAS] semanaInicio:', semanaInicio, 'semanaFim:', semanaFim, 'dataStr:', dataStr)

  // Get client's plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('planos(horas_semanais)')
    .eq('id', clienteId)
    .single()

  const horasPlanoMin = ((profile as any)?.planos?.horas_semanais ?? 0) * 60

  // Calculate used hours this week from sessoes table
  const { data: sessoes } = await supabase
    .from('sessoes')
    .select('duracao_minutos')
    .eq('cliente_id', clienteId)
    .gte('data', semanaInicio)
    .lte('data', semanaFim)
    .in('estado', ['pendente', 'confirmada', 'concluida'])

  const usadasMin = (sessoes || []).reduce((sum: number, s: any) => sum + s.duracao_minutos, 0)
  const restantesMin = Math.max(0, horasPlanoMin - usadasMin)

  console.log('[HORAS] plano:', horasPlanoMin, 'usadas:', usadasMin, 'restantes:', restantesMin, 'pedido:', duracaoMin)

  return {
    ok: duracaoMin <= restantesMin,
    restantes: restantesMin,
    usadas: usadasMin,
    plano: horasPlanoMin,
  }
}

/**
 * Increment used hours when a session is confirmed.
 * Updates the horas_semana table (creates record if doesn't exist).
 * Uses admin/service-role supabase client to bypass RLS.
 */
export async function incrementarHorasUsadas(
  supabase: SupabaseClient,
  clienteId: string,
  dataStr: string,
  duracaoMin: number,
) {
  const semanaInicio = getSegunda(new Date(dataStr + 'T12:00:00'))

  // Try to get existing record
  const { data: existente } = await supabase
    .from('horas_semana')
    .select('*')
    .eq('cliente_id', clienteId)
    .eq('semana_inicio', semanaInicio)
    .maybeSingle()

  if (existente) {
    // Update existing
    const { error } = await supabase
      .from('horas_semana')
      .update({
        horas_usadas: existente.horas_usadas + duracaoMin,
        horas_restantes: Math.max(0, existente.horas_restantes - duracaoMin),
      })
      .eq('cliente_id', clienteId)
      .eq('semana_inicio', semanaInicio)

    if (error) {
      console.error('[HORAS] Update error:', error)
    } else {
      console.log('[HORAS] ✅ Horas actualizadas:', {
        usadas: existente.horas_usadas + duracaoMin,
        restantes: existente.horas_restantes - duracaoMin,
      })
    }
  } else {
    // Create new record for this week
    const { data: profile } = await supabase
      .from('profiles')
      .select('planos(horas_semanais)')
      .eq('id', clienteId)
      .single()

    const horasPlanoMin = ((profile as any)?.planos?.horas_semanais ?? 0) * 60

    const { error } = await supabase
      .from('horas_semana')
      .insert({
        cliente_id: clienteId,
        semana_inicio: semanaInicio,
        horas_plano: horasPlanoMin,
        horas_usadas: duracaoMin,
        horas_restantes: Math.max(0, horasPlanoMin - duracaoMin),
      })

    if (error) {
      console.error('[HORAS] Insert error:', error)
    } else {
      console.log('[HORAS] ✅ horas_semana criado para semana:', semanaInicio)
    }
  }
}

export function calcularHorasTrabalhadasMes(horasSemanais: number, diasDecorridos: number): number {
  return Math.round((horasSemanais / 7) * diasDecorridos * 10) / 10
}
