import type { PoolClient } from "pg";

export class ReglaAdopcion extends Error {
  constructor(message: string, readonly status = 409) { super(message); }
}

// La fila del adoptante serializa aprobaciones de distintas organizaciones.
export async function comprobarCupo(conexion: PoolClient, adoptanteId: number) {
  const cuenta = await conexion.query(
    "SELECT tipo_usuario, estado_cuenta FROM usuarios WHERE id = $1 FOR UPDATE",
    [adoptanteId]
  );
  const usuario = cuenta.rows[0];
  if (usuario?.tipo_usuario !== "adoptante" || usuario.estado_cuenta !== "activo") {
    throw new ReglaAdopcion("Se requiere una cuenta adoptante activa.", 403);
  }
  const politica = await conexion.query("SELECT maximo FROM politica_adopcion WHERE unica FOR SHARE");
  const activas = await conexion.query(
    `SELECT count(*)::int AS total FROM postulaciones
     WHERE adoptante_id = $1 AND estado = 'aprobada' AND fin_tenencia IS NULL`, [adoptanteId]
  );
  if (activas.rows[0].total >= politica.rows[0].maximo) {
    throw new ReglaAdopcion("Se alcanzó el límite de adopciones simultáneas.");
  }
}
