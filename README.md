# Recanto Sonho Meu 🎉

Site e painel administrativo para o **Recanto Sonho Meu**, salão de festas em Uberlândia, MG.

**Live:** [recantosonhomeu.web.app](https://recantosonhomeu.web.app)
**Admin:** [recantosonhomeu.web.app/admin](https://recantosonhomeu.web.app/admin)

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | [Astro 7](https://astro.build) + [Tailwind CSS 4](https://tailwindcss.com) |
| Backend/DB | [Supabase](https://supabase.com) (PostgreSQL + Auth + Storage + Edge Functions) |
| Hosting | [Firebase Hosting](https://firebase.google.com/products/hosting) |
| Reviews | [Elfsight](https://elfsight.com) Google Reviews Widget (free tier) |

---

## Funcionalidades

### Landing Page (público)

- **Hero** com confetes animados e próxima data disponível em tempo real
- **Sobre** o espaço com descrição e fotos
- **Eventos** — tipos de evento suportados
- **Estrutura** — itens do espaço carregados do Supabase (ícone, quantidade, nome)
- **Calculadora de reservas** — calendário interativo com seleção de período, pacotes adicionais, resumo de preço e confirmação via WhatsApp
- **Galeria** — fotos com filtro por categoria, lightbox com navegação por teclado e swipe mobile
- **Tour Virtual 360°** — iframe configurável pelo admin
- **Depoimentos** — carrossel com autoplay e avaliações em estrelas
- **Google Reviews** — widget Elfsight configurável pelo admin
- **FAQ** — accordion com schema JSON-LD para SEO
- **Localização** — mapa embed do Google Maps + endereço + informações
- **Contato** — formulário de orçamento (salva como lead no Supabase) + botões WhatsApp/Instagram
- **Página de obrigado** — redirect após envio do formulário
- **Nav responsivo** — menu mobile com hamburger, troca de cor ao scroll
- **FABs** — botões flutuantes de WhatsApp e Instagram
- **PWA** — manifest.json + ícones para instalação mobile
- **SEO** — sitemap, Open Graph, meta tags

### Painel Admin (/admin)

- **Login** — autenticação via Supabase Auth (email/senha)
- **Agenda** — calendário com 3 meses, criar/editar/remover reservas, enviar confirmação via WhatsApp
- **Preços** — preço por dia da semana + datas especiais (Réveillon, feriados, etc.)
- **Pacotes** — CRUD de pacotes adicionais com ícone, preço, unidade, drag & drop para reordenar
- **Fotos** — upload para Supabase Storage, categorias, legendas, reordenação
- **Estrutura** — itens do espaço (salão, piscina, quartos, etc.)
- **Depoimentos** — CRUD com aprovação (só aprovados aparecem no site)
- **FAQ** — CRUD com ativo/inativo, drag & drop para reordenar
- **Leads** — tabela de solicitações do formulário de contato com filtros (busca, tipo, período)
- **Configurações** — WhatsApp, Instagram, endereço, Google Maps, Tour Virtual, email admin, horário, regras do espaço (lista dinâmica), max convidados, widget Google Reviews
- **Credenciais** — alterar email e senha do admin

---

## Estrutura do Projeto

```
src/
├── components/
│   ├── admin/           # Componentes do painel admin
│   │   ├── TabAgenda.astro
│   │   ├── TabPrecos.astro
│   │   ├── TabPacotes.astro
│   │   ├── TabFotos.astro
│   │   ├── TabEstrutura.astro
│   │   ├── TabDepoimentos.astro
│   │   ├── TabFAQ.astro
│   │   ├── TabLeads.astro
│   │   └── TabConfiguracoes.astro
│   └── landing/         # Componentes da landing page
│       ├── Nav.astro
│       ├── Hero.astro
│       ├── Sobre.astro
│       ├── Eventos.astro
│       ├── Estrutura.astro
│       ├── Calculadora.astro
│       ├── Galeria.astro
│       ├── TourVirtual.astro
│       ├── Depoimentos.astro
│       ├── GoogleReviews.astro
│       ├── FAQ.astro
│       ├── Localizacao.astro
│       ├── Contato.astro
│       └── Footer.astro
├── layouts/
│   ├── Base.astro       # Layout base (head, fontes, FABs)
│   └── Admin.astro      # Layout admin (sidebar, auth, toast)
├── lib/
│   ├── supabase.js      # Cliente Supabase + módulo db com CRUD completo
│   └── helpers.js       # Formatação de datas, preços, XSS escape, WhatsApp
├── pages/
│   ├── index.astro      # Landing page
│   ├── obrigado.astro   # Página pós-formulário
│   └── admin/
│       └── index.astro  # Painel admin
└── styles/
    └── global.css       # Tailwind config, tema, estilos globais
```

---

## Segurança

- **XSS Protection** — todos os dados do Supabase são escapados via `esc()` antes de renderizar com `innerHTML`
- **RLS (Row Level Security)** — todas as tabelas têm políticas:
  - Leitura pública para dados do site (preços, fotos, FAQ, etc.)
  - Escrita restrita a usuários autenticados
  - Leads permite INSERT anônimo (formulário público) mas SELECT apenas autenticado
- **Validação de URLs** — iframe do Maps aceita apenas `https://`
- **Input sanitization** — WhatsApp aceita apenas dígitos, datas validadas contra futuro/passado

---

## Setup Local

### Pré-requisitos

- Node.js 24+
- Conta no [Supabase](https://supabase.com)

### Instalação

```bash
git clone https://github.com/walisson-andrade/recanto-sonho-meu.github.io.git
cd recanto-sonho-meu.github.io
npm install
```

### Variáveis de ambiente

Crie um `.env` na raiz:

```env
PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

### Banco de dados

Execute o schema no SQL Editor do Supabase:

```bash
# O arquivo está em supabase/migrations/001_schema.sql
```

### Desenvolvimento

```bash
npm run dev
# Acesse http://localhost:4322
```

### Build

```bash
npm run build
```

---

## Deploy

### Firebase Hosting (produção)

```bash
npm run build
firebase deploy --only hosting
```

### GitHub Actions

O repositório tem workflow automático (`.github/workflows/deploy.yml`) que faz build e deploy no GitHub Pages a cada push na `main`. Os secrets `PUBLIC_SUPABASE_URL` e `PUBLIC_SUPABASE_ANON_KEY` devem estar configurados no repositório.

---

## Configurações Importantes

### Google Reviews (Elfsight)

1. Crie conta grátis em [elfsight.com](https://elfsight.com)
2. Crie widget de Google Reviews conectado ao Google Business
3. Copie o código do widget
4. Cole em Admin > Configurações > Widget Google Reviews

### Google Maps Embed

1. Abra [Google Maps](https://maps.google.com)
2. Pesquise o endereço
3. Compartilhar > Incorporar um mapa > copie só a URL do `src`
4. Cole em Admin > Configurações > Embed Maps

### Notificações

- **WhatsApp** — ao criar/editar reserva com "Enviar confirmação via WhatsApp" marcado, abre o WhatsApp Web com mensagem pronta
- **Email** — requer domínio próprio + Resend API (não configurado no momento)

---

## Licença

Projeto privado. Todos os direitos reservados.
