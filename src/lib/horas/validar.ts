import { SupabaseClient } from '@supabase/supabase-js'
import { calcularHorasCliente } from './calcular'

export interface ValidacaoHoras {
  ok: boolean
  erro?: string
  restantesSemana: number
  restantesCiclo: number
}

/**
 * Validates whether a client has enough hours to book a session.
 * Replaces the old verificarHorasSemana() — no horas_semana table needed.
 */
export async function validarHorasParaSessao(
  supabase: SupabaseClient,
  clienteId: string,
  duracaoMin: number,
  dataSessao: string,
): Promise<ValidacaoHoras> {
  const horas = await calcularHorasCliente(supabase, clienteId)

  // No plan or no cycle configured — allow (admin will sort it)
  if (!horas) {
    return { ok: true, restantesSemana: 0, restantesCiclo: 0 }
  }

  // Check if session date is within the current cycle
  if (dataSessao < horas.dataInicio || dataSessao >= horas.dataRenovacao) {
    return {
      ok: false,
      erro: 'Data fora do ciclo de subscrição actual. Contacta o admin.',
      restantesSemana: horas.horasRestantesSemana,
      restantesCiclo: horas.horasRestantesCiclo,
    }
  }

  const duracaoHoras = duracaoMin / 60

  // Check if session falls in the current week of the cycle
  const naSemanActual = dataSessao >= horas.inicioSemana && dataSessao < horas.fimSemana

  if (naSemanActual) {
    if (duracaoHoras > horas.horasRestantesSemana) {
      return {
        ok: false,
        erro: `Horas semanais insuficientes. Restam ${horas.horasRestantesSemana.toFixed(1)}h desta semana (semana ${horas.semanaActual} de ${horas.totalSemanas}).`,
        restantesSemana: horas.horasRestantesSemana,
        restantesCiclo: horas.horasRestantesCiclo,
      }
    }
  }

  // Check total cycle hours
  if (duracaoHoras > horas.horasRestantesCiclo) {
    return {
      ok: false,
      erro: `Horas mensais esgotadas. Restam ${horas.horasRestantesCiclo.toFixed(1)}h no ciclo actual.`,
      restantesSemana: horas.horasRestantesSemana,
      restantesCiclo: horas.horasRestantesCiclo,
    }
  }

  return {
    ok: true,
    restantesSemana: horas.horasRestantesSemana,
    restantesCiclo: horas.horasRestantesCiclo,
  }
}
