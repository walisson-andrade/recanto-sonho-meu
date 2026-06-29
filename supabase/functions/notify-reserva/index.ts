import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const { reserva_id, enviar_cliente } = await req.json()

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Buscar reserva
    const reservaRes = await fetch(`${supabaseUrl}/rest/v1/reservas?id=eq.${reserva_id}&select=*`, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
    })
    const reservas = await reservaRes.json()
    const reserva = reservas[0]
    if (!reserva) throw new Error('Reserva não encontrada')

    // Buscar config
    const configRes = await fetch(`${supabaseUrl}/rest/v1/configuracoes?select=*`, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
    })
    const configData = await configRes.json()
    const config: Record<string, string> = {}
    configData.forEach((c: { chave: string; valor: string }) => { config[c.chave] = c.valor })

    const whatsapp = config.whatsapp || '5534999763010'
    const emailAdmin = config.email_admin || 'contato@recantosonhomeu.com.br'

    const pacotes = Array.isArray(reserva.pacotes_selecionados)
      ? reserva.pacotes_selecionados.map((p: any) => p.nome || p).join(', ')
      : '—'

    const dataFormatada = new Date(reserva.data + 'T00:00:00').toLocaleDateString('pt-BR')
    const valor = reserva.valor_total
      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(reserva.valor_total)
      : '—'

    // Email para o cliente
    if (enviar_cliente && reserva.cliente_email) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Recanto Sonho Meu <noreply@recantosonhomeu.com.br>',
          to: [reserva.cliente_email],
          subject: '🎉 Reserva confirmada — Recanto Sonho Meu',
          html: `
            <h2>Sua reserva está confirmada!</h2>
            <p>Olá, <strong>${reserva.cliente_nome || 'cliente'}</strong>!</p>
            <p>Sua reserva para <strong>${dataFormatada}</strong> está confirmada.</p>
            <p><strong>Valor:</strong> ${valor}</p>
            <p><strong>Pacotes:</strong> ${pacotes}</p>
            <p>Fale conosco: <a href="https://wa.me/${whatsapp}">wa.me/${whatsapp}</a></p>
            <br/>
            <p>Equipe Recanto Sonho Meu 🎉</p>
          `,
        }),
      })
    }

    // Email para a dona
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Recanto Sonho Meu <noreply@recantosonhomeu.com.br>',
        to: [emailAdmin],
        subject: `📅 Nova reserva confirmada — ${dataFormatada}`,
        html: `
          <h2>Nova reserva confirmada</h2>
          <table style="border-collapse:collapse;width:100%">
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Data</strong></td><td style="padding:8px;border:1px solid #ddd">${dataFormatada}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Cliente</strong></td><td style="padding:8px;border:1px solid #ddd">${reserva.cliente_nome || '—'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>WhatsApp</strong></td><td style="padding:8px;border:1px solid #ddd">${reserva.cliente_whatsapp || '—'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Evento</strong></td><td style="padding:8px;border:1px solid #ddd">${reserva.tipo_evento || '—'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Convidados</strong></td><td style="padding:8px;border:1px solid #ddd">${reserva.num_convidados || '—'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Valor</strong></td><td style="padding:8px;border:1px solid #ddd">${valor}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Pacotes</strong></td><td style="padding:8px;border:1px solid #ddd">${pacotes}</td></tr>
          </table>
        `,
      }),
    })

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }
})
