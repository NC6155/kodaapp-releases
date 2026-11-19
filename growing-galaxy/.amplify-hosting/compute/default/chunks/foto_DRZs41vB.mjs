import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { t as db } from "./db_BgmFgjUe.mjs";
import { n as urlFotoPerfil } from "./fotos_DIX-svjU.mjs";
import { t as getUsuarioDesdeSesion } from "./auth_DzGWmYJk.mjs";
import { a as validarImagen, i as subirImagen, n as borrarImagen, t as ErrorImagen } from "./azure_BaGRAJb7.mjs";
//#region src/pages/api/perfil/foto.ts
var foto_exports = /* @__PURE__ */ __exportAll({
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
		const formulario = await request.formData();
		const imagen = await validarImagen(formulario.get("foto"));
		if (!imagen) return responder({
			ok: false,
			mensaje: "Selecciona una imagen."
		}, 400);
		const anterior = await db.query("SELECT foto_blob FROM usuarios WHERE id = $1", [usuario.id]);
		if (!anterior.rows.length) return responder({
			ok: false,
			mensaje: "Usuario no encontrado."
		}, 404);
		const nombre = await subirImagen("perfiles", usuario.id, imagen);
		try {
			await db.query(`UPDATE usuarios
         SET foto_blob = $1
         WHERE id = $2`, [nombre, usuario.id]);
		} catch (error) {
			await borrarImagen(nombre).catch(console.error);
			throw error;
		}
		const antigua = anterior.rows[0].foto_blob;
		if (antigua) await borrarImagen(antigua).catch((error) => console.error("Fallo limpiando avatar anterior:", error));
		return responder({
			ok: true,
			foto: urlFotoPerfil(usuario.id, nombre)
		});
	} catch (error) {
		if (error instanceof ErrorImagen) return responder({
			ok: false,
			mensaje: error.message
		}, 400);
		console.error("Error guardando avatar en Azure:", error);
		return responder({
			ok: false,
			mensaje: "No se pudo guardar la fotografía."
		}, 500);
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/perfil/foto@_@ts
var page = () => foto_exports;
//#endregion
export { page };
