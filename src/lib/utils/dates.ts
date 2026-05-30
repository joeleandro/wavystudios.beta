/**
 * Get the start of the current month as ISO string (YYYY-MM-DD).
 */
export function inicioDoMes(date = new Date()): string {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)
  ).toISOString().split('T')[0]
}

/**
 * Get the end of the current month as ISO string (YYYY-MM-DD).
 */
export function fimDoMes(date = new Date()): string {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)
  ).toISOString().split('T')[0]
}

/**
 * Get Monday (start of week) for a given date — UTC-safe.
 */
export function getSegundaUTC(date = new Date()): string {
  const d = new Date(date)
  const day = d.getUTCDay() // 0=Dom, 1=Seg
  const diff = day === 0 ? -6 : 1 - day
  d.setUTCDate(d.getUTCDate() + diff)
  return d.toISOString().split('T')[0]
}

/**
 * Get Sunday (end of week) for a given date — UTC-safe.
 */
export function getDomingoUTC(date = new Date()): string {
  const d = new Date(date)
  const day = d.getUTCDay()
  const diff = day === 0 ? 0 : 7 - day
  d.setUTCDate(d.getUTCDate() + diff)
  return d.toISOString().split('T')[0]
}
