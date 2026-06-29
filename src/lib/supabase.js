import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl || '', supabaseKey || '')

export const db = {
  reservas: {
    async listar() {
      const { data, error } = await supabase
        .from('reservas')
        .select('*')
        .order('data', { ascending: true })
      if (error) throw error
      return data
    },
    async adicionar(reserva) {
      const { data, error } = await supabase
        .from('reservas')
        .insert(reserva)
        .select()
        .single()
      if (error) throw error
      return data
    },
    async remover(id) {
      const { error } = await supabase.from('reservas').delete().eq('id', id)
      if (error) throw error
    }
  },

  precos: {
    async listar() {
      const { data, error } = await supabase
        .from('precos_semana')
        .select('*')
        .order('dia_semana')
      if (error) throw error
      return data
    },
    async atualizar(dia_semana, preco) {
      const { error } = await supabase
        .from('precos_semana')
        .update({ preco })
        .eq('dia_semana', dia_semana)
      if (error) throw error
    }
  },

  datasEspeciais: {
    async listar() {
      const { data, error } = await supabase
        .from('datas_especiais')
        .select('*')
        .order('data')
      if (error) throw error
      return data
    },
    async adicionar(item) {
      const { data, error } = await supabase
        .from('datas_especiais')
        .insert(item)
        .select()
        .single()
      if (error) throw error
      return data
    },
    async remover(id) {
      const { error } = await supabase.from('datas_especiais').delete().eq('id', id)
      if (error) throw error
    }
  },

  pacotes: {
    async listar() {
      const { data, error } = await supabase
        .from('pacotes')
        .select('*')
        .order('ordem')
      if (error) throw error
      return data
    },
    async adicionar(pacote) {
      const { data, error } = await supabase
        .from('pacotes')
        .insert(pacote)
        .select()
        .single()
      if (error) throw error
      return data
    },
    async atualizar(id, campos) {
      const { error } = await supabase
        .from('pacotes')
        .update(campos)
        .eq('id', id)
      if (error) throw error
    },
    async remover(id) {
      const { error } = await supabase.from('pacotes').delete().eq('id', id)
      if (error) throw error
    },
    async reordenar(itens) {
      for (const { id, ordem } of itens) {
        await supabase.from('pacotes').update({ ordem }).eq('id', id)
      }
    }
  },

  fotos: {
    async listar() {
      const { data, error } = await supabase
        .from('fotos')
        .select('*')
        .order('ordem')
      if (error) throw error
      return data
    },
    async adicionar(foto) {
      const { data, error } = await supabase
        .from('fotos')
        .insert(foto)
        .select()
        .single()
      if (error) throw error
      return data
    },
    async atualizar(id, campos) {
      const { error } = await supabase
        .from('fotos')
        .update(campos)
        .eq('id', id)
      if (error) throw error
    },
    async remover(id) {
      const { error } = await supabase.from('fotos').delete().eq('id', id)
      if (error) throw error
    },
    async upload(arquivo) {
      const nome = `${Date.now()}-${arquivo.name}`
      const { error } = await supabase.storage
        .from('fotos')
        .upload(nome, arquivo)
      if (error) throw error
      const { data } = supabase.storage.from('fotos').getPublicUrl(nome)
      return data.publicUrl
    },
    async reordenar(itens) {
      for (const { id, ordem } of itens) {
        await supabase.from('fotos').update({ ordem }).eq('id', id)
      }
    }
  },

  estrutura: {
    async listar() {
      const { data, error } = await supabase
        .from('estrutura')
        .select('*')
        .order('ordem')
      if (error) throw error
      return data
    },
    async adicionar(item) {
      const { data, error } = await supabase
        .from('estrutura')
        .insert(item)
        .select()
        .single()
      if (error) throw error
      return data
    },
    async atualizar(id, campos) {
      const { error } = await supabase
        .from('estrutura')
        .update(campos)
        .eq('id', id)
      if (error) throw error
    },
    async remover(id) {
      const { error } = await supabase.from('estrutura').delete().eq('id', id)
      if (error) throw error
    },
    async reordenar(itens) {
      for (const { id, ordem } of itens) {
        await supabase.from('estrutura').update({ ordem }).eq('id', id)
      }
    }
  },

  depoimentos: {
    async listar() {
      const { data, error } = await supabase
        .from('depoimentos')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    async adicionar(dep) {
      const { data, error } = await supabase
        .from('depoimentos')
        .insert(dep)
        .select()
        .single()
      if (error) throw error
      return data
    },
    async atualizar(id, campos) {
      const { error } = await supabase
        .from('depoimentos')
        .update(campos)
        .eq('id', id)
      if (error) throw error
    },
    async remover(id) {
      const { error } = await supabase.from('depoimentos').delete().eq('id', id)
      if (error) throw error
    }
  },

  leads: {
    async listar() {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    async adicionar(lead) {
      const { error } = await supabase.from('leads').insert(lead)
      if (error) throw error
    },
    async remover(id) {
      const { error } = await supabase.from('leads').delete().eq('id', id)
      if (error) throw error
    }
  },

  faq: {
    async listar() {
      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .order('ordem')
      if (error) throw error
      return data
    },
    async adicionar(item) {
      const { data, error } = await supabase
        .from('faq')
        .insert(item)
        .select()
        .single()
      if (error) throw error
      return data
    },
    async atualizar(id, campos) {
      const { error } = await supabase
        .from('faq')
        .update(campos)
        .eq('id', id)
      if (error) throw error
    },
    async remover(id) {
      const { error } = await supabase.from('faq').delete().eq('id', id)
      if (error) throw error
    },
    async reordenar(itens) {
      for (const { id, ordem } of itens) {
        await supabase.from('faq').update({ ordem }).eq('id', id)
      }
    }
  },

  config: {
    async listar() {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
      if (error) throw error
      return Object.fromEntries(data.map(r => [r.chave, r.valor]))
    },
    async atualizar(chave, valor) {
      const { error } = await supabase
        .from('configuracoes')
        .upsert({ chave, valor })
      if (error) throw error
    }
  }
}
