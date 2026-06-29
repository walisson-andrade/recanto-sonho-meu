const DIAS_SEMANA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const DIAS_CURTOS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

export function formatarPreco(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

export function formatarData(dataStr) {
  const d = new Date(dataStr + 'T00:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatarDataExtenso(dataStr) {
  const d = new Date(dataStr + 'T00:00:00')
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`
}

export function diaSemana(dataStr) {
  const d = new Date(dataStr + 'T00:00:00')
  return DIAS_SEMANA[d.getDay()]
}

export function diaSemanaAbrev(dataStr) {
  const d = new Date(dataStr + 'T00:00:00')
  return DIAS_CURTOS[d.getDay()]
}

export function nomeMes(indice) {
  return MESES[indice]
}

export function nomesDiasCurtos() {
  return DIAS_CURTOS
}

export function gerarUrlWhatsApp(numero, mensagem) {
  const msg = encodeURIComponent(mensagem)
  return `https://wa.me/${numero}?text=${msg}`
}

export function calcularPrecoData(dataStr, precosSemana, datasEspeciais) {
  const d = new Date(dataStr + 'T00:00:00')
  const especial = datasEspeciais.find(de => {
    if (de.recorrente) {
      const deData = new Date(de.data + 'T00:00:00')
      return deData.getMonth() === d.getMonth() && deData.getDate() === d.getDate()
    }
    return de.data === dataStr
  })
  if (especial) return { preco: Number(especial.preco), label: especial.label }
  const diaSem = precosSemana.find(p => p.dia_semana === d.getDay())
  return { preco: diaSem ? Number(diaSem.preco) : 500, label: DIAS_SEMANA[d.getDay()] }
}

export function gerarIniciais(nome) {
  return nome
    .split(' ')
    .filter(p => p.length > 0)
    .slice(0, 2)
    .map(p => p[0].toUpperCase())
    .join('')
}

export function dataParaISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export { DIAS_SEMANA, DIAS_CURTOS, MESES }
