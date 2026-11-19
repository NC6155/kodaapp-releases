import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { t as db } from "./db_BgmFgjUe.mjs";
import { t as getUsuarioDesdeSesion } from "./auth_DzGWmYJk.mjs";
import { r as descargarImagen } from "./azure_BaGRAJb7.mjs";
//#region src/pages/api/fotos/[tipo]/[id].ts
var _id__exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ params, cookies }) => {
	const id = Number(params.id);
	if (!Number.isSafeInteger(id) || id <= 0) return new Response(null, { status: 404 });
	try {
		let nombre = null;
		if (params.tipo === "perfil") {
			const usuario = await getUsuarioDesdeSesion(cookies.get("session_id")?.value);
			if (!usuario) return new Response(null, { status: 401 });
			if (usuario.id !== id) return new Response(null, { status: 403 });
			nombre = (await db.query("SELECT foto_blob FROM usuarios WHERE id = $1", [id])).rows[0]?.foto_blob ?? null;
		} else if (params.tipo === "mascotas") nombre = (await db.query("SELECT foto_blob FROM mascotas WHERE id = $1", [id])).rows[0]?.foto_blob ?? null;
		else return new Response(null, { status: 404 });
		if (!nombre) return new Response(null, { status: 404 });
		const { datos, mime } = await descargarImagen(nombre);
		return new Response(new Uint8Array(datos), {
			status: 200,
			headers: {
				"Content-Type": mime,
				"Cache-Control": params.tipo === "perfil" ? "private, no-store" : "private, max-age=3600",
				"X-Content-Type-Options": "nosniff"
			}
		});
	} catch (error) {
		console.error("Error consultando foto en Azure:", error);
		return new Response(null, { status: 500 });
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/fotos/[tipo]/[id]@_@ts
var page = () => _id__exports;
//#endregion
export { page };
