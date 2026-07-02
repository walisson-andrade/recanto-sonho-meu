# PLANO.md — Recanto Sonho Meu

## 1. Resumo

Site completo para o salão de festas Recanto Sonho Meu (Uberlândia, GO), composto por uma landing page pública focada em captação de leads via WhatsApp e um painel administrativo protegido por Supabase Auth. Toda a gestão (reservas, preços, fotos, depoimentos, FAQ, estrutura, pacotes e configurações) é feita pelo painel admin. O site é estático (Astro 6), estilizado com Tailwind CSS v4, com dados dinâmicos carregados client-side via Supabase. Deploy via GitHub Pages com GitHub Actions. PWA instalável sem service worker.

---

## 2. Decisões Técnicas

| Decisão | Justificativa |
|---------|--------------|
| **Astro 7 → Astro 5** | Astro 7 é a versão mais recente (npm), porém o spec pede `^6`. O Astro pulou da v5 para v7 (não existe v6 publicada). Vou usar **Astro 5.x** (`^5`) que é a última versão estável da linha anterior, ou **Astro 7** se o objetivo é "mais recente". **Preciso de confirmação.** |
| **TypeScript 6 não existe** | A versão mais recente do TypeScript é 5.x (npm retornou 6.0.3 — verificar se é beta). Vou usar `^5.8` estável. **Preciso de confirmação.** |
| **Vanilla JS nos islands** | Componentes interativos (calendário, calculadora, galeria, admin) serão implementados como `<script>` tags nos componentes Astro, sem framework de UI. |
| **Supabase client via CDN ou npm** | Vou usar `@supabase/supabase-js` via npm para type-safety e bundling pelo Astro/Vite. |
| **Imagens/ícones PWA** | Ícones PWA precisam ser criados manualmente ou com ferramenta externa. Vou gerar placeholders SVG simples que o usuário pode substituir. |
| **Edge Functions** | Ficam em `supabase/functions/` como referência. O deploy delas é feito via Supabase CLI separadamente, não pelo GitHub Actions do site. |
| **Drag-and-drop no admin** | Implementado com a API nativa HTML5 Drag and Drop, sem bibliotecas externas. |
| **Lightbox da galeria** | Implementação vanilla JS customizada, sem dependência externa. |
| **Confetes no hero** | Canvas animation vanilla JS, respeitando `prefers-reduced-motion`. |
| **Calendário** | Componente customizado vanilla JS — sem lib externa. |

---

## 3. Ordem de Implementação

### Fase 0 — Infraestrutura
1. Inicializar projeto (`package.json`, dependências)
2. Configurar `astro.config.mjs`, `tsconfig.json`
3. Criar `Dockerfile` e `docker-compose.yml`
4. Criar `.env.example` e `.gitignore`
5. Criar `public/manifest.json` e placeholders dos ícones PWA
6. Criar `.github/workflows/deploy.yml`

### Fase 1 — Banco de Dados
7. Criar `supabase/migrations/001_schema.sql` (schema + seed + RLS)

### Fase 2 — Lib e Estilos
8. Criar `src/styles/global.css` (variáveis CSS, reset, fontes)
9. Criar `src/lib/supabase.js` (cliente Supabase + funções `db.*`)
10. Criar `src/lib/helpers.js` (formatação de datas, preços, WhatsApp URL)

### Fase 3 — Layouts
11. Criar `src/layouts/Base.astro` (head, meta, PWA, fonts, OG tags)
12. Criar `src/layouts/Admin.astro` (sidebar, auth wrapper)

