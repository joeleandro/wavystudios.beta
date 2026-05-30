import { SupabaseClient } from '@supabase/supabase-js'

export async function verificarHorasSemana(
  supabase: SupabaseClient,
  clienteId: string,
  duracaoMin: number,
  dataStr: string
): Promise<{ ok: boolean; restantes: number; usadas: number; plano: number }> {
  const semanaInicio = getSegunda(new Date(dataStr))
  const semanaFim = getSexta(new Date(dataStr))

  // Get client's plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('planos(horas_semanais)')
    .eq('id', clienteId)
    .single()

  const horasPlanoMin = ((profile as any)?.planos?.horas_semanais ?? 0) * 60

  // Calculate used hours this week
  const { data: sessoes } = await supabase
    .from('sessoes')
    .select('duracao_minutos')
    .eq('cliente_id', clienteId)
    .gte('data', semanaInicio)
    .lte('data', semanaFim)
    .in('estado', ['pendente', 'confirmada', 'concluida'])

  const usadasMin = (sessoes || []).reduce((sum: number, s: any) => sum + s.duracao_minutos, 0)
  const restantesMin = Math.max(0, horasPlanoMin - usadasMin)

  return {
    ok: duracaoMin <= restantesMin,
    restantes: restantesMin,
    usadas: usadasMin,
    plano: horasPlanoMin,
  }
}

/**
 * Get Monday (start of week) for a given date — timezone-safe using UTC.
 */
export function getSegunda(date: Date): string {
  const d = new Date(date)
  // Use UTC to avoid timezone shifts
  const day = d.getUTCDay() // 0=Dom, 1=Seg, ...
  const diff = day === 0 ? -6 : 1 - day
  d.setUTCDate(d.getUTCDate() + diff)
  return d.toISOString().split('T')[0]
}

/**
 * Get Sunday (end of week) for a given date — timezone-safe using UTC.
 */
function getSexta(date: Date): string {
  const d = new Date(date)
  const day = d.getUTCDay() // 0=Dom, 1=Seg, ...
  const diff = day === 0 ? 0 : 7 - day
  d.setUTCDate(d.getUTCDate() + diff)
  return d.toISOString().split('T')[0]
}

export function calcularHorasTrabalhadasMes(horasSemanais: number, diasDecorridos: number): number {
  return Math.round((horasSemanais / 7) * diasDecorridos * 10) / 10
}
