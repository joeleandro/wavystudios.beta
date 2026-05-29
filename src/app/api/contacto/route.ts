import { NextRequest, NextResponse } from 'next/server'
import { emailContacto } from '@/lib/email/resend'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { nome, email, assunto, mensagem } = body

  if (!nome || !email || !assunto || !mensagem) {
    return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 })
  }

  const result = await emailContacto(nome, email, assunto, mensagem)

  if (result.success) {
    return NextResponse.json({ message: 'Mensagem enviada com sucesso!' })
  } else {
    return NextResponse.json({ message: 'Mensagem registada. Entraremos em contacto em breve.' })
  }
}
