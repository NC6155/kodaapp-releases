import { t as db } from "./db_BgmFgjUe.mjs";
//#region src/lib/seguridad/sesiones.ts
/**
* KODAPP - SEGURIDAD DE SESIONES
*
* PostgreSQL registra la última actividad.
* Después de 60 minutos sin actividad,
* la sesión deja de ser válida.
*/
var NOMBRE_COOKIE = "session_id";
var DURACION_SESION = 3600;
/**
* Validar la sesión y registrar actividad.
*
* Si está activa, devuelve usuario_id.
* Si está expirada, devuelve null.
*/
async function validarSesion(sessionId) {
	if (!sessionId) return null;
	const resultado = await db.query(`UPDATE sesiones
     SET ultima_actividad = NOW()
     WHERE id = $1
       AND ultima_actividad >
           NOW() - INTERVAL '60 minutes'
     RETURNING usuario_id`, [sessionId]);
	if (resultado.rows.length === 0) {
		await db.query(`DELETE FROM sesiones
       WHERE id = $1
         AND ultima_actividad <=
             NOW() - INTERVAL '60 minutes'`, [sessionId]);
		return null;
	}
	return Number(resultado.rows[0].usuario_id);
}
/**
* Eliminar una sesión al cerrar sesión.
*/
async function eliminarSesion(sessionId) {
	if (!sessionId) return;
	await db.query("DELETE FROM sesiones WHERE id = $1", [sessionId]);
}
//#endregion
export { validarSesion as i, NOMBRE_COOKIE as n, eliminarSesion as r, DURACION_SESION as t };
