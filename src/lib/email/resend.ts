import { Resend } from 'resend'

let resendInstance: Resend | null = null

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY)
  }
  return resendInstance
}

const FROM = 'Wavy Studios <onboarding@resend.dev>'

const ADMIN = process.env.ADMIN_EMAIL || 'vlaudiosebastiao@gmail.com'
const BASE_URL = process.env.NEXT_PUBLIC_URL || 'https://wavystudios-beta.vercel.app'

// ─────────────────────────────────────
// 1. NOVA SESSÃO → EMAIL PARA ADMIN
// ─────────────────────────────────────
export async function emailNovaSessionAdmin({
  sessao,
  cliente,
}: {
  sessao: {
    id: string
    data: string
    hora_inicio: string
    hora_fim: string
    tipo: string
    produtor?: string | null
    duracao_minutos?: number
    notas?: string | null
  }
  cliente: { nome: string; email?: string; telefone?: string }
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[EMAIL] Skipped: no RESEND_API_KEY configured')
    return
  }

  const urlConfirmar = `${BASE_URL}/api/sessoes/confirmar?sessao_id=${sessao.id}&acao=confirmar`
  const urlRecusar = `${BASE_URL}/api/sessoes/confirmar?sessao_id=${sessao.id}&acao=recusar`

  try {
    const { data, error } = await getResend()!.emails.send({
      from: FROM,
      to: ADMIN,
      subject: `🎙️ Nova sessão: ${cliente.nome} — ${sessao.data}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#ffffff;border-radius:12px;overflow:hidden">
          <div style="background:#8B0000;padding:32px;text-align:center">
            <h1 style="margin:0;font-size:24px;letter-spacing:4px">WAVY STUDIOS</h1>
            <p style="margin:8px 0 0;opacity:0.8;font-size:13px">Nova sessão pendente de confirmação</p>
          </div>
          <div style="padding:32px">
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:12px;text-transform:uppercase;letter-spacing:1px;width:140px">Cliente</td>
                <td style="padding:10px 0;font-weight:600">${cliente.nome}</td>
              </tr>
              ${cliente.email ? `<tr><td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:12px;text-transform:uppercase;letter-spacing:1px">Contacto</td><td style="padding:10px 0">${cliente.email}${cliente.telefone ? ` · ${cliente.telefone}` : ''}</td></tr>` : ''}
              <tr>
                <td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:12px;text-transform:uppercase;letter-spacing:1px">Data</td>
                <td style="padding:10px 0;font-weight:600;color:#ff6b6b">${sessao.data}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:12px;text-transform:uppercase;letter-spacing:1px">Horário</td>
                <td style="padding:10px 0">${sessao.hora_inicio} — ${sessao.hora_fim}</td>
              </tr>
              ${sessao.produtor ? `<tr><td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:12px;text-transform:uppercase;letter-spacing:1px">Produtor</td><td style="padding:10px 0">${sessao.produtor}</td></tr>` : ''}
              <tr>
                <td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:12px;text-transform:uppercase;letter-spacing:1px">Tipo</td>
                <td style="padding:10px 0">${sessao.tipo}</td>
              </tr>
              ${sessao.duracao_minutos ? `<tr><td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:12px;text-transform:uppercase;letter-spacing:1px">Duração</td><td style="padding:10px 0">${sessao.duracao_minutos}min</td></tr>` : ''}
              ${sessao.notas ? `<tr><td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:12px;text-transform:uppercase;letter-spacing:1px">Notas</td><td style="padding:10px 0;color:rgba(255,255,255,0.7)">${sessao.notas}</td></tr>` : ''}
            </table>
            <div style="margin-top:40px">
              <a href="${urlConfirmar}" style="display:inline-block;background:#16a34a;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;letter-spacing:1px;margin-right:12px">✓ CONFIRMAR</a>
              <a href="${urlRecusar}" style="display:inline-block;background:#dc2626;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;letter-spacing:1px">✗ RECUSAR</a>
            </div>
            <p style="margin-top:24px;font-size:11px;color:rgba(255,255,255,0.3)">
              Ou acede ao dashboard: <a href="${BASE_URL}/admin" style="color:#8B0000">${BASE_URL}/admin</a>
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('[EMAIL] Resend error:', error)
    } else {
      console.log('[EMAIL] Nova sessão → admin:', data?.id)
    }
  } catch (err) {
    console.error('[EMAIL] Exception:', err)
  }
}

// ─────────────────────────────────────
// 2. SESSÃO CONFIRMADA → EMAIL PARA CLIENTE
// ─────────────────────────────────────
export async function emailSessaoConfirmada({
  sessao,
  cliente,
}: {
  sessao: {
    data: string
    hora_inicio: string
    hora_fim: string
    tipo: string
    produtor?: string | null
  }
  cliente: { nome: string; email: string }
}) {
  if (!process.env.RESEND_API_KEY) return

  const primeiroNome = cliente.nome.split(' ')[0]

  try {
    await getResend()!.emails.send({
      from: FROM,
      to: cliente.email,
      subject: `✅ Sessão confirmada — ${sessao.data}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#ffffff;border-radius:12px;overflow:hidden">
          <div style="background:#8B0000;padding:32px;text-align:center">
            <h1 style="margin:0;font-size:24px;letter-spacing:4px">WAVY STUDIOS</h1>
          </div>
          <div style="padding:32px">
            <h2 style="margin:0 0 8px;font-size:20px">Olá, ${primeiroNome} 👋</h2>
            <p style="color:rgba(255,255,255,0.6);margin:0 0 32px">A tua sessão foi confirmada.</p>
            <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:24px">
              <p style="margin:0 0 12px;font-size:13px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:2px">Detalhes da sessão</p>
              <p style="margin:8px 0;font-size:22px;font-weight:700;color:#ff6b6b">${sessao.data}</p>
              <p style="margin:4px 0">🕐 ${sessao.hora_inicio} — ${sessao.hora_fim}</p>
              <p style="margin:4px 0">🎚️ ${sessao.tipo}</p>
              ${sessao.produtor ? `<p style="margin:4px 0">👤 Produtor: ${sessao.produtor}</p>` : ''}
            </div>
            <div style="margin-top:32px;padding:16px;background:rgba(139,0,0,0.15);border-left:3px solid #8B0000;border-radius:4px">
              <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.7)">⚠️ Sessões canceladas não podem ser remarcadas.<br/>Chega com 5 minutos de antecedência.</p>
            </div>
            <a href="${BASE_URL}/dashboard" style="display:inline-block;margin-top:32px;background:#8B0000;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;letter-spacing:1px">Ver Dashboard</a>
          </div>
          <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:rgba(255,255,255,0.3)">Wavy Studios · wavystudiosinfo@gmail.com</div>
        </div>
      `,
    })
    console.log('[EMAIL] Confirmação → cliente:', cliente.email)
  } catch (err) {
    console.error('[EMAIL] Confirmation error:', err)
  }
}

// ─────────────────────────────────────
// 3. SESSÃO RECUSADA → EMAIL PARA CLIENTE
// ─────────────────────────────────────
export async function emailSessaoRecusada({
  sessao,
  cliente,
}: {
  sessao: { data: string; hora_inicio: string }
  cliente: { nome: string; email: string }
}) {
  if (!process.env.RESEND_API_KEY) return

  const primeiroNome = cliente.nome.split(' ')[0]

  try {
    await getResend()!.emails.send({
      from: FROM,
      to: cliente.email,
      subject: `❌ Sessão não confirmada — ${sessao.data}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#ffffff;border-radius:12px;overflow:hidden">
          <div style="background:#8B0000;padding:32px;text-align:center">
            <h1 style="margin:0;font-size:24px;letter-spacing:4px">WAVY STUDIOS</h1>
          </div>
          <div style="padding:32px">
            <h2 style="margin:0 0 8px">Olá, ${primeiroNome}</h2>
            <p style="color:rgba(255,255,255,0.6);margin:0 0 24px">A sessão de ${sessao.data} às ${sessao.hora_inicio} não foi possível confirmar.</p>
            <p style="color:rgba(255,255,255,0.6)">Podes marcar outro horário disponível no teu dashboard.</p>
            <a href="${BASE_URL}/sessoes" style="display:inline-block;margin-top:32px;background:#8B0000;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;letter-spacing:1px">Marcar Nova Sessão</a>
            <p style="margin-top:24px;font-size:13px;color:rgba(255,255,255,0.4)">Dúvidas? Fala connosco:<br/>wavystudiosinfo@gmail.com<br/><a href="https://wa.me/351939910528" style="color:#8B0000">WhatsApp</a></p>
          </div>
          <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:rgba(255,255,255,0.3)">Wavy Studios · wavystudiosinfo@gmail.com</div>
        </div>
      `,
    })
    console.log('[EMAIL] Recusa → cliente:', cliente.email)
  } catch (err) {
    console.error('[EMAIL] Rejection error:', err)
  }
}

// ─────────────────────────────────────
// 4. ENTREGA DE FICHEIRO → EMAIL PARA CLIENTE
// ─────────────────────────────────────
export async function emailEntregaFicheiro({
  entrega,
  cliente,
  downloadUrl,
}: {
  entrega: {
    nome_ficheiro: string
    tipo: string
    expires_at: string
  }
  cliente: { nome: string; email: string }
  downloadUrl: string
}) {
  if (!process.env.RESEND_API_KEY) return

  const primeiroNome = cliente.nome.split(' ')[0]
  const dataExpiracao = new Date(entrega.expires_at).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  try {
    await getResend()!.emails.send({
      from: FROM,
      to: cliente.email,
      subject: `🎵 O teu ${entrega.tipo} está pronto — Wavy Studios`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#ffffff;border-radius:12px;overflow:hidden">
          <div style="background:#8B0000;padding:32px;text-align:center">
            <h1 style="margin:0;font-size:24px;letter-spacing:4px">WAVY STUDIOS</h1>
          </div>
          <div style="padding:32px">
            <h2 style="margin:0 0 8px">Olá, ${primeiroNome} 🎵</h2>
            <p style="color:rgba(255,255,255,0.6);margin:0 0 32px">O teu ficheiro está pronto para download.</p>
            <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:24px">
              <p style="margin:0 0 8px;font-size:13px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:2px">Ficheiro</p>
              <p style="margin:0 0 4px;font-weight:600;font-size:18px">${entrega.nome_ficheiro}</p>
              <p style="margin:0;color:rgba(255,255,255,0.5);font-size:13px;text-transform:uppercase;letter-spacing:1px">${entrega.tipo}</p>
            </div>
            <a href="${downloadUrl}" style="display:block;margin-top:24px;background:#8B0000;color:white;padding:16px 32px;border-radius:8px;text-decoration:none;font-weight:600;letter-spacing:1px;text-align:center;font-size:15px">↓ Fazer Download</a>
            <div style="margin-top:24px;padding:16px;background:rgba(220,38,38,0.1);border-left:3px solid #dc2626;border-radius:4px">
              <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.7)">⚠️ Disponível até <strong>${dataExpiracao}</strong>. Após essa data o ficheiro será apagado automaticamente.</p>
            </div>
          </div>
          <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:rgba(255,255,255,0.3)">Wavy Studios · wavystudiosinfo@gmail.com</div>
        </div>
      `,
    })
    console.log('[EMAIL] Entrega → cliente:', cliente.email)
  } catch (err) {
    console.error('[EMAIL] Delivery error:', err)
  }
}

// ─────────────────────────────────────
// 5. CONTACTO → EMAIL PARA ADMIN
// ─────────────────────────────────────
export async function emailContacto(nome: string, email: string, assunto: string, mensagem: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[EMAIL] Contact skipped: no RESEND_API_KEY')
    return { success: false }
  }

  try {
    await getResend()!.emails.send({
      from: FROM,
      to: ADMIN,
      subject: `Contacto: ${assunto} — de ${nome}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#ffffff;border-radius:12px;overflow:hidden">
          <div style="background:#8B0000;padding:32px;text-align:center">
            <h1 style="margin:0;font-size:24px;letter-spacing:4px">WAVY STUDIOS</h1>
            <p style="margin:8px 0 0;opacity:0.8;font-size:13px">Nova mensagem de contacto</p>
          </div>
          <div style="padding:32px">
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Assunto:</strong> ${assunto}</p>
            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:20px 0"/>
            <p style="line-height:1.7">${mensagem.replace(/\n/g, '<br/>')}</p>
          </div>
        </div>
      `,
    })
    return { success: true }
  } catch (err) {
    console.error('[EMAIL] Contact error:', err)
    return { success: false }
  }
}