### Fase 4 — Componentes da Landing Page
13. `Nav.astro` — navbar com links âncora, CTA, hambúrguer mobile
14. `Hero.astro` — badge, título, pill dinâmica, stats, confetes canvas
15. `Sobre.astro` — grid 2 colunas + 4 cards
16. `Eventos.astro` — 3 cards de tipos de evento
17. `Estrutura.astro` — grid dinâmico com dados do Supabase
18. `Calculadora.astro` — wizard 4 passos com cálculo em tempo real
19. `Agenda.astro` — calendário 2 meses, dias reservados/livres, modal WhatsApp
20. `Galeria.astro` — filtros, grid masonry, lightbox
21. `TourVirtual.astro` — iframe condicional
22. `Depoimentos.astro` — carrossel auto-play com pause
23. `FAQ.astro` — accordion + JSON-LD
24. `Localizacao.astro` — iframe Maps + endereço
25. `Contato.astro` — formulário de lead + botões WhatsApp/Instagram
26. `Footer.astro`

### Fase 5 — Páginas Públicas
27. `src/pages/index.astro` — composição de todos os componentes landing
28. `src/pages/obrigado.astro` — página pós-lead

### Fase 6 — Componentes do Admin
29. `Sidebar.astro` — navegação entre abas
30. `LoginOverlay.astro` — formulário de login
31. `TabAgenda.astro` — calendário admin + tabela de reservas + modal
32. `TabPrecos.astro` — preços por dia + datas especiais
33. `TabPacotes.astro` — CRUD + drag-and-drop + toggle
34. `TabFotos.astro` — upload drag-and-drop + Supabase Storage
35. `TabEstrutura.astro` — tabela editável + reordenação
36. `TabDepoimentos.astro` — tabela + toggle aprovado
37. `TabFAQ.astro` — tabela + toggle ativo + reordenação
38. `TabConfiguracoes.astro` — configurações gerais + email teste + senha

### Fase 7 — Página Admin
39. `src/pages/admin/index.astro` — composição dos componentes admin

### Fase 8 — Edge Functions
40. `supabase/functions/notify-lead/index.ts` (Resend)
41. `supabase/functions/notify-reserva/index.ts` (Resend)

### Fase 9 — Finalização
42. Testar build (`npm run build`)
43. Revisar acessibilidade, responsividade e `prefers-reduced-motion`
44. Validar sitemap.xml gerado

---

## 4. Pré-requisitos (para o usuário)

Antes de rodar o projeto:

1. **Supabase**: criar projeto em supabase.com e rodar `supabase/migrations/001_schema.sql` no SQL Editor
2. **Supabase Storage**: criar bucket público chamado `fotos`
3. **Supabase Auth**: criar usuário admin em Authentication → Users
4. **Resend**: criar conta em resend.com e obter API key
5. **Supabase Edge Functions**: adicionar `RESEND_API_KEY` nas secrets
6. **Env local**: copiar `.env.example` → `.env` e preencher `PUBLIC_SUPABASE_URL` e `PUBLIC_SUPABASE_ANON_KEY`
7. **GitHub Secrets**: cadastrar `PUBLIC_SUPABASE_URL` e `PUBLIC_SUPABASE_ANON_KEY` em Settings → Secrets → Actions
8. **GitHub Pages**: habilitar em Settings → Pages → Source: GitHub Actions
9. **Docker** (opcional): ter Docker instalado para usar `docker-compose up`

---

## 5. Dúvidas

1. **Versão do Astro**: O spec pede `^6`, mas o Astro não tem versão 6 publicada (pulou de 5.x para 7.x). Devo usar **Astro 5** (última estável antes do 7) ou **Astro 7** (versão mais recente)?

2. **TypeScript 6**: npm retornou versão 6.0.3 que pode ser recente. O spec pede `^6`. Confirmo que devo usar essa versão?

3. **Ícones PWA**: O spec menciona gerar ícones a partir do "logo do Recanto Sonho Meu", mas não há logo fornecido no projeto. Devo criar placeholders simples (texto/emoji) que o usuário substituirá depois?

4. **Supabase client**: O spec não lista `@supabase/supabase-js` nas dependências do `package.json`. Vou adicioná-lo como dependência — correto?

5. **`output: 'static'`**: Com site estático, toda interação com Supabase acontece client-side (browser). Isso significa que a anon key fica exposta no JS do cliente, protegida apenas pelas RLS policies. Isso é o esperado?

