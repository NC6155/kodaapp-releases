import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { t as db } from "./db_BgmFgjUe.mjs";
import { t as getUsuarioDesdeSesion } from "./auth_DzGWmYJk.mjs";
import { n as borrarImagen } from "./azure_BaGRAJb7.mjs";
//#region src/pages/api/mascotas/eliminar.ts
var eliminar_exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
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
var DELETE = async ({ request, cookies }) => {
	const origin = request.headers.get("origin");
	if (origin && origin !== new URL(request.url).origin) return responder({
		ok: false,
		mensaje: "Origen no permitido."
	}, 403);
	try {
		const usuario = await getUsuarioDesdeSesion(cookies.get("session_id")?.value);
		if (!usuario) return responder({
			ok: false,
			mensaje: "Debes iniciar sesión."
		}, 401);
		if (usuario.tipo_usuario !== "organizacion") return responder({
			ok: false,
			mensaje: "Sin permisos."
		}, 403);
		const datos = await request.json().catch(() => null);
		const id = Number(datos?.id);
		if (!Number.isSafeInteger(id) || id <= 0) return responder({
			ok: false,
			mensaje: "ID inválido."
		}, 400);
		const resultado = await db.query(`DELETE FROM mascotas
       WHERE id = $1
         AND usuario_id = $2
       RETURNING foto_blob`, [id, usuario.id]);
		if (!resultado.rows.length) return responder({
			ok: false,
			mensaje: "Mascota no encontrada o sin permisos."
		}, 404);
		try {
			await borrarImagen(resultado.rows[0].foto_blob);
		} catch (error) {
			console.error("Publicación borrada, pero falló limpieza en Azure:", error);
			return responder({
				ok: true,
				advertencia: true,
				mensaje: "Publicación eliminada. No se pudo limpiar su imagen de Azure."
			});
		}
		return responder({
			ok: true,
			mensaje: "Publicación eliminada correctamente."
		});
	} catch (error) {
		console.error("Error eliminando mascota:", error);
		return responder({
			ok: false,
			mensaje: "No se pudo eliminar la publicación."
		}, 500);
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/mascotas/eliminar@_@ts
var page = () => eliminar_exports;
//#endregion
export { page };
