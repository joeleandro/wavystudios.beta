import { SupabaseClient } from '@supabase/supabase-js'

export async function verificarConflito(
  supabase: SupabaseClient,
  data: string,
  horaInicio: string,
  horaFim: string,
  sessaoIdExcluir?: string
): Promise<{ conflito: boolean; proximoSlot?: string }> {
  let query = supabase
    .from('sessoes')
    .select('id, hora_inicio, hora_fim')
    .eq('data', data)
    .in('estado', ['pendente', 'confirmada'])
    .lt('hora_inicio', horaFim)
    .gt('hora_fim', horaInicio)

  if (sessaoIdExcluir) {
    query = query.neq('id', sessaoIdExcluir)
  }

  const { data: conflitos } = await query
  const temConflito = (conflitos?.length ?? 0) > 0

  if (temConflito) {
    // Find next available slot
    const { data: allSessions } = await supabase
      .from('sessoes')
      .select('hora_inicio, hora_fim')
      .eq('data', data)
      .in('estado', ['pendente', 'confirmada'])
      .order('hora_inicio')

    const duracao = timeToMinutes(horaFim) - timeToMinutes(horaInicio)
    let nextSlot = '09:00'

    for (const s of allSessions || []) {
      if (timeToMinutes(s.hora_fim) <= timeToMinutes(nextSlot)) continue
      if (timeToMinutes(nextSlot) + duracao <= timeToMinutes(s.hora_inicio)) break
      nextSlot = s.hora_fim
    }

    if (timeToMinutes(nextSlot) + duracao > timeToMinutes('22:00')) {
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
  const startHour = 9
  const endHour = 22

  for (let minutes = startHour * 60; minutes + duracao <= endHour * 60; minutes += 30) {
    const slotStart = minutesToTime(minutes)
    const hasConflict = (existing || []).some((s: any) => {
      const existStart = timeToMinutes(s.hora_inicio)
      const existEnd = timeToMinutes(s.hora_fim)
      return minutes < existEnd && minutes + duracao > existStart
    })
    if (!hasConflict) slots.push(slotStart)
  }

  return slots
}

export function calcularHoraFim(horaInicio: string, duracaoMin: number): string {
  return minutesToTime(timeToMinutes(horaInicio) + duracaoMin)
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}