6. **Domínio**: O `site` no astro.config aponta para `recantosonhomeu08.github.io`. O arquivo `public/CNAME` deve ser criado vazio ou com algum domínio específico?

7. **Responsividade da Calculadora**: O mini-calendário inline na calculadora é o mesmo componente do calendário da seção Agenda, ou um componente separado mais simples (date picker)?

---

## 6. Auditoria de Segurança — Proteção de dados (RLS)

A chave anon do Supabase é pública por design (fica visível no DevTools de
qualquer visitante). A proteção real dos dados é feita pelas policies de
Row Level Security (RLS) no Postgres — não pela chave em si.

### Resultado final (2026-07-02, testado com a chave anon direto na API REST)

Todas as tabelas base agora bloqueiam leitura pública (`select * → []` pra chave
anon). O acesso público passa exclusivamente por views que devolvem só as
colunas que a landing page de fato usa:

| Tabela base | Tinha exposto (antes) | View pública | Colunas na view |
|---|---|---|---|
| `reservas` | linha inteira: nome, email, whatsapp, observações, título | `reservas_datas` | `data` |
| `datas_especiais` | linha inteira, incl. `id` | `datas_especiais_publicas` | `data, label, preco, recorrente` |
| `pacotes` | linha inteira, incl. `disponivel` | `pacotes_publicos` | `id, icone, nome, descricao, preco, unidade, ordem` (só `disponivel=true`) |
| `fotos` | linha inteira, incl. `id, created_at` | `fotos_publicas` | `url, legenda, categoria, ordem` |
| `estrutura` | linha inteira, incl. `id` | `estrutura_publica` | `icone, quantidade, item, ordem` |
| `depoimentos` | linha inteira, incl. `id` | `depoimentos_publicos` | `nome, tipo_evento, texto, avaliacao, created_at` (só `aprovado=true`) |
| `faq` | linha inteira, incl. `id, ativo` | `faq_publica` | `pergunta, resposta, ordem` (só `ativo=true`) |
| `configuracoes` | **todas as chaves, incl. `email_admin`** | `configuracoes_publicas` | whitelist de 10 chaves (sem `email_admin`) |
| `precos_semana` | `dia_semana, preco` | — (tabela já minimalista, sem view) | leitura pública direta mantida |
| `leads` | — | — | nunca teve leitura pública (só `INSERT`) |

Migrations aplicadas: `002_fix_reservas_pii_leak.sql`, `003_reservas_datas_sem_titulo.sql`,
`004_views_publicas_minimas.sql`. Frontend (`src/lib/supabase.js` + todos os
componentes de `src/components/landing/`) atualizado para usar `listarPublico()`
em vez de `listar()`; o painel admin (`src/components/admin/`) continua usando
`listar()` (tabela completa), protegido pela policy `admin_all` (role
`authenticated`).

### O que foi corrigido

`reservas` tinha `CREATE POLICY "pub_read" ON reservas FOR SELECT USING (true)`,
que expunha nome/email/whatsapp/observações de todo cliente pra qualquer
visitante do site. Corrigido em `supabase/migrations/002_fix_reservas_pii_leak.sql`:
policy removida, criada view `reservas_datas` (id/data/titulo) pro uso público
no calendário. Frontend (`Agenda.astro`, `Calculadora.astro`, `Hero.astro`)
atualizado para usar `db.reservas.listarDatas()` em vez de `db.reservas.listar()`.

### Regra para tabelas futuras

Antes de criar `CREATE POLICY ... FOR SELECT USING (true)` em qualquer tabela
nova, verificar se ela tem colunas com dado pessoal de cliente (nome, email,
telefone, endereço, data de nascimento, mensagens). Se tiver, nunca expor a
tabela inteira publicamente — criar uma view com só as colunas não-sensíveis,
ou restringir a policy à role `authenticated`.
