
import { db } from "../db";

/**
 * KODAPP - SEGURIDAD DE SESIONES
 *
 * PostgreSQL registra la última actividad.
 * Después de 60 minutos sin actividad,
 * la sesión deja de ser válida.
 */

export const NOMBRE_COOKIE = "session_id";
export const DURACION_SESION = 60 * 60;

/**
 * Validar la sesión y registrar actividad.
 *
 * Si está activa, devuelve usuario_id.
 * Si está expirada, devuelve null.
 */
export async function validarSesion(
  sessionId: string | undefined
): Promise<number | null> {
  if (!sessionId || !/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(sessionId)) {
    return null;
  }

  // Operación atómica: no revive sesiones expiradas.
  const resultado = await db.query(
    `UPDATE sesiones
     SET ultima_actividad = NOW()
     WHERE id = $1
       AND EXISTS (SELECT 1 FROM usuarios u WHERE u.id=sesiones.usuario_id AND u.estado_cuenta='activo')
       AND ultima_actividad >
           NOW() - INTERVAL '60 minutes'
     RETURNING usuario_id`,
    [sessionId]
  );

  if (resultado.rows.length === 0) {
    // Limpiar solamente sesiones que ya expiraron.
    await db.query(
      `DELETE FROM sesiones
       WHERE id = $1
         AND ultima_actividad <=
             NOW() - INTERVAL '60 minutes'`,
      [sessionId]
    );

    return null;
  }

  return Number(resultado.rows[0].usuario_id);
}

/**
 * Eliminar una sesión al cerrar sesión.
 */
export async function eliminarSesion(
  sessionId: string | undefined
): Promise<void> {
  if (!sessionId) return;

  await db.query(
    "DELETE FROM sesiones WHERE id = $1",
    [sessionId]
  );
}
