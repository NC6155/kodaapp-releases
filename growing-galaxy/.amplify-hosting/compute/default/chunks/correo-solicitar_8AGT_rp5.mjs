import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { t as db } from "./db_BgmFgjUe.mjs";
import { t as getUsuarioDesdeSesion } from "./auth_DzGWmYJk.mjs";
import { i as hashCodigo, n as enviarCodigo, r as generarCodigo } from "./correo_-onjkGVk.mjs";
import bcrypt from "bcrypt";
//#region src/pages/api/perfil/correo-solicitar.ts
var correo_solicitar_exports = /* @__PURE__ */ __exportAll({
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
	if (request.headers.get("origin") !== new URL(request.url).origin) return responder({ error: "Origen no permitido." }, 403);
	const usuario = await getUsuarioDesdeSesion(cookies.get("session_id")?.value);
	if (!usuario) return responder({ error: "Sesión expirada." }, 401);
	const datos = await request.json().catch(() => null);
	if (!datos || typeof datos !== "object" || Array.isArray(datos)) return responder({ error: "Datos inválidos." }, 400);
	const correoNuevo = typeof datos.correoNuevo === "string" ? datos.correoNuevo.trim().toLowerCase() : "";
	const contrasenaActual = datos.contrasenaActual;
	if (correoNuevo.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoNuevo)) return responder({ error: "Correo inválido." }, 400);
	if (typeof contrasenaActual !== "string") return responder({ error: "Indica tu contraseña." }, 400);
	try {
		const consulta = await db.query(`SELECT correo, contrasena
       FROM usuarios
       WHERE id = $1`, [usuario.id]);
		if (consulta.rows.length === 0) return responder({ error: "Usuario no encontrado." }, 404);
		const cuenta = consulta.rows[0];
		if (!await bcrypt.compare(contrasenaActual, cuenta.contrasena)) return responder({ error: "Contraseña incorrecta." }, 403);
		if (correoNuevo === cuenta.correo.toLowerCase()) return responder({ error: "El correo nuevo debe ser diferente." }, 400);
		if ((await db.query(`SELECT id FROM usuarios
       WHERE LOWER(correo) = $1
         AND id <> $2`, [correoNuevo, usuario.id])).rows.length > 0) return responder({ error: "Correo ya registrado." }, 409);
		const codigo = generarCodigo();
		const hash = hashCodigo(usuario.id, correoNuevo, codigo);
		if ((await db.query(`UPDATE usuarios
       SET correo_pendiente = $1,
           correo_codigo_hash = $2,
           correo_codigo_expira =
             NOW() + INTERVAL '15 minutes',
           correo_codigo_enviado = NOW(),
           correo_codigo_intentos = 0
       WHERE id = $3
         AND (
           correo_codigo_enviado IS NULL
           OR correo_codigo_enviado <=
              NOW() - INTERVAL '60 seconds'
         )
       RETURNING id`, [
			correoNuevo,
			hash,
			usuario.id
		])).rows.length === 0) return responder({ error: "Espera un minuto antes de solicitar otro código." }, 429);
		try {
			await enviarCodigo(correoNuevo, codigo);
		} catch (error) {
			console.error("Falló el envío SMTP:", error);
			await db.query(`UPDATE usuarios
         SET correo_pendiente = NULL,
             correo_codigo_hash = NULL,
             correo_codigo_expira = NULL,
             correo_codigo_enviado = NULL,
             correo_codigo_intentos = 0
         WHERE id = $1
           AND correo_codigo_hash = $2`, [usuario.id, hash]);
			return responder({ error: "No se pudo enviar el código." }, 503);
		}
		return responder({
			success: true,
			mensaje: "Enviamos un código al correo nuevo."
		});
	} catch (error) {
		console.error("Error solicitando correo:", error);
		return responder({ error: "No se pudo solicitar el cambio." }, 500);
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/perfil/correo-solicitar@_@ts
var page = () => correo_solicitar_exports;
//#endregion
export { page };
