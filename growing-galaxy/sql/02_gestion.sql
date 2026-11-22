BEGIN;

CREATE TABLE IF NOT EXISTS administradores (
  usuario_id integer PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS politica_adopcion (
  unica boolean PRIMARY KEY DEFAULT true CHECK (unica),
  maximo integer NOT NULL CHECK (maximo BETWEEN 1 AND 100)
);
INSERT INTO politica_adopcion (maximo) VALUES (3) ON CONFLICT DO NOTHING;

ALTER TABLE postulaciones ADD COLUMN IF NOT EXISTS fin_tenencia timestamptz;
ALTER TABLE mascotas ADD COLUMN IF NOT EXISTS referencia_origen text;
CREATE UNIQUE INDEX IF NOT EXISTS mascota_origen_unico ON mascotas(usuario_id, referencia_origen);
CREATE UNIQUE INDEX IF NOT EXISTS mascota_con_tenencia_unica ON postulaciones(mascota_id)
  WHERE estado = 'aprobada' AND fin_tenencia IS NULL;
CREATE INDEX IF NOT EXISTS cupos_por_adoptante ON postulaciones(adoptante_id)
  WHERE estado = 'aprobada' AND fin_tenencia IS NULL;

-- Conservar expedientes incluso si otra ruta intenta borrar una ficha.
ALTER TABLE postulaciones DROP CONSTRAINT IF EXISTS postulaciones_mascota_id_fkey;
ALTER TABLE postulaciones ADD CONSTRAINT postulaciones_mascota_id_fkey
  FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE RESTRICT;

CREATE TABLE IF NOT EXISTS reportes (
  id bigserial PRIMARY KEY,
  autor_id integer NOT NULL REFERENCES usuarios(id),
  cuenta_id integer NOT NULL REFERENCES usuarios(id),
  motivo text NOT NULL CHECK (length(trim(motivo)) BETWEEN 10 AND 1000),
  creado_en timestamptz NOT NULL DEFAULT now(),
  revisado_en timestamptz,
  revisado_por integer REFERENCES usuarios(id),
  CHECK (autor_id <> cuenta_id)
);
ALTER TABLE reportes ADD COLUMN IF NOT EXISTS postulacion_id bigint REFERENCES postulaciones(id);
CREATE TABLE IF NOT EXISTS historial_gestion (
  id bigserial PRIMARY KEY,
  actor_id integer NOT NULL REFERENCES usuarios(id),
  cuenta_id integer NOT NULL REFERENCES usuarios(id),
  accion text NOT NULL,
  motivo text NOT NULL,
  creado_en timestamptz NOT NULL DEFAULT now()
);
CREATE OR REPLACE VIEW mascotas_postulables AS
  SELECT m.* FROM mascotas m
  JOIN usuarios u ON u.id = m.usuario_id
  WHERE u.estado_cuenta = 'activo' AND m.estado_adopcion = 'disponible'
    AND NOT EXISTS (SELECT 1 FROM postulaciones p WHERE p.mascota_id = m.id
      AND p.estado = 'aprobada' AND p.fin_tenencia IS NULL);

CREATE OR REPLACE FUNCTION proteger_estado_tenencia() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.estado_adopcion <> 'adoptada' AND EXISTS (
    SELECT 1 FROM postulaciones WHERE mascota_id=NEW.id AND estado='aprobada' AND fin_tenencia IS NULL
  ) THEN
    RAISE EXCEPTION USING ERRCODE='23514', CONSTRAINT='tenencia_activa', MESSAGE='Hay una tenencia activa';
  END IF;
  RETURN NEW;
END;
$$;
CREATE OR REPLACE TRIGGER estado_con_tenencia BEFORE UPDATE OF estado_adopcion ON mascotas
  FOR EACH ROW WHEN (OLD.estado_adopcion IS DISTINCT FROM NEW.estado_adopcion)
  EXECUTE FUNCTION proteger_estado_tenencia();
COMMIT;
