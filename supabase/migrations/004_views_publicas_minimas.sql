-- Endurece o acesso publico: cada tabela so deve devolver exatamente as
-- colunas que a landing page usa. Remove os "pub_read USING (true)" que
-- devolviam a linha inteira (incluindo id interno e, no caso de
-- configuracoes, chaves nunca destinadas ao publico como email_admin) e
-- troca por views com o menor conjunto de colunas necessario.
--
-- As tabelas continuam com RLS habilitado; a policy "admin_all" (role
-- authenticated) permanece intacta para o painel admin.

DROP POLICY IF EXISTS "pub_read" ON datas_especiais;
DROP POLICY IF EXISTS "pub_read" ON pacotes;
DROP POLICY IF EXISTS "pub_read" ON fotos;
DROP POLICY IF EXISTS "pub_read" ON estrutura;
DROP POLICY IF EXISTS "pub_read" ON depoimentos;
DROP POLICY IF EXISTS "pub_read" ON faq;
DROP POLICY IF EXISTS "pub_read" ON configuracoes;

-- Datas especiais: sem id (nao usado publicamente)
CREATE VIEW datas_especiais_publicas AS
  SELECT data, label, preco, recorrente FROM datas_especiais;

-- Pacotes: precisa do id (usado para marcar selecao no formulario),
-- mas nao da flag "disponivel" (ja filtrada aqui)
CREATE VIEW pacotes_publicos AS
  SELECT id, icone, nome, descricao, preco, unidade, ordem
  FROM pacotes
  WHERE disponivel = true;

-- Fotos: sem id nem created_at
CREATE VIEW fotos_publicas AS
  SELECT url, legenda, categoria, ordem FROM fotos;

-- Estrutura: sem id
CREATE VIEW estrutura_publica AS
  SELECT icone, quantidade, item, ordem FROM estrutura;

-- Depoimentos: sem id; created_at so pra manter a ordenacao por mais recente
CREATE VIEW depoimentos_publicos AS
  SELECT nome, tipo_evento, texto, avaliacao, created_at
  FROM depoimentos
  WHERE aprovado = true;

-- FAQ: sem id
CREATE VIEW faq_publica AS
  SELECT pergunta, resposta, ordem FROM faq
  WHERE ativo = true;

-- Configuracoes: whitelist explicita das chaves de exibicao publica.
-- email_admin fica de fora (so usado internamente pelas edge functions
-- de notificacao e pelo painel admin).
CREATE VIEW configuracoes_publicas AS
  SELECT chave, valor FROM configuracoes
  WHERE chave IN (
    'whatsapp', 'instagram', 'endereco', 'maps_url', 'maps_embed',
    'tour_virtual', 'max_convidados', 'google_reviews_widget',
    'horario_diaria', 'regras_espaco'
  );

GRANT SELECT ON datas_especiais_publicas TO anon, authenticated;
GRANT SELECT ON pacotes_publicos          TO anon, authenticated;
GRANT SELECT ON fotos_publicas            TO anon, authenticated;
GRANT SELECT ON estrutura_publica         TO anon, authenticated;
GRANT SELECT ON depoimentos_publicos      TO anon, authenticated;
GRANT SELECT ON faq_publica               TO anon, authenticated;
GRANT SELECT ON configuracoes_publicas    TO anon, authenticated;
