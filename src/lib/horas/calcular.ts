import { SupabaseClient } from '@supabase/supabase-js'

export interface Sessao {
  id: string
  data: string
  hora_inicio: string
  hora_fim: string
  tipo: string
  estado: string
  duracao_minutos: number
  produtor?: string | null
}

export interface HorasCliente {
  // Semana actual (within cycle)
  horasUsadasSemana: number
  horasRestantesSemana: number
  horasPlanoDiaSemana: number
  semanaActual: number       // 1-indexed (1 to 4)
  totalSemanas: number       // always 4
  inicioSemana: string       // ISO date
  fimSemana: string          // ISO date

  // Ciclo actual (monthly)
  horasUsadasCiclo: number
  horasRestantesCiclo: number
  horasPlanoCiclo: number
  dataInicio: string
  dataRenovacao: string
  diasRestantesCiclo: number

  // Mix/Master
  mmUsados: number
  mmRestantes: number
  mmPlano: number

  // Sessões
  totalSessoesCiclo: number
  proximaSessao: Sessao | null
}

/**
 * Dynamically calculates all hours/usage info for a client based on their
 * renewal cycle (data_inicio → data_renovacao) and confirmed/concluded sessions.
 * No horas_semana table needed — everything is computed from sessoes.
 */
export async function calcularHorasCliente(
  supabase: SupabaseClient,
  clienteId: string,
): Promise<HorasCliente | null> {
  // 1. Fetch profile + plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, planos(*)')
    .eq('id', clienteId)
    .single()

  if (!profile || !profile.planos || !profile.data_inicio || !profile.data_renovacao) {
    return null
  }

  const plano = profile.planos as any
  const dataInicio = profile.data_inicio as string
  const dataRenovacao = profile.data_renovacao as string
  const hoje = new Date()
  const hojeStr = hoje.toISOString().split('T')[0]

  // 2. Fetch all sessions within this cycle (confirmed + concluded)
  const { data: sessoes } = await supabase
    .from('sessoes')
    .select('*')
    .eq('cliente_id', clienteId)
    .in('estado', ['confirmada', 'concluida'])
    .gte('data', dataInicio)
    .lt('data', dataRenovacao)
    .order('data', { ascending: true })

  const sessoesValidas = (sessoes || []) as Sessao[]

  // 3. Calculate which week of the cycle we're in
  const inicioDate = new Date(dataInicio + 'T00:00:00Z')
  const diasDecorridos = Math.max(0, Math.floor(
    (hoje.getTime() - inicioDate.getTime()) / (1000 * 60 * 60 * 24)
  ))
  const semanaIdx = Math.min(Math.floor(diasDecorridos / 7), 3) // 0,1,2,3

  const inicioSemana = new Date(inicioDate)
  inicioSemana.setUTCDate(inicioDate.getUTCDate() + semanaIdx * 7)
  const fimSemana = new Date(inicioSemana)
  fimSemana.setUTCDate(inicioSemana.getUTCDate() + 7)

  const inicioSemanaStr = inicioSemana.toISOString().split('T')[0]
  const fimSemanaStr = fimSemana.toISOString().split('T')[0]

  // 4. Sessions within this week
  const sessoesSemana = sessoesValidas.filter(
    s => s.data >= inicioSemanaStr && s.data < fimSemanaStr
  )
  const minutosUsadosSemana = sessoesSemana.reduce((acc, s) => acc + s.duracao_minutos, 0)
  const horasUsadasSemana = minutosUsadosSemana / 60
  const horasPlanoDiaSemana = plano.horas_semanais || 0
  const horasRestantesSemana = Math.max(0, horasPlanoDiaSemana - horasUsadasSemana)

  // 5. Full cycle hours
  const minutosTotaisCiclo = sessoesValidas.reduce((acc, s) => acc + s.duracao_minutos, 0)
  const horasUsadasCiclo = minutosTotaisCiclo / 60
  const horasPlanoCiclo = (plano.horas_semanais || 0) * 4 // 4 weeks
  const horasRestantesCiclo = Math.max(0, horasPlanoCiclo - horasUsadasCiclo)

  // 6. Mix/Master count in cycle
  const mmUsados = sessoesValidas.filter(s => s.tipo === 'mix_master').length
  const mmPlano = plano.mix_master_mes || 0
  const mmRestantes = Math.max(0, mmPlano - mmUsados)

  // 7. Days remaining in cycle
  const renovacaoDate = new Date(dataRenovacao + 'T00:00:00Z')
  const diasRestantesCiclo = Math.max(0, Math.ceil(
    (renovacaoDate.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
  ))

  // 8. Next confirmed session
  const proximaSessao = await getProximaSessao(supabase, clienteId, hojeStr)

  return {
    horasUsadasSemana,
    horasRestantesSemana,
    horasPlanoDiaSemana,
    semanaActual: semanaIdx + 1,
    totalSemanas: 4,
    inicioSemana: inicioSemanaStr,
    fimSemana: fimSemanaStr,

    horasUsadasCiclo,
    horasRestantesCiclo,
    horasPlanoCiclo,
    dataInicio,
    dataRenovacao,
    diasRestantesCiclo,

    mmUsados,
    mmRestantes,
    mmPlano,

    totalSessoesCiclo: sessoesValidas.length,
    proximaSessao,
  }
}

async function getProximaSessao(
  supabase: SupabaseClient,
  clienteId: string,
  hojeStr: string,
): Promise<Sessao | null> {
  const { data } = await supabase
    .from('sessoes')
    .select('*')
    .eq('cliente_id', clienteId)
    .in('estado', ['confirmada', 'pendente'])
    .gte('data', hojeStr)
    .order('data', { ascending: true })
    .order('hora_inicio', { ascending: true })
    .limit(1)
    .maybeSingle()

  return data as Sessao | null
}
