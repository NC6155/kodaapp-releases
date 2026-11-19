import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { t as db } from "./db_BgmFgjUe.mjs";
import { t as getUsuarioDesdeSesion } from "./auth_DzGWmYJk.mjs";
//#region src/pages/api/perfil/datos.ts
var datos_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ cookies }) => {
	const usuario = await getUsuarioDesdeSesion(cookies.get("session_id")?.value);
	if (!usuario) return new Response(JSON.stringify({ error: "Sesión expirada." }), {
		status: 401,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "no-store"
		}
	});
	try {
		const resultado = await db.query(`SELECT nombre, correo, tipo_usuario
       FROM usuarios
       WHERE id = $1`, [usuario.id]);
		if (resultado.rows.length === 0) return new Response(JSON.stringify({ error: "Usuario no encontrado." }), { status: 404 });
		return new Response(JSON.stringify(resultado.rows[0]), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "no-store"
			}
		});
	} catch (error) {
		console.error("Error leyendo perfil:", error);
		return new Response(JSON.stringify({ error: "No se pudo cargar el perfil." }), { status: 500 });
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/perfil/datos@_@ts
var page = () => datos_exports;
//#endregion
export { page };
