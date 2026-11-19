import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { t as db } from "./db_BgmFgjUe.mjs";
import { t as getUsuarioDesdeSesion } from "./auth_DzGWmYJk.mjs";
import { t as validarContrasena } from "./validarcontrasena_Lzm43Qtu.mjs";
import bcrypt from "bcrypt";
//#region src/pages/api/perfil/actualizar.ts
var actualizar_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
function responder(datos, estado = 200) {
	return new Response(JSON.stringify(datos), {
		status: estado,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "no-store"
		}
	});
}
var POST = async ({ request, cookies }) => {
	try {
		if (request.headers.get("origin") !== new URL(request.url).origin) return responder({ error: "Origen no permitido." }, 403);
		const sessionId = cookies.get("session_id")?.value;
		const usuario = await getUsuarioDesdeSesion(sessionId);
		if (!usuario) return responder({ error: "Sesión expirada. Inicia sesión nuevamente." }, 401);
		const cuerpo = await request.json().catch(() => null);
		if (!cuerpo || typeof cuerpo !== "object" || Array.isArray(cuerpo)) return responder({ error: "Datos inválidos." }, 400);
		const datos = cuerpo;
		const accion = datos.accion;
		if (accion === "nombre") {
			if (typeof datos.nombre !== "string") return responder({ error: "Debes introducir un nombre." }, 400);
			const nombre = datos.nombre.trim().normalize("NFC");
			if (nombre.length < 2 || nombre.length > 100) return responder({ error: "El nombre debe tener entre 2 y 100 caracteres." }, 400);
			if ((await db.query(`UPDATE usuarios
         SET nombre = $1
         WHERE id = $2
           AND estado_cuenta = 'activo'
         RETURNING id`, [nombre, usuario.id])).rows.length === 0) return responder({ error: "No se pudo actualizar esta cuenta." }, 403);
			return responder({
				success: true,
				mensaje: "Nombre actualizado correctamente.",
				nombre
			});
		}
		if (accion === "contrasena") {
			const actual = datos.contrasenaActual;
			const nueva = datos.contrasenaNueva;
			if (typeof actual !== "string" || typeof nueva !== "string") return responder({ error: "Completa ambas contraseñas." }, 400);
			const errores = validarContrasena(nueva);
			if (errores.length > 0) return responder({ error: errores.join(" ") }, 400);
			const conexion = await db.connect();
			let transaccionActiva = false;
			try {
				await conexion.query("BEGIN");
				transaccionActiva = true;
				const consulta = await conexion.query(`SELECT contrasena, estado_cuenta
           FROM usuarios
           WHERE id = $1
           FOR UPDATE`, [usuario.id]);
				if (consulta.rows.length === 0) {
					await conexion.query("ROLLBACK");
					transaccionActiva = false;
					return responder({ error: "Usuario no encontrado." }, 404);
				}
				const cuenta = consulta.rows[0];
				if (cuenta.estado_cuenta !== "activo") {
					await conexion.query("ROLLBACK");
					transaccionActiva = false;
					return responder({ error: "La cuenta no está activa." }, 403);
				}
				if (!await bcrypt.compare(actual, cuenta.contrasena)) {
					await conexion.query("ROLLBACK");
					transaccionActiva = false;
					return responder({ error: "La contraseña actual es incorrecta." }, 403);
				}
				if (await bcrypt.compare(nueva, cuenta.contrasena)) {
					await conexion.query("ROLLBACK");
					transaccionActiva = false;
					return responder({ error: "La contraseña nueva debe ser diferente." }, 400);
				}
				const nuevoHash = await bcrypt.hash(nueva, 12);
				await conexion.query(`UPDATE usuarios
           SET contrasena = $1
           WHERE id = $2`, [nuevoHash, usuario.id]);
				await conexion.query(`DELETE FROM sesiones
           WHERE usuario_id = $1`, [usuario.id]);
				await conexion.query("COMMIT");
				transaccionActiva = false;
				cookies.delete("session_id", { path: "/" });
				return responder({
					success: true,
					mensaje: "Contraseña actualizada. Inicia sesión nuevamente."
				});
			} catch (error) {
				if (transaccionActiva) await conexion.query("ROLLBACK").catch(() => {});
				console.error("Error al cambiar contraseña:", error);
				return responder({ error: "No se pudo cambiar la contraseña." }, 500);
			} finally {
				conexion.release();
			}
		}
		if (accion === "organizacion" || accion === "adoptante") {
			const contrasenaActual = datos.contrasenaActual;
			if (typeof contrasenaActual !== "string" || contrasenaActual.length === 0) return responder({ error: "Debes confirmar tu contraseña." }, 400);
			const nuevoTipo = accion;
			const tipoEsperado = nuevoTipo === "organizacion" ? "adoptante" : "organizacion";
			const conexion = await db.connect();
			let transaccionActiva = false;
			try {
				await conexion.query("BEGIN");
				transaccionActiva = true;
				const consulta = await conexion.query(`SELECT
             contrasena,
             tipo_usuario,
             estado_cuenta
           FROM usuarios
           WHERE id = $1
           FOR UPDATE`, [usuario.id]);
				if (consulta.rows.length === 0) {
					await conexion.query("ROLLBACK");
					transaccionActiva = false;
					return responder({ error: "Usuario no encontrado." }, 404);
				}
				const cuenta = consulta.rows[0];
				if (cuenta.estado_cuenta !== "activo") {
					await conexion.query("ROLLBACK");
					transaccionActiva = false;
					return responder({ error: "La cuenta no está activa." }, 403);
				}
				if (cuenta.tipo_usuario !== tipoEsperado) {
					await conexion.query("ROLLBACK");
					transaccionActiva = false;
					return responder({ error: "El tipo de cuenta actual no permite este cambio." }, 400);
				}
				if (!await bcrypt.compare(contrasenaActual, cuenta.contrasena)) {
					await conexion.query("ROLLBACK");
					transaccionActiva = false;
					return responder({ error: "Contraseña incorrecta." }, 403);
				}
				if (nuevoTipo === "adoptante") {
					const mascotas = await conexion.query(`SELECT COUNT(*)::integer AS cantidad
             FROM mascotas
             WHERE usuario_id = $1`, [usuario.id]);
					const cantidad = Number(mascotas.rows[0]?.cantidad ?? 0);
					if (cantidad > 0) {
						await conexion.query("ROLLBACK");
						transaccionActiva = false;
						return responder({
							error: `No puedes cambiar a Adoptante porque tienes ${cantidad} publicación(es) de mascotas asociadas a tu organización. Debes resolverlas antes de cambiar de cuenta.`,
							codigo: "MASCOTAS_PUBLICADAS",
							cantidadMascotas: cantidad
						}, 409);
					}
				}
				if ((await conexion.query(`UPDATE usuarios
           SET tipo_usuario = $1
           WHERE id = $2
             AND tipo_usuario = $3
           RETURNING tipo_usuario`, [
					nuevoTipo,
					usuario.id,
					tipoEsperado
				])).rows.length === 0) {
					await conexion.query("ROLLBACK");
					transaccionActiva = false;
					return responder({ error: "No se pudo completar el cambio de cuenta." }, 409);
				}
				await conexion.query("COMMIT");
				transaccionActiva = false;
				return responder({
					success: true,
					mensaje: nuevoTipo === "organizacion" ? "Tu cuenta ahora es de tipo Organización." : "Tu cuenta ahora es de tipo Adoptante.",
					tipo_usuario: nuevoTipo
				});
			} catch (error) {
				if (transaccionActiva) await conexion.query("ROLLBACK").catch(() => {});
				console.error("Error al cambiar tipo de cuenta:", error);
				return responder({ error: "No se pudo cambiar el tipo de cuenta." }, 500);
			} finally {
				conexion.release();
			}
		}
		return responder({ error: "Acción no válida." }, 400);
	} catch (error) {
		console.error("Error general de perfil:", error);
		return responder({ error: "Error interno al actualizar la cuenta." }, 500);
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/perfil/actualizar@_@ts
var page = () => actualizar_exports;
//#endregion
export { page };
