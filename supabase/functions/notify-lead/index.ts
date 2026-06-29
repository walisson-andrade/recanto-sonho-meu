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
    const { nome, email, whatsapp, tipo_evento, data_desejada, num_convidados, mensagem } = await req.json()

    // Buscar email da dona nas configurações
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const configRes = await fetch(`${supabaseUrl}/rest/v1/configuracoes?chave=eq.email_admin&select=valor`, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
    })
    const configData = await configRes.json()
    const emailAdmin = configData[0]?.valor || 'contato@recantosonhomeu.com.br'

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Recanto Sonho Meu <noreply@recantosonhomeu.com.br>',
        to: [emailAdmin],
        subject: `🔔 Novo lead — ${nome}`,
        html: `
          <h2>Novo lead recebido!</h2>
          <table style="border-collapse:collapse;width:100%">
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Nome</strong></td><td style="padding:8px;border:1px solid #ddd">${nome}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Email</strong></td><td style="padding:8px;border:1px solid #ddd">${email || '—'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>WhatsApp</strong></td><td style="padding:8px;border:1px solid #ddd">${whatsapp || '—'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Tipo de evento</strong></td><td style="padding:8px;border:1px solid #ddd">${tipo_evento || '—'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Data desejada</strong></td><td style="padding:8px;border:1px solid #ddd">${data_desejada || '—'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Convidados</strong></td><td style="padding:8px;border:1px solid #ddd">${num_convidados || '—'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Mensagem</strong></td><td style="padding:8px;border:1px solid #ddd">${mensagem || '—'}</td></tr>
          </table>
        `,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(err)
    }

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
