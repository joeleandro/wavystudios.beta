import { Resend } from 'resend'

let resendInstance: Resend | null = null

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY)
  }
  return resendInstance
}

export async function emailNovaSessaoAdmin(sessao: any, cliente: any) {
  const resend = getResend()
  if (!resend) {
    console.log('[EMAIL] Skipped: no RESEND_API_KEY configured')
    return
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
  const produtorInfo = sessao.produtor ? `<p><strong>Produtor:</strong> ${sessao.produtor}</p>` : ''

  try {
    const { data, error } = await resend.emails.send({
      from: 'Wavy Studios <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL || 'admin@wavystudios.pt',
      subject: `Nova sessão: ${cliente.nome} — ${sessao.data}`,
      html: `
        <div style="font-family:system-ui;max-width:500px;margin:0 auto;padding:24px;background:#111;color:#e5e2e1;border-radius:12px">
          <h2 style="color:#ffb4a8;margin-bottom:16px">Nova sessão pendente</h2>
          <p><strong>Cliente:</strong> ${cliente.nome}</p>
          <p><strong>Data:</strong> ${sessao.data}</p>
          <p><strong>Hora:</strong> ${sessao.hora_inicio} — ${sessao.hora_fim}</p>
          <p><strong>Tipo:</strong> ${sessao.tipo}</p>
          ${produtorInfo}
          <p><strong>Duração:</strong> ${sessao.duracao_minutos}min</p>
          <br/>
          <a href="${baseUrl}/api/sessoes/confirmar?sessao_id=${sessao.id}&acao=confirmar"
             style="background:#16a34a;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin-right:12px">
            ✓ Confirmar
          </a>
          <a href="${baseUrl}/api/sessoes/confirmar?sessao_id=${sessao.id}&acao=recusar"
             style="background:#dc2626;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block">
            ✗ Recusar
          </a>
        </div>
      `,
    })

    if (error) {
      console.error('[EMAIL] Resend error:', error)
    } else {
      console.log('[EMAIL] Sent successfully:', data?.id)
    }
  } catch (err) {
    console.error('[EMAIL] Exception:', err)
  }
}

export async function emailSessaoConfirmada(clienteEmail: string, sessao: any) {
  const resend = getResend()
  if (!resend) return

  try {
    await resend.emails.send({
      from: 'Wavy Studios <onboarding@resend.dev>',
      to: clienteEmail,
      subject: `Sessão confirmada — ${sessao.data}`,
      html: `
        <div style="font-family:system-ui;max-width:500px;margin:0 auto;padding:24px;background:#111;color:#e5e2e1;border-radius:12px">
          <h2 style="color:#4ade80">Sessão confirmada ✓</h2>
          <p>A tua sessão de <strong>${sessao.data}</strong> às <strong>${sessao.hora_inicio}</strong> foi confirmada.</p>
          <p>Até lá!</p>
        </div>
      `,
    })
    console.log('[EMAIL] Confirmation sent to:', clienteEmail)
  } catch (err) {
    console.error('[EMAIL] Confirmation error:', err)
  }
}

export async function emailSessaoRecusada(clienteEmail: string, sessao: any) {
  const resend = getResend()
  if (!resend) return

  try {
    await resend.emails.send({
      from: 'Wavy Studios <onboarding@resend.dev>',
      to: clienteEmail,
      subject: `Sessão recusada — ${sessao.data}`,
      html: `
        <div style="font-family:system-ui;max-width:500px;margin:0 auto;padding:24px;background:#111;color:#e5e2e1;border-radius:12px">
          <h2 style="color:#f87171">Sessão recusada</h2>
          <p>A tua sessão de <strong>${sessao.data}</strong> às <strong>${sessao.hora_inicio}</strong> não foi aprovada.</p>
          <p>Por favor, marca outro horário.</p>
        </div>
      `,
    })
  } catch (err) {
    console.error('[EMAIL] Rejection error:', err)
  }
}

export async function emailContacto(nome: string, email: string, assunto: string, mensagem: string) {
  const resend = getResend()
  if (!resend) {
    console.log('[EMAIL] Contact skipped: no RESEND_API_KEY')
    return { success: false }
  }

  try {
    await resend.emails.send({
      from: 'Wavy Studios <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL || 'wavystudiosinfo@gmail.com',
      subject: `Contacto: ${assunto} — de ${nome}`,
      html: `
        <div style="font-family:system-ui;max-width:500px;margin:0 auto;padding:24px">
          <h2>Nova mensagem de contacto</h2>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Assunto:</strong> ${assunto}</p>
          <hr/>
          <p>${mensagem.replace(/\n/g, '<br/>')}</p>
        </div>
      `,
    })
    return { success: true }
  } catch (err) {
    console.error('[EMAIL] Contact error:', err)
    return { success: false }
  }
}



export async function emailEntregaCliente(
  clienteEmail: string,
  clienteNome: string,
  nomeFile: string,
  tipo: string,
  expiresAt: Date
) {
  const resend = getResend()
  if (!resend) return

  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

  try {
    await resend.emails.send({
      from: 'Wavy Studios <onboarding@resend.dev>',
      to: clienteEmail,
      subject: `Entrega pronta: ${nomeFile}`,
      html: `
        <div style="font-family:system-ui;max-width:500px;margin:0 auto;padding:24px;background:#111;color:#e5e2e1;border-radius:12px">
          <h2 style="color:#ffb4a8;margin-bottom:16px">Entrega disponível 🎵</h2>
          <p>Olá <strong>${clienteNome}</strong>,</p>
          <p>O teu <strong>${tipo}</strong> "<em>${nomeFile}</em>" está pronto para download.</p>
          <p style="color:#aaa">Disponível até: <strong>${expiresAt.toLocaleDateString('pt-PT')}</strong></p>
          <br/>
          <a href="${baseUrl}/dashboard"
             style="background:#8b0000;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block">
            Ver no Dashboard
          </a>
        </div>
      `,
    })
    console.log('[EMAIL] Entrega sent to:', clienteEmail)
  } catch (err) {
    console.error('[EMAIL] Entrega error:', err)
  }
}
