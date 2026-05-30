import { SupabaseClient } from '@supabase/supabase-js'

const BUFFER_MINUTES = 30 // 30min buffer between sessions

// Studio operating hours: 12:00 (noon) to 04:00 (4 AM next day)
// We use "extended minutes" where 04:00 next day = 28*60 = 1680
export const HORA_ABERTURA = '12:00'
export const HORA_FECHO = '04:00' // Next day
const ABERTURA_MIN = 12 * 60 // 720
const FECHO_MIN = 28 * 60 // 1680 (4:00 next day in extended format)

export async function verificarConflito(
  supabase: SupabaseClient,
  data: string,
  horaInicio: string,
  horaFim: string,
  sessaoIdExcluir?: string
): Promise<{ conflito: boolean; proximoSlot?: string }> {
  const horaFimComBuffer = minutesToTime(toExtended(horaFim) + BUFFER_MINUTES)
  const horaInicioComBuffer = minutesToTime(Math.max(0, toExtended(horaInicio) - BUFFER_MINUTES))

  let query = supabase
    .from('sessoes')
    .select('id, hora_inicio, hora_fim')
    .eq('data', data)
    .in('estado', ['pendente', 'confirmada'])
    .lt('hora_inicio', horaFimComBuffer)
    .gt('hora_fim', horaInicioComBuffer)

  if (sessaoIdExcluir) {
    query = query.neq('id', sessaoIdExcluir)
  }

  const { data: conflitos } = await query
  const temConflito = (conflitos?.length ?? 0) > 0

  if (temConflito) {
    const { data: allSessions } = await supabase
      .from('sessoes')
      .select('hora_inicio, hora_fim')
      .eq('data', data)
      .in('estado', ['pendente', 'confirmada'])
      .order('hora_inicio')

    const duracao = toExtended(horaFim) - toExtended(horaInicio)
    let nextSlot = ABERTURA_MIN

    for (const s of allSessions || []) {
      const sessionEndWithBuffer = toExtended(s.hora_fim) + BUFFER_MINUTES
      if (sessionEndWithBuffer <= nextSlot) continue
      if (nextSlot + duracao + BUFFER_MINUTES <= toExtended(s.hora_inicio)) break
      nextSlot = sessionEndWithBuffer
    }

    // Last possible slot: hora_fim must be <= FECHO_MIN
    if (nextSlot + duracao > FECHO_MIN) {
      return { conflito: true, proximoSlot: undefined }
    }

    return { conflito: true, proximoSlot: minutesToTime(nextSlot) }
  }

  return { conflito: false }
}

export async function obterSlotsDisponiveis(
  supabase: SupabaseClient,
  data: string,
  duracao: number
): Promise<string[]> {
  const { data: existing } = await supabase
    .from('sessoes')
    .select('hora_inicio, hora_fim')
    .eq('data', data)
    .in('estado', ['pendente', 'confirmada'])
    .order('hora_inicio')

  const slots: string[] = []

  // Generate slots from 12:00 to 04:00 (next day)
  // A slot is valid if its end time (start + duration) <= FECHO_MIN (04:00)
  for (let minutes = ABERTURA_MIN; minutes + duracao <= FECHO_MIN; minutes += duracao) {
    const slotEnd = minutes + duracao

    const hasConflict = (existing || []).some((s: any) => {
      const existStart = toExtended(s.hora_inicio)
      const existEnd = toExtended(s.hora_fim) + BUFFER_MINUTES
      return minutes < existEnd && slotEnd + BUFFER_MINUTES > existStart
    })

    if (!hasConflict) {
      slots.push(minutesToTime(minutes))
    }
  }

  return slots
}

export function calcularHoraFim(horaInicio: string, duracaoMin: number): string {
  return minutesToTime(toExtended(horaInicio) + duracaoMin)
}

/**
 * Convert "HH:MM" to extended minutes (handles times past midnight).
 * Hours 00:00–04:00 are treated as next-day (add 24h).
 * Hours 12:00–23:59 are treated as same-day.
 */
function toExtended(time: string): number {
  const [h, m] = time.split(':').map(Number)
  // If hour < 5 (i.e. 00:00–04:59), treat as next day
  if (h < 5) return (h + 24) * 60 + m
  return h * 60 + m
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function minutesToTime(minutes: number): string {
  // Normalize back: if >= 24*60 (1440), wrap to next day representation
  const normalized = minutes >= 24 * 60 ? minutes - 24 * 60 : minutes
  const h = Math.floor(normalized / 60)
  const m = normalized % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}
