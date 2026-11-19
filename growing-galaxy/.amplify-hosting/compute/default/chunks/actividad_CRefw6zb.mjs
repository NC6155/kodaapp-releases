import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { i as validarSesion, n as NOMBRE_COOKIE, t as DURACION_SESION } from "./sesiones_B_NT--6D.mjs";
//#region src/pages/api/auth/actividad.ts
var actividad_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ request, cookies }) => {
	if (request.headers.get("origin") !== new URL(request.url).origin) return new Response(JSON.stringify({ error: "Origen no permitido." }), { status: 403 });
	const sessionId = cookies.get(NOMBRE_COOKIE)?.value;
	if (!await validarSesion(sessionId) || !sessionId) {
		cookies.delete(NOMBRE_COOKIE, { path: "/" });
		return new Response(JSON.stringify({ autenticado: false }), { status: 401 });
	}
	cookies.set(NOMBRE_COOKIE, sessionId, {
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		path: "/",
		maxAge: DURACION_SESION
	});
	return new Response(JSON.stringify({ autenticado: true }), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "no-store"
		}
	});
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/auth/actividad@_@ts
var page = () => actividad_exports;
//#endregion
export { page };
