-- RESERVAS
CREATE TABLE reservas (
  id                    uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  data                  date NOT NULL UNIQUE,
  titulo                text NOT NULL,
  cliente_nome          text,
  cliente_email         text,
  cliente_whatsapp      text,
  tipo_evento           text,
  num_convidados        integer,
  pacotes_selecionados  jsonb DEFAULT '[]',
  valor_total           numeric,
  observacoes           text,
  created_at            timestamptz DEFAULT now()
);

-- PREÇOS POR DIA DA SEMANA (0=dom ... 6=sab)
CREATE TABLE precos_semana (
  dia_semana  integer PRIMARY KEY CHECK (dia_semana BETWEEN 0 AND 6),
  preco       numeric NOT NULL DEFAULT 500
);

-- DATAS ESPECIAIS
CREATE TABLE datas_especiais (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  data        date NOT NULL,
  label       text NOT NULL,
  preco       numeric NOT NULL,
  recorrente  boolean DEFAULT false
);

-- PACOTES / ADICIONAIS
CREATE TABLE pacotes (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  icone       text NOT NULL,
  nome        text NOT NULL,
  descricao   text,
  preco       numeric NOT NULL,
  unidade     text DEFAULT 'diária',
  disponivel  boolean DEFAULT true,
  ordem       integer DEFAULT 0
);

