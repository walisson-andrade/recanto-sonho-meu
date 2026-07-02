-- O campo "titulo" da reserva é texto livre preenchido pelo admin e pode
-- conter nome de cliente/evento. A view pública não deve expor nenhum
-- dado além da data ocupada (usada só pra pintar o calendário).

DROP VIEW IF EXISTS reservas_datas;

CREATE VIEW reservas_datas AS
  SELECT data FROM reservas;

GRANT SELECT ON reservas_datas TO anon, authenticated;
