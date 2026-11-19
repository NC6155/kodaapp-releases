import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { t as db } from "./db_BgmFgjUe.mjs";
import { n as NOMBRE_COOKIE, t as DURACION_SESION } from "./sesiones_B_NT--6D.mjs";
import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";
//#region src/pages/api/login.ts
var login_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
function responder(datos, status = 200) {
	return new Response(JSON.stringify(datos), {
		status,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "no-store"
		}
	});
}
var POST = async ({ request, cookies }) => {
	try {
		const datos = await request.json().catch(() => null);
		if (!datos || typeof datos !== "object") return responder({
			ok: false,
			mensaje: "Solicitud inválida."
		}, 400);
		const correo = typeof datos.correo === "string" ? datos.correo.trim().toLowerCase() : "";
		const contrasena = datos.contrasena;
		if (!correo || typeof contrasena !== "string" || !contrasena) return responder({
			ok: false,
			mensaje: "Correo y contraseña obligatorios."
		}, 400);
		const resultado = await db.query(`SELECT id,
              nombre,
              correo,
              tipo_usuario,
              contrasena,
              estado_cuenta
       FROM usuarios
       WHERE LOWER(correo) = $1`, [correo]);
		if (resultado.rows.length === 0) return responder({
			ok: false,
			mensaje: "Correo o contraseña incorrectos."
		}, 401);
		const usuario = resultado.rows[0];
		if (usuario.estado_cuenta !== "activo") return responder({
			ok: false,
			mensaje: "La cuenta no está activa."
		}, 403);
		if (!await bcrypt.compare(contrasena, usuario.contrasena)) return responder({
			ok: false,
			mensaje: "Correo o contraseña incorrectos."
		}, 401);
		const sessionId = randomUUID();
		const sesionAnterior = cookies.get(NOMBRE_COOKIE)?.value;
		if (sesionAnterior) await db.query("DELETE FROM sesiones WHERE id = $1", [sesionAnterior]);
		await db.query(`INSERT INTO sesiones (
         id,
         usuario_id,
         ultima_actividad
       )
       VALUES ($1, $2, NOW())`, [sessionId, usuario.id]);
		cookies.set(NOMBRE_COOKIE, sessionId, {
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			path: "/",
			maxAge: DURACION_SESION
		});
		return responder({
			ok: true,
			usuario: {
				id: usuario.id,
				nombre: usuario.nombre,
				correo: usuario.correo,
				tipoUsuario: usuario.tipo_usuario
			}
		});
	} catch (error) {
		console.error("Error en login:", error);
		return responder({
			ok: false,
			mensaje: "Error interno del servidor."
		}, 500);
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/login@_@ts
var page = () => login_exports;
//#endregion
export { page };