-- FOTOS DA GALERIA
CREATE TABLE fotos (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  url         text NOT NULL,
  legenda     text,
  categoria   text DEFAULT 'geral',
  ordem       integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- ESTRUTURA DO ESPAÇO
CREATE TABLE estrutura (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  icone       text NOT NULL,
  quantidade  text NOT NULL,
  item        text NOT NULL,
  ordem       integer DEFAULT 0
);

-- DEPOIMENTOS
CREATE TABLE depoimentos (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome        text NOT NULL,
  tipo_evento text,
  texto       text NOT NULL,
  avaliacao   integer DEFAULT 5 CHECK (avaliacao BETWEEN 1 AND 5),
  data_evento date,
  aprovado    boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

-- FAQ
CREATE TABLE faq (
  id        uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  pergunta  text NOT NULL,
  resposta  text NOT NULL,
  ordem     integer DEFAULT 0,
  ativo     boolean DEFAULT true
);

-- LEADS (formulário de contato)
CREATE TABLE leads (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome            text NOT NULL,
  email           text,
  whatsapp        text,
  data_nascimento date,
  tipo_evento     text,
  data_inicio     date,
  data_fim        date,
  num_convidados  integer,
  mensagem        text,
  created_at      timestamptz DEFAULT now()
);

-- CONFIGURAÇÕES GERAIS
CREATE TABLE configuracoes (
  chave  text PRIMARY KEY,
  valor  text
);

-- -------------------------------------------------------
-- SEED
-- -------------------------------------------------------

INSERT INTO precos_semana VALUES
  (0,800),(1,500),(2,500),(3,500),(4,500),(5,700),(6,900);

INSERT INTO pacotes (icone, nome, descricao, preco, unidade, ordem) VALUES
  ('🔥', 'Gás',      'Botijão de gás para o evento',       40,  'diária',    1),
  ('🔊', '3 Richos', 'Sistema de som completo (3 caixas)', 100, 'diária',    2),
  ('🎪', 'Forro',    'Forro decorativo do espaço',          10,  'por metro', 3);

INSERT INTO estrutura (icone, quantidade, item, ordem) VALUES
  ('❄️','8','Ventiladores',1),
  ('🔥','1','Churrasqueira',2),
  ('🚗','20','Vagas de estacionamento',3),
  ('🪑','150','Cadeiras',4),
  ('🪑','20','Mesas',5),
  ('🏊','1','Piscina',6),
  ('🛏️','2','Quartos para hospedagem',7),
  ('🎤','1','Sistema de som',8);

INSERT INTO configuracoes VALUES
  ('whatsapp',       '5534999763010'),
  ('instagram',      'recantosonhomeu08'),
  ('endereco',       'Rua Cobertura, 1072, Laranjeiras, Uberlândia, MG · CEP 38410-480'),
  ('maps_url',       'https://maps.google.com/?q=Rua+Cobertura+1072+Laranjeiras+Uberlandia+MG'),
  ('maps_embed',     ''),
  ('email_admin',    'contato@recantosonhomeu.com.br'),
  ('tour_virtual',   '');

INSERT INTO configuracoes VALUES ('horario_diaria', '14h às 22h') ON CONFLICT DO NOTHING;
INSERT INTO configuracoes VALUES ('regras_espaco', 'Proibido som automotivo') ON CONFLICT DO NOTHING;

INSERT INTO datas_especiais (data, label, preco, recorrente) VALUES
  ('2025-12-31', 'Réveillon',        1500, true),
  ('2025-12-24', 'Véspera de Natal', 1200, true),
  ('2026-02-14', 'Carnaval',         1100, false);

INSERT INTO faq (pergunta, resposta, ordem) VALUES
  ('Posso trazer buffet externo?',    'Sim! Cozinha equipada disponível.',                              1),
  ('O som está incluso?',             'Som básico incluso. Pacote 3 Richos por R$ 100 para estrutura completa.', 2),
  ('Aceita parcelamento?',            'Sim, entre em contato para combinar.',                           3),
  ('Qual a capacidade máxima?',       'Até 150 pessoas confortavelmente.',                              4),
  ('Posso visitar antes de fechar?',  'Sim! Agende pelo WhatsApp, Seg–Sáb das 9h às 18h.',             5);

INSERT INTO depoimentos (nome, tipo_evento, texto, avaliacao, aprovado) VALUES
  ('Ana e Carlos', 'Casamento',        'Lugar perfeito! A equipe foi incrível.',            5, true),
  ('Empresa XYZ',  'Confraternização', 'Ótimo espaço e equipe atenciosa. Voltaremos!',     5, true);

-- -------------------------------------------------------
-- RLS
-- -------------------------------------------------------

ALTER TABLE reservas        ENABLE ROW LEVEL SECURITY;
ALTER TABLE fotos           ENABLE ROW LEVEL SECURITY;
ALTER TABLE estrutura       ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE precos_semana   ENABLE ROW LEVEL SECURITY;
ALTER TABLE datas_especiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacotes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE depoimentos     ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq             ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads           ENABLE ROW LEVEL SECURITY;

-- Leitura pública
CREATE POLICY "pub_read" ON reservas        FOR SELECT USING (true);
CREATE POLICY "pub_read" ON fotos           FOR SELECT USING (true);
CREATE POLICY "pub_read" ON estrutura       FOR SELECT USING (true);
CREATE POLICY "pub_read" ON configuracoes   FOR SELECT USING (true);
CREATE POLICY "pub_read" ON precos_semana   FOR SELECT USING (true);
CREATE POLICY "pub_read" ON datas_especiais FOR SELECT USING (true);
CREATE POLICY "pub_read" ON pacotes         FOR SELECT USING (disponivel = true);
CREATE POLICY "pub_read" ON faq             FOR SELECT USING (ativo = true);
CREATE POLICY "pub_read" ON depoimentos     FOR SELECT USING (aprovado = true);

-- Escrita autenticada
CREATE POLICY "admin_all" ON reservas        FOR ALL USING (auth.role()='authenticated');
CREATE POLICY "admin_all" ON fotos           FOR ALL USING (auth.role()='authenticated');
CREATE POLICY "admin_all" ON estrutura       FOR ALL USING (auth.role()='authenticated');
CREATE POLICY "admin_all" ON configuracoes   FOR ALL USING (auth.role()='authenticated');
CREATE POLICY "admin_all" ON precos_semana   FOR ALL USING (auth.role()='authenticated');
CREATE POLICY "admin_all" ON datas_especiais FOR ALL USING (auth.role()='authenticated');
CREATE POLICY "admin_all" ON pacotes         FOR ALL USING (auth.role()='authenticated');
CREATE POLICY "admin_all" ON depoimentos     FOR ALL USING (auth.role()='authenticated');
CREATE POLICY "admin_all" ON faq             FOR ALL USING (auth.role()='authenticated');
CREATE POLICY "admin_all" ON leads           FOR ALL USING (auth.role()='authenticated');
CREATE POLICY "pub_insert" ON leads          FOR INSERT WITH CHECK (true);
