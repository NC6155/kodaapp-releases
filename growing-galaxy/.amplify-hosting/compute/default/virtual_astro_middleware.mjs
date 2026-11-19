import { t as sequence, ut as defineMiddleware } from "./chunks/sequence_DWzj4TxR.mjs";
import { i as validarSesion, n as NOMBRE_COOKIE, t as DURACION_SESION } from "./chunks/sesiones_B_NT--6D.mjs";
//#region src/middleware.ts
function rechazarAcceso(context, ruta) {
	if (ruta.startsWith("/api/")) return new Response(JSON.stringify({
		ok: false,
		error: "Sesión expirada.",
		mensaje: "Debes iniciar sesión nuevamente."
	}), {
		status: 401,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "no-store"
		}
	});
	return context.redirect("/login?expirada=1");
}
var onRequest$1 = defineMiddleware(async (context, next) => {
	const ruta = context.url.pathname;
	const protegida = [
		"/perfil",
		"/usuario",
		"/gestion",
		"/configuracion",
		"/rescatista",
		"/api/perfil",
		"/api/mascotas",
		"/api/auth/actividad"
	].some((prefijo) => ruta === prefijo || ruta.startsWith(prefijo + "/"));
	const sessionId = context.cookies.get(NOMBRE_COOKIE)?.value;
	if (!sessionId) return protegida ? rechazarAcceso(context, ruta) : next();
	let usuarioId;
	try {
		usuarioId = await validarSesion(sessionId);
	} catch (error) {
		console.error("No se pudo validar la sesión:", error);
		return new Response("No se pudo verificar la sesión.", { status: 503 });
	}
	if (!usuarioId) {
		context.cookies.delete(NOMBRE_COOKIE, { path: "/" });
		return protegida ? rechazarAcceso(context, ruta) : next();
	}
	context.cookies.set(NOMBRE_COOKIE, sessionId, {
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		path: "/",
		maxAge: DURACION_SESION
	});
	return next();
});
//#endregion
//#region \0virtual:astro:middleware
var onRequest = sequence(onRequest$1);
//#endregion
export { onRequest };
