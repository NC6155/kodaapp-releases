import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { n as NOMBRE_COOKIE, r as eliminarSesion } from "./sesiones_B_NT--6D.mjs";
//#region src/pages/api/logout.ts
var logout_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ request, cookies }) => {
	if (request.headers.get("origin") !== new URL(request.url).origin) return new Response(JSON.stringify({
		ok: false,
		mensaje: "Origen no permitido."
	}), { status: 403 });
	const sessionId = cookies.get(NOMBRE_COOKIE)?.value;
	try {
		await eliminarSesion(sessionId);
		cookies.delete(NOMBRE_COOKIE, { path: "/" });
		return new Response(JSON.stringify({
			ok: true,
			mensaje: "Sesión cerrada."
		}), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "no-store"
			}
		});
	} catch (error) {
		console.error("Error al cerrar sesión:", error);
		return new Response(JSON.stringify({
			ok: false,
			mensaje: "No se pudo cerrar la sesión."
		}), { status: 500 });
	}
};
//#endregion
export { logout_exports as n, POST as t };
