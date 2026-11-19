import { t as db } from "./db_BgmFgjUe.mjs";
import { i as validarSesion } from "./sesiones_B_NT--6D.mjs";
import { n as urlFotoPerfil } from "./fotos_DIX-svjU.mjs";
//#region src/lib/auth.ts
async function getUsuarioDesdeSesion(sessionId) {
	const usuarioId = await validarSesion(sessionId);
	if (!usuarioId) return null;
	const usuario = (await db.query(`SELECT
       id,
       nombre,
       correo,
       rut,
       tipo_usuario,
       estado_cuenta,
       descripcion_perfil,
       foto_blob
     FROM usuarios
     WHERE id = $1
       AND estado_cuenta = 'activo'`, [usuarioId])).rows[0];
	if (!usuario) return null;
	return {
		id: Number(usuario.id),
		nombre: usuario.nombre,
		correo: usuario.correo,
		rut: usuario.rut,
		tipo_usuario: usuario.tipo_usuario,
		estado_cuenta: usuario.estado_cuenta,
		descripcion_perfil: usuario.descripcion_perfil,
		foto_perfil: urlFotoPerfil(Number(usuario.id), usuario.foto_blob)
	};
}
//#endregion
export { getUsuarioDesdeSesion as t };
