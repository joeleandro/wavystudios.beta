import { Resend } from 'resend'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || 'dummy_key')
}

export async function emailNovaSessaoAdmin(sessao: any, cliente: any) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[EMAIL] Skipped: no RESEND_API_KEY')
    return
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

  await getResend().emails.send({
    from: 'SG Studio <noreply@sgstudio.pt>',
    to: process.env.ADMIN_EMAIL || 'admin@sgstudio.pt',
    subject: `Nova sessão: ${cliente.nome} — ${sessao.data}`,
    html: `
      <div style="font-family:system-ui;max-width:500px;margin:0 auto;padding:24px">
        <h2 style="color:#333;margin-bottom:16px">Nova sessão pendente</h2>
        <p><strong>Cliente:</strong> ${cliente.nome}</p>
        <p><strong>Data:</strong> ${sessao.data}</p>
        <p><strong>Hora:</strong> ${sessao.hora_inicio} — ${sessao.hora_fim}</p>
        <p><strong>Tipo:</strong> ${sessao.tipo}</p>
        <p><strong>Duração:</strong> ${sessao.duracao_minutos}min</p>
        <br/>
        <div style="display:flex;gap:12px">
          <a href="${baseUrl}/api/sessoes/confirmar?sessao_id=${sessao.id}&acao=confirmar"
             style="background:#16a34a;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block">
            ✓ Confirmar
          </a>
          <a href="${baseUrl}/api/sessoes/confirmar?sessao_id=${sessao.id}&acao=recusar"
             style="background:#dc2626;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin-left:12px">
            ✗ Recusar
          </a>
        </div>
      </div>
    `,
  })
}

export async function emailSessaoConfirmada(clienteEmail: string, sessao: any) {
  if (!process.env.RESEND_API_KEY) return

  await getResend().emails.send({
    from: 'SG Studio <noreply@sgstudio.pt>',
    to: clienteEmail,
    subject: `Sessão confirmada — ${sessao.data}`,
    html: `
      <div style="font-family:system-ui;max-width:500px;margin:0 auto;padding:24px">
        <h2 style="color:#16a34a">Sessão confirmada ✓</h2>
        <p>A tua sessão de <strong>${sessao.data}</strong> às <strong>${sessao.hora_inicio}</strong> foi confirmada.</p>
        <p>Até lá!</p>
      </div>
    `,
  })
}

export async function emailSessaoRecusada(clienteEmail: string, sessao: any) {
  if (!process.env.RESEND_API_KEY) return

  await getResend().emails.send({
    from: 'SG Studio <noreply@sgstudio.pt>',
    to: clienteEmail,
    subject: `Sessão recusada — ${sessao.data}`,
    html: `
      <div style="font-family:system-ui;max-width:500px;margin:0 auto;padding:24px">
        <h2 style="color:#dc2626">Sessão recusada</h2>
        <p>A tua sessão de <strong>${sessao.data}</strong> às <strong>${sessao.hora_inicio}</strong> não foi aprovada.</p>
        <p>Por favor, marca outro horário.</p>
      </div>
    `,
  })
}
