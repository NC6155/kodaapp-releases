import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { t as db } from "./db_BgmFgjUe.mjs";
import { t as getUsuarioDesdeSesion } from "./auth_DzGWmYJk.mjs";
//#region src/pages/api/perfil/descripcion.ts
var descripcion_exports = /* @__PURE__ */ __exportAll({
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
		const sessionId = cookies.get("session_id")?.value;
		const usuario = await getUsuarioDesdeSesion(sessionId);
		if (!usuario) return responder({
			ok: false,
			mensaje: "Debes iniciar sesión."
		}, 401);
		const datos = await request.json().catch(() => ({}));
		if (typeof datos.descripcion !== "string") return responder({
			ok: false,
			mensaje: "La descripción no es válida."
		}, 400);
		const descripcion = datos.descripcion.trim();
		if (descripcion.length > 500) return responder({
			ok: false,
			mensaje: "La descripción no puede superar los 500 caracteres."
		}, 400);
		await db.query(`UPDATE usuarios
       SET descripcion_perfil = $1
       WHERE id = $2`, [descripcion, usuario.id]);
		return responder({
			ok: true,
			mensaje: "Descripción actualizada correctamente.",
			descripcion
		});
	} catch (error) {
		console.error("Error al actualizar descripción:", error);
		return responder({
			ok: false,
			mensaje: "No se pudo actualizar la descripción."
		}, 500);
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/perfil/descripcion@_@ts
var page = () => descripcion_exports;
//#endregion
export { page };
