import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { t as db } from "./db_BgmFgjUe.mjs";
import { t as getUsuarioDesdeSesion } from "./auth_DzGWmYJk.mjs";
import { a as validarImagen, i as subirImagen, n as borrarImagen, t as ErrorImagen } from "./azure_BaGRAJb7.mjs";
import { n as PERSONALIDADES, r as procesarClasificacion, t as ANTECEDENTES_MEDICOS } from "./CatalogoMatch_BKZaFKAX.mjs";
//#region src/pages/api/mascotas/crear.ts
var crear_exports = /* @__PURE__ */ __exportAll({
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
		if (usuario.tipo_usuario !== "organizacion") return responder({
			ok: false,
			mensaje: "Solo las organizaciones pueden publicar."
		}, 403);
		const datos = await request.formData();
		const nombre = String(datos.get("nombre") ?? "").trim();
		const tipo = String(datos.get("tipoMascota") ?? "").trim();
		const descripcion = String(datos.get("descripcion") ?? "").trim();
		const personalidad = procesarClasificacion(datos.get("personalidadCodigo"), datos.get("personalidadDetalle"), PERSONALIDADES, "la personalidad");
		const salud = procesarClasificacion(datos.get("saludCodigo"), datos.get("saludDetalle"), ANTECEDENTES_MEDICOS, "los antecedentes médicos");
		if (!nombre || nombre.length > 100) return responder({
			ok: false,
			mensaje: "Nombre inválido."
		}, 400);
		if (![
			"perro",
			"gato",
			"otro"
		].includes(tipo)) return responder({
			ok: false,
			mensaje: "Tipo de mascota inválido."
		}, 400);
		if (descripcion.length > 5e3) return responder({
			ok: false,
			mensaje: "Descripción demasiado larga."
		}, 400);
		if (!personalidad.ok) return responder({
			ok: false,
			mensaje: personalidad.mensaje
		}, 400);
		if (!salud.ok) return responder({
			ok: false,
			mensaje: salud.mensaje
		}, 400);
		const imagen = await validarImagen(datos.get("foto"), true);
		const resultado = await db.query(`INSERT INTO mascotas (
         usuario_id,
         nombre,
         descripcion,
         personalidad,
         personalidad_codigo,
         historial_medico,
         salud_codigo,
         estado_adopcion,
         tipo_mascota
       )
       VALUES (
         $1, $2, $3, $4, $5,
         $6, $7, 'disponible', $8
       )
       RETURNING id`, [
			usuario.id,
			nombre,
			descripcion || null,
			personalidad.texto,
			personalidad.codigo,
			salud.texto,
			salud.codigo,
			tipo
		]);
		const mascotaId = Number(resultado.rows[0].id);
		let fotoNueva = null;
		try {
			if (imagen) {
				fotoNueva = await subirImagen("mascotas", mascotaId, imagen);
				await db.query(`UPDATE mascotas
           SET foto_blob = $1
           WHERE id = $2`, [fotoNueva, mascotaId]);
			}
		} catch (error) {
			if (fotoNueva) await borrarImagen(fotoNueva).catch(console.error);
			await db.query(`DELETE FROM mascotas
         WHERE id = $1 AND usuario_id = $2`, [mascotaId, usuario.id]).catch(console.error);
			throw error;
		}
		return responder({
			ok: true,
			mensaje: "Mascota publicada correctamente.",
			mascotaId
		}, 201);
	} catch (error) {
		if (error instanceof ErrorImagen) return responder({
			ok: false,
			mensaje: error.message
		}, 400);
		console.error("Error publicando mascota:", error);
		return responder({
			ok: false,
			mensaje: "No se pudo publicar la mascota."
		}, 500);
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/mascotas/crear@_@ts
var page = () => crear_exports;
//#endregion
export { page };
