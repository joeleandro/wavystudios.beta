import { SupabaseClient } from '@supabase/supabase-js'

const BUFFER_MINUTES = 30 // 30min buffer between sessions

// Studio operating hours
export const HORA_ABERTURA = '12:00'
export const HORA_FECHO = '16:00'
// Maximum end time including the buffer allowance — last slot may end at 16:00,
// and the +30min buffer is allowed up to 16:30 so the last slot is not blocked.
export const HORA_FECHO_COM_BUFFER = '16:30'

export async function verificarConflito(
  supabase: SupabaseClient,
  data: string,
  horaInicio: string,
  horaFim: string,
  sessaoIdExcluir?: string
): Promise<{ conflito: boolean; proximoSlot?: string }> {
  // FIX 1: Add 30min buffer — check against hora_fim + 30min
  const horaFimComBuffer = minutesToTime(timeToMinutes(horaFim) + BUFFER_MINUTES)
  const horaInicioComBuffer = minutesToTime(Math.max(0, timeToMinutes(horaInicio) - BUFFER_MINUTES))

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

    const duracao = timeToMinutes(horaFim) - timeToMinutes(horaInicio)
    let nextSlot = HORA_ABERTURA

    for (const s of allSessions || []) {
      // Account for buffer when finding next slot
      const sessionEndWithBuffer = timeToMinutes(s.hora_fim) + BUFFER_MINUTES
      if (sessionEndWithBuffer <= timeToMinutes(nextSlot)) continue
      if (timeToMinutes(nextSlot) + duracao + BUFFER_MINUTES <= timeToMinutes(s.hora_inicio)) break
      nextSlot = minutesToTime(sessionEndWithBuffer)
    }

    // Last possible slot: hora_fim must be <= HORA_FECHO (16:00)
    if (timeToMinutes(nextSlot) + duracao > timeToMinutes(HORA_FECHO)) {
      return { conflito: true, proximoSlot: undefined }
    }

    return { conflito: true, proximoSlot: nextSlot }
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
  const startMinutes = timeToMinutes(HORA_ABERTURA) // 12:00
  const endMinutes = timeToMinutes(HORA_FECHO) // 16:00
  const endWithBufferMinutes = timeToMinutes(HORA_FECHO_COM_BUFFER) // 16:30

  // Generate slots based on duration. The last slot is one whose
  // hora_fim <= HORA_FECHO (16:00), with the +30min buffer permitted up to 16:30.
  // Step uses session duration so slots line up cleanly:
  //   60min → 12:00, 13:00, 14:00, 15:00 (last ends at 16:00)
  //   90min → 12:00, 13:30 (next would end at 16:30, slightly past close — skipped)
  //  120min → 12:00, 14:00 (last ends at 16:00)
  for (let minutes = startMinutes; ; minutes += duracao) {
    const slotEnd = minutes + duracao
    if (slotEnd > endMinutes) break
    // Buffer rule: hora_fim + 30min must not exceed HORA_FECHO_COM_BUFFER
    // (16:30) — for the listed step it's always satisfied when slotEnd <= 16:00.
    if (slotEnd + BUFFER_MINUTES > endWithBufferMinutes) break

    const slotStart = minutesToTime(minutes)
    const hasConflict = (existing || []).some((s: any) => {
      const existStart = timeToMinutes(s.hora_inicio)
      const existEnd = timeToMinutes(s.hora_fim) + BUFFER_MINUTES
      return minutes < existEnd && slotEnd + BUFFER_MINUTES > existStart
    })
    if (!hasConflict) slots.push(slotStart)
  }

  return slots
}

export function calcularHoraFim(horaInicio: string, duracaoMin: number): string {
  return minutesToTime(timeToMinutes(horaInicio) + duracaoMin)
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}
