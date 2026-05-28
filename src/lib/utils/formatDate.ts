/**
 * Format date in Portuguese: "Quinta-feira, 29 Maio 2025"
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date + (date.length === 10 ? 'T12:00:00' : '')) : date

  return d.toLocaleDateString('pt-PT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  .replace(/^\w/, c => c.toUpperCase())
  .replace(/ de /g, ' ')
}

/**
 * Short format for tables: "Qui, 29 Mai 2025"
 */
export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date + (date.length === 10 ? 'T12:00:00' : '')) : date

  return d.toLocaleDateString('pt-PT', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  .replace(/^\w/, c => c.toUpperCase())
  .replace(/\./g, '')
}

/**
 * Decomposed date for visual cards
 * Returns { weekday, dayMonth, year }
 */
export function formatDateParts(date: string | Date): { weekday: string; dayMonth: string; year: string } {
  const d = typeof date === 'string' ? new Date(date + (date.length === 10 ? 'T12:00:00' : '')) : date

  const weekday = d.toLocaleDateString('pt-PT', { weekday: 'long' })
    .replace(/^\w/, c => c.toUpperCase())

  const day = d.getDate()
  const month = d.toLocaleDateString('pt-PT', { month: 'long' })
    .replace(/^\w/, c => c.toUpperCase())

  const year = d.getFullYear().toString()

  return { weekday, dayMonth: `${day} ${month}`, year }
}
