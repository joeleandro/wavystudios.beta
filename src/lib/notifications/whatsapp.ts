// WhatsApp notifications via Twilio REST API (no SDK needed)

export async function wppNovaSessaoAdmin(sessao: any, cliente: any) {
  if (!process.env.TWILIO_SID || !process.env.TWILIO_TOKEN || !process.env.ADMIN_PHONE) {
    console.log('[WPP] Skipped: no Twilio credentials')
    return
  }

  const body = new URLSearchParams({
    From: 'whatsapp:+14155238886',
    To: `whatsapp:${process.env.ADMIN_PHONE}`,
    Body:
      `🎙️ *Nova sessão Wavy Studios*\n\n` +
      `👤 Cliente: ${cliente.nome}\n` +
      `📅 Data: ${sessao.data}\n` +
      `⏰ Hora: ${sessao.hora_inicio} - ${sessao.hora_fim}\n` +
      `🎚️ Tipo: ${sessao.tipo}\n\n` +
      `Responde *SIM* para confirmar ou *NÃO* para recusar.`,
  })

  try {
    await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${process.env.TWILIO_SID}:${process.env.TWILIO_TOKEN}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      }
    )
  } catch (err) {
    console.error('[WPP] Error:', err)
  }
}

export async function wppSessaoConfirmada(telefone: string, sessao: any) {
  if (!process.env.TWILIO_SID || !process.env.TWILIO_TOKEN || !telefone) return

  const body = new URLSearchParams({
    From: 'whatsapp:+14155238886',
    To: `whatsapp:${telefone}`,
    Body: `✅ A tua sessão de ${sessao.data} às ${sessao.hora_inicio} foi *confirmada*! Até lá 🎶`,
  })

  try {
    await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${process.env.TWILIO_SID}:${process.env.TWILIO_TOKEN}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      }
    )
  } catch (err) {
    console.error('[WPP] Error:', err)
  }
}



export async function wppEntregaCliente(telefone: string, nome: string, ficheiro: string, tipo: string, expiresAt: Date) {
  if (!process.env.TWILIO_SID || !process.env.TWILIO_TOKEN || !telefone) return

  const dataExpStr = expiresAt.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long' })
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

  const body = new URLSearchParams({
    From: 'whatsapp:+14155238886',
    To: `whatsapp:${telefone}`,
    Body:
      `🎵 *Wavy Studios*\n\n` +
      `Olá ${nome}! O teu ${tipo} está pronto.\n` +
      `📁 Ficheiro: ${ficheiro}\n` +
      `⏱ Tens até ${dataExpStr} para fazer download.\n\n` +
      `Acede aqui: ${baseUrl}/dashboard`,
  })

  try {
    await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${process.env.TWILIO_SID}:${process.env.TWILIO_TOKEN}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      }
    )
  } catch (err) {
    console.error('[WPP] Entrega error:', err)
  }
}
